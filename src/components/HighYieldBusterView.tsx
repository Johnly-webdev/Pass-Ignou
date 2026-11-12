import React from 'react';
import { 
  Flame, 
  Target, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import { useQuestionBank } from '../context/QuestionBankContext';
import { QuestionCard } from './QuestionCard';

export const HighYieldBusterView: React.FC = () => {
  const { allQuestions, userMetadata, filters, updateFilter } = useQuestionBank();

  // Filter high-yield questions (appearance >= 3)
  const highYieldQuestions = allQuestions
    .filter(q => {
      if (q.appearanceCount < 3) return false;
      if (filters.programme !== 'ALL' && q.programmeId !== filters.programme) return false;
      if (filters.courseCode !== 'ALL' && q.courseCode !== filters.courseCode) return false;
      return true;
    })
    .sort((a, b) => b.appearanceCount - a.appearanceCount);

  // Compute stats for high-yield questions
  const totalHighYield = highYieldQuestions.length;
  const masteredHighYield = highYieldQuestions.filter(q => userMetadata[q.id]?.status === 'mastered').length;
  const inProgressHighYield = highYieldQuestions.filter(q => userMetadata[q.id]?.status === 'in_progress').length;
  const prepRatio = totalHighYield > 0 ? Math.round(((masteredHighYield + inProgressHighYield * 0.5) / totalHighYield) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* High-Yield Hero Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-xs text-amber-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-4 h-4 text-amber-300" />
            <span>The 80/20 Rule for IGNOU Term-End Exams</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
            Super High-Yield Repeated Questions
          </h2>
          <p className="mt-2 text-sm sm:text-base text-amber-100 leading-relaxed font-sans">
            In IGNOU Term-End Examinations (TEE), over <strong>65% to 75%</strong> of questions recur with minor wording variations from the past 5 years. Preparing these high-frequency questions provides the highest return on your study hours.
          </p>

          {/* Quick Metrics */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-4 border-t border-white/20">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
              <span className="text-xs text-amber-200 block">High-Yield Questions</span>
              <span className="text-2xl font-bold">{totalHighYield}</span>
              <span className="text-[11px] text-amber-200 block">Appeared 3+ Times</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl">
              <span className="text-xs text-amber-200 block">Your High-Yield Mastery</span>
              <span className="text-2xl font-bold">{prepRatio}%</span>
              <span className="text-[11px] text-amber-200 block">{masteredHighYield} Mastered</span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-xs text-amber-200 block">Average TEE Recurrence</span>
              <span className="text-2xl font-bold">5.2x</span>
              <span className="text-[11px] text-amber-200 block">Across alternate cycles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advice Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-200">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Exam Strategy Recommendation
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Review every 5+ times repeated question first. For 4-credit courses (e.g. MCS-021, MCS-012), questions in this list account for over 60 marks out of the 100-mark paper!
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Course:</span>
          <select
            value={filters.courseCode}
            onChange={(e) => updateFilter('courseCode', e.target.value)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Available Courses</option>
            {Array.from(new Set(highYieldQuestions.map(q => q.courseCode))).map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Question Cards List */}
      <div className="space-y-4">
        {highYieldQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">No high-yield questions found for current programme/course filter.</p>
          </div>
        ) : (
          highYieldQuestions.map((question, index) => (
            <QuestionCard key={question.id} question={question} index={index} />
          ))
        )}
      </div>
    </div>
  );
};
