import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = 'https://rmnejxdkcjamjdclnunk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtbmVqeGRrY2phbWpkY2xudW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTI3MzYsImV4cCI6MjA2NzEyODczNn0.AGdk-emwT-Q7JLvUMDwa3CLGC1kYTshkBXMoK3ZfJk8';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test connection
supabase.from('categories').select('count').then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected successfully');
  }
});