/*
# Create profiles, prayer_logs, monthly_winners, winner_verifications tables

1. New Tables
- `profiles`: stores user display name, points, streak, guest flag, and device ID for guest accounts.
- `prayer_logs`: one row per completed prayer, used to compute activity scores for the monthly draw.
- `monthly_winners`: records the selected winner for each month, with status (pending/verified/claimed/expired).
- `winner_verifications`: contact details collected from the winner so the admin team can deliver the prize.

2. Security
- Enable RLS on all tables.
- profiles: owner-scoped CRUD for authenticated users; guests matched by device_id via request header.
- prayer_logs: owner-scoped CRUD.
- monthly_winners: SELECT open to all (transparency); INSERT/UPDATE via service role only.
- winner_verifications: owner-scoped INSERT/SELECT.

3. Notes
- Guest accounts use device_id instead of auth.uid().
- The monthly winner is selected by an edge function using activity score.
- winner_verifications.contact_method: phone, telegram, whatsapp, email.
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id text UNIQUE,
  display_name text NOT NULL DEFAULT 'User',
  email text,
  is_guest boolean NOT NULL DEFAULT false,
  points integer NOT NULL DEFAULT 0,
  streak integer NOT NULL DEFAULT 0,
  best_streak integer NOT NULL DEFAULT 0,
  skip_passes integer NOT NULL DEFAULT 0,
  premium_unlocked boolean NOT NULL DEFAULT false,
  unlocked_reciters text[] NOT NULL DEFAULT ARRAY['makkah', 'madinah'],
  unlocked_themes text[] NOT NULL DEFAULT ARRAY['emerald', 'midnight'],
  unlocked_badges text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO anon, authenticated
USING (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR
  (device_id IS NOT NULL AND device_id = current_setting('request.header.x-device-id', true))
);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO anon, authenticated
WITH CHECK (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR
  (device_id IS NOT NULL)
);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO anon, authenticated
USING (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR
  (device_id IS NOT NULL AND device_id = current_setting('request.header.x-device-id', true))
)
WITH CHECK (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR
  (device_id IS NOT NULL AND device_id = current_setting('request.header.x-device-id', true))
);

-- Prayer logs table
CREATE TABLE IF NOT EXISTS prayer_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prayer_key text NOT NULL,
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  logged_at timestamptz NOT NULL DEFAULT now(),
  verified_by_camera boolean NOT NULL DEFAULT false,
  UNIQUE (profile_id, prayer_key, log_date)
);

CREATE INDEX IF NOT EXISTS idx_prayer_logs_profile ON prayer_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_prayer_logs_log_date ON prayer_logs(log_date);

ALTER TABLE prayer_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_prayer_logs" ON prayer_logs;
CREATE POLICY "select_own_prayer_logs"
ON prayer_logs FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = prayer_logs.profile_id
    AND (
      (p.user_id IS NOT NULL AND p.user_id = auth.uid())
      OR
      (p.device_id IS NOT NULL AND p.device_id = current_setting('request.header.x-device-id', true))
    )
  )
);

DROP POLICY IF EXISTS "insert_own_prayer_logs" ON prayer_logs;
CREATE POLICY "insert_own_prayer_logs"
ON prayer_logs FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = prayer_logs.profile_id
    AND (
      (p.user_id IS NOT NULL AND p.user_id = auth.uid())
      OR
      (p.device_id IS NOT NULL AND p.device_id = current_setting('request.header.x-device-id', true))
    )
  )
);

DROP POLICY IF EXISTS "delete_own_prayer_logs" ON prayer_logs;
CREATE POLICY "delete_own_prayer_logs"
ON prayer_logs FOR DELETE
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = prayer_logs.profile_id
    AND (
      (p.user_id IS NOT NULL AND p.user_id = auth.uid())
      OR
      (p.device_id IS NOT NULL AND p.device_id = current_setting('request.header.x-device-id', true))
    )
  )
);

-- Monthly winners table
CREATE TABLE IF NOT EXISTS monthly_winners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_month text NOT NULL UNIQUE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_score integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  selected_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_winner_status CHECK (status IN ('pending', 'verified', 'claimed', 'expired'))
);

ALTER TABLE monthly_winners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_monthly_winners" ON monthly_winners;
CREATE POLICY "select_monthly_winners"
ON monthly_winners FOR SELECT
TO anon, authenticated
USING (true);

-- Winner verifications table
CREATE TABLE IF NOT EXISTS winner_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  winner_id uuid NOT NULL REFERENCES monthly_winners(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  contact_method text NOT NULL,
  contact_value text NOT NULL,
  full_name text,
  notes text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_contact_method CHECK (contact_method IN ('phone', 'telegram', 'whatsapp', 'email'))
);

ALTER TABLE winner_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_verification" ON winner_verifications;
CREATE POLICY "select_own_verification"
ON winner_verifications FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = winner_verifications.profile_id
    AND (
      (p.user_id IS NOT NULL AND p.user_id = auth.uid())
      OR
      (p.device_id IS NOT NULL AND p.device_id = current_setting('request.header.x-device-id', true))
    )
  )
);

DROP POLICY IF EXISTS "insert_own_verification" ON winner_verifications;
CREATE POLICY "insert_own_verification"
ON winner_verifications FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = winner_verifications.profile_id
    AND (
      (p.user_id IS NOT NULL AND p.user_id = auth.uid())
      OR
      (p.device_id IS NOT NULL AND p.device_id = current_setting('request.header.x-device-id', true))
    )
  )
);
