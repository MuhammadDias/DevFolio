-- Add public contact and map fields to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS map_lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS map_lng DOUBLE PRECISION;
