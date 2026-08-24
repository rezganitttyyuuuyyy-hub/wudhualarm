/*
# Add unique constraint on user_id in profiles

1. Changes
  - Add a UNIQUE constraint on `profiles.user_id` to prevent duplicate profiles per user.
  - Drop the old non-unique index first, then create a unique index.

2. Important Notes
  - This prevents the auto-creation logic from inserting duplicate rows on repeated logins.
  - The upsert in the app code uses `onConflict: 'user_id'` which requires this unique constraint.
*/

DROP INDEX IF EXISTS idx_profiles_user_id;
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles (user_id);
