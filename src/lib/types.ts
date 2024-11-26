export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'short-answer' | 'essay';
  subject: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gradeLevel: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points?: number;
  timeLimit?: number;
}

export interface QuestionGenerationParams {
  subject: string;
  topic: string;
  difficulty: string;
  type: string;
  count: number;
  context?: string | null; // Added context parameter for document content
}

export interface HuggingFaceResponse {
  generated_text: string;
  [key: string]: any;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  gradeLevel: string[];
}