import React, { useState } from 'react';
import { 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Trash2, 
  BookOpen, 
  Sparkles,
  Layers,
  Flame
} from 'lucide-react';
import { useQuestionBank } from '../context/QuestionBankContext';
import { QuestionCard } from './QuestionCard';

export const StudyDeckView: React.FC = () => {
  const { allQuestions, userMetadata, stats } = useQuestionBank();
  const [deckTab, setDeckTab] = useState<'all' | 'bookmarked' | 'in_progress' | 'mastered'>('all');

  // Filter questions for deck
  const deckQuestions = allQuestions.filter(q => {
    const meta = userMetadata[q.id];
    if (!meta) return false;

    if (deckTab === 'bookmarked') return meta.isBookmarked;
    if (deckTab === 'in_progress') return meta.status === 'in_progress';
    if (deckTab === 'mastered') return meta.status === 'mastered';

    // 'all' = either bookmarked or has changed status or has notes
    return meta.isBookmarked || meta.status !== 'not_started' || Boolean(meta.notes);
  });

  return (
    <div className="space-y-6">
      {/* Study Deck Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personalized Exam Prep Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              My Study Deck &amp; Active Review
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Track your revision status, view personal study notes, and focus on saved questions for the Term-End Exam.
            </p>
          </div>

          {/* Quick Deck Stats */}
          <div className="flex items-center gap-3">
            <div className="text-center px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Bookmarked</span>
              <span className="text-lg font-bold text-amber-600">{stats.bookmarkedCount}</span>
            </div>
            <div className="text-center px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">In Progress</span>
              <span className="text-lg font-bold text-blue-600">{stats.inProgressCount}</span>
            </div>
            <div className="text-center px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Mastered</span>
              <span className="text-lg font-bold text-emerald-600">{stats.masteredCount}</span>
            </div>
          </div>
        </div>

        {/* Deck Sub-tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setDeckTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
              deckTab === 'all'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Active Items ({deckQuestions.length})
          </button>
          <button
            onClick={() => setDeckTab('bookmarked')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              deckTab === 'bookmarked'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarked ({stats.bookmarkedCount})</span>
          </button>
          <button
            onClick={() => setDeckTab('in_progress')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              deckTab === 'in_progress'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>In Review ({stats.inProgressCount})</span>
          </button>
          <button
            onClick={() => setDeckTab('mastered')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              deckTab === 'mastered'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Exam Ready ({stats.masteredCount})</span>
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {deckQuestions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Your Study Deck is Empty</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              Click the bookmark icon or update the study status (In Review / Mastered) on any question in the Question Bank or 80/20 High-Yield tab to organize your revision deck.
            </p>
          </div>
        ) : (
          deckQuestions.map((question, index) => (
            <QuestionCard key={question.id} question={question} index={index} />
          ))
        )}
      </div>
    </div>
  );
};
