import React, { useState } from 'react';
import { 
  QuestionBankProvider, 
  useQuestionBank 
} from './context/QuestionBankContext';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { FilterToolbar } from './components/FilterToolbar';
import { QuestionCard } from './components/QuestionCard';
import { ModelAnswerModal } from './components/ModelAnswerModal';
import { AddQuestionModal } from './components/AddQuestionModal';
import { HighYieldBusterView } from './components/HighYieldBusterView';
import { MockExamSimulator } from './components/MockExamSimulator';
import { FrequencyAnalyticsView } from './components/FrequencyAnalyticsView';
import { StudyDeckView } from './components/StudyDeckView';
import { 
  BookOpen, 
  Flame, 
  RotateCcw, 
  GraduationCap, 
  Info,
  ShieldCheck,
  Award
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    questions, 
    activeView, 
    resetFilters, 
    filters,
    stats
  } = useQuestionBank();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header onOpenAddModal={() => setIsAddModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeView === 'bank' && (
          <div>
            <StatsBanner />
            <FilterToolbar />

            {/* Questions List Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">
                  Showing {questions.length} Questions
                </span>
                {filters.courseCode !== 'ALL' && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {filters.courseCode}
                  </span>
                )}
                {filters.creditWeightage !== 'ALL' && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {filters.creditWeightage} Credits
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 font-medium hidden sm:block">
                Sorted by: {filters.sortBy.replace('_', ' ').toUpperCase()}
              </div>
            </div>

            {/* Questions Container */}
            {questions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Matching Questions Found</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
                  No questions match your current combination of programme, course, credit weightage, and frequency filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <QuestionCard 
                    key={question.id} 
                    question={question} 
                    index={index} 
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeView === 'high_yield' && <HighYieldBusterView />}

        {activeView === 'mock_exam' && <MockExamSimulator />}

        {activeView === 'analytics' && <FrequencyAnalyticsView />}

        {activeView === 'deck' && <StudyDeckView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 px-4 sm:px-6 border-t border-slate-800 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 text-white font-bold font-serif text-sm mb-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>IGNOU Question Bank &amp; Exam Preparation Portal</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Categorizes Term-End Examination (TEE) questions by academic programme, course code, historical frequency of appearance, and official credit weightage.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
              IGNOU Academic Credit Framework
            </h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>• <strong>1 Credit</strong> = 30 Study Hours (Self-study, audio/video &amp; assignments)</li>
              <li>• <strong>2 Credits</strong> = 60 Hours (50 Marks TEE Paper, 2 Hours Duration)</li>
              <li>• <strong>4 Credits</strong> = 120 Hours (100 Marks TEE Paper, 3 Hours Duration)</li>
              <li>• <strong>6 &amp; 8 Credits</strong> = 180 - 240 Hours (100 Marks Core Papers)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-2">
              Examination Success Strategy
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              In IGNOU evaluation, write answers with clear headings matching study material blocks, draw labeled diagrams, and prioritize questions that have recurred 3 or more times across past TEE cycles.
            </p>
            <div className="mt-3 flex items-center gap-3 text-slate-500">
              <span>BCA • MCA • MBA • BAG • BCOMG • MEG</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>© 2026 Student Study Support Portal for IGNOU Learners. Non-official preparatory resource.</span>
          <span>Aligned with IGNOU Choice Based Credit System (CBCS) &amp; SOCIS/SOMS Syllabi.</span>
        </div>
      </footer>

      {/* Modals */}
      <ModelAnswerModal />
      <AddQuestionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <QuestionBankProvider>
      <MainContent />
    </QuestionBankProvider>
  );
}
