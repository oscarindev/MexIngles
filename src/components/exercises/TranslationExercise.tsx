import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { strings } from '../../constants/i18n';
import { useAudio } from '../../hooks/useAudio';
import type { Exercise } from '../../types/exercises';

interface TranslationExerciseProps {
  exercise: Exercise;
  onSubmit: (answer: string, timeSpentMs: number) => void;
  startTime: number;
}

export function TranslationExercise({ exercise, onSubmit, startTime }: TranslationExerciseProps) {
  const [answer, setAnswer] = useState('');
  const { speakEnglish, speakSpanish } = useAudio();

  const isSpanishToEnglish = exercise.options?.direction !== 'en_to_es';
  const promptText = isSpanishToEnglish ? exercise.promptEs : exercise.promptEn;
  const placeholder = isSpanishToEnglish ? strings.typeInEnglish : strings.typeInSpanish;

  const handleSpeak = () => {
    if (isSpanishToEnglish && exercise.promptEs) {
      speakSpanish(exercise.promptEs);
    } else if (exercise.promptEn) {
      speakEnglish(exercise.promptEn);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{strings.translateThis}</Text>

      <TouchableOpacity style={styles.promptCard} onPress={handleSpeak}>
        <View style={styles.promptRow}>
          <Ionicons name="volume-high" size={24} color={colors.primary} />
          <Text style={styles.promptText}>{promptText}</Text>
        </View>
      </TouchableOpacity>

      {exercise.hintEs && (
        <Text style={styles.hint}>Pista: {exercise.hintEs}</Text>
      )}

      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        multiline
      />

      <Button
        title={strings.checkAnswer}
        onPress={() => onSubmit(answer.trim(), Date.now() - startTime)}
        disabled={answer.trim().length === 0}
        size="lg"
        style={styles.checkBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  instruction: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  promptCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  promptText: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  hint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.lg,
    color: colors.text,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
  checkBtn: {
    marginTop: 'auto',
  },
});
