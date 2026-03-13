import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ynchupdotsavqddoucxe.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InluY2h1cGRvdHNhdnFkZG91Y3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1Mzc0MTcsImV4cCI6MjA4NzExMzQxN30.KF-WReqJ44wuCGTnlvo3R8h-qqhHGlF4j1AGGt5I6iY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
