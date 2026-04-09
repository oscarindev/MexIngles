import { create } from 'zustand';
import type { Exercise, ExerciseResult, ExerciseSessionState, LessonResult } from '../types/exercises';
import type { Lesson } from '../types/lessons';

interface LessonState {
  currentLesson: Lesson | null;
  exercises: Exercise[];
  currentExerciseIndex: number;
  sessionState: ExerciseSessionState;
  exerciseResults: ExerciseResult[];
  heartsLost: number;
  startTime: number;
  isComplete: boolean;

  startLesson: (lesson: Lesson, exercises: Exercise[]) => void;
  submitAnswer: (result: ExerciseResult) => void;
  nextExercise: () => void;
  setSessionState: (state: ExerciseSessionState) => void;
  getResult: () => LessonResult | null;
  resetLesson: () => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  currentLesson: null,
  exercises: [],
  currentExerciseIndex: 0,
  sessionState: 'presenting',
  exerciseResults: [],
  heartsLost: 0,
  startTime: 0,
  isComplete: false,

  startLesson: (lesson, exercises) => {
    set({
      currentLesson: lesson,
      exercises,
      currentExerciseIndex: 0,
      sessionState: 'presenting',
      exerciseResults: [],
      heartsLost: 0,
      startTime: Date.now(),
      isComplete: false,
    });
  },

  submitAnswer: (result) => {
    const { exerciseResults } = get();
    set({
      exerciseResults: [...exerciseResults, result],
      sessionState: 'feedback',
      heartsLost: get().heartsLost + (result.isCorrect ? 0 : 1),
    });
  },

  nextExercise: () => {
    const { currentExerciseIndex, exercises } = get();
    const nextIndex = currentExerciseIndex + 1;

    if (nextIndex >= exercises.length) {
      set({ isComplete: true, sessionState: 'complete' });
    } else {
      set({
        currentExerciseIndex: nextIndex,
        sessionState: 'presenting',
      });
    }
  },

  setSessionState: (state) => set({ sessionState: state }),

  getResult: () => {
    const { currentLesson, exercises, exerciseResults, startTime } = get();
    if (!currentLesson) return null;

    const correctAnswers = exerciseResults.filter(r => r.isCorrect).length;
    const accuracy = exercises.length > 0 ? (correctAnswers / exercises.length) * 100 : 0;
    const isPerfect = correctAnswers === exercises.length;
    const baseXP = currentLesson.xpReward;
    const bonusXP = isPerfect ? 5 : 0;

    return {
      lessonId: currentLesson.id,
      totalExercises: exercises.length,
      correctAnswers,
      incorrectAnswers: exercises.length - correctAnswers,
      accuracy,
      xpEarned: baseXP + bonusXP,
      isPerfect,
      timeSpentMs: Date.now() - startTime,
      exerciseResults,
    };
  },

  resetLesson: () => {
    set({
      currentLesson: null,
      exercises: [],
      currentExerciseIndex: 0,
      sessionState: 'presenting',
      exerciseResults: [],
      heartsLost: 0,
      startTime: 0,
      isComplete: false,
    });
  },
}));
