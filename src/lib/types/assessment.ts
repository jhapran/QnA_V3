export interface Assessment {
  id: string;
  title: string;
  description?: string;
  type: AssessmentType;
  subject: string;
  gradeLevel: string;
  questions: AssessmentQuestion[];
  totalPoints: number;
  timeLimit?: number;
  dueDate?: Date;
  settings: AssessmentSettings;
  metadata: AssessmentMetadata;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AssessmentType = 
  | 'quiz'
  | 'test'
  | 'exam'
  | 'homework'
  | 'practice';

export interface AssessmentQuestion {
  id: string;
  questionId: string;
  order: number;
  points: number;
  required: boolean;
}

export interface AssessmentSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showFeedback: boolean;
  showExplanation: boolean;
  allowRetries: boolean;
  maxRetries?: number;
  passingScore?: number;
  showTimer: boolean;
  requireProctoring?: boolean;
  accessCode?: string;
  allowPause: boolean;
  showProgress: boolean;
}

export interface AssessmentMetadata {
  averageScore?: number;
  completionRate?: number;
  averageTime?: number;
  attemptCount: number;
  status: AssessmentStatus;
  version: number;
  lastModifiedBy?: string;
}

export type AssessmentStatus = 
  | 'draft'
  | 'published'
  | 'archived'
  | 'scheduled';

export interface AssessmentSubmission {
  id: string;
  assessmentId: string;
  studentId: string;
  answers: QuestionResponse[];
  score: number;
  startedAt: Date;
  submittedAt?: Date;
  timeSpent: number;
  status: SubmissionStatus;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

export interface QuestionResponse {
  questionId: string;
  answer: string;
  isCorrect?: boolean;
  points?: number;
  feedback?: string;
  timeSpent: number;
}

export type SubmissionStatus = 
  | 'in-progress'
  | 'completed'
  | 'graded'
  | 'late'
  | 'pending-review';