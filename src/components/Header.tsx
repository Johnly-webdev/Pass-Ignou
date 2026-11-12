import React from 'react';
import { 
  BookOpen, 
  Flame, 
  FileText, 
  BarChart3, 
  Bookmark, 
  PlusCircle, 
  Printer, 
  GraduationCap, 
  CheckCircle2, 
  Clock
} from 'lucide-react';
import { useQuestionBank } from '../context/QuestionBankContext';
import { IGNOU_PROGRAMMES } from '../data/ignouData';
import { ProgrammeId } from '../types';

interface HeaderProps {
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal }) => {
  const { 
    activeView, 
    setActiveView, 
    filters, 
    updateFilter, 
    stats,
  } = useQuestionBank();

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-xs print:hidden backdrop-blur-md bg-white/95">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
              ★
            </span>
            <span>IGNOU Term-End Examination (TEE) Question Repository &amp; Weightage Matrix</span>
            <span className="hidden md:inline-block text-slate-400">|</span>
            <span className="hidden md:inline-block text-slate-400">Aligned with 1 Credit = 30 Study Hours Norm</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prepared: <strong className="text-white">{stats.preparedRatio}%</strong></span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>High-Yield PYQs: <strong className="text-white">{stats.highYieldCount}</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & University Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 flex items-center justify-center shadow-md shadow-indigo-900/10 text-white shrink-0 border border-indigo-600/30">
              <GraduationCap className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-blue-100 text-blue-800 border border-blue-200">
                  IGNOU Portal
                </span>
                <span className="text-xs text-slate-500 font-medium">Est. 1985 • The People&apos;s University</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
                Exam Question Bank &amp; Credit Hub
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={() => onOpenAddModal()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition shadow-xs cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add TEE Question</span>
            </button>
            <button
              onClick={handlePrint}
              title="Print / Save as PDF"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition border border-slate-300/80 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Programme Selection Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
            Programme:
          </span>
          <button
            onClick={() => updateFilter('programme', 'ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition shrink-0 cursor-pointer ${
              filters.programme === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Programmes
          </button>
          {IGNOU_PROGRAMMES.map((prog) => (
            <button
              key={prog.id}
              onClick={() => updateFilter('programme', prog.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                filters.programme === prog.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{prog.id}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                filters.programme === prog.id ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200 text-slate-600'
              }`}>
                {prog.level.includes('Master') ? 'PG' : 'UG'}
              </span>
            </button>
          ))}
        </div>

        {/* View Mode Tabs */}
        <nav className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveView('bank')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeView === 'bank'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Question Bank</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-slate-200 text-slate-700">
              {stats.total}
            </span>
          </button>

          <button
            onClick={() => setActiveView('high_yield')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeView === 'high_yield'
                ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            <span>80/20 High-Yield Buster</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 font-bold">
              {stats.highYieldCount} PYQs
            </span>
          </button>

          <button
            onClick={() => setActiveView('mock_exam')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeView === 'mock_exam'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Mock TEE Simulator</span>
          </button>

          <button
            onClick={() => setActiveView('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeView === 'analytics'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>Weightage &amp; Frequency Matrix</span>
          </button>

          <button
            onClick={() => setActiveView('deck')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer shrink-0 ${
              activeView === 'deck'
                ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-4 h-4 text-purple-600" />
            <span>My Study Deck</span>
            {(stats.bookmarkedCount > 0 || stats.masteredCount > 0) && (
              <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800 font-medium">
                {stats.bookmarkedCount + stats.inProgressCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
