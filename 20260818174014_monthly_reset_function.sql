/*
# Monthly Points Reset System

## Purpose
Creates a server-side function to archive the top 3 winners and reset all
users' monthly_points to zero on the 1st of every month.

## New Functions
- `perform_monthly_reset()` — SECURITY DEFINER function callable only by
  service_role. Archives top 3 profiles into monthly_winners for the
  previous month, then sets every profile's monthly_points to 0.
  Idempotent: if the previous month already has archived winners, it skips.

## Modified Tables
- `monthly_winners` — receives archived winner rows each month.
- `profiles` — monthly_points is reset to 0.

## Security
- Function runs as SECURITY DEFINER (owner privileges).
- EXECUTE granted only to service_role so it cannot be called from the client.

## Important Notes
1. The function checks monthly_winners for existing entries to prevent
   double-archiving.
2. It stores the user's monthly_points as activity_score in the archive.
3. The unique constraint on (year_month, rank) in monthly_winners prevents
   duplicates via ON CONFLICT DO NOTHING.
*/

-- Add a unique constraint on (year_month, rank) if not already present
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'monthly_winners_year_month_rank_key'
  ) THEN
    ALTER TABLE monthly_winners ADD CONSTRAINT monthly_winners_year_month_rank_key
      UNIQUE (year_month, rank);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION perform_monthly_reset()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  prev_month text;
  already_archived boolean;
  archived_count int := 0;
  reset_count int := 0;
BEGIN
  -- Calculate previous month in YYYY-MM format
  prev_month := to_char(now() - interval '1 day', 'YYYY-MM');

  -- Check if we already archived for this month
  SELECT EXISTS (
    SELECT 1 FROM monthly_winners WHERE year_month = prev_month
  ) INTO already_archived;

  -- Archive top 3 if not done yet
  IF NOT already_archived THEN
    INSERT INTO monthly_winners (year_month, profile_id, activity_score, rank, status, selected_at)
    SELECT
      prev_month,
      p.id,
      p.monthly_points,
      row_number() OVER (ORDER BY p.monthly_points DESC) AS rank,
      'pending',
      now()
    FROM profiles p
    WHERE p.monthly_points > 0
    ORDER BY p.monthly_points DESC
    LIMIT 3
    ON CONFLICT (year_month, rank) DO NOTHING;

    GET DIAGNOSTICS archived_count = ROW_COUNT;
  END IF;

  -- Reset all monthly points
  UPDATE profiles SET monthly_points = 0, updated_at = now()
  WHERE monthly_points > 0;

  GET DIAGNOSTICS reset_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'month', prev_month,
    'already_archived', already_archived,
    'archived', archived_count,
    'reset', reset_count
  );
END;
$$;

-- Only service_role can call this
REVOKE ALL ON FUNCTION perform_monthly_reset() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION perform_monthly_reset() TO service_role;
