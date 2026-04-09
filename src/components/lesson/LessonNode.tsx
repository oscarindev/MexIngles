import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';

interface LessonNodeProps {
  title: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  stars: number;
  onPress: () => void;
  index: number;
}

export function LessonNode({ title, status, stars, onPress, index }: LessonNodeProps) {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isAvailable = status === 'available' || status === 'in_progress';

  // Zigzag positioning
  const offsetX = (index % 3 === 1) ? 50 : (index % 3 === 2) ? -50 : 0;

  return (
    <TouchableOpacity
      style={[styles.container, { marginLeft: offsetX }]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.circle,
          isCompleted && styles.circleCompleted,
          isAvailable && styles.circleAvailable,
          isLocked && styles.circleLocked,
        ]}
      >
        {isLocked && <Ionicons name="lock-closed" size={24} color={colors.textMuted} />}
        {isAvailable && <Ionicons name="play" size={28} color={colors.textLight} />}
        {isCompleted && <Ionicons name="checkmark" size={28} color={colors.textLight} />}
      </View>

      {isCompleted && stars > 0 && (
        <View style={styles.starsRow}>
          {[1, 2, 3].map(i => (
            <Ionicons
              key={i}
              name={i <= stars ? 'star' : 'star-outline'}
              size={14}
              color={i <= stars ? colors.xp : colors.textMuted}
            />
          ))}
        </View>
      )}

      <Text style={[styles.title, isLocked && styles.titleLocked]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.sm,
    width: 120,
    alignSelf: 'center',
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  circleAvailable: {
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  circleCompleted: {
    backgroundColor: colors.primaryLight,
  },
  circleLocked: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2,
    borderColor: colors.border,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  titleLocked: {
    color: colors.textMuted,
  },
});
