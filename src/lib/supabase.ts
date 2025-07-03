import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = 'https://hyveolbcugvnxndmspfq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5dmVvbGJjdWd2bnhuZG1zcGZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNjQ3OTQsImV4cCI6MjA2Njc0MDc5NH0.UE3KjTENmbY1evTgsCIr1mLyDY8-49IKR9fSddMjDbw';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Test connection
supabase.from('categories').select('count').then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connected successfully');
  }
});