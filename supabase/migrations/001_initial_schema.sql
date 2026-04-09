-- MexIngles Database Schema
-- Supabase PostgreSQL

-- Profiles (extends Firebase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  native_language TEXT DEFAULT 'es-MX',
  target_language TEXT DEFAULT 'en-US',
  current_level TEXT DEFAULT 'beginner',
  daily_goal INTEGER DEFAULT 10,
  sound_enabled BOOLEAN DEFAULT true,
  haptics_enabled BOOLEAN DEFAULT true,
  notification_enabled BOOLEAN DEFAULT true,
  timezone TEXT DEFAULT 'America/Mexico_City',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT,
  level TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Units
CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL,
  total_lessons INTEGER NOT NULL DEFAULT 5,
  guidebook_es TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, slug)
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title_es TEXT NOT NULL,
  lesson_type TEXT NOT NULL DEFAULT 'standard',
  sort_order INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  difficulty INTEGER NOT NULL DEFAULT 1,
  estimated_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(unit_id, slug)
);

-- Exercises
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  exercise_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  prompt_es TEXT,
  prompt_en TEXT,
  correct_answer TEXT NOT NULL,
  accepted_answers TEXT[],
  options JSONB,
  hint_es TEXT,
  explanation_es TEXT,
  audio_text TEXT,
  difficulty INTEGER DEFAULT 1,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Vocabulary
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_en TEXT NOT NULL,
  word_es TEXT NOT NULL,
  pronunciation_ipa TEXT,
  part_of_speech TEXT,
  example_en TEXT,
  example_es TEXT,
  audio_text TEXT,
  image_url TEXT,
  difficulty INTEGER DEFAULT 1,
  category TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Lesson Progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked',
  stars INTEGER DEFAULT 0,
  best_score REAL DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- User Exercise Attempts
CREATE TABLE IF NOT EXISTS user_exercise_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  is_correct BOOLEAN NOT NULL,
  user_answer TEXT,
  time_spent_ms INTEGER,
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Review Cards (Spaced Repetition)
CREATE TABLE IF NOT EXISTS user_review_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vocabulary_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE,
  easiness_factor REAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ DEFAULT now(),
  last_review_at TIMESTAMPTZ,
  total_reviews INTEGER DEFAULT 0,
  correct_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, vocabulary_id)
);

-- User Unit Progress
CREATE TABLE IF NOT EXISTS user_unit_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked',
  lessons_completed INTEGER DEFAULT 0,
  crown_level INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, unit_id)
);

-- Gamification
CREATE TABLE IF NOT EXISTS user_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  total_xp INTEGER DEFAULT 0,
  weekly_xp INTEGER DEFAULT 0,
  monthly_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  streak_freeze_count INTEGER DEFAULT 2,
  last_activity_date DATE,
  hearts INTEGER DEFAULT 5,
  hearts_last_refill TIMESTAMPTZ DEFAULT now(),
  gems INTEGER DEFAULT 0,
  current_league TEXT DEFAULT 'bronce',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Daily XP
CREATE TABLE IF NOT EXISTS user_daily_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_es TEXT NOT NULL,
  description_es TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Weekly Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard_weekly (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  rank INTEGER,
  league TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, week_start)
);

-- Stories
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT,
  level TEXT NOT NULL,
  category TEXT,
  estimated_minutes INTEGER DEFAULT 5,
  xp_reward INTEGER DEFAULT 15,
  sort_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Story Segments
CREATE TABLE IF NOT EXISTS story_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL,
  speaker TEXT,
  text_en TEXT NOT NULL,
  text_es TEXT,
  highlighted_words JSONB,
  audio_text TEXT,
  has_question BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Story Questions
CREATE TABLE IF NOT EXISTS story_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_id UUID REFERENCES story_segments(id) ON DELETE CASCADE,
  question_es TEXT NOT NULL,
  question_type TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  options JSONB,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Story Progress
CREATE TABLE IF NOT EXISTS user_story_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started',
  last_segment_index INTEGER DEFAULT 0,
  score REAL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- Friendships
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, friend_id)
);

-- Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenged_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_type TEXT NOT NULL DEFAULT 'xp_race',
  status TEXT DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  challenger_score INTEGER DEFAULT 0,
  challenged_score INTEGER DEFAULT 0,
  winner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scenario TEXT NOT NULL,
  messages_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  translation TEXT,
  correction TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_review_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unit_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Public read for content tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read units" ON units FOR SELECT USING (true);
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read lessons" ON lessons FOR SELECT USING (true);
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read exercises" ON exercises FOR SELECT USING (true);
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read vocabulary" ON vocabulary FOR SELECT USING (true);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read achievements" ON achievements FOR SELECT USING (true);
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stories" ON stories FOR SELECT USING (true);
ALTER TABLE story_segments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read story_segments" ON story_segments FOR SELECT USING (true);
ALTER TABLE story_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read story_questions" ON story_questions FOR SELECT USING (true);

-- User data policies (users can only access their own data)
CREATE POLICY "Users own profile" ON profiles FOR ALL USING (id = auth.uid());
CREATE POLICY "Users own lesson progress" ON user_lesson_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own exercise attempts" ON user_exercise_attempts FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own review cards" ON user_review_cards FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own unit progress" ON user_unit_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own gamification" ON user_gamification FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own daily xp" ON user_daily_xp FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own achievements" ON user_achievements FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own story progress" ON user_story_progress FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own friendships" ON friendships FOR ALL USING (user_id = auth.uid() OR friend_id = auth.uid());
CREATE POLICY "Users own challenges" ON challenges FOR ALL USING (challenger_id = auth.uid() OR challenged_id = auth.uid());
CREATE POLICY "Users own chat sessions" ON chat_sessions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own chat messages" ON chat_messages FOR ALL USING (
  session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
);

-- Leaderboard is readable by all authenticated users
ALTER TABLE leaderboard_weekly ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaderboard readable" ON leaderboard_weekly FOR SELECT USING (true);
CREATE POLICY "Users own leaderboard" ON leaderboard_weekly FOR INSERT USING (user_id = auth.uid());
CREATE POLICY "Users update own leaderboard" ON leaderboard_weekly FOR UPDATE USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_units_course_id ON units(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_unit_id ON lessons(unit_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_review_cards_user_next ON user_review_cards(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_user_daily_xp_user_date ON user_daily_xp(user_id, activity_date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_week ON leaderboard_weekly(week_start, league, xp_earned DESC);
