import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Question, 
  ProgrammeId, 
  FilterState, 
  QuestionUserMetadata, 
  PrepStatus 
} from '../types';
import { INITIAL_QUESTIONS, IGNOU_PROGRAMMES, IGNOU_COURSES } from '../data/ignouData';

interface QuestionBankContextType {
  questions: Question[];
  allQuestions: Question[];
  filteredQuestions: Question[];
  filters: FilterState;
  userMetadata: Record<string, QuestionUserMetadata>;
  activeView: 'bank' | 'high_yield' | 'mock_exam' | 'analytics' | 'deck';
  selectedQuestionForModal: Question | null;
  setActiveView: (view: 'bank' | 'high_yield' | 'mock_exam' | 'analytics' | 'deck') => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  toggleBookmark: (questionId: string) => void;
  setQuestionStatus: (questionId: string, status: PrepStatus) => void;
  saveQuestionNote: (questionId: string, note: string) => void;
  addCustomQuestion: (question: Omit<Question, 'id' | 'isCustom'>) => void;
  deleteCustomQuestion: (questionId: string) => void;
  openModelAnswer: (question: Question) => void;
  closeModelAnswer: () => void;
  stats: {
    total: number;
    highYieldCount: number;
    masteredCount: number;
    inProgressCount: number;
    bookmarkedCount: number;
    preparedRatio: number;
  };
}

const defaultFilters: FilterState = {
  programme: 'BCA',
  semester: 'ALL',
  courseCode: 'ALL',
  creditWeightage: 'ALL',
  frequencyTier: 'ALL',
  marks: 'ALL',
  block: 'ALL',
  unit: 'ALL',
  yearRangeFilter: 'ALL',
  searchQuery: '',
  onlyBookmarked: false,
  onlyHighYield: false,
  statusFilter: 'ALL',
  sortBy: 'frequency_desc',
};

const STORAGE_KEYS = {
  CUSTOM_QUESTIONS: 'ignou_custom_questions_v1',
  USER_METADATA: 'ignou_user_metadata_v1',
};

const QuestionBankContext = createContext<QuestionBankContextType | undefined>(undefined);

export const QuestionBankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userMetadata, setUserMetadata] = useState<Record<string, QuestionUserMetadata>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_METADATA);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeView, setActiveView] = useState<'bank' | 'high_yield' | 'mock_exam' | 'analytics' | 'deck'>('bank');
  const [selectedQuestionForModal, setSelectedQuestionForModal] = useState<Question | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(customQuestions));
    } catch (e) {
      console.error('Failed to save custom questions', e);
    }
  }, [customQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_METADATA, JSON.stringify(userMetadata));
    } catch (e) {
      console.error('Failed to save user metadata', e);
    }
  }, [userMetadata]);

  // Combine initial questions + custom user questions
  const allQuestions = useMemo(() => {
    return [...INITIAL_QUESTIONS, ...customQuestions];
  }, [customQuestions]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      // If programme changed, validate course
      if (key === 'programme' && value !== 'ALL') {
        const allowedCourses = IGNOU_COURSES.filter(c => c.programmeId === value).map(c => c.code);
        if (next.courseCode !== 'ALL' && !allowedCourses.includes(next.courseCode)) {
          next.courseCode = 'ALL';
        }
      }
      // If semester changed and a course is selected, check if course belongs to semester
      if (key === 'semester' && value !== 'ALL') {
        const semesterCourses = IGNOU_COURSES.filter(c => c.semesterYear.includes(value as string)).map(c => c.code);
        if (next.courseCode !== 'ALL' && !semesterCourses.includes(next.courseCode)) {
          next.courseCode = 'ALL';
        }
      }
      return next;
    });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const toggleBookmark = (questionId: string) => {
    setUserMetadata(prev => {
      const current = prev[questionId] || { status: 'not_started', isBookmarked: false };
      return {
        ...prev,
        [questionId]: {
          ...current,
          isBookmarked: !current.isBookmarked,
          lastReviewedAt: new Date().toISOString(),
        },
      };
    });
  };

  const setQuestionStatus = (questionId: string, status: PrepStatus) => {
    setUserMetadata(prev => {
      const current = prev[questionId] || { status: 'not_started', isBookmarked: false };
      return {
        ...prev,
        [questionId]: {
          ...current,
          status,
          lastReviewedAt: new Date().toISOString(),
        },
      };
    });
  };

  const saveQuestionNote = (questionId: string, notes: string) => {
    setUserMetadata(prev => {
      const current = prev[questionId] || { status: 'not_started', isBookmarked: false };
      return {
        ...prev,
        [questionId]: {
          ...current,
          notes,
          lastReviewedAt: new Date().toISOString(),
        },
      };
    });
  };

  const addCustomQuestion = (newQData: Omit<Question, 'id' | 'isCustom'>) => {
    const newQuestion: Question = {
      ...newQData,
      id: `custom-q-${Date.now()}`,
      isCustom: true,
    };
    setCustomQuestions(prev => [newQuestion, ...prev]);
  };

  const deleteCustomQuestion = (questionId: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const openModelAnswer = (question: Question) => {
    setSelectedQuestionForModal(question);
  };

  const closeModelAnswer = () => {
    setSelectedQuestionForModal(null);
  };

  // Filtered and sorted questions
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const meta = userMetadata[q.id] || { status: 'not_started', isBookmarked: false };

      // High yield view overrides or filter toggle
      if (activeView === 'high_yield' || filters.onlyHighYield) {
        if (q.appearanceCount < 3) return false;
      }

      // My Study Deck view: only bookmarked or in_progress or mastered
      if (activeView === 'deck') {
        if (!meta.isBookmarked && meta.status === 'not_started') return false;
      }

      if (filters.onlyBookmarked && !meta.isBookmarked) {
        return false;
      }

      if (filters.statusFilter !== 'ALL' && meta.status !== filters.statusFilter) {
        return false;
      }

      if (filters.programme !== 'ALL' && q.programmeId !== filters.programme) {
        return false;
      }

      if (filters.semester !== 'ALL' && q.semester !== filters.semester) {
        return false;
      }

      if (filters.courseCode !== 'ALL' && q.courseCode !== filters.courseCode) {
        return false;
      }

      if (filters.creditWeightage !== 'ALL' && q.creditWeightage !== filters.creditWeightage) {
        return false;
      }

      if (filters.frequencyTier !== 'ALL' && q.frequencyTier !== filters.frequencyTier) {
        return false;
      }

      if (filters.marks !== 'ALL' && q.marks !== filters.marks) {
        return false;
      }

      if (filters.block !== 'ALL' && !q.block.toLowerCase().includes(filters.block.toLowerCase())) {
        return false;
      }

      if (filters.unit !== 'ALL' && !q.unit.toLowerCase().includes(filters.unit.toLowerCase())) {
        return false;
      }

      if (filters.yearRangeFilter !== 'ALL') {
        const firstYear = q.firstAppearedYear || 2020;
        const latestYear = q.latestAppearedYear || 2023;
        if (filters.yearRangeFilter === 'past_5_years') {
          if (latestYear < 2019) return false;
        } else if (filters.yearRangeFilter === 'past_10_years') {
          if (latestYear < 2014) return false;
        } else if (filters.yearRangeFilter === 'past_20_years') {
          // Has appeared within the 2004-2024 archive window
          if (firstYear > 2024 || latestYear < 2004) return false;
        }
      }

      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesText = 
          q.question.toLowerCase().includes(query) ||
          q.courseCode.toLowerCase().includes(query) ||
          q.courseTitle.toLowerCase().includes(query) ||
          q.block.toLowerCase().includes(query) ||
          q.unit.toLowerCase().includes(query) ||
          q.semester.toLowerCase().includes(query) ||
          q.tags.some(t => t.toLowerCase().includes(query)) ||
          q.examSessions.some(s => s.toLowerCase().includes(query));
        if (!matchesText) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'frequency_desc') {
        return b.appearanceCount - a.appearanceCount;
      }
      if (filters.sortBy === 'marks_desc') {
        return b.marks - a.marks;
      }
      if (filters.sortBy === 'credit_desc') {
        return b.creditWeightage - a.creditWeightage;
      }
      if (filters.sortBy === 'importance_desc') {
        return b.importanceScore - a.importanceScore;
      }
      if (filters.sortBy === 'year_desc') {
        return (b.latestAppearedYear || 0) - (a.latestAppearedYear || 0);
      }
      if (filters.sortBy === 'alphabetical') {
        return a.question.localeCompare(b.question);
      }
      return 0;
    });
  }, [allQuestions, filters, userMetadata, activeView]);

  // Overall Statistics
  const stats = useMemo(() => {
    const total = allQuestions.length;
    const highYieldCount = allQuestions.filter(q => q.appearanceCount >= 3).length;
    let masteredCount = 0;
    let inProgressCount = 0;
    let bookmarkedCount = 0;

    allQuestions.forEach(q => {
      const meta = userMetadata[q.id];
      if (meta) {
        if (meta.status === 'mastered') masteredCount++;
        else if (meta.status === 'in_progress') inProgressCount++;
        if (meta.isBookmarked) bookmarkedCount++;
      }
    });

    const preparedRatio = total > 0 ? Math.round(((masteredCount + inProgressCount * 0.5) / total) * 100) : 0;

    return {
      total,
      highYieldCount,
      masteredCount,
      inProgressCount,
      bookmarkedCount,
      preparedRatio,
    };
  }, [allQuestions, userMetadata]);

  return (
    <QuestionBankContext.Provider
      value={{
        questions: filteredQuestions,
        allQuestions,
        filteredQuestions,
        filters,
        userMetadata,
        activeView,
        selectedQuestionForModal,
        setActiveView,
        setFilters,
        updateFilter,
        resetFilters,
        toggleBookmark,
        setQuestionStatus,
        saveQuestionNote,
        addCustomQuestion,
        deleteCustomQuestion,
        openModelAnswer,
        closeModelAnswer,
        stats,
      }}
    >
      {children}
    </QuestionBankContext.Provider>
  );
};

export const useQuestionBank = () => {
  const context = useContext(QuestionBankContext);
  if (!context) {
    throw new Error('useQuestionBank must be used within a QuestionBankProvider');
  }
  return context;
};
