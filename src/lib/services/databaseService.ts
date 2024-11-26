import { supabase } from '../config/supabase';
import type { Database } from '../types/database';
import { toast } from 'sonner';

export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!this.instance) {
      this.instance = new DatabaseService();
    }
    return this.instance;
  }

  // Users
  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          roles (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          roles (
            name
          )
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updates: Partial<Database['public']['Tables']['users']['Update']>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Questions
  async createQuestion(question: Omit<Database['public']['Tables']['questions']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([question])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  async getQuestions(filters?: {
    subject?: string;
    topic?: string;
    difficulty?: string;
    type?: string;
  }) {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters) {
        if (filters.subject) query = query.eq('subject', filters.subject);
        if (filters.topic) query = query.eq('topic', filters.topic);
        if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);
        if (filters.type) query = query.eq('type', filters.type);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }

  async updateQuestion(
    questionId: string,
    updates: Partial<Database['public']['Tables']['questions']['Update']>
  ) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update(updates)
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

  async deleteQuestion(questionId: string) {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  }

  // Assessments
  async createAssessment(
    assessment: Omit<Database['public']['Tables']['assessments']['Insert'], 'id' | 'created_at' | 'updated_at'>
  ) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .insert([assessment])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  async getAssessments(filters?: {
    subject?: string;
    type?: string;
    gradeLevel?: string;
  }) {
    try {
      let query = supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters) {
        if (filters.subject) query = query.eq('subject', filters.subject);
        if (filters.type) query = query.eq('type', filters.type);
        if (filters.gradeLevel) query = query.eq('grade_level', filters.gradeLevel);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }

  async updateAssessment(
    assessmentId: string,
    updates: Partial<Database['public']['Tables']['assessments']['Update']>
  ) {
    try {
      const { data, error } = await supabase
        .from('assessments')
        .update(updates)
        .eq('id', assessmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  }

  async deleteAssessment(assessmentId: string) {
    try {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', assessmentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  }

  // Error Handling
  private handleError(error: any) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    toast.error(message);
    throw error;
  }
}

export const databaseService = DatabaseService.getInstance();