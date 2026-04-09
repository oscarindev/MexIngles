export interface Story {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  descriptionEs?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  estimatedMinutes: number;
  xpReward: number;
  sortOrder: number;
  isActive: boolean;
}

export interface StorySegment {
  id: string;
  storyId: string;
  sortOrder: number;
  speaker?: string;
  textEn: string;
  textEs?: string;
  highlightedWords?: Record<string, string>;
  audioText?: string;
  hasQuestion: boolean;
}

export interface StoryQuestion {
  id: string;
  segmentId: string;
  questionEs: string;
  questionType: 'multiple_choice' | 'fill_blank';
  correctAnswer: string;
  options?: string[];
}

export interface UserStoryProgress {
  userId: string;
  storyId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  lastSegmentIndex: number;
  score: number;
  completedAt: string | null;
}

// Content JSON format for bundled stories
export interface StoryContent {
  slug: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  level: string;
  category: string;
  estimatedMinutes: number;
  xpReward: number;
  segments: StorySegmentContent[];
}

export interface StorySegmentContent {
  speaker?: string;
  textEn: string;
  textEs?: string;
  highlightedWords?: Record<string, string>;
  hasQuestion?: boolean;
  question?: {
    questionEs: string;
    type: string;
    correctAnswer: string;
    options: string[];
  };
}
