import React, { useState } from 'react';
import { 
  Flame, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  FileEdit, 
  Layers, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  Calendar,
  GraduationCap,
  History
} from 'lucide-react';
import { Question, PrepStatus } from '../types';
import { useQuestionBank } from '../context/QuestionBankContext';

interface QuestionCardProps {
  question: Question;
  index: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
  const { 
    userMetadata, 
    toggleBookmark, 
    setQuestionStatus, 
    saveQuestionNote, 
    deleteCustomQuestion,
    openModelAnswer 
  } = useQuestionBank();

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteText, setNoteText] = useState(() => userMetadata[question.id]?.notes || '');
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const meta = userMetadata[question.id] || { status: 'not_started', isBookmarked: false };

  const handleSaveNote = () => {
    saveQuestionNote(question.id, noteText);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2000);
  };

  const getFrequencyBadge = () => {
    if (question.appearanceCount >= 10) {
      return {
        bg: 'bg-red-50 text-red-900 border-red-300',
        badge: 'bg-red-600 text-white',
        label: `🔥 20-Year Mega Repeated • ${question.appearanceCount}x in TEE`,
        accent: 'border-l-4 border-l-red-600',
      };
    }
    if (question.appearanceCount >= 5) {
      return {
        bg: 'bg-orange-50 text-orange-900 border-orange-300',
        badge: 'bg-orange-600 text-white',
        label: `🔥 High Yield Repeated • ${question.appearanceCount}x in TEE`,
        accent: 'border-l-4 border-l-orange-500',
      };
    }
    if (question.appearanceCount >= 3) {
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-300',
        badge: 'bg-amber-500 text-slate-950',
        label: `⚡ Repeated ${question.appearanceCount}x in TEE`,
        accent: 'border-l-4 border-l-amber-500',
      };
    }
    return {
      bg: 'bg-slate-50 text-slate-700 border-slate-200',
      badge: 'bg-slate-600 text-white',
      label: `Appeared in ${question.appearanceCount} TEEs`,
      accent: 'border-l-4 border-l-slate-300',
    };
  };

  const freq = getFrequencyBadge();

  return (
    <div 
      className={`bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden ${freq.accent} mb-4`}
    >
      {/* Top Meta Bar */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
          {/* Semester, Course, Credits */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Semester Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-bold text-xs">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>{question.semester}</span>
            </span>

            {/* Course Code */}
            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 font-mono font-bold text-xs tracking-wide">
              {question.courseCode}
            </span>

            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
              {question.courseTitle}
            </span>

            <span className="text-slate-300 hidden sm:inline">•</span>

            {/* Credit Weightage Tag */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Layers className="w-3 h-3 text-emerald-600" />
              <span>{question.creditWeightage} Credits</span>
              <span className="text-[10px] text-emerald-700">({question.creditWeightage * 30}h)</span>
            </span>

            {/* Past Years Timeline Badge */}
            {question.firstAppearedYear && question.latestAppearedYear && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                <History className="w-3 h-3 text-blue-600" />
                <span>{question.firstAppearedYear}–{question.latestAppearedYear} Archive</span>
              </span>
            )}

            {question.isCustom && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                User Added
              </span>
            )}
          </div>

          {/* Right Action Icons: Bookmark & Delete if custom */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleBookmark(question.id)}
              className={`p-2 rounded-xl transition cursor-pointer ${
                meta.isBookmarked 
                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={meta.isBookmarked ? 'Remove Bookmark' : 'Bookmark for Exam Revision'}
            >
              <Bookmark className={`w-4 h-4 ${meta.isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            {question.isCustom && (
              <button
                onClick={() => deleteCustomQuestion(question.id)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                title="Delete this question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Frequency & Exam Repetition Banner with Sessions */}
        <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${freq.bg}`}>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase ${freq.badge}`}>
              {question.appearanceCount >= 10 ? '★ 20-Yr Core' : question.appearanceCount >= 5 ? '★ Priority 1' : 'Priority 2'}
            </span>
            <span className="text-xs font-bold">
              {freq.label}
            </span>
          </div>

          {/* Past Sessions List (with smooth scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:max-w-xl scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-600 shrink-0 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              Sessions ({question.examSessions.length}):
            </span>
            {question.examSessions.map((session) => (
              <span
                key={session}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/95 border border-slate-300 text-slate-800 shadow-2xs shrink-0"
              >
                {session}
              </span>
            ))}
          </div>
        </div>

        {/* Question Text */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug font-serif">
              <span className="text-slate-400 font-sans mr-2 text-sm font-bold">Q{index + 1}.</span>
              {question.question}
            </h3>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs shrink-0 shadow-xs">
              {question.marks} Marks
            </span>
          </div>

          {/* Block & Unit Citation */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-indigo-900 bg-indigo-50/80 border border-indigo-100 px-2 py-0.5 rounded">
              {question.block}
            </span>
            <span>›</span>
            <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {question.unit}
            </span>
          </div>

          {/* Topic Tags */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer Bar */}
      <div className="bg-slate-50/90 border-t border-slate-100 px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Prep Status Toggle */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <button
            onClick={() => {
              const nextStatus: Record<PrepStatus, PrepStatus> = {
                not_started: 'in_progress',
                in_progress: 'mastered',
                mastered: 'not_started',
              };
              setQuestionStatus(question.id, nextStatus[meta.status]);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
              meta.status === 'mastered'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : meta.status === 'in_progress'
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {meta.status === 'mastered' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            {meta.status === 'in_progress' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
            {meta.status === 'not_started' && <span className="w-2 h-2 rounded-full bg-slate-400" />}
            <span>
              {meta.status === 'mastered' ? 'Mastered (Exam Ready)' : meta.status === 'in_progress' ? 'In Progress' : 'Not Started'}
            </span>
          </button>
        </div>

        {/* View Model Answer & Notes Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 border ${
              meta.notes
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>{meta.notes ? 'My Notes (1)' : 'Add Notes'}</span>
            {isNotesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => openModelAnswer(question)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Model Answer &amp; Tips</span>
          </button>
        </div>
      </div>

      {/* Inline Study Notes Drawer */}
      {isNotesOpen && (
        <div className="bg-purple-50/50 border-t border-purple-100 p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <FileEdit className="w-3.5 h-3.5 text-purple-700" />
              Personal Revision Notes for this Question
            </span>
            {isSavedAlert && (
              <span className="text-xs text-emerald-600 font-semibold animate-pulse">
                ✓ Notes saved!
              </span>
            )}
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={2}
            placeholder="Jot down quick formulas, page numbers from your IGNOU study material, or memory mnemonics..."
            className="w-full p-2.5 text-xs rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800"
          />
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleSaveNote}
              className="px-3 py-1 rounded-md text-xs font-semibold bg-purple-700 text-white hover:bg-purple-800 transition cursor-pointer flex items-center gap-1"
            >
              <Save className="w-3 h-3" />
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
