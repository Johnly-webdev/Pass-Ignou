import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  BookOpen, 
  Layers, 
  Flame, 
  HelpCircle, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { useQuestionBank } from '../context/QuestionBankContext';
import { IGNOU_PROGRAMMES, IGNOU_COURSES } from '../data/ignouData';
import { ProgrammeId, QuestionType, FrequencyTier } from '../types';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ isOpen, onClose }) => {
  const { addCustomQuestion } = useQuestionBank();

  const [programmeId, setProgrammeId] = useState<ProgrammeId>('BCA');
  const [courseCode, setCourseCode] = useState<string>('MCS-021');
  const [courseTitle, setCourseTitle] = useState<string>('Data and File Structures');
  const [creditWeightage, setCreditWeightage] = useState<number>(4);
  const [block, setBlock] = useState<string>('Block 1: Introduction to Data Structures');
  const [unit, setUnit] = useState<string>('Unit 1: Basic Concepts');
  const [questionText, setQuestionText] = useState<string>('');
  const [marks, setMarks] = useState<number>(20);
  const [questionType, setQuestionType] = useState<QuestionType>('long_essay');
  const [appearanceCount, setAppearanceCount] = useState<number>(3);
  const [sessionsInput, setSessionsInput] = useState<string>('Dec 2023, June 2023, Dec 2022');
  const [tagsInput, setTagsInput] = useState<string>('Important, Repeated');
  const [intro, setIntro] = useState<string>('');
  const [keyPointsInput, setKeyPointsInput] = useState<string>('');
  const [diagram, setDiagram] = useState<string>('');
  const [examTips, setExamTips] = useState<string>('Draw neat diagrams and write stepwise definitions.');

  if (!isOpen) return null;

  const [semester, setSemester] = useState<string>('Semester 1');

  // Handle course change to auto-fill title, credits and programme
  const handleCourseSelect = (code: string) => {
    setCourseCode(code);
    const found = IGNOU_COURSES.find(c => c.code === code);
    if (found) {
      setCourseTitle(found.title);
      setCreditWeightage(found.credits);
      setProgrammeId(found.programmeId);
      if (found.semesterYear) {
        setSemester(found.semesterYear);
      }
      if (found.blocks.length > 0) {
        setBlock(found.blocks[0]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    const sessions = sessionsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const keyPoints = keyPointsInput
      .split('\n')
      .map(p => p.trim())
      .filter(Boolean);

    let freqTier: FrequencyTier = 'moderate';
    if (appearanceCount >= 5) freqTier = 'very_high';
    else if (appearanceCount >= 3) freqTier = 'high';
    else if (appearanceCount === 1) freqTier = 'low';

    addCustomQuestion({
      programmeId,
      courseCode,
      courseTitle,
      creditWeightage,
      semester,
      block,
      unit,
      question: questionText,
      marks,
      questionType,
      frequencyTier: freqTier,
      appearanceCount,
      examSessions: sessions.length > 0 ? sessions : ['Model Question'],
      firstAppearedYear: 2018,
      latestAppearedYear: 2024,
      importanceScore: Math.min(100, appearanceCount * 15 + marks),
      modelAnswer: {
        introduction: intro || 'Model introduction placeholder.',
        keyPoints: keyPoints.length > 0 ? keyPoints : ['Point 1: Key definition', 'Point 2: Core mechanism'],
        diagramOrStructure: diagram || undefined,
        examTips: examTips || 'Emphasize precise terminology and block references.',
        recommendedWordCount: marks === 20 ? 500 : marks === 10 ? 300 : 150,
      },
      tags: tags.length > 0 ? tags : ['User Added'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif">Add Question to Bank</h3>
              <p className="text-xs text-slate-400">
                Categorize by Programme, Course, Frequency of Appearance &amp; Credit Weightage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-800">
          {/* Row 1: Programme & Course */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Programme
              </label>
              <select
                value={programmeId}
                onChange={(e) => {
                  const newProg = e.target.value as ProgrammeId;
                  setProgrammeId(newProg);
                  const firstCourse = IGNOU_COURSES.find(c => c.programmeId === newProg);
                  if (firstCourse) handleCourseSelect(firstCourse.code);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                {IGNOU_PROGRAMMES.map(p => (
                  <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Course Selection
              </label>
              <select
                value={courseCode}
                onChange={(e) => handleCourseSelect(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                {IGNOU_COURSES.filter(c => c.programmeId === programmeId).map(c => (
                  <option key={c.code} value={c.code}>{c.code}: {c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Credit Weightage & Marks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Credit Weightage
              </label>
              <select
                value={creditWeightage}
                onChange={(e) => setCreditWeightage(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                {[2, 3, 4, 6, 8].map(cr => (
                  <option key={cr} value={cr}>{cr} Credits ({cr * 30}h)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Question Marks
              </label>
              <select
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              >
                {[20, 15, 10, 5].map(m => (
                  <option key={m} value={m}>{m} Marks</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Appearance Count
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={appearanceCount}
                onChange={(e) => setAppearanceCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
              />
            </div>
          </div>

          {/* Block and Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                IGNOU Block
              </label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder="e.g. Block 2: Memory Hierarchy"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                IGNOU Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. Unit 3: Cache Mapping"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Question Statement *
            </label>
            <textarea
              required
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter full question statement as asked in the Term-End Exam..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif"
            />
          </div>

          {/* Past Sessions & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Past Exam Sessions (Comma Separated)
              </label>
              <input
                type="text"
                value={sessionsInput}
                onChange={(e) => setSessionsInput(e.target.value)}
                placeholder="e.g. Dec 2023, June 2023, Dec 2022"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Keywords / Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Memory, Cache, Direct Mapping"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          {/* Model Answer Details */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Model Answer &amp; Examiner Rubric
            </h4>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Introduction / Definition
              </label>
              <input
                type="text"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="Brief formal opening definition..."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Core Key Points (One per line)
              </label>
              <textarea
                rows={2}
                value={keyPointsInput}
                onChange={(e) => setKeyPointsInput(e.target.value)}
                placeholder="Point 1&#10;Point 2&#10;Point 3"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                IGNOU Examiner Tips
              </label>
              <input
                type="text"
                value={examTips}
                onChange={(e) => setExamTips(e.target.value)}
                placeholder="e.g. Draw neat diagram for 6 marks, write step-by-step trace."
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>
          </div>

          {/* Modal Submit Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Save to Question Bank</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
