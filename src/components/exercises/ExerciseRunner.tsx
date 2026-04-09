import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLessonStore } from '../../stores/useLessonStore';
import { useGamificationStore } from '../../stores/useGamificationStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useAudio } from '../../hooks/useAudio';
import { ExerciseProgress } from './ExerciseProgress';
import { ExerciseFeedback } from './ExerciseFeedback';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';
import { TranslationExercise } from './TranslationExercise';
import { FillInBlankExercise } from './FillInBlankExercise';
import { MatchingExercise } from './MatchingExercise';
import { ListeningExercise } from './ListeningExercise';
import { WordOrderExercise } from './WordOrderExercise';
import { SpeakingExercise } from './SpeakingExercise';
import type { Exercise, ExerciseResult } from '../../types/exercises';
import { colors } from '../../constants/theme';

interface ExerciseRunnerProps {
  onComplete: () => void;
  onQuit: () => void;
}

export function ExerciseRunner({ onComplete, onQuit }: ExerciseRunnerProps) {
  const {
    exercises,
    currentExerciseIndex,
    sessionState,
    submitAnswer,
    nextExercise,
    isComplete,
  } = useLessonStore();

  const gamification = useGamificationStore(s => s.gamification);
  const loseHeart = useGamificationStore(s => s.loseHeart);
  const profile = useAuthStore(s => s.profile);
  const { hapticSuccess, hapticError } = useAudio();

  const [exerciseStartTime] = useState(Date.now());
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; correctAnswer: string; explanation?: string } | null>(null);

  const currentExercise = exercises[currentExerciseIndex];
  const hearts = gamification?.hearts ?? 5;

  const checkAnswer = useCallback((userAnswer: string, correctAnswer: string, acceptedAnswers?: string[]): boolean => {
    const normalize = (s: string) => s.toLowerCase().trim().replace(/[.,!?;:'"]/g, '');
    const normalizedUser = normalize(userAnswer);
    const normalizedCorrect = normalize(correctAnswer);

    if (normalizedUser === normalizedCorrect) return true;

    if (acceptedAnswers) {
      return acceptedAnswers.some(a => normalize(a) === normalizedUser);
    }

    return false;
  }, []);

  const handleSubmit = useCallback(async (answer: string, timeSpentMs: number) => {
    if (!currentExercise) return;

    const isCorrect = checkAnswer(answer, currentExercise.correctAnswer, currentExercise.acceptedAnswers);

    if (isCorrect) {
      hapticSuccess();
    } else {
      hapticError();
      if (profile) {
        await loseHeart(profile.id);
      }
    }

    const result: ExerciseResult = {
      exerciseId: currentExercise.id,
      isCorrect,
      userAnswer: answer,
      timeSpentMs,
    };

    submitAnswer(result);
    setLastResult({
      isCorrect,
      correctAnswer: currentExercise.correctAnswer,
      explanation: currentExercise.explanationEs,
    });
  }, [currentExercise, checkAnswer, hapticSuccess, hapticError, loseHeart, profile, submitAnswer]);

  const handleContinue = useCallback(() => {
    setLastResult(null);
    if (isComplete) {
      onComplete();
    } else {
      nextExercise();
    }
  }, [isComplete, onComplete, nextExercise]);

  if (!currentExercise) return null;

  const renderExercise = (exercise: Exercise) => {
    const props = {
      exercise,
      onSubmit: handleSubmit,
      startTime: exerciseStartTime,
    };

    switch (exercise.exerciseType) {
      case 'multiple_choice':
        return <MultipleChoiceExercise {...props} />;
      case 'translation':
        return <TranslationExercise {...props} />;
      case 'fill_blank':
        return <FillInBlankExercise {...props} />;
      case 'matching':
        return <MatchingExercise {...props} />;
      case 'listening':
        return <ListeningExercise {...props} />;
      case 'word_order':
        return <WordOrderExercise {...props} />;
      case 'speaking':
        return <SpeakingExercise {...props} />;
      default:
        return <MultipleChoiceExercise {...props} />;
    }
  };

  return (
    <View style={styles.container}>
      <ExerciseProgress
        current={currentExerciseIndex + (sessionState === 'feedback' ? 1 : 0)}
        total={exercises.length}
        hearts={hearts}
        onClose={onQuit}
      />

      <View style={styles.exerciseContent}>
        {sessionState !== 'feedback' && renderExercise(currentExercise)}
      </View>

      {sessionState === 'feedback' && lastResult && (
        <ExerciseFeedback
          isCorrect={lastResult.isCorrect}
          correctAnswer={lastResult.isCorrect ? undefined : lastResult.correctAnswer}
          explanation={lastResult.explanation}
          onContinue={handleContinue}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  exerciseContent: {
    flex: 1,
  },
});
