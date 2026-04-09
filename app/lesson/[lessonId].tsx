import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExerciseRunner } from '../../src/components/exercises/ExerciseRunner';
import { LessonComplete } from '../../src/components/lesson/LessonComplete';
import { useLessonStore } from '../../src/stores/useLessonStore';
import { useProgressStore } from '../../src/stores/useProgressStore';
import { useGamificationStore } from '../../src/stores/useGamificationStore';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { supabase } from '../../src/services/supabase';
import { colors } from '../../src/constants/theme';
import type { Exercise } from '../../src/types/exercises';
import type { Lesson } from '../../src/types/lessons';

// Demo exercises for testing
const DEMO_EXERCISES: Exercise[] = [
  {
    id: 'demo-1',
    lessonId: 'demo',
    exerciseType: 'multiple_choice',
    sortOrder: 1,
    promptEs: 'Como se dice "Hola" en ingles?',
    correctAnswer: 'Hello',
    options: { choices: ['Hello', 'Goodbye', 'Please', 'Thanks'] },
    audioText: 'Hello',
    difficulty: 1,
  },
  {
    id: 'demo-2',
    lessonId: 'demo',
    exerciseType: 'translation',
    sortOrder: 2,
    promptEs: 'Buenos dias',
    correctAnswer: 'Good morning',
    acceptedAnswers: ['good morning'],
    hintEs: 'Good = bueno, Morning = manana',
    audioText: 'Good morning',
    difficulty: 1,
  },
  {
    id: 'demo-3',
    lessonId: 'demo',
    exerciseType: 'fill_blank',
    sortOrder: 3,
    promptEs: 'Como estas?',
    promptEn: 'How ___ you?',
    correctAnswer: 'are',
    acceptedAnswers: ['are'],
    difficulty: 1,
  },
  {
    id: 'demo-4',
    lessonId: 'demo',
    exerciseType: 'listening',
    sortOrder: 4,
    promptEs: 'Escucha y escribe lo que oyes',
    correctAnswer: 'Thank you very much',
    acceptedAnswers: ['thank you very much', 'Thank you very much'],
    audioText: 'Thank you very much',
    difficulty: 1,
  },
  {
    id: 'demo-5',
    lessonId: 'demo',
    exerciseType: 'word_order',
    sortOrder: 5,
    promptEs: 'Mi nombre es Maria',
    correctAnswer: 'My name is Maria',
    options: { words: ['is', 'My', 'Maria', 'name'] },
    difficulty: 1,
  },
  {
    id: 'demo-6',
    lessonId: 'demo',
    exerciseType: 'matching',
    sortOrder: 6,
    promptEs: 'Conecta cada palabra en ingles con su traduccion',
    correctAnswer: 'all_matched',
    options: {
      pairs: [
        { en: 'Hello', es: 'Hola' },
        { en: 'Goodbye', es: 'Adios' },
        { en: 'Please', es: 'Por favor' },
        { en: 'Thank you', es: 'Gracias' },
      ],
    },
    difficulty: 1,
  },
  {
    id: 'demo-7',
    lessonId: 'demo',
    exerciseType: 'multiple_choice',
    sortOrder: 7,
    promptEs: 'Que significa "I am hungry"?',
    correctAnswer: 'Tengo hambre',
    options: { choices: ['Tengo hambre', 'Tengo sed', 'Estoy cansado', 'Estoy feliz'] },
    audioText: 'I am hungry',
    explanationEs: '"I am" = "yo estoy/soy", "hungry" = "hambriento/con hambre"',
    difficulty: 1,
  },
  {
    id: 'demo-8',
    lessonId: 'demo',
    exerciseType: 'translation',
    sortOrder: 8,
    promptEs: 'Me llamo Juan',
    correctAnswer: 'My name is Juan',
    acceptedAnswers: ['my name is Juan', 'My name is Juan', "I'm Juan", "I am Juan"],
    difficulty: 1,
  },
];

const DEMO_LESSON: Lesson = {
  id: 'demo',
  unitId: 'demo-unit',
  slug: 'demo',
  titleEs: 'Leccion Demo - Lo Basico',
  lessonType: 'standard',
  sortOrder: 1,
  xpReward: 10,
  difficulty: 1,
  estimatedMinutes: 5,
};

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const profile = useAuthStore(s => s.profile);
  const { startLesson, getResult, resetLesson, isComplete } = useLessonStore();
  const { completeLesson } = useProgressStore();
  const { awardXP, updateStreak, checkAchievements } = useGamificationStore();
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    loadLesson();
    return () => resetLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    if (lessonId === 'demo') {
      startLesson(DEMO_LESSON, DEMO_EXERCISES);
      return;
    }

    // Load from Supabase
    try {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      const { data: exercises } = await supabase
        .from('exercises')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('sort_order');

      if (lesson && exercises) {
        const mappedLesson: Lesson = {
          id: lesson.id,
          unitId: lesson.unit_id,
          slug: lesson.slug,
          titleEs: lesson.title_es,
          lessonType: lesson.lesson_type,
          sortOrder: lesson.sort_order,
          xpReward: lesson.xp_reward,
          difficulty: lesson.difficulty,
          estimatedMinutes: lesson.estimated_minutes,
        };

        const mappedExercises: Exercise[] = exercises.map(e => ({
          id: e.id,
          lessonId: e.lesson_id,
          exerciseType: e.exercise_type,
          sortOrder: e.sort_order,
          promptEs: e.prompt_es,
          promptEn: e.prompt_en,
          correctAnswer: e.correct_answer,
          acceptedAnswers: e.accepted_answers,
          options: e.options,
          hintEs: e.hint_es,
          explanationEs: e.explanation_es,
          audioText: e.audio_text,
          difficulty: e.difficulty,
          tags: e.tags,
        }));

        startLesson(mappedLesson, mappedExercises);
      }
    } catch (err) {
      // Fallback to demo if lesson not found
      startLesson(DEMO_LESSON, DEMO_EXERCISES);
    }
  };

  const handleComplete = async () => {
    const result = getResult();
    if (!result) return;

    setShowComplete(true);

    if (profile && lessonId !== 'demo') {
      try {
        await completeLesson(profile.id, result.lessonId, result.accuracy, result.xpEarned);
        await awardXP(profile.id, result.xpEarned);
        await updateStreak(profile.id);
        await checkAchievements(profile.id);
      } catch {
        // Progress will sync later if offline
      }
    }
  };

  const handleQuit = () => {
    Alert.alert(
      'Salir de la leccion?',
      'Perderas tu progreso en esta leccion.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: () => { resetLesson(); router.back(); } },
      ]
    );
  };

  const result = getResult();

  if (showComplete && result) {
    return (
      <SafeAreaView style={styles.container}>
        <LessonComplete
          result={result}
          onContinue={() => { resetLesson(); router.back(); }}
          onPracticeMore={() => { setShowComplete(false); loadLesson(); }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ExerciseRunner onComplete={handleComplete} onQuit={handleQuit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
