import React from 'react';
import { 
  Flame, 
  Award, 
  Layers, 
  HelpCircle, 
  BookMarked,
  Sparkles
} from 'lucide-react';
import { useQuestionBank } from '../context/QuestionBankContext';
import { IGNOU_COURSES } from '../data/ignouData';

export const StatsBanner: React.FC = () => {
  const { questions, allQuestions, filters, stats, updateFilter, activeView } = useQuestionBank();

  // Active course info if specific course is selected
  const activeCourse = filters.courseCode !== 'ALL' 
    ? IGNOU_COURSES.find(c => c.code === filters.courseCode) 
    : null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Card 1: Total Question Scope */}
        <div className="flex items-start gap-3.5 pr-3 pt-2 md:pt-0">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {filters.courseCode !== 'ALL' ? `${filters.courseCode} Bank` : 'Matching Questions'}
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">{questions.length}</span>
              <span className="text-xs text-slate-500">of {allQuestions.length} Total</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Past 10–20 Years (2004–2024) TEE Archive
            </p>
          </div>
        </div>

        {/* Card 2: High Yield Questions */}
        <div className="flex items-start gap-3.5 px-0 md:px-4 pt-3 md:pt-0">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <Flame className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                Repeated (3+ TEEs)
              </p>
              <span className="animate-pulse w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-amber-900">{stats.highYieldCount}</span>
              <span className="text-xs text-amber-800 font-medium">High-Yield</span>
            </div>
            <button
              onClick={() => updateFilter('onlyHighYield', !filters.onlyHighYield)}
              className="text-[11px] text-amber-700 hover:text-amber-900 underline font-medium mt-0.5 cursor-pointer block"
            >
              {filters.onlyHighYield ? 'Show all frequencies' : 'Filter only repeated →'}
            </button>
          </div>
        </div>

        {/* Card 3: Credit Weightage & Study Hours */}
        <div className="flex items-start gap-3.5 px-0 md:px-4 pt-3 md:pt-0">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {activeCourse ? `${activeCourse.credits} Credits Weight` : 'Credit Categories'}
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900">
                {activeCourse ? `${activeCourse.credits * 30}h` : '2, 3, 4, 6, 8'}
              </span>
              <span className="text-xs text-slate-500">
                {activeCourse ? 'Study Norm' : 'Credits'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              {activeCourse 
                ? `${activeCourse.maxMarks} Marks TEE • ${activeCourse.durationHours} Hours Paper` 
                : '1 Credit = 30 Study Hours (IGNOU)'}
            </p>
          </div>
        </div>

        {/* Card 4: Exam Readiness Progress */}
        <div className="flex items-start gap-3.5 pl-0 md:pl-4 pt-3 md:pt-0">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Your Exam Readiness
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-emerald-700">{stats.preparedRatio}%</span>
              <span className="text-xs text-slate-500">
                {stats.masteredCount} Mastered
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mt-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.preparedRatio)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Course Context Pill if course selected */}
      {activeCourse && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/80 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded text-[11px]">
              {activeCourse.code}
            </span>
            <span className="font-semibold text-slate-800">{activeCourse.title}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">{activeCourse.semesterYear}</span>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <span><strong>{activeCourse.blocks.length}</strong> Study Blocks</span>
            <span><strong>{activeCourse.credits}</strong> Credits</span>
            <span><strong>{activeCourse.maxMarks}</strong> Max Marks</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
              Passing: {activeCourse.maxMarks === 100 ? '35' : '18'} Marks
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
