-- Twilio Voicemail & SMS Storage Schema
-- Run this in your Supabase SQL editor to create the required tables

-- Table for storing voicemail recordings
CREATE TABLE IF NOT EXISTS voicemails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_sid TEXT NOT NULL UNIQUE,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  recording_url TEXT NOT NULL,
  recording_sid TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  transcription TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table for storing incoming SMS messages
CREATE TABLE IF NOT EXISTS sms_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_sid TEXT NOT NULL UNIQUE,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  body TEXT NOT NULL,
  num_media INTEGER DEFAULT 0,
  media_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_voicemails_created_at ON voicemails (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_voicemails_from ON voicemails (from_number);
CREATE INDEX IF NOT EXISTS idx_sms_created_at ON sms_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_from ON sms_messages (from_number);

-- Enable Row Level Security
ALTER TABLE voicemails ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (used by our API routes)
CREATE POLICY "Service role full access on voicemails"
  ON voicemails FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on sms_messages"
  ON sms_messages FOR ALL
  USING (true)
  WITH CHECK (true);
