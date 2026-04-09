import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { strings } from '../../constants/i18n';
import type { LessonResult } from '../../types/exercises';

interface LessonCompleteProps {
  result: LessonResult;
  onContinue: () => void;
  onPracticeMore: () => void;
}

export function LessonComplete({ result, onContinue, onPracticeMore }: LessonCompleteProps) {
  const stars = result.accuracy >= 100 ? 3 : result.accuracy >= 80 ? 2 : 1;

  return (
    <View style={styles.container}>
      <View style={styles.celebration}>
        <Text style={styles.emoji}>{result.isPerfect ? '🎉' : '⭐'}</Text>
        <Text style={styles.title}>{strings.lessonComplete}</Text>
        <Text style={styles.subtitle}>
          {result.isPerfect ? strings.perfectScore : strings.greatJob}
        </Text>
      </View>

      {/* Stars */}
      <View style={styles.starsRow}>
        {[1, 2, 3].map(i => (
          <Ionicons
            key={i}
            name={i <= stars ? 'star' : 'star-outline'}
            size={48}
            color={i <= stars ? colors.xp : colors.textMuted}
          />
        ))}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statRow}>
          <Ionicons name="flash" size={24} color={colors.xp} />
          <Text style={styles.statLabel}>{strings.xpEarned}</Text>
          <Text style={styles.statValue}>+{result.xpEarned}</Text>
        </View>
        <View style={styles.statRow}>
          <Ionicons name="checkmark-circle" size={24} color={colors.correct} />
          <Text style={styles.statLabel}>{strings.accuracy}</Text>
          <Text style={styles.statValue}>{Math.round(result.accuracy)}%</Text>
        </View>
        <View style={styles.statRow}>
          <Ionicons name="time" size={24} color={colors.primary} />
          <Text style={styles.statLabel}>Tiempo</Text>
          <Text style={styles.statValue}>
            {Math.round(result.timeSpentMs / 1000)}s
          </Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          title={strings.continueBtn}
          onPress={onContinue}
          size="lg"
        />
        {!result.isPerfect && (
          <Button
            title={strings.practiceMore}
            onPress={onPracticeMore}
            variant="outline"
            size="md"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  celebration: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statsContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  buttons: {
    gap: spacing.md,
  },
});
