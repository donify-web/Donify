-- Grant service_role full access to profiles (bypasses RLS)
-- Run this in Supabase SQL editor to allow Edge Functions to read profiles

-- The service_role already bypasses RLS in Postgres by default.
-- If you're seeing "permission denied", the table likely doesn't have GRANT to service_role.
GRANT SELECT ON profiles TO service_role;
GRANT SELECT, INSERT, UPDATE ON vote_tokens TO service_role;
GRANT SELECT ON voting_options TO service_role;

-- Grant access to UI web roles (anon, authenticated)
GRANT SELECT, UPDATE ON vote_tokens TO anon, authenticated;
GRANT SELECT, UPDATE ON voting_options TO anon, authenticated;

-- Make sure the Data API is enabled for profiles
-- (Supabase Table Editor → profiles → Enable Row Level Security → API should be ON)
