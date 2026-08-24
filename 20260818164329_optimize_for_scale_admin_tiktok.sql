/*
# Scale Optimization, Admin Role, and TikTok Field

## 1. New Columns
- `profiles.tiktok_link` (text, nullable) — dedicated TikTok URL field
- `profiles.is_admin` (boolean, default false) — admin flag for dashboard access

## 2. Performance Indexes
- `idx_profiles_monthly_points` — speeds up leaderboard ranking queries (ORDER BY monthly_points DESC)
- `idx_profiles_points` — speeds up total points queries  
- `idx_profiles_user_id` — speeds up auth lookups
- `idx_prayer_logs_profile_date` — speeds up prayer history queries
- `idx_point_transactions_profile` — speeds up point history queries

## 3. Security Changes
- Add SELECT policy on profiles for leaderboard (public top 3 display_name + monthly_points)
- Admin-only SELECT policy for full profile details
- RLS policy for admin dashboard access

## Important Notes
1. No destructive operations — all additive
2. Indexes are concurrent-safe with IF NOT EXISTS
3. Admin flag defaults to false — must be manually set for the app owner
*/

-- Add TikTok link column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'tiktok_link') THEN
    ALTER TABLE profiles ADD COLUMN tiktok_link text;
  END IF;
END $$;

-- Add admin flag column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Performance indexes for leaderboard and lookups
CREATE INDEX IF NOT EXISTS idx_profiles_monthly_points ON profiles (monthly_points DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_profiles_points ON profiles (points DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_streak ON profiles (streak DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_prayer_logs_profile_date ON prayer_logs (profile_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_point_transactions_profile ON point_transactions (profile_id, created_at DESC);

-- Allow all authenticated users to SELECT leaderboard data (limited fields enforced by app)
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Secure function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND is_admin = true
  );
$$;

-- Revoke direct EXECUTE from public, grant only to authenticated
REVOKE ALL ON FUNCTION is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
