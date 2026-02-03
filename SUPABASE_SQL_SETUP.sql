-- ============================================
-- SUPABASE PROFILES TABLE & RLS SETUP
-- ============================================
-- Run this SQL in your Supabase Dashboard → SQL Editor
-- to set up the profiles table with Row Level Security

-- 1. CREATE PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. CREATE POLICIES
-- ============================================

-- Policy: Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. OPTIONAL: CREATE FUNCTION TO AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
-- This automatically creates a profile entry when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$;

-- Create trigger to call the function
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your setup:

-- Check profiles table structure:
-- SELECT * FROM information_schema.tables WHERE table_name='profiles';

-- Check RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename='profiles';

-- Check policies:
-- SELECT * FROM pg_policies WHERE tablename='profiles';

-- ============================================
-- OPTIONAL: INSERT TEST DATA (after creating a user in Auth)
-- ============================================
-- INSERT INTO profiles (id, full_name, username, phone)
-- VALUES (
--   'user-uuid-here',
--   'John Doe',
--   'johndoe',
--   '+1 (555) 123-4567'
-- );

-- ============================================
-- OPTIONAL: CLEANUP (if you need to reset)
-- ============================================
-- To delete the table and start over:
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
