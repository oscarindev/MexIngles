import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { strings } from '../../constants/i18n';
import type { Exercise } from '../../types/exercises';

interface FillInBlankExerciseProps {
  exercise: Exercise;
  onSubmit: (answer: string, timeSpentMs: number) => void;
  startTime: number;
}

export function FillInBlankExercise({ exercise, onSubmit, startTime }: FillInBlankExerciseProps) {
  const [answer, setAnswer] = useState('');

  // Split prompt around the blank marker ___
  const parts = (exercise.promptEn || '').split('___');
  const before = parts[0] || '';
  const after = parts[1] || '';

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{strings.fillInBlank}</Text>

      {exercise.promptEs && (
        <Text style={styles.spanishPrompt}>{exercise.promptEs}</Text>
      )}

      <View style={styles.sentenceContainer}>
        <Text style={styles.sentenceText}>
          {before}
          <Text style={styles.blank}>{answer || '______'}</Text>
          {after}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
        placeholder="..."
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
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
  spanishPrompt: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  sentenceContainer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  sentenceText: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 34,
  },
  blank: {
    color: colors.primary,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.lg,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  checkBtn: {
    marginTop: 'auto',
  },
});
