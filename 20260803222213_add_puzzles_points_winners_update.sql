/*
# Add puzzles, point_transactions, winner_rank; update monthly_winners for top-3 + verification codes

1. New Tables
- `puzzles`: library of riddles/puzzles with question, options, correct answer, and difficulty.
- `puzzle_attempts`: tracks each user's attempt at a puzzle (correct/incorrect, points awarded).
- `point_transactions`: ledger of all point awards (puzzle=1.5, ad=2, prayer=10, etc.) for auditability and monthly leaderboard scoring.

2. Modified Tables
- `monthly_winners`: add `rank` (1-3), `verification_code` (unique, e.g. WINNER-9842-TN), `prize_amount` (default 100).
  - Relax the unique constraint on year_month so multiple winners (top 3) can be stored per month.
  - Add a unique constraint on verification_code.
- `profiles`: add `monthly_points` column (default 0) to track points earned in the current month for leaderboard ranking.

3. Security
- `puzzles`: SELECT open to authenticated (all users see the puzzle library); no client INSERT/UPDATE.
- `puzzle_attempts`: owner-scoped CRUD (users see and submit their own attempts).
- `point_transactions`: owner-scoped SELECT (users see their own point history); INSERT via service role / edge function.
- `monthly_winners`: SELECT open to authenticated (transparency); INSERT/UPDATE via service role only.

4. Notes
- The monthly leaderboard ranks users by `monthly_points` (accumulated from puzzles + ads + prayers).
- Top 3 users at month's end each win $100 and receive a unique verification code.
- verification_code format: WINNER-XXXX-XX (random alphanumeric).
- `monthly_points` resets at the start of each month via the edge function.
*/

-- Add monthly_points to profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'monthly_points') THEN
    ALTER TABLE profiles ADD COLUMN monthly_points integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Relax unique constraint on monthly_winners.year_month (allow top 3 per month)
ALTER TABLE monthly_winners DROP CONSTRAINT IF EXISTS monthly_winners_year_month_key;

-- Add rank, verification_code, prize_amount to monthly_winners
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_winners' AND column_name = 'rank') THEN
    ALTER TABLE monthly_winners ADD COLUMN rank integer NOT NULL DEFAULT 1;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_winners' AND column_name = 'verification_code') THEN
    ALTER TABLE monthly_winners ADD COLUMN verification_code text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_winners' AND column_name = 'prize_amount') THEN
    ALTER TABLE monthly_winners ADD COLUMN prize_amount integer NOT NULL DEFAULT 100;
  END IF;
END $$;

-- Unique constraint on verification_code
DROP INDEX IF EXISTS monthly_winners_verification_code_key;
CREATE UNIQUE INDEX IF NOT EXISTS monthly_winners_verification_code_key ON monthly_winners (verification_code) WHERE verification_code IS NOT NULL;

-- Update the status check constraint to include 'notified'
ALTER TABLE monthly_winners DROP CONSTRAINT IF EXISTS valid_winner_status;
ALTER TABLE monthly_winners ADD CONSTRAINT valid_winner_status CHECK (status IN ('pending', 'verified', 'claimed', 'expired', 'notified'));

-- Puzzles table
CREATE TABLE IF NOT EXISTS puzzles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
  difficulty text NOT NULL DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category text NOT NULL DEFAULT 'general',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_puzzles" ON puzzles;
CREATE POLICY "select_puzzles"
ON puzzles FOR SELECT
TO authenticated
USING (is_active = true);

-- Puzzle attempts table
CREATE TABLE IF NOT EXISTS puzzle_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  puzzle_id uuid NOT NULL REFERENCES puzzles(id) ON DELETE CASCADE,
  selected_answer text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  points_awarded numeric(4,1) NOT NULL DEFAULT 0,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profile_id, puzzle_id)
);

CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_profile ON puzzle_attempts(profile_id);

ALTER TABLE puzzle_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_puzzle_attempts" ON puzzle_attempts;
CREATE POLICY "select_own_puzzle_attempts"
ON puzzle_attempts FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = puzzle_attempts.profile_id AND p.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "insert_own_puzzle_attempts" ON puzzle_attempts;
CREATE POLICY "insert_own_puzzle_attempts"
ON puzzle_attempts FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = puzzle_attempts.profile_id AND p.user_id = auth.uid()
  )
);

-- Point transactions table (ledger)
CREATE TABLE IF NOT EXISTS point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('puzzle', 'ad', 'prayer', 'camera_verify', 'bonus', 'admin')),
  amount numeric(6,1) NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_point_transactions_profile ON point_transactions(profile_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created ON point_transactions(created_at);

ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_point_transactions" ON point_transactions;
CREATE POLICY "select_own_point_transactions"
ON point_transactions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = point_transactions.profile_id AND p.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "insert_own_point_transactions" ON point_transactions;
CREATE POLICY "insert_own_point_transactions"
ON point_transactions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = point_transactions.profile_id AND p.user_id = auth.uid()
  )
);

-- Update monthly_winners SELECT policy to authenticated only (was anon+authenticated)
DROP POLICY IF EXISTS "select_monthly_winners" ON monthly_winners;
CREATE POLICY "select_monthly_winners"
ON monthly_winners FOR SELECT
TO authenticated
USING (true);

-- Seed some puzzles
INSERT INTO puzzles (question, option_a, option_b, option_c, option_d, correct_answer, difficulty, category) VALUES
('How many prayers are there in a day in Islam?', '3', '5', '7', '10', 'b', 'easy', 'islamic'),
('Which prayer is performed before sunrise?', 'Fajr', 'Dhuhr', 'Asr', 'Isha', 'a', 'easy', 'islamic'),
('What is the act of washing before prayer called?', 'Salah', 'Wudhu', 'Zakat', 'Sawm', 'b', 'easy', 'islamic'),
('Which prayer has the most rakats?', 'Fajr', 'Asr', 'Maghrib', 'Isha', 'd', 'medium', 'islamic'),
('What do Muslims face during prayer?', 'The Kaaba', 'The Mosque', 'The Sun', 'The Moon', 'a', 'easy', 'islamic'),
('How many pillars of Islam are there?', '3', '4', '5', '6', 'c', 'easy', 'islamic'),
('Which month do Muslims fast?', 'Rajab', 'Ramadan', 'Shaban', 'Muharram', 'b', 'easy', 'islamic'),
('What is the first pillar of Islam?', 'Prayer', 'Fasting', 'Shahada', 'Charity', 'c', 'easy', 'islamic'),
('How many times is prayer performed daily?', '3', '4', '5', '6', 'c', 'easy', 'islamic'),
('Which prayer is at noon?', 'Fajr', 'Dhuhr', 'Maghrib', 'Isha', 'b', 'easy', 'islamic'),
('What is the term for the call to prayer?', 'Adhan', 'Iqama', 'Takbir', 'Dua', 'a', 'medium', 'islamic'),
('How many rakats in Fajr prayer?', '2', '3', '4', '6', 'a', 'medium', 'islamic'),
('What must you do before touching the Quran?', 'Sleep', 'Wudhu', 'Eat', 'Run', 'b', 'easy', 'islamic'),
('Which direction is the Qibla?', 'North', 'South', 'Toward Kaaba', 'East', 'c', 'easy', 'islamic'),
('What is the reward for praying in congregation?', '10 times', '27 times', '50 times', '100 times', 'b', 'hard', 'islamic')
ON CONFLICT DO NOTHING;
