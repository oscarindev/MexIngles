import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProgressBar } from '../ui/ProgressBar';
import { colors, spacing, fontSize } from '../../constants/theme';

interface ExerciseProgressProps {
  current: number;
  total: number;
  hearts: number;
  onClose: () => void;
}

export function ExerciseProgress({ current, total, hearts, onClose }: ExerciseProgressProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Ionicons name="close" size={28} color={colors.textSecondary} />
      </TouchableOpacity>
      <View style={styles.progressWrapper}>
        <ProgressBar
          progress={total > 0 ? current / total : 0}
          color={colors.primaryLight}
          height={10}
        />
      </View>
      <View style={styles.heartsWrapper}>
        <Ionicons name="heart" size={20} color={colors.hearts} />
        <Text style={styles.heartsText}>{hearts}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  progressWrapper: {
    flex: 1,
  },
  heartsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  heartsText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.hearts,
  },
});
