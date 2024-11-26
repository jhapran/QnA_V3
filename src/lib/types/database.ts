export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role_id: number
          organization_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role_id: number
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role_id?: number
          organization_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          content: string
          type: string
          difficulty: string
          subject: string
          topic: string
          grade_level: string
          options: Json | null
          correct_answer: string
          explanation: string | null
          points: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          type: string
          difficulty: string
          subject: string
          topic: string
          grade_level: string
          options?: Json | null
          correct_answer: string
          explanation?: string | null
          points: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          type?: string
          difficulty?: string
          subject?: string
          topic?: string
          grade_level?: string
          options?: Json | null
          correct_answer?: string
          explanation?: string | null
          points?: number
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          subject: string
          grade_level: string
          total_points: number
          time_limit: number | null
          due_date: string | null
          settings: Json
          metadata: Json
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: string
          subject: string
          grade_level: string
          total_points: number
          time_limit?: number | null
          due_date?: string | null
          settings: Json
          metadata: Json
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: string
          subject?: string
          grade_level?: string
          total_points?: number
          time_limit?: number | null
          due_date?: string | null
          settings?: Json
          metadata?: Json
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}