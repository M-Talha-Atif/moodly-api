-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR,
  avatar_url VARCHAR,
  cultural_background JSONB,
  language_preferences VARCHAR[] DEFAULT ARRAY['en'],
  communication_style VARCHAR,
  role VARCHAR NOT NULL CHECK (role IN ('user', 'host', 'admin')) DEFAULT 'user',
  account_status VARCHAR NOT NULL CHECK (account_status IN ('active', 'suspended', 'deleted')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Privacy Settings Table
CREATE TABLE IF NOT EXISTS privacy_settings (
  user_id UUID PRIMARY KEY,
  data_sharing_level VARCHAR NOT NULL CHECK (data_sharing_level IN ('minimal', 'balanced', 'full')) DEFAULT 'balanced',
  community_visibility VARCHAR NOT NULL CHECK (community_visibility IN ('private', 'connections', 'public')) DEFAULT 'connections',
  tracking_consent BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Experience Table
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  location VARCHAR NOT NULL,
  image VARCHAR NOT NULL,
  is_virtual BOOLEAN NOT NULL,
  session_start_time TIMESTAMP NOT NULL,
  session_end_time TIMESTAMP NOT NULL,
  price NUMERIC NOT NULL,
  timezone VARCHAR NOT NULL,
  total_spots INT NOT NULL,
  spots_filled INT DEFAULT 0,
  meeting_link VARCHAR,
  cancellation_policy VARCHAR,
  ai_prep JSONB,
  testimonials JSONB,
  preparation JSONB,
  target_emotions TEXT[],
  desired_outcomes TEXT[],
  language VARCHAR,
  cultural_tags TEXT[],
  growth_dimensions JSONB,
  experience_outcome_summary TEXT,
  ideal_participant_traits TEXT[],
  engagement_stats JSONB,
  host_id UUID,
  embedding vector(384),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_host FOREIGN KEY(host_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Mood Log Table
CREATE TABLE IF NOT EXISTS mood_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  mood_label VARCHAR,
  note TEXT,
  text_sentiment VARCHAR,
  photo_emotion VARCHAR,
  voice_transcript TEXT,
  voice_sentiment VARCHAR,
  same_as_yesterday BOOLEAN DEFAULT FALSE,
  embedding vector(384),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_mood_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
