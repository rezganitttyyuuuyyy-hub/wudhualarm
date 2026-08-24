/*
# Production Hardening: Security & Performance

1. Security Fixes
  - Set immutable search_path on is_admin and perform_monthly_reset
  - Revoke EXECUTE from anon on admin functions
  - Add DELETE policy on profiles

2. Performance Fixes
  - Add missing indexes on all foreign key columns
  - Add composite indexes for common query patterns at scale
*/

-- 1. Fix search_path on SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid() AND is_admin = true
  );
$$;

CREATE OR REPLACE FUNCTION public.perform_monthly_reset()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  current_ym text;
  top3 record;
  winner_count int := 0;
BEGIN
  current_ym := to_char(now(), 'YYYY-MM');

  FOR top3 IN
    SELECT id, monthly_points
    FROM profiles
    WHERE monthly_points > 0
    ORDER BY monthly_points DESC
    LIMIT 3
  LOOP
    winner_count := winner_count + 1;
    INSERT INTO monthly_winners (profile_id, year_month, rank, activity_score)
    VALUES (top3.id, current_ym, winner_count, top3.monthly_points)
    ON CONFLICT DO NOTHING;
  END LOOP;

  UPDATE profiles SET monthly_points = 0, updated_at = now();

  result := jsonb_build_object(
    'month', current_ym,
    'winners_inserted', winner_count,
    'status', 'success'
  );

  RETURN result;
END;
$$;

-- 2. Revoke anon access to admin functions
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.perform_monthly_reset() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.perform_monthly_reset() TO authenticated;

-- 3. Add DELETE policy on profiles
DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 4. Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_monthly_winners_profile_id ON monthly_winners (profile_id);
CREATE INDEX IF NOT EXISTS idx_winner_verifications_profile_id ON winner_verifications (profile_id);
CREATE INDEX IF NOT EXISTS idx_winner_verifications_winner_id ON winner_verifications (winner_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_profile_id ON point_transactions (profile_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_profile_id ON puzzle_attempts (profile_id);
CREATE INDEX IF NOT EXISTS idx_prayer_logs_profile_id ON prayer_logs (profile_id);

-- 5. Composite indexes for scale
CREATE INDEX IF NOT EXISTS idx_prayer_logs_profile_date ON prayer_logs (profile_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_point_transactions_profile_date ON point_transactions (profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_monthly_points ON profiles (monthly_points DESC) WHERE monthly_points > 0;
CREATE INDEX IF NOT EXISTS idx_monthly_winners_year_month ON monthly_winners (year_month DESC, rank ASC);
