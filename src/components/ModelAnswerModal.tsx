import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Lightbulb, 
  Flame, 
  Award, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Save, 
  Printer, 
  Calendar,
  Share2
} from 'lucide-react';
import { useQuestionBank } from '../context/QuestionBankContext';
import { PrepStatus } from '../types';

export const ModelAnswerModal: React.FC = () => {
  const { 
    selectedQuestionForModal, 
    closeModelAnswer, 
    userMetadata, 
    setQuestionStatus, 
    saveQuestionNote, 
    toggleBookmark 
  } = useQuestionBank();

  if (!selectedQuestionForModal) return null;

  const q = selectedQuestionForModal;
  const meta = userMetadata[q.id] || { status: 'not_started', isBookmarked: false };
  const [note, setNote] = useState(meta.notes || '');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSaveNote = () => {
    saveQuestionNote(q.id, note);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold border border-indigo-500/30">
                {q.courseCode}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                {q.semester}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {q.courseTitle}
              </span>
              <span className="text-slate-500">•</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {q.creditWeightage} Credits
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-slate-950" />
                Repeated {q.appearanceCount}x
              </span>
              {q.firstAppearedYear && q.latestAppearedYear && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {q.firstAppearedYear}–{q.latestAppearedYear} (20-Yr Timeline)
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold font-serif leading-snug">
              {q.question}
            </h2>

            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>Marks: <strong className="text-white">{q.marks} Marks</strong></span>
              <span>•</span>
              <span>{q.block}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Sessions: {q.examSessions.join(', ')}
              </span>
            </div>
          </div>

          <button
            onClick={closeModelAnswer}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-slate-800">
          {/* IGNOU Scoring Tip Box */}
          <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950">
                  IGNOU Examiner Rubric &amp; High-Score Strategy
                </h4>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                  {q.modelAnswer.examTips}
                </p>
                <p className="text-[11px] text-amber-800 font-medium pt-1">
                  Target Word Count: <strong>~{q.modelAnswer.recommendedWordCount} words</strong> (Aligns with IGNOU 20/10/5-mark booklet page limits)
                </p>
              </div>
            </div>
          </div>

          {/* Model Solution Section */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Structured Model Answer Framework
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Standard TEE Solution
              </span>
            </div>

            {/* 1. Introduction */}
            <div>
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                1. Definition &amp; Conceptual Foundation
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-sans">
                {q.modelAnswer.introduction}
              </p>
            </div>

            {/* 2. Key Analytical Points */}
            <div>
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                2. Core Technical Points &amp; Elaboration
              </h4>
              <ul className="space-y-2.5">
                {q.modelAnswer.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Structural / Diagrammatic Blueprint (if present) */}
            {q.modelAnswer.diagramOrStructure && (
              <div>
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  3. Diagram / Structural Trace / Trace Matrix
                </h4>
                <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner leading-relaxed">
                  <pre>{q.modelAnswer.diagramOrStructure}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Personal Revision Notes Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                My Revision Notes for This Question
              </span>
              {savedFeedback && (
                <span className="text-xs text-emerald-600 font-semibold animate-pulse">
                  ✓ Saved successfully
                </span>
              )}
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Record your mnemonics, unit page references, or specific questions from assignments..."
              className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-slate-800"
            />
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={handleSaveNote}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-700 hover:bg-purple-800 text-white transition cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                Save Revision Note
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky Footer */}
        <div className="p-4 sm:p-5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Exam Status:</span>
            <button
              onClick={() => {
                const next: Record<PrepStatus, PrepStatus> = {
                  not_started: 'in_progress',
                  in_progress: 'mastered',
                  mastered: 'not_started',
                };
                setQuestionStatus(q.id, next[meta.status]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
                meta.status === 'mastered'
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : meta.status === 'in_progress'
                  ? 'bg-amber-500 text-slate-950 border-amber-600'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {meta.status === 'mastered' ? 'Mastered (Ready)' : meta.status === 'in_progress' ? 'In Review' : 'Mark as Started'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(q.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
                meta.isBookmarked
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{meta.isBookmarked ? 'Bookmarked ★' : 'Add to Deck'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Solution</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
