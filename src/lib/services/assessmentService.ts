import { supabase } from '../config/supabase';
import type { 
  Assessment,
  AssessmentQuestion,
  AssessmentSubmission,
  QuestionResponse 
} from '../types/assessment';
import { questionService } from './questionService';

export class AssessmentService {
  private static instance: AssessmentService;

  private constructor() {}

  static getInstance(): AssessmentService {
    if (!this.instance) {
      this.instance = new AssessmentService();
    }
    return this.instance;
  }

  async createAssessment(assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .insert([{
          ...assessment,
          totalPoints: this.calculateTotalPoints(assessment.questions),
          metadata: {
            ...assessment.metadata,
            attemptCount: 0,
            version: 1
          }
        }])
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw new Error('Failed to create assessment');
    }
  }

  async updateAssessment(id: string, updates: Partial<Assessment>): Promise<void> {
    try {
      const { error } = await supabase
        .from('assessments')
        .update({
          ...updates,
          updatedAt: new Date(),
          metadata: {
            ...updates.metadata,
            version: (updates.metadata?.version || 0) + 1
          }
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw new Error('Failed to update assessment');
    }
  }

  async getAssessment(id: string): Promise<Assessment> {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select(`
          *,
          questions:assessment_questions(
            *,
            question:questions(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return this.mapAssessmentData(data);
    } catch (error) {
      console.error('Error fetching assessment:', error);
      throw new Error('Failed to fetch assessment');
    }
  }

  async submitAssessment(submission: AssessmentSubmission): Promise<void> {
    try {
      // Start a transaction
      const { error } = await supabase.rpc('submit_assessment', {
        submission_data: submission
      });

      if (error) throw error;

      // Update assessment metadata
      await this.updateAssessmentMetadata(submission.assessmentId);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw new Error('Failed to submit assessment');
    }
  }

  async gradeSubmission(
    submissionId: string,
    grades: { questionId: string; points: number; feedback?: string }[]
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('grade_submission', {
        submission_id: submissionId,
        grades: grades
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error grading submission:', error);
      throw new Error('Failed to grade submission');
    }
  }

  async getStudentProgress(studentId: string, assessmentId: string): Promise<{
    completed: number;
    total: number;
    score?: number;
    timeSpent: number;
    submissions: AssessmentSubmission[];
  }> {
    try {
      const { data, error } = await supabase
        .from('assessment_submissions')
        .select('*')
        .eq('student_id', studentId)
        .eq('assessment_id', assessmentId);

      if (error) throw error;

      return {
        completed: data.filter(s => s.status === 'completed').length,
        total: data.length,
        score: this.calculateAverageScore(data),
        timeSpent: this.calculateTotalTimeSpent(data),
        submissions: data
      };
    } catch (error) {
      console.error('Error fetching student progress:', error);
      throw new Error('Failed to fetch student progress');
    }
  }

  private calculateTotalPoints(questions: AssessmentQuestion[]): number {
    return questions.reduce((total, q) => total + q.points, 0);
  }

  private calculateAverageScore(submissions: AssessmentSubmission[]): number {
    const completedSubmissions = submissions.filter(s => s.status === 'completed');
    if (completedSubmissions.length === 0) return 0;
    
    const totalScore = completedSubmissions.reduce((sum, s) => sum + s.score, 0);
    return totalScore / completedSubmissions.length;
  }

  private calculateTotalTimeSpent(submissions: AssessmentSubmission[]): number {
    return submissions.reduce((total, s) => total + s.timeSpent, 0);
  }

  private async updateAssessmentMetadata(assessmentId: string): Promise<void> {
    const { data: submissions, error } = await supabase
      .from('assessment_submissions')
      .select('*')
      .eq('assessment_id', assessmentId);

    if (error) throw error;

    const metadata = {
      averageScore: this.calculateAverageScore(submissions),
      completionRate: submissions.filter(s => s.status === 'completed').length / submissions.length,
      averageTime: submissions.reduce((sum, s) => sum + s.timeSpent, 0) / submissions.length,
      attemptCount: submissions.length
    };

    await this.updateAssessment(assessmentId, { metadata });
  }

  private mapAssessmentData(data: any): Assessment {
    return {
      ...data,
      questions: data.questions.map((q: any) => ({
        ...q,
        question: questionService.mapQuestionData(q.question)
      }))
    };
  }
}

export const assessmentService = AssessmentService.getInstance();