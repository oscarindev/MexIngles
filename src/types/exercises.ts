export type ExerciseType =
  | 'translation'
  | 'fill_blank'
  | 'matching'
  | 'listening'
  | 'speaking'
  | 'word_order'
  | 'multiple_choice';

export interface Exercise {
  id: string;
  lessonId: string;
  exerciseType: ExerciseType;
  sortOrder: number;
  promptEs?: string;
  promptEn?: string;
  correctAnswer: string;
  acceptedAnswers?: string[];
  options?: Record<string, any>;
  hintEs?: string;
  explanationEs?: string;
  audioText?: string;
  difficulty: number;
  tags?: string[];
}

export interface ExerciseResult {
  exerciseId: string;
  isCorrect: boolean;
  userAnswer: string;
  timeSpentMs: number;
  isCloseAnswer?: boolean;
}

export type ExerciseSessionState =
  | 'presenting'
  | 'answering'
  | 'checking'
  | 'feedback'
  | 'complete';

export interface LessonResult {
  lessonId: string;
  totalExercises: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  xpEarned: number;
  isPerfect: boolean;
  timeSpentMs: number;
  exerciseResults: ExerciseResult[];
}
