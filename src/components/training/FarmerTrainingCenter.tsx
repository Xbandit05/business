import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { TrainingLesson } from '../../types/index.ts';
import {
  BookOpen,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

export const FarmerTrainingCenter: React.FC = () => {
  const { t, language, speakKinyarwandaText, isSpeaking } = useLanguage();
  const { lessons, toggleLessonComplete } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>('les_1');
  const [playingLessonId, setPlayingLessonId] = useState<string | null>(null);

  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const filteredLessons =
    selectedCategory === 'all'
      ? lessons
      : lessons.filter((l) => l.category === selectedCategory);

  const handlePlayLesson = (lesson: TrainingLesson) => {
    if (playingLessonId === lesson.id && isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingLessonId(null);
    } else {
      setPlayingLessonId(lesson.id);
      speakKinyarwandaText(lesson.kinyarwandaAudioText);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
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

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'Crop Management', 'Agrochemical Safety', 'Harvest Quality'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            {cat === 'all' ? 'All Lessons' : cat}
          </button>
        ))}
      </div>

      {/* Lessons Accordion / Card List */}
      <div className="space-y-4">
        {filteredLessons.map((lesson) => {
          const isExpanded = expandedLessonId === lesson.id;
          const isAudioPlaying = playingLessonId === lesson.id && isSpeaking;

          return (
            <div
              key={lesson.id}
              className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4 transition-colors"
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

                {/* Audio Playback CTA */}
                <button
                  onClick={() => handlePlayLesson(lesson)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-2xs transition-colors shrink-0 whitespace-nowrap ${
                    isAudioPlaying
                      ? 'bg-emerald-700 text-white animate-pulse'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                >
                  {isAudioPlaying ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>{t('train.listenAudio')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Spoken Narration Script Box */}
              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700/60 text-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-[11px] font-semibold uppercase">
                  <span>Kinyarwanda Spoken Narration Transcript</span>
                  <span>Audio Lesson</span>
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
