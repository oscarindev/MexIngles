import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { strings } from '../../constants/i18n';

interface ExerciseFeedbackProps {
  isCorrect: boolean;
  correctAnswer?: string;
  explanation?: string;
  onContinue: () => void;
}

export function ExerciseFeedback({
  isCorrect,
  correctAnswer,
  explanation,
  onContinue,
}: ExerciseFeedbackProps) {
  return (
    <View style={[styles.container, isCorrect ? styles.correctBg : styles.incorrectBg]}>
      <View style={styles.header}>
        <Ionicons
          name={isCorrect ? 'checkmark-circle' : 'close-circle'}
          size={32}
          color={isCorrect ? colors.correct : colors.incorrect}
        />
        <Text style={[styles.title, isCorrect ? styles.correctText : styles.incorrectText]}>
          {isCorrect ? strings.correct : strings.incorrect}
        </Text>
      </View>

      {!isCorrect && correctAnswer && (
        <View style={styles.answerRow}>
          <Text style={styles.answerLabel}>{strings.correctAnswer}</Text>
          <Text style={styles.answerText}>{correctAnswer}</Text>
        </View>
      )}

      {explanation && (
        <Text style={styles.explanation}>{explanation}</Text>
      )}

      <Button
        title={strings.continueBtn}
        onPress={onContinue}
        variant={isCorrect ? 'primary' : 'secondary'}
        size="lg"
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  correctBg: { backgroundColor: colors.correctBg },
  incorrectBg: { backgroundColor: colors.incorrectBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
  },
  correctText: { color: colors.correct },
  incorrectText: { color: colors.incorrect },
  answerRow: {
    marginBottom: spacing.sm,
  },
  answerLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  answerText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  explanation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
  },
});
