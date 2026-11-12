import React from 'react';
import { 
  Search, 
  RotateCcw, 
  Flame, 
  Layers, 
  X,
  Calendar,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { useQuestionBank } from '../context/QuestionBankContext';
import { IGNOU_PROGRAMMES, IGNOU_COURSES } from '../data/ignouData';
import { FrequencyTier, PrepStatus } from '../types';

export const FilterToolbar: React.FC = () => {
  const { filters, updateFilter, resetFilters, questions } = useQuestionBank();

  // Filter courses by selected programme and optionally semester
  const availableCourses = IGNOU_COURSES.filter(c => {
    if (filters.programme !== 'ALL' && c.programmeId !== filters.programme) return false;
    if (filters.semester !== 'ALL' && !c.semesterYear.includes(filters.semester)) return false;
    return true;
  });

  // Current course for block/unit inspection
  const currentCourse = IGNOU_COURSES.find(c => c.code === filters.courseCode);

  const hasActiveFilters = 
    filters.programme !== 'ALL' ||
    filters.semester !== 'ALL' ||
    filters.courseCode !== 'ALL' ||
    filters.creditWeightage !== 'ALL' ||
    filters.frequencyTier !== 'ALL' ||
    filters.marks !== 'ALL' ||
    filters.block !== 'ALL' ||
    filters.unit !== 'ALL' ||
    filters.yearRangeFilter !== 'ALL' ||
    filters.searchQuery !== '' ||
    filters.onlyBookmarked ||
    filters.onlyHighYield ||
    filters.statusFilter !== 'ALL';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-6 space-y-4">
      {/* Semester Navigation Bar (Crucial for BCA_NEW / BCA 6-Semester curriculum) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 scrollbar-none">
        <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider shrink-0 flex items-center gap-1.5 mr-1">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          BCA Semesters:
        </span>
        <button
          onClick={() => updateFilter('semester', 'ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
            filters.semester === 'ALL'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All 6 Semesters
        </button>
        {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'].map((sem, idx) => (
          <button
            key={sem}
            onClick={() => updateFilter('semester', sem)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              filters.semester === sem
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Sem {idx + 1}</span>
            <span className={`text-[10px] px-1 rounded ${
              filters.semester === sem ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
            }`}>
              {sem === 'Semester 1' ? 'BCS-011/12' : sem === 'Semester 2' ? 'MCS-011/12' : sem === 'Semester 3' ? 'MCS-021/23' : sem === 'Semester 4' ? 'BCS-041/Java' : sem === 'Semester 5' ? 'SE/Web' : 'OS/E-Com'}
            </span>
          </button>
        ))}
      </div>

      {/* Primary Search & Subject Selector Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            placeholder="Search questions by topic, algorithm, theorem, or TEE session (e.g. 'AVL Tree', 'Dec 2008', 'Cramer', 'Banker')..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 hover:bg-slate-50 transition"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Subject / Course Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <select
              value={filters.courseCode}
              onChange={(e) => updateFilter('courseCode', e.target.value)}
              className="w-full py-2.5 pl-3 pr-8 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
            >
              <option value="ALL">All Subjects ({availableCourses.length})</option>
              {availableCourses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}: {c.title.length > 25 ? c.title.substring(0, 25) + '...' : c.title} ({c.credits} Cr)
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full md:w-52">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as any)}
              className="w-full py-2.5 pl-3 pr-8 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
            >
              <option value="frequency_desc">Sort: Most Repeated (15x-5x) 🔥</option>
              <option value="year_desc">Sort: Latest TEE Exam Session</option>
              <option value="importance_desc">Sort: Exam Yield Score</option>
              <option value="marks_desc">Sort: Marks (20M → 5M)</option>
              <option value="credit_desc">Sort: Credit Weightage (4Cr → 2Cr)</option>
              <option value="alphabetical">Sort: Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* 10 to 20 Years PYQ Archive Timeline Selector & Credit Weightage */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
        {/* Past 10-20 Years Archive Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1 mr-1">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            PYQ Archive Range:
          </span>
          <button
            onClick={() => updateFilter('yearRangeFilter', 'ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              filters.yearRangeFilter === 'ALL'
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Sessions (2004–2024)
          </button>
          <button
            onClick={() => updateFilter('yearRangeFilter', 'past_20_years')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              filters.yearRangeFilter === 'past_20_years'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <span>📜 Past 20 Years</span>
            <span className="text-[10px] font-bold">(2004–2024)</span>
          </button>
          <button
            onClick={() => updateFilter('yearRangeFilter', 'past_10_years')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              filters.yearRangeFilter === 'past_10_years'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <span>📅 Past 10 Years</span>
            <span className="text-[10px] font-bold">(2014–2024)</span>
          </button>
          <button
            onClick={() => updateFilter('yearRangeFilter', 'past_5_years')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              filters.yearRangeFilter === 'past_5_years'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <span>⚡ Past 5 Years</span>
            <span className="text-[10px] font-bold">(2019–2024)</span>
          </button>
        </div>

        {/* Credit Weightage */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Credit Weight:
          </span>
          <button
            onClick={() => updateFilter('creditWeightage', 'ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              filters.creditWeightage === 'ALL'
                ? 'bg-indigo-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {[2, 3, 4].map((cr) => (
            <button
              key={cr}
              onClick={() => updateFilter('creditWeightage', cr)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                filters.creditWeightage === cr
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cr} Credits</span>
              <span className={`text-[10px] ${filters.creditWeightage === cr ? 'text-indigo-100' : 'text-slate-500'}`}>
                ({cr * 30}h)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Frequency & Marks Row */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
        {/* Frequency */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Repetition:
          </span>
          <button
            onClick={() => updateFilter('frequencyTier', 'ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              filters.frequencyTier === 'ALL'
                ? 'bg-amber-600 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => updateFilter('frequencyTier', 'very_high')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              filters.frequencyTier === 'very_high'
                ? 'bg-red-600 text-white font-semibold shadow-xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/50'
            }`}
          >
            <span>🔥 5+ to 17x Repeated</span>
          </button>
          <button
            onClick={() => updateFilter('frequencyTier', 'high')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              filters.frequencyTier === 'high'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/50'
            }`}
          >
            <span>⚡ 3-4x Repeated</span>
          </button>
        </div>

        {/* Marks */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1">
            Marks:
          </span>
          <button
            onClick={() => updateFilter('marks', 'ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
              filters.marks === 'ALL'
                ? 'bg-slate-800 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {[20, 15, 10, 5].map((m) => (
            <button
              key={m}
              onClick={() => updateFilter('marks', m)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                filters.marks === m
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {m}M
            </button>
          ))}
        </div>

        {/* Prep Status Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 mr-1">
            Status:
          </span>
          {(['ALL', 'not_started', 'in_progress', 'mastered'] as (PrepStatus | 'ALL')[]).map((status) => (
            <button
              key={status}
              onClick={() => updateFilter('statusFilter', status)}
              className={`px-2 py-0.5 rounded text-xs font-medium transition cursor-pointer ${
                filters.statusFilter === status
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All' : status === 'mastered' ? '✅ Ready' : status === 'in_progress' ? '⏳ Review' : '⚪ New'}
            </button>
          ))}
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Block & Unit Filter if course is selected */}
      {currentCourse && currentCourse.blocks.length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-500 shrink-0 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            Syllabus Blocks:
          </span>
          <button
            onClick={() => updateFilter('block', 'ALL')}
            className={`px-2.5 py-1 rounded text-xs font-medium shrink-0 cursor-pointer ${
              filters.block === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Blocks
          </button>
          {currentCourse.blocks.map((b) => {
            const blockShort = b.split(':')[0]; // e.g. "Block 1"
            return (
              <button
                key={b}
                onClick={() => updateFilter('block', blockShort)}
                className={`px-2.5 py-1 rounded text-xs font-medium shrink-0 cursor-pointer flex items-center gap-1 ${
                  filters.block === blockShort
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{b}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
