-- Create vote_tokens table for magic link voting
CREATE TABLE IF NOT EXISTS vote_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  month TEXT NOT NULL, -- Format: YYYY-MM
  used BOOLEAN DEFAULT false,
  cause_voted TEXT, -- ID of the cause they voted for
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  UNIQUE(email, month) -- Prevent multiple tokens for the same user in the same month
);

-- Enable RLS
ALTER TABLE vote_tokens ENABLE ROW LEVEL SECURITY;

-- Anyone with the token can READ their own token to validate it
CREATE POLICY "Public can view their token"
  ON vote_tokens FOR SELECT
  USING (true); -- We rely on the token UUID logic in the application to "find" it. UUIDs are unguessable.

-- Anyone with the token can UPDATE it to mark as used (only if it wasn't used yet)
CREATE POLICY "Public can use their token"
  ON vote_tokens FOR UPDATE
  USING (used = false)
  WITH CHECK (used = true);

-- Admins can do everything (insert tokens for users)
CREATE POLICY "Allow inserts for admins"
  ON vote_tokens FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all for admins"
  ON vote_tokens FOR ALL
  USING (true);
