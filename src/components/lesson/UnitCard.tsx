import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '../ui/ProgressBar';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

interface UnitCardProps {
  title: string;
  icon: string;
  description?: string;
  lessonsCompleted: number;
  totalLessons: number;
}

export function UnitCard({ title, icon, description, lessonsCompleted, totalLessons }: UnitCardProps) {
  const progress = totalLessons > 0 ? lessonsCompleted / totalLessons : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      </View>
      <View style={styles.progressRow}>
        <ProgressBar progress={progress} height={6} color={colors.primaryLight} />
        <Text style={styles.progressText}>
          {lessonsCompleted}/{totalLessons}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 32,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
    minWidth: 30,
  },
});
