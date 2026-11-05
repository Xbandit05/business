import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { searchOfflineAgriKnowledge, RetrievalResult } from '../../utils/offlineAgriEngine.ts';
import {
  LocalAiModelManager,
  AIStatusMode,
  LocalModelInfo,
} from '../../utils/localAiModelManager.ts';
import {
  ChatMessage,
  ConversationSession,
  getAllConversations,
  saveConversation,
  deleteConversation,
  clearAllConversations,
} from '../../utils/conversationStorage.ts';
import { AgriBridgeBrandIcon } from '../common/AgriBridgeBrandIcon.tsx';
import {
  Sprout,
  Send,
  Sparkles,
  Wifi,
  WifiOff,
  Database,
  Download,
  Trash2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  ArrowRight,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Plus,
  Clock,
  Settings2,
  X,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Layers,
  Leaf,
  Store,
  Wallet,
  CheckCircle2,
  BookOpen,
  Camera,
  Image as ImageIcon,
  Paperclip,
} from 'lucide-react';
import { AgriculturalKnowledgeLibrary } from './AgriculturalKnowledgeLibrary.tsx';
import { CropProblemSolverModal } from './CropProblemSolverModal.tsx';


interface AgriBridgeAiViewProps {
  onNavigateTab: (tab: any) => void;
  onOpenNewPlotModal?: () => void;
  onOpenNewListingModal?: () => void;
}

export const AgriBridgeAiView: React.FC<AgriBridgeAiViewProps> = ({
  onNavigateTab,
  onOpenNewPlotModal,
  onOpenNewListingModal,
}) => {
  const { language, setLanguage, speakKinyarwandaText, isSpeaking, stopAudio } = useLanguage();
  const { currentUser, farms, plots, cropCycles } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Status and Local Model Management
  const [aiStatus, setAiStatus] = useState<AIStatusMode>('LOCAL KNOWLEDGE MODE');
  const [modelProgress, setModelProgress] = useState(0);
  const [modelInfo, setModelInfo] = useState<LocalModelInfo | null>(null);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);

  // Personalization toggle
  const [personalize, setPersonalize] = useState(true);

  // Sub-tab view: chat vs knowledge library
  const [activeViewMode, setActiveViewMode] = useState<'chat' | 'library'>('chat');
  // Problem solver modal state
  const [isProblemSolverOpen, setIsProblemSolverOpen] = useState(false);

  // Image upload state for pest / weed / disease diagnostics
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Conversations history
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => 'session_' + Date.now());
  const [savedSessions, setSavedSessions] = useState<ConversationSession[]>([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Voice recording state
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modelManager = useRef(LocalAiModelManager.getInstance()).current;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setAttachedImage(null);
    setAttachedImageName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProblemSolverSubmit = (diagnosticSummary: string) => {
    setIsProblemSolverOpen(false);
    setActiveViewMode('chat');
    handleSendMessage(diagnosticSummary);
  };


  // Subscribe to status updates from model manager
  useEffect(() => {
    const unsubscribe = modelManager.subscribe((status, progress) => {
      setAiStatus(status);
      setModelProgress(progress);
      setModelInfo(modelManager.getModelInfo());
    });

    // Load initial conversations from IndexedDB
    getAllConversations().then((sessions) => {
      setSavedSessions(sessions);
      if (sessions.length > 0 && messages.length === 0) {
        // Load latest session
        const latest = sessions[0];
        setCurrentSessionId(latest.id);
        setMessages(latest.messages);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Save current conversation session to IndexedDB
  useEffect(() => {
    if (messages.length === 0) return;

    const firstUserMsg = messages.find((m) => m.role === 'user');
    const title = firstUserMsg ? firstUserMsg.content.slice(0, 35) + '...' : 'Farming Inquiry';

    const session: ConversationSession = {
      id: currentSessionId,
      title,
      createdAt: messages[0]?.timestamp || Date.now(),
      updatedAt: Date.now(),
      messages,
      language: language as 'en' | 'rw',
    };

    saveConversation(session).then(() => {
      getAllConversations().then(setSavedSessions);
    });
  }, [messages, currentSessionId, language]);

  // Compute farm context for local personalization
  const farmContext = {
    district: currentUser?.district || 'Nyagatare',
    sector: currentUser?.sector || 'Mimuri',
    crops: Array.from(new Set(cropCycles.map((c) => c.cropType).filter(Boolean))),
    plotCount: plots.length,
  };

  // Process and Submit a user question
  const handleSendMessage = async (queryText?: string) => {
    let textToSend = (queryText || inputQuery).trim();
    if (!textToSend && !attachedImage) return;
    if (isProcessing) return;

    if (attachedImage && !textToSend) {
      textToSend =
        language === 'rw'
          ? 'Ndasaba kureba iyi foto y\'igihingwa/urwiri/icyonnyi ukangira inama y\'ubuhinzi.'
          : 'Please inspect this crop/weed/pest photo and provide agricultural guidance.';
    }

    const currentImgName = attachedImageName;
    setInputQuery('');
    setAttachedImage(null);
    setAttachedImageName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const displayContent = currentImgName
      ? `📷 [${language === 'rw' ? 'Ifoto Yometseho' : 'Attached Photo'}: ${currentImgName}]\n\n${textToSend}`
      : textToSend;

    const userMessage: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: displayContent,
      timestamp: Date.now(),
      engineUsed: 'local_knowledge',
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsProcessing(true);


    try {
      let assistantAnswer = '';
      let engineUsed: ChatMessage['engineUsed'] = 'local_knowledge';
      let platformAction: ChatMessage['platformAction'];

      const isOnline = modelManager.checkOnline();

      // 1. Try Online AI (Gemini) if online
      if (isOnline) {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: textToSend,
              language,
              history: newMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
              farmContext: personalize ? farmContext : null,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.answer && !data.fallback) {
              assistantAnswer = data.answer;
              engineUsed = 'online_gemini';

              // Check if query triggers a platform action
              const localLookup = searchOfflineAgriKnowledge(textToSend, language as 'en' | 'rw', farmContext, personalize);
              if (localLookup.platformAction) {
                platformAction = localLookup.platformAction;
              }
            }
          }
        } catch (netErr) {
          console.warn('Online AI failed, smoothly falling back to offline knowledge base:', netErr);
        }
      }

      // 2. Fallback to 100% Offline Local Knowledge Engine if not answered by online AI
      if (!assistantAnswer) {
        const localResult = searchOfflineAgriKnowledge(textToSend, language as 'en' | 'rw', farmContext, personalize);
        assistantAnswer = localResult.formattedAnswer;
        engineUsed = modelInfo?.installed ? 'local_model' : 'local_knowledge';
        platformAction = localResult.platformAction;
      }

      const assistantMessage: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: assistantAnswer,
        timestamp: Date.now(),
        engineUsed,
        platformAction,
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (err: any) {
      console.error('Error in AI processing:', err);
      const fallbackMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content:
          language === 'rw'
            ? 'Habaye ikibazo mu gushaka igisubizo. Ubumenyi bw\'ibanze bw\'ubutaka, ibigori, n\'ibishyimbo buracyafite umutekano muri telefone yawe.'
            : 'An issue occurred during evaluation. Verified offline knowledge entries remain safely stored on your device.',
        timestamp: Date.now(),
        engineUsed: 'local_knowledge',
      };
      setMessages([...newMessages, fallbackMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  // New Conversation trigger
  const handleStartNewChat = () => {
    setCurrentSessionId('session_' + Date.now());
    setMessages([]);
  };

  // Delete Conversation session
  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteConversation(id);
    const updated = await getAllConversations();
    setSavedSessions(updated);
    if (id === currentSessionId) {
      handleStartNewChat();
    }
  };

  // Copy answer to clipboard
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Feedback thumb rating
  const handleFeedback = (id: string, fb: 'helpful' | 'unhelpful') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: fb } : m))
    );
  };

  // Audio Speech Readout
  const handleSpeak = (text: string, id: string) => {
    if (isSpeaking) {
      stopAudio();
    } else {
      // Clean markdown stars/bullets for clean audio narration
      const cleanText = text.replace(/[*_#`]/g, '').slice(0, 350);
      speakKinyarwandaText(cleanText, id);
    }
  };

  // Voice speech input using browser Web Speech API
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const handleToggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      setVoiceNotice(
        language === 'rw'
          ? 'Ijwi ntirishyigikiwe muri iyi browser.'
          : 'Voice input is not supported in this browser environment.'
      );
      setTimeout(() => setVoiceNotice(null), 3500);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = language === 'rw' ? 'rw-RW' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Quick Question Cards Data
  const quickCards = [
    {
      en: 'Hello! How can you help me today?',
      rw: 'Muraho! Wamfasha ute uyu munsi?',
      tag: 'Greeting & Intro',
    },
    {
      en: 'Who founded AgriBridge Rwanda?',
      rw: 'Ninde washinze AgriBridge Rwanda?',
      tag: 'Founders & Vision',
    },
    {
      en: 'How can I stop Banana Bacterial Wilt (Kirabiranya)?',
      rw: 'Nigute nahagarika kirabiranya y\'insina mu rutoki?',
      tag: 'Banana Protection',
    },
    {
      en: 'How do I identify and manage Cassava Ububembe (CBSD)?',
      rw: 'Nigute namenya nkanarwanya ububembe bw\'imyumbati?',
      tag: 'Cassava Health',
    },
    {
      en: 'How do I stake climbing beans for high yields?',
      rw: 'Nigute nshingirira neza ibishyimbo by\'imishingiriro?',
      tag: 'Climbing Beans',
    },
    {
      en: 'How can I control Fall Armyworm (Nkongwa) in maize?',
      rw: 'Nigute narwanya nkongwa idasanzwe mu bigori?',
      tag: 'Maize Protection',
    },
    {
      en: 'How do dairy farmers make silage for dry season?',
      rw: 'Nigute nabika ubwatsi bwa silage mu mpeshyi?',
      tag: 'Dairy & Silage',
    },
    {
      en: 'Best practices for rice farming in marshlands?',
      rw: 'Uburyo bwiza bwo guhinga umuceri mu bishanga?',
      tag: 'Rice Marshlands',
    },
    {
      en: 'How should I store beans to prevent weevil damage?',
      rw: 'Nigute nabika ibishyimbo ngo bitaribwa n\'imungu?',
      tag: 'PICS Storage',
    },
    {
      en: 'How do I use AgriBridge to sell my harvested produce?',
      rw: 'Nigute nkoresha AgriBridge ngo ngurishe umusaruro?',
      tag: 'Marketplace',
    },
  ];

  // Helper for Status Badge styling
  const renderStatusBadge = () => {
    switch (aiStatus) {
      case 'ONLINE AI AVAILABLE':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
            <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Online AI Available</span>
          </div>
        );
      case 'OFFLINE AI READY':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-800 text-[11px] font-semibold text-teal-800 dark:text-teal-300">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Offline AI Ready (Local Model)</span>
          </div>
        );
      case 'DOWNLOADING AI MODEL':
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
            <Download className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span>Downloading AI Model ({modelProgress}%)</span>
          </div>
        );
      case 'LOCAL KNOWLEDGE MODE':
      default:
        return (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
            <Database className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Local Knowledge Mode (100% Offline)</span>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[580px] rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
      {/* 1. Header Toolbar */}
      <header className="px-4 sm:px-6 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-100 shadow-xs">
            <AgriBridgeBrandIcon className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-tight">
                AgriBridge AI
              </h2>
              <span className="hidden sm:inline-block text-xs font-medium text-emerald-800 dark:text-emerald-400">
                &middot; Your Farming Knowledge Companion
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {language === 'rw'
                ? 'Ubumenyi bw\'ubuhinzi ntibuzimira niyo interineti yagenda.'
                : 'Your farming knowledge should not disappear when your internet connection does.'}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Active Status Badge */}
          {renderStatusBadge()}

          {/* Local Model Manager trigger */}
          <button
            onClick={() => setIsModelModalOpen(true)}
            className="p-1.5 text-xs font-medium rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
            title="Local AI Model Storage & Options"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Conversations Drawer trigger */}
          <button
            onClick={() => setIsHistoryDrawerOpen(!isHistoryDrawerOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            title="View saved offline conversations"
          >
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Saved</span>
            <span className="text-[10px] bg-stone-100 dark:bg-stone-700 px-1.5 py-0.2 rounded-full">
              {savedSessions.length}
            </span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-2xs"
            title="Start fresh inquiry"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </header>

      {/* 1.5 Sub-Navigation Tab Bar: Chat vs Knowledge Library + Solve Problem Button */}
      <div className="px-4 sm:px-6 py-2.5 border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveViewMode('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeViewMode === 'chat'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{language === 'rw' ? 'Ikiganiro cy\'Ubuhinzi' : 'Farming AI Chat'}</span>
          </button>

          <button
            onClick={() => setActiveViewMode('library')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeViewMode === 'library'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'rw' ? 'Isomero ry\'Ubumenyi' : 'Knowledge Library'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono">
              44+
            </span>
          </button>
        </div>

        <button
          onClick={() => setIsProblemSolverOpen(true)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 flex items-center gap-2 transition-all shadow-xs cursor-pointer ml-auto hover:scale-[1.02] active:scale-[0.98]"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-stone-950" />
          <span>{language === 'rw' ? 'Mfite ikibazo ku gihingwa cyanjye' : 'I Have a Problem with My Crop'}</span>
        </button>
      </div>

      {/* Main View Area: Either Knowledge Library or Chat Stream */}
      {activeViewMode === 'library' ? (
        <div className="flex-1 overflow-hidden">
          <AgriculturalKnowledgeLibrary
            onAskAiAboutEntry={(entry) => {
              setActiveViewMode('chat');
              handleSendMessage(language === 'rw' ? entry.questionRw : entry.questionEn);
            }}
            onNavigateTab={onNavigateTab}
          />
        </div>
      ) : (
        /* Main Body Grid (Chat Area + Optional History Drawer) */
        <div className="relative flex-1 flex overflow-hidden">
          {/* Chat Stream Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-stone-50/40 dark:bg-stone-950/40">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Welcome Banner when conversation is empty */}
            {messages.length === 0 && (
              <div className="max-w-2xl mx-auto py-6 space-y-6 text-center animate-in fade-in duration-300">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-800 flex items-center justify-center text-emerald-200 shadow-md">
                  <AgriBridgeBrandIcon className="w-8 h-8 text-emerald-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-50">
                    {language === 'rw' ? 'Murakaza neza kuri AgriBridge AI' : 'Welcome to AgriBridge AI'}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto leading-relaxed">
                    {language === 'rw'
                      ? 'Umufasha wawe mu bumenyi bw\'ubuhinzi. Baza ibibazo, wige uburyo bunoze bwo guhinga, kandi ubone amakuru yizewe — niyo waba nta interineti ufite.'
                      : 'Your farming knowledge companion. Ask questions, learn better farming practices, and access agricultural guidance — even when you are offline.'}
                  </p>
                </div>

                {/* Personalization Info Strip */}
                {plots.length > 0 && (
                  <div className="inline-flex items-center gap-2 p-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 text-left">
                    <Leaf className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>
                      {language === 'rw'
                        ? `Ubufasha bwitegeye ku butaka bwawe ${plots.length} mu murenge wa ${currentUser.sector || 'Nyagatare'}.`
                        : `Personalized for your ${plots.length} recorded plots in ${currentUser.sector || 'Nyagatare'}.`}
                    </span>
                    <button
                      onClick={() => setPersonalize(!personalize)}
                      className="ml-2 text-[10px] font-bold underline cursor-pointer"
                    >
                      {personalize ? 'Turn Off' : 'Turn On'}
                    </button>
                  </div>
                )}

                {/* Quick Question Cards (Section 7) */}
                <div className="pt-2 text-left space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
                    <span>
                      {language === 'rw' ? 'Ibibazo Bikunze Kubazwa (Bikora Offline)' : 'Frequently Asked Farming Questions (Works Offline)'}
                    </span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400">100% Verified</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {quickCards.map((card, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(language === 'rw' ? card.rw : card.en)}
                        className="group text-left p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-500/60 dark:hover:border-emerald-600/60 hover:shadow-xs transition-all flex flex-col justify-between"
                      >
                        <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 leading-snug">
                          {language === 'rw' ? card.rw : card.en}
                        </span>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100 dark:border-stone-800/80 text-[10px] text-stone-400">
                          <span className="font-mono uppercase">{card.tag}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-emerald-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Render Conversation Messages */}
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-2xs ${
                      isUser
                        ? 'bg-stone-800 text-stone-100 dark:bg-stone-700'
                        : 'bg-emerald-800 text-emerald-200'
                    }`}
                  >
                    {isUser ? (
                      <span className="text-xs font-bold uppercase">{currentUser.fullName?.[0] || 'U'}</span>
                    ) : (
                      <AgriBridgeBrandIcon className="w-4 h-4 text-emerald-300" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`space-y-2 max-w-[85%] sm:max-w-[78%]`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-emerald-800 text-white rounded-tr-xs shadow-xs'
                          : 'bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-tl-xs shadow-xs text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {/* Message Content with bold headings rendered cleanly */}
                      <div className="whitespace-pre-wrap space-y-2">
                        {msg.content.split('\n\n').map((block, i) => (
                          <p key={i}>
                            {block.split('**').map((seg, j) =>
                              j % 2 === 1 ? <strong key={j} className="text-stone-900 dark:text-white font-bold">{seg}</strong> : seg
                            )}
                          </p>
                        ))}
                      </div>

                      {/* Interactive Platform Navigation Action (Section 8 & 9) */}
                      {!isUser && msg.platformAction && (
                        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                          <button
                            onClick={() => {
                              if (msg.platformAction?.tab === 'farmer' && onOpenNewPlotModal) {
                                onNavigateTab('farmer');
                              } else if (msg.platformAction?.tab === 'marketplace' && onOpenNewListingModal) {
                                onNavigateTab('marketplace');
                              } else {
                                onNavigateTab(msg.platformAction?.tab as any);
                              }
                            }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                          >
                            <span>{language === 'rw' ? msg.platformAction.labelRw : msg.platformAction.labelEn}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Controls Bar under bubble */}
                    {!isUser && (
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-400 dark:text-stone-500 px-1">
                        {/* Engine Badge */}
                        <span className="font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {msg.engineUsed === 'online_gemini'
                            ? 'Gemini 2.5 Flash'
                            : msg.engineUsed === 'local_model'
                            ? 'On-Device Mobile Model'
                            : 'Verified Offline Knowledge'}
                        </span>

                        <span>&middot;</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-stone-700 dark:hover:text-stone-300 ml-1 p-0.5"
                          title="Copy answer"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>

                        {/* Audio Narration button */}
                        <button
                          onClick={() => handleSpeak(msg.content, msg.id)}
                          className="hover:text-emerald-700 dark:hover:text-emerald-400 p-0.5"
                          title="Listen to audio reading"
                        >
                          {isSpeaking ? <VolumeX className="w-3 h-3 text-emerald-600 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                        </button>

                        {/* Helpful / Unhelpful Feedback */}
                        <div className="flex items-center gap-1 ml-auto">
                          <button
                            onClick={() => handleFeedback(msg.id, 'helpful')}
                            className={`p-0.5 hover:text-emerald-600 ${msg.feedback === 'helpful' ? 'text-emerald-600' : ''}`}
                            title="Helpful advice"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'unhelpful')}
                            className={`p-0.5 hover:text-amber-600 ${msg.feedback === 'unhelpful' ? 'text-amber-600' : ''}`}
                            title="Needs improvement"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Processing / Typing Indicator */}
            {isProcessing && (
              <div className="flex items-center gap-3 text-xs text-stone-500 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-200">
                  <AgriBridgeBrandIcon className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl rounded-tl-xs">
                  <span>{language === 'rw' ? 'Gusesengura ubumenyi bw\'ubuhinzi...' : 'Analyzing agricultural knowledge base...'}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 3. Input Toolbar Area */}
          <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shrink-0">
            {/* Attached Photo Preview */}
            {attachedImage && (
              <div className="mb-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <img
                    src={attachedImage}
                    alt="Attached crop preview"
                    className="w-10 h-10 rounded-lg object-cover border border-emerald-300 dark:border-emerald-700 shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-200 truncate">
                      {attachedImageName || 'Crop / Weed / Pest Photo'}
                    </p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      {language === 'rw' ? 'Ifoto yiteguye gusuzumwa' : 'Photo ready for botanical / pest diagnosis'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="p-1 rounded-md text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {voiceNotice && (
              <div className="mb-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300">
                {voiceNotice}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Hidden file input for camera & photo upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />

              {/* Camera / Photo upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                title={language === 'rw' ? 'Ohereza ifoto y\'urwiri cyangwa indwara' : 'Attach crop or weed photo for diagnosis'}
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Voice Input button */}
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-100'
                }`}
                title="Voice inquiry (English / Kinyarwanda)"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  language === 'rw'
                    ? 'Baza ikibazo cy\'ubuhinzi, indwara, urwiri, ibiciro cyangwa AgriBridge...'
                    : 'Ask agricultural questions, crop diseases, weeds, fertilizer, or finances...'
                }
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!inputQuery.trim() && !attachedImage) || isProcessing}
                className="p-2.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
                title="Submit question"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Input status line */}
            <div className="flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500 pt-2 px-1">
              <span>
                {language === 'rw'
                  ? 'Ubumenyi bwose bubitswe muri telefone bukora 100% nta interineti.'
                  : 'All agricultural guidance works 100% offline without internet.'}
              </span>
              <button
                type="button"
                onClick={() => setMessages([])}
                className="hover:text-stone-700 dark:hover:text-stone-300"
              >
                {language === 'rw' ? 'Gusiba Ikiganiro' : 'Clear Chat'}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Saved Conversations Drawer */}
        {isHistoryDrawerOpen && (
          <aside className="w-72 sm:w-80 border-l border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col z-20 animate-in slide-in-from-right duration-200">
            <div className="p-3.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {language === 'rw' ? 'Ibiganiro Byabitswe' : 'Saved Conversations'}
                </h4>
              </div>
              <button
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {savedSessions.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-400">
                  {language === 'rw' ? 'Nta biganiro birabikwa muri telefone.' : 'No saved conversations on device yet.'}
                </div>
              ) : (
                savedSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => {
                      setCurrentSessionId(session.id);
                      setMessages(session.messages);
                      setIsHistoryDrawerOpen(false);
                    }}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors group flex items-start justify-between gap-2 ${
                      session.id === currentSessionId
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="space-y-0.5 overflow-hidden">
                      <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {session.title}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {new Date(session.updatedAt).toLocaleDateString()} &middot; {session.messages.length} messages
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {savedSessions.length > 0 && (
              <div className="p-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  onClick={async () => {
                    await clearAllConversations();
                    setSavedSessions([]);
                    handleStartNewChat();
                  }}
                  className="w-full py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors font-medium text-center"
                >
                  {language === 'rw' ? 'Siba Byose (Clear Storage)' : 'Clear All Stored Conversations'}
                </button>
              </div>
            )}
          </aside>
        )}
      </div>
      )}

      {/* 5. Local AI Model Settings Modal (Section 4 & 5) */}
      {isModelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Local AI Model &amp; Storage Settings
                </h3>
              </div>
              <button
                onClick={() => setIsModelModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-300">
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {modelInfo?.name || 'AgriBridge Mobile Agronomy LLM'}
                  </span>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {modelInfo?.sizeMb} MB
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Compact in-browser model for offline semantic reasoning. Designed to run completely on-device without network calls, suitable for modern smartphones.
                </p>
                <div className="pt-1 flex items-center gap-2 text-[11px]">
                  <span className="font-medium text-stone-500">Status:</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-400">
                    {modelInfo?.installed ? 'Installed & Ready for Offline Inference' : 'Not Installed (Using Zero-RAM Local Knowledge Base)'}
                  </span>
                </div>
              </div>

              {/* Download / Management Action */}
              {modelInfo?.installed ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Model weights cached in browser storage.</span>
                  </div>
                  <button
                    onClick={() => {
                      modelManager.removeModel();
                    }}
                    className="w-full py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    Delete Model &amp; Free 38.4MB Storage
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[11px] text-stone-500">
                    Note: An initial download requires internet connectivity. If you decline, AgriBridge will still answer all agricultural questions via the built-in verified knowledge base.
                  </p>
                  <button
                    onClick={() => {
                      modelManager.downloadModel();
                    }}
                    disabled={modelProgress > 0 && modelProgress < 100}
                    className="w-full py-2.5 text-xs font-bold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>
                      {modelProgress > 0 && modelProgress < 100
                        ? `Downloading... (${modelProgress}%)`
                        : 'Download Model for Offline Generation (38.4 MB)'}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex justify-end">
              <button
                onClick={() => setIsModelModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Guided Farmer Problem-Solving Workflow Modal (Part 6) */}
      <CropProblemSolverModal
        isOpen={isProblemSolverOpen}
        onClose={() => setIsProblemSolverOpen(false)}
        onSubmitToChat={handleProblemSolverSubmit}
      />
    </div>
  );
};

