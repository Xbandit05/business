import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { TrainingLesson } from '../../types/index.ts';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Award,
  Mic,
  Activity,
  Layers,
} from 'lucide-react';

export const FarmerTrainingCenter: React.FC = () => {
  const {
    t,
    language,
    speakKinyarwandaText,
    isSpeaking,
    audioState,
    speaker,
    setSpeaker,
    audioSpeed,
    setAudioSpeed,
    activeAudioId,
    audioProgress,
    pauseAudio,
    resumeAudio,
    stopAudio,
  } = useLanguage();

  const { lessons, toggleLessonComplete } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>('les_1');

  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const filteredLessons =
    selectedCategory === 'all'
      ? lessons
      : lessons.filter((l) => l.category === selectedCategory);

  const activeLesson = lessons.find((l) => l.id === activeAudioId);

  const handleToggleLessonAudio = (lesson: TrainingLesson) => {
    if (activeAudioId === lesson.id && audioState === 'playing') {
      pauseAudio();
    } else if (activeAudioId === lesson.id && audioState === 'paused') {
      resumeAudio();
    } else {
      speakKinyarwandaText(lesson.kinyarwandaAudioText, lesson.id);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = Math.floor(sec % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="space-y-8">
      {/* Title & Progress Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {t('train.title')}
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            {t('train.subtitle')}
          </p>
        </div>

        {/* Progress Badge */}
        <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs flex items-center gap-3 self-start sm:self-auto">
          <Award className="w-6 h-6 text-emerald-700" />
          <div>
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
              Training Progress: {completedCount} of {lessons.length} Completed
            </div>
            <div className="w-36 bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real Kinyarwanda Voice Control Station */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-emerald-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-700/80 flex items-center justify-center text-emerald-200">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide">
                Real Kinyarwanda Audible Voice Broadcast (Amajwi Nyakuri y'Ubuhinzi)
              </h2>
              <p className="text-[11px] text-emerald-200/80">
                Studio-grade spoken Kinyarwanda by verified Rwandan agronomy specialists
              </p>
            </div>
          </div>

          {/* Voice Selector & Speed Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Speaker Toggle */}
            <div className="flex items-center bg-emerald-950/70 p-1 rounded-xl border border-emerald-700/50 text-xs">
              <button
                type="button"
                onClick={() => setSpeaker('keza')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  speaker === 'keza'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <span>Agronome Keza</span>
                <span className="text-[10px] opacity-75">(Umugore)</span>
              </button>

              <button
                type="button"
                onClick={() => setSpeaker('mugisha')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                  speaker === 'mugisha'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <span>Agronome Mugisha</span>
                <span className="text-[10px] opacity-75">(Umugabo)</span>
              </button>
            </div>

            {/* Speed Toggle */}
            <div className="flex items-center bg-emerald-950/70 p-1 rounded-xl border border-emerald-700/50 text-xs">
              {[
                { speed: 0.8, label: '0.8x Gahoro' },
                { speed: 1.0, label: '1.0x Bisanzwe' },
                { speed: 1.2, label: '1.2x Byihuse' },
              ].map((s) => (
                <button
                  key={s.speed}
                  type="button"
                  onClick={() => setAudioSpeed(s.speed)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium text-[11px] transition-all ${
                    audioSpeed === s.speed
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Audio Player Active Banner */}
        {activeLesson && (audioState === 'playing' || audioState === 'paused' || audioState === 'loading') && (
          <div className="p-3.5 bg-emerald-950/60 rounded-xl border border-emerald-600/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (audioState === 'playing') pauseAudio();
                  else resumeAudio();
                }}
                className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 flex items-center justify-center shrink-0 shadow-xs"
              >
                {audioState === 'playing' ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <div className="space-y-0.5">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Now Speaking: {language === 'rw' ? activeLesson.titleRw : activeLesson.titleEn}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 font-mono">
                    {speaker === 'keza' ? 'Voice: Agronome Keza' : 'Voice: Agronome Mugisha'}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-200/90 font-mono">
                  {formatSeconds(audioProgress.current)} / {formatSeconds(audioProgress.duration || activeLesson.durationMinutes * 60)}
                </div>
              </div>
            </div>

            {/* Animated Audio Equalizer Waveform */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <div className="flex items-center gap-0.5 h-6 px-3 bg-emerald-900/80 rounded-lg">
                {[40, 70, 95, 60, 85, 45, 90, 65, 30].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-emerald-400 transition-all ${
                      audioState === 'playing' ? 'animate-pulse' : 'opacity-40'
                    }`}
                    style={{
                      height: audioState === 'playing' ? `${Math.max(20, (h * (i % 2 === 0 ? 1 : 0.8)))}%` : '20%',
                      animationDuration: `${0.4 + (i * 0.1)}s`,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={stopAudio}
                className="px-2.5 py-1 text-[11px] font-semibold text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded border border-emerald-700/60"
              >
                Stop
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'Crop Management', 'Agrochemical Safety', 'Harvest Quality', 'Soil & Water'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            {cat === 'all' ? 'All Lessons' : cat}
          </button>
        ))}
      </div>

      {/* Lessons Cards List */}
      <div className="space-y-4">
        {filteredLessons.map((lesson) => {
          const isExpanded = expandedLessonId === lesson.id;
          const isThisLessonPlaying = activeAudioId === lesson.id && audioState === 'playing';
          const isThisLessonPaused = activeAudioId === lesson.id && audioState === 'paused';
          const isThisLessonLoading = activeAudioId === lesson.id && audioState === 'loading';

          return (
            <div
              key={lesson.id}
              className={`p-5 rounded-2xl border shadow-2xs space-y-4 transition-all ${
                isThisLessonPlaying
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/70 shadow-emerald-500/10'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {lesson.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-stone-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.durationMinutes} mins</span>
                    </span>
                    {lesson.isCompleted && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 pt-1">
                    {language === 'rw' ? lesson.titleRw : lesson.titleEn}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {language === 'rw' ? lesson.summaryRw : lesson.summaryEn}
                  </p>
                </div>

                {/* Real Audible Voice Trigger CTA */}
                <button
                  type="button"
                  onClick={() => handleToggleLessonAudio(lesson)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl shadow-xs transition-all shrink-0 whitespace-nowrap ${
                    isThisLessonPlaying
                      ? 'bg-emerald-700 text-white ring-2 ring-emerald-500'
                      : isThisLessonPaused
                      ? 'bg-amber-700 text-white'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                >
                  {isThisLessonLoading ? (
                    <>
                      <Activity className="w-4 h-4 animate-spin" />
                      <span>Tegereza Ijwi...</span>
                    </>
                  ) : isThisLessonPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Hagarika Ijwi (Pause)</span>
                    </>
                  ) : isThisLessonPaused ? (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Komeza Kumva (Resume)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Umva mu Kinyarwanda</span>
                    </>
                  )}
                </button>
              </div>

              {/* Spoken Narration Script Box */}
              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700/60 text-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-[11px] font-semibold uppercase">
                  <span>Icyo Isomo Rivuga mu Kinyarwanda (Audible Transcript)</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400">
                    {speaker === 'keza' ? 'Ijwi: Keza' : 'Ijwi: Mugisha'}
                  </span>
                </div>
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed italic font-medium">
                  "{lesson.kinyarwandaAudioText}"
                </p>
              </div>

              {/* Expandable Key Takeaways */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                  className="flex items-center justify-between w-full text-xs font-bold text-stone-800 dark:text-stone-200 hover:text-emerald-800 transition-colors py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>{t('train.keyTakeaways')}</span>
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <ul className="mt-2.5 space-y-2 text-xs text-stone-700 dark:text-stone-300 pl-5 list-disc leading-relaxed">
                    {(language === 'rw' ? lesson.keyTakeawaysRw : lesson.keyTakeawaysEn).map(
                      (item, idx) => (
                        <li key={idx}>{item}</li>
                      )
                    )}
                  </ul>
                )}
              </div>

              {/* Complete Toggle Button */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  onClick={() => toggleLessonComplete(lesson.id)}
                  className="inline-flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-300 hover:text-emerald-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!lesson.isCompleted}
                    onChange={() => {}}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Mark Lesson Completed on Profile</span>
                </button>

                <span className="text-[11px] text-stone-400">RAB Technical Guideline Aligned</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
