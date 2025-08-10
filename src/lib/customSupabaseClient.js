import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lierbimyvkmeesufglxk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZXJiaW15dmttZWVzdWZnbHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyODMxNTQsImV4cCI6MjA2OTg1OTE1NH0.2M9wGsO6XNOAJvWHx68RcXSFzoQB4_1V8pWqAOM1h3w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);