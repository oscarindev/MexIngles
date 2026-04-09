import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { strings } from '../../constants/i18n';
import { useAudio } from '../../hooks/useAudio';
import type { Exercise } from '../../types/exercises';

interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  onSubmit: (answer: string, timeSpentMs: number) => void;
  startTime: number;
}

export function MultipleChoiceExercise({ exercise, onSubmit, startTime }: MultipleChoiceExerciseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { speakEnglish, hapticLight } = useAudio();
  const options: string[] = exercise.options?.choices || [];

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    hapticLight();
  };

  const handleCheck = () => {
    if (selectedOption) {
      onSubmit(selectedOption, Date.now() - startTime);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>
        {exercise.promptEs || strings.selectCorrect}
      </Text>

      {exercise.audioText && (
        <TouchableOpacity
          style={styles.audioBtn}
          onPress={() => speakEnglish(exercise.audioText!)}
        >
          <Ionicons name="volume-high" size={28} color={colors.primary} />
          <Text style={styles.audioText}>{exercise.audioText}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.options}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedOption === option && styles.optionSelected,
            ]}
            onPress={() => handleSelect(option)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title={strings.checkAnswer}
        onPress={handleCheck}
        disabled={!selectedOption}
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
  prompt: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  audioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  audioText: {
    fontSize: fontSize.lg,
    color: colors.text,
    fontWeight: '500',
  },
  options: {
    gap: spacing.sm,
    flex: 1,
  },
  option: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },
  optionText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkBtn: {
    marginTop: spacing.lg,
  },
});
