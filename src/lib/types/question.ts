export interface Question {
  id: string;
  content: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  subject: string;
  topic: string;
  subTopic?: string;
  gradeLevel: string;
  bloomsLevel: BloomsLevel;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  hints?: string[];
  points: number;
  timeLimit?: number;
  tags?: string[];
  metadata: QuestionMetadata;
  curriculum?: CurriculumAlignment[];
  language?: string;
  imageUrl?: string;
  diagramInstructions?: string;
  rubric?: RubricCriteria[];
  standards?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type QuestionType = 
  | 'multiple-choice'
  | 'true-false'
  | 'short-answer'
  | 'essay'
  | 'fill-in-blank'
  | 'matching'
  | 'diagram-labeling';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type BloomsLevel = 
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export interface QuestionMetadata {
  averageScore?: number;
  attemptCount?: number;
  successRate?: number;
  averageTimeSpent?: number;
  discriminationIndex?: number;
  difficultyIndex?: number;
  feedback?: QuestionFeedback[];
  version: number;
  isVerified: boolean;
  lastVerifiedBy?: string;
  lastVerifiedAt?: Date;
}

export interface QuestionFeedback {
  id: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface CurriculumAlignment {
  curriculumId: string;
  standardCode: string;
  description: string;
}

export interface RubricCriteria {
  criterion: string;
  description: string;
  points: number;
  levels: {
    level: number;
    description: string;
    points: number;
  }[];
}