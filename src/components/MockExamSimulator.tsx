import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Printer, 
  Award, 
  FileText, 
  CheckCircle, 
  Layers, 
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { useQuestionBank } from '../context/QuestionBankContext';
import { IGNOU_COURSES, IGNOU_PROGRAMMES } from '../data/ignouData';
import { Question } from '../types';

export const MockExamSimulator: React.FC = () => {
  const { allQuestions, openModelAnswer } = useQuestionBank();

  // Selected course for mock exam
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('MCS-021');

  // Find course details
  const currentCourse = IGNOU_COURSES.find(c => c.code === selectedCourseCode) || IGNOU_COURSES[0];
  const currentProgramme = IGNOU_PROGRAMMES.find(p => p.id === currentCourse.programmeId);

  // Filter questions for this course
  const courseQuestions = allQuestions.filter(q => q.courseCode === currentCourse.code);

  // Timer state
  const initialSeconds = currentCourse.durationHours * 3600;
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Reset timer if course changes
  useEffect(() => {
    setTimeLeft(currentCourse.durationHours * 3600);
    setIsTimerRunning(false);
  }, [currentCourse]);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Divide questions into Section A and Section B
  const sectionAQuestions = courseQuestions.filter(q => q.marks >= 15).slice(0, 2);
  const sectionBQuestions = courseQuestions.filter(q => q.marks < 15 || !sectionAQuestions.includes(q)).slice(0, 5);

  const [expandedSolutions, setExpandedSolutions] = useState<Record<string, boolean>>({});

  const toggleSolution = (qId: string) => {
    setExpandedSolutions(prev => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Simulator Control Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:hidden">
        {/* Select Course */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600" />
            Select Course:
          </span>
          <select
            value={selectedCourseCode}
            onChange={(e) => setSelectedCourseCode(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-md"
          >
            {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'].map(sem => {
              const semCourses = IGNOU_COURSES.filter(c => c.programmeId === 'BCA' && c.semesterYear.includes(sem));
              if (semCourses.length === 0) return null;
              return (
                <optgroup key={sem} label={`BCA ${sem}`}>
                  {semCourses.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code}: {c.title} ({c.credits} Cr - {c.maxMarks}M)
                    </option>
                  ))}
                </optgroup>
              );
            })}
            <optgroup label="Other Programmes (MBA / BAG / MEG)">
              {IGNOU_COURSES.filter(c => c.programmeId !== 'BCA').map(c => (
                <option key={c.code} value={c.code}>
                  {c.code}: {c.title} ({c.credits} Cr)
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Exam Timer Controls */}
        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-xs justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} />
            <span className="font-mono text-lg font-bold tracking-wider">
              {formatTime(timeLeft)}
            </span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-700 pl-3">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition flex items-center gap-1 ${
                isTimerRunning 
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
              title={isTimerRunning ? 'Pause Timer' : 'Start Timer'}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isTimerRunning ? 'Pause' : 'Start Exam'}</span>
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimeLeft(initialSeconds);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print Exam Paper</span>
        </button>
      </div>

      {/* Simulated Official IGNOU Question Paper */}
      <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-10 shadow-lg font-serif text-slate-900 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Official Header */}
        <div className="text-center border-b-2 border-slate-900 pb-5 mb-6">
          <p className="text-xs uppercase tracking-widest font-sans font-bold text-slate-600">
            {currentProgramme?.fullName} ({currentProgramme?.id})
          </p>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase mt-1">
            Indira Gandhi National Open University
          </h2>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-800 mt-0.5">
            Term-End Examination (TEE) • Model Question Paper
          </p>

          <div className="mt-4 pt-3 border-t border-dashed border-slate-400 flex flex-wrap items-center justify-between text-xs sm:text-sm font-sans font-bold text-slate-900">
            <span>Course Code: <strong className="font-mono text-base">{currentCourse.code}</strong></span>
            <span>Course Title: <strong className="uppercase">{currentCourse.title}</strong></span>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between text-xs sm:text-sm font-sans text-slate-700">
            <span>Time Allowed: <strong>{currentCourse.durationHours} Hours</strong></span>
            <span>Credit Weightage: <strong>{currentCourse.credits} Credits ({currentCourse.credits * 30} Hours Norm)</strong></span>
            <span>Maximum Marks: <strong>{currentCourse.maxMarks}</strong></span>
          </div>
        </div>

        {/* General Instructions Note */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-6 text-xs font-sans text-slate-800">
          <p className="font-bold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-700" />
            General Instructions:
          </p>
          {currentCourse.maxMarks === 100 ? (
            <ol className="list-decimal list-inside space-y-0.5 text-slate-700">
              <li>Section A is compulsory. All sub-questions carry indicated marks.</li>
              <li>Answer any THREE questions from Section B (20 marks each).</li>
              <li>Assume suitable data wherever necessary and state your assumptions clearly.</li>
            </ol>
          ) : (
            <ol className="list-decimal list-inside space-y-0.5 text-slate-700">
              <li>Answer any FIVE questions in all. All questions carry equal marks (10 marks each).</li>
              <li>Write concise, structured answers adhering to the indicated word limits.</li>
            </ol>
          )}
        </div>

        {/* Section A */}
        <div className="space-y-6 mb-8">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between font-sans">
            <h3 className="font-bold text-base uppercase text-slate-900">
              SECTION A (Compulsory)
            </h3>
            <span className="text-xs font-semibold text-slate-600">
              Total: {currentCourse.maxMarks === 100 ? '40 Marks' : '20 Marks'}
            </span>
          </div>

          {sectionAQuestions.length > 0 ? (
            sectionAQuestions.map((q, idx) => (
              <div key={q.id} className="space-y-2 border-b border-slate-100 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-base sm:text-lg leading-relaxed font-serif">
                    <span className="font-bold font-sans text-slate-700 mr-2">Q{idx + 1}.</span>
                    {q.question}
                  </div>
                  <span className="font-sans font-bold text-sm bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    [{q.marks} Marks]
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-sans text-slate-500 pt-1">
                  <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    ★ Appeared {q.appearanceCount}x ({q.examSessions.slice(0, 3).join(', ')})
                  </span>
                  <span>{q.block}</span>

                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="ml-auto text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer print:hidden"
                  >
                    <span>{expandedSolutions[q.id] ? 'Hide Solution' : 'View Model Answer'}</span>
                    {expandedSolutions[q.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Inline Model Solution Toggle */}
                {expandedSolutions[q.id] && (
                  <div className="mt-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 font-sans text-xs space-y-2 print:hidden">
                    <p className="font-bold text-indigo-950 uppercase tracking-wide">
                      Key Points for Maximum Marks:
                    </p>
                    <p className="text-slate-700">{q.modelAnswer.introduction}</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {q.modelAnswer.keyPoints.map((kp, kIdx) => (
                        <li key={kIdx}>{kp}</li>
                      ))}
                    </ul>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => openModelAnswer(q)}
                        className="text-indigo-700 hover:text-indigo-900 font-bold underline cursor-pointer"
                      >
                        Open Full Solution &amp; Examiner Notes →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm font-sans text-slate-500 italic">No section A questions found.</p>
          )}
        </div>

        {/* Section B */}
        <div className="space-y-6">
          <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between font-sans">
            <h3 className="font-bold text-base uppercase text-slate-900">
              SECTION B
            </h3>
            <span className="text-xs font-semibold text-slate-600">
              {currentCourse.maxMarks === 100 ? 'Answer any THREE questions (20 Marks each)' : 'Answer any THREE questions (10 Marks each)'}
            </span>
          </div>

          {sectionBQuestions.length > 0 ? (
            sectionBQuestions.map((q, idx) => (
              <div key={q.id} className="space-y-2 border-b border-slate-100 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-base sm:text-lg leading-relaxed font-serif">
                    <span className="font-bold font-sans text-slate-700 mr-2">Q{sectionAQuestions.length + idx + 1}.</span>
                    {q.question}
                  </div>
                  <span className="font-sans font-bold text-sm bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    [{q.marks} Marks]
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-sans text-slate-500 pt-1">
                  <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    ★ Appeared {q.appearanceCount}x ({q.examSessions.slice(0, 3).join(', ')})
                  </span>
                  <span>{q.block}</span>

                  <button
                    onClick={() => toggleSolution(q.id)}
                    className="ml-auto text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer print:hidden"
                  >
                    <span>{expandedSolutions[q.id] ? 'Hide Solution' : 'View Model Answer'}</span>
                    {expandedSolutions[q.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Inline Model Solution Toggle */}
                {expandedSolutions[q.id] && (
                  <div className="mt-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 font-sans text-xs space-y-2 print:hidden">
                    <p className="font-bold text-indigo-950 uppercase tracking-wide">
                      Key Points for Maximum Marks:
                    </p>
                    <p className="text-slate-700">{q.modelAnswer.introduction}</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {q.modelAnswer.keyPoints.map((kp, kIdx) => (
                        <li key={kIdx}>{kp}</li>
                      ))}
                    </ul>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => openModelAnswer(q)}
                        className="text-indigo-700 hover:text-indigo-900 font-bold underline cursor-pointer"
                      >
                        Open Full Solution &amp; Examiner Notes →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm font-sans text-slate-500 italic">No section B questions found.</p>
          )}
        </div>

        {/* Paper End Stamp */}
        <div className="mt-10 pt-4 border-t-2 border-slate-900 text-center text-xs font-sans font-bold uppercase tracking-widest text-slate-500">
          — End of Term-End Examination Question Paper —
        </div>
      </div>
    </div>
  );
};
