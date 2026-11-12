export type ProgrammeId = 'BCA' | 'MCA' | 'MBA' | 'BAG' | 'BCOMG' | 'MEG';

export interface Programme {
  id: ProgrammeId;
  name: string;
  fullName: string;
  school: string;
  level: 'Bachelor Degree' | 'Master Degree' | 'Diploma';
  totalCredits: number;
  description: string;
}

export interface Course {
  code: string;
  title: string;
  programmeId: ProgrammeId;
  credits: number; // 2, 3, 4, 6, 8
  maxMarks: number; // 50 or 100
  durationHours: number; // 2 or 3 hours
  semesterYear: string;
  blocks: string[];
}

export type FrequencyTier = 'very_high' | 'high' | 'moderate' | 'low';

export type QuestionType = 'long_essay' | 'analytical' | 'short_notes' | 'distinguish' | 'objective';

export interface ModelAnswer {
  introduction: string;
  keyPoints: string[];
  diagramOrStructure?: string;
  examTips: string;
  recommendedWordCount: number;
}

export interface Question {
  id: string;
  programmeId: ProgrammeId;
  courseCode: string;
  courseTitle: string;
  creditWeightage: number; // 2, 3, 4, 6, 8
  semester: string; // 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'
  block: string;
  unit: string;
  question: string;
  marks: number; // 5, 10, 15, 20
  questionType: QuestionType;
  frequencyTier: FrequencyTier;
  appearanceCount: number; // Number of times appeared in past TEEs
  examSessions: string[]; // e.g. ["Dec 2023", "June 2023", "Dec 2022", "June 2021", ..., "June 2005"]
  firstAppearedYear?: number; // e.g. 2004, 2008, 2011
  latestAppearedYear?: number; // e.g. 2024, 2023
  importanceScore: number; // 0 - 100
  modelAnswer: ModelAnswer;
  tags: string[];
  isCustom?: boolean;
}

export type PrepStatus = 'not_started' | 'in_progress' | 'mastered';

export interface QuestionUserMetadata {
  status: PrepStatus;
  isBookmarked: boolean;
  notes?: string;
  lastReviewedAt?: string;
}

export interface FilterState {
  programme: ProgrammeId | 'ALL';
  semester: string | 'ALL'; // 'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'ALL'
  courseCode: string | 'ALL';
  creditWeightage: number | 'ALL'; // 2, 3, 4, 6, 8 or ALL
  frequencyTier: FrequencyTier | 'ALL';
  marks: number | 'ALL';
  block: string | 'ALL';
  unit: string | 'ALL';
  yearRangeFilter: 'ALL' | 'past_20_years' | 'past_10_years' | 'past_5_years';
  searchQuery: string;
  onlyBookmarked: boolean;
  onlyHighYield: boolean; // 3+ times
  statusFilter: PrepStatus | 'ALL';
  sortBy: 'frequency_desc' | 'marks_desc' | 'credit_desc' | 'importance_desc' | 'alphabetical' | 'year_desc';
}
