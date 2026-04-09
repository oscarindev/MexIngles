export interface Course {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  descriptionEs?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  sortOrder: number;
  isActive: boolean;
}

export interface Unit {
  id: string;
  courseId: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  descriptionEs?: string;
  icon: string;
  sortOrder: number;
  totalLessons: number;
  guidebookEs?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  slug: string;
  titleEs: string;
  lessonType: 'standard' | 'review' | 'test' | 'bonus';
  sortOrder: number;
  xpReward: number;
  difficulty: number;
  estimatedMinutes: number;
}

export interface Vocabulary {
  id: string;
  wordEn: string;
  wordEs: string;
  pronunciationIpa?: string;
  partOfSpeech?: string;
  exampleEn?: string;
  exampleEs?: string;
  audioText?: string;
  imageUrl?: string;
  difficulty: number;
  category?: string;
  tags?: string[];
}

// Content JSON format for bundled lessons
export interface LessonContent {
  unitSlug: string;
  unitTitleEs: string;
  unitTitleEn: string;
  unitIcon: string;
  level: string;
  guidebookEs?: string;
  lessons: LessonContentItem[];
}

export interface LessonContentItem {
  slug: string;
  titleEs: string;
  xpReward: number;
  difficulty: number;
  exercises: ExerciseContent[];
  vocabulary: VocabularyContent[];
}

export interface ExerciseContent {
  type: string;
  promptEs?: string;
  promptEn?: string;
  correctAnswer: string;
  acceptedAnswers?: string[];
  options?: any;
  hintEs?: string;
  explanationEs?: string;
  audioText?: string;
  difficulty?: number;
}

export interface VocabularyContent {
  wordEn: string;
  wordEs: string;
  pronunciationIpa?: string;
  partOfSpeech?: string;
  exampleEn?: string;
  exampleEs?: string;
  category?: string;
}
