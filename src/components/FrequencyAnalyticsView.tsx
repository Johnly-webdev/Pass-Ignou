import React, { useMemo } from 'react';
import { 
  BarChart3, 
  Flame, 
  Layers, 
  Award, 
  PieChart, 
  TrendingUp, 
  Clock, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { useQuestionBank } from '../context/QuestionBankContext';
import { IGNOU_COURSES, IGNOU_PROGRAMMES } from '../data/ignouData';

export const FrequencyAnalyticsView: React.FC = () => {
  const { allQuestions, filters, updateFilter } = useQuestionBank();

  // Active dataset according to current programme filter
  const currentQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      if (filters.programme !== 'ALL' && q.programmeId !== filters.programme) return false;
      return true;
    });
  }, [allQuestions, filters.programme]);

  // Frequency Tier Counts
  const frequencyStats = useMemo(() => {
    let vHigh = 0; // 5+
    let high = 0;  // 3-4
    let mod = 0;   // 2
    let low = 0;   // 1

    currentQuestions.forEach(q => {
      if (q.appearanceCount >= 5) vHigh++;
      else if (q.appearanceCount >= 3) high++;
      else if (q.appearanceCount === 2) mod++;
      else low++;
    });

    const total = currentQuestions.length || 1;
    return {
      vHigh,
      high,
      mod,
      low,
      vHighPct: Math.round((vHigh / total) * 100),
      highPct: Math.round((high / total) * 100),
      modPct: Math.round((mod / total) * 100),
      lowPct: Math.round((low / total) * 100),
    };
  }, [currentQuestions]);

  // Credit Weightage Counts
  const creditStats = useMemo(() => {
    const credits: Record<number, { count: number; totalMarks: number }> = {
      2: { count: 0, totalMarks: 0 },
      3: { count: 0, totalMarks: 0 },
      4: { count: 0, totalMarks: 0 },
      6: { count: 0, totalMarks: 0 },
      8: { count: 0, totalMarks: 0 },
    };

    currentQuestions.forEach(q => {
      if (credits[q.creditWeightage]) {
        credits[q.creditWeightage].count++;
        credits[q.creditWeightage].totalMarks += q.marks;
      }
    });

    return credits;
  }, [currentQuestions]);

  // Block-Wise Distribution (Which block yields the most questions)
  const blockStats = useMemo(() => {
    const blocksMap: Record<string, { count: number; totalMarks: number; avgFreq: number }> = {};

    currentQuestions.forEach(q => {
      const blockKey = q.block.split(':')[0].trim(); // e.g. "Block 1", "Block 2"
      if (!blocksMap[blockKey]) {
        blocksMap[blockKey] = { count: 0, totalMarks: 0, avgFreq: 0 };
      }
      blocksMap[blockKey].count++;
      blocksMap[blockKey].totalMarks += q.marks;
      blocksMap[blockKey].avgFreq += q.appearanceCount;
    });

    return Object.entries(blocksMap).map(([name, data]) => ({
      name,
      count: data.count,
      totalMarks: data.totalMarks,
      avgAppearance: (data.avgFreq / (data.count || 1)).toFixed(1),
    }));
  }, [currentQuestions]);

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Statistical Distribution &amp; Syllabus Weightage</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
              Exam Frequency &amp; Credit Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Data-backed examination patterns across {currentQuestions.length} analyzed Term-End Examination questions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Scope:</span>
            <select
              value={filters.programme}
              onChange={(e) => updateFilter('programme', e.target.value as any)}
              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Programmes</option>
              {IGNOU_PROGRAMMES.map(p => (
                <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Analytical Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Examination Repetition Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Examination Recurrence Breakdown
            </h3>
            <span className="text-xs text-slate-500">TEE Past Cycles</span>
          </div>

          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            Demonstrates how frequently questions reappear in successive Term-End Examinations.
          </p>

          <div className="space-y-4">
            {/* 5+ Times */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-red-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  🔥 5+ Times Repeated (Core TEE Questions)
                </span>
                <span className="font-bold text-slate-800">
                  {frequencyStats.vHigh} questions ({frequencyStats.vHighPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${frequencyStats.vHighPct}%` }}
                />
              </div>
            </div>

            {/* 3-4 Times */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  ⚡ 3-4 Times Repeated (High Probability)
                </span>
                <span className="font-bold text-slate-800">
                  {frequencyStats.high} questions ({frequencyStats.highPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${frequencyStats.highPct}%` }}
                />
              </div>
            </div>

            {/* 2 Times */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-blue-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  2 Times Repeated (Moderate Probability)
                </span>
                <span className="font-bold text-slate-800">
                  {frequencyStats.mod} questions ({frequencyStats.modPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${frequencyStats.modPct}%` }}
                />
              </div>
            </div>

            {/* 1 Time */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  1 Time / Model Question
                </span>
                <span className="font-bold text-slate-800">
                  {frequencyStats.low} questions ({frequencyStats.lowPct}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-slate-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${frequencyStats.lowPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Key Insight:</strong> 5+ and 3-4 times repeated questions account for <strong>{frequencyStats.vHighPct + frequencyStats.highPct}%</strong> of all test items, offering the highest score return per hour of revision!
          </div>
        </div>

        {/* Chart 2: Credit Weightage & Study Norms */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Course Credit Weightage Matrix
            </h3>
            <span className="text-xs text-slate-500">IGNOU Study Norms</span>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            IGNOU mandates <strong>30 study hours per credit</strong>. Higher-credit courses feature comprehensive essay questions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[2, 3, 4, 6, 8].map(credit => {
              const stat = creditStats[credit] || { count: 0, totalMarks: 0 };
              return (
                <div 
                  key={credit} 
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded">
                      {credit} Credits
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {credit * 30}h Norm
                    </span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-2">
                    {stat.count} Questions
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {stat.totalMarks} Total Marks Pool
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-200 text-xs text-indigo-900 leading-relaxed">
            <strong>Credit Insight:</strong> 6 and 8 Credit papers (BPSC, BCOC, MEG) have compulsory 20-mark critical essays requiring ~500 words per answer. 2 and 3 credit papers focus on algorithms and definitions.
          </div>
        </div>
      </div>

      {/* Block-Wise Marks Yield Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Block-Wise Question &amp; Marks Concentration
          </h3>
          <span className="text-xs text-slate-500">Syllabus Block Analysis</span>
        </div>

        <p className="text-xs text-slate-600 mb-4">
          Shows how questions are distributed across the physical study blocks of IGNOU course material.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Syllabus Block</th>
                <th className="py-2.5 px-4">Questions in Bank</th>
                <th className="py-2.5 px-4">Total Marks Available</th>
                <th className="py-2.5 px-4">Avg TEE Appearance</th>
                <th className="py-2.5 px-4">Strategic Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blockStats.map(b => (
                <tr key={b.name} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {b.name}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {b.count} questions
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-bold">
                    {b.totalMarks} Marks
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      ★ {b.avgAppearance}x
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-100 text-emerald-800">
                      High Yield Block
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
