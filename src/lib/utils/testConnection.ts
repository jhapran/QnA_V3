import { supabase, isSupabaseConfigured } from '../config/supabase';

export async function testDatabaseConnection() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not properly configured. Check your environment variables.');
  }

  try {
    // Test connection by checking auth configuration which always exists
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}