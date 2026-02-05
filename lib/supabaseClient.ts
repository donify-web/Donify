import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const supabaseUrl = 'https://xmgeufzuqkxfhpfvjkkg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZ2V1Znp1cWt4ZmhwZnZqa2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzgwMDgsImV4cCI6MjA4NDYxNDAwOH0.HtNuQIq5_XSOxslb7Y9dtIvGTe2mzgrLxMqqewLXV60';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);