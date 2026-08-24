/*
# Remove FK + unique constraint on puzzle_attempts for generated puzzle IDs

1. Modified Tables
- `puzzle_attempts`: drop the foreign key to `puzzles` and the unique constraint on (profile_id, puzzle_id) so the table can store attempts for dynamically generated puzzles that don't exist as rows in the `puzzles` table. The generated puzzles are ephemeral (created by the edge function per-request) and identified by a `puzzle_key` string rather than a UUID FK.

2. New Columns
- `puzzle_attempts.puzzle_key` (text, nullable): a stable string key identifying the generated puzzle (e.g., "how_many_prayers"). Used for dedup so a user can't solve the same generated puzzle twice.
- `puzzle_attempts.question` (text, nullable): the question text at time of attempt (for audit).
- `puzzle_attempts.correct_answer` (text, nullable): the correct answer letter at time of attempt.

3. Security
- No policy changes. Existing owner-scoped SELECT/INSERT policies still apply.

4. Notes
- The `puzzles` table is kept for any future admin-curated puzzles, but the Puzzles screen will primarily use the edge function for infinite unique multilingual puzzles.
- The unique constraint on (profile_id, puzzle_key) prevents duplicate attempts on the same generated puzzle.
*/

-- Drop FK constraint on puzzle_attempts.puzzle_id
ALTER TABLE puzzle_attempts DROP CONSTRAINT IF EXISTS puzzle_attempts_puzzle_id_fkey;

-- Drop old unique constraint on (profile_id, puzzle_id)
ALTER TABLE puzzle_attempts DROP CONSTRAINT IF EXISTS puzzle_attempts_profile_id_puzzle_id_key;

-- Add puzzle_key column
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'puzzle_attempts' AND column_name = 'puzzle_key') THEN
    ALTER TABLE puzzle_attempts ADD COLUMN puzzle_key text;
  END IF;
END $$;

-- Add question and correct_answer columns for audit
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'puzzle_attempts' AND column_name = 'question') THEN
    ALTER TABLE puzzle_attempts ADD COLUMN question text;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'puzzle_attempts' AND column_name = 'correct_answer') THEN
    ALTER TABLE puzzle_attempts ADD COLUMN correct_answer text;
  END IF;
END $$;

-- Make puzzle_id nullable (generated puzzles don't have a UUID)
ALTER TABLE puzzle_attempts ALTER COLUMN puzzle_id DROP NOT NULL;

-- Add unique constraint on (profile_id, puzzle_key) for generated puzzles
CREATE UNIQUE INDEX IF NOT EXISTS puzzle_attempts_profile_puzzle_key_key
  ON puzzle_attempts (profile_id, puzzle_key)
  WHERE puzzle_key IS NOT NULL;

-- Add index on puzzle_key for lookups
CREATE INDEX IF NOT EXISTS idx_puzzle_attempts_key ON puzzle_attempts(puzzle_key);
