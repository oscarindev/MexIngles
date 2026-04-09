import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { strings } from '../../constants/i18n';
import { useAudio } from '../../hooks/useAudio';
import type { Exercise } from '../../types/exercises';

interface WordOrderExerciseProps {
  exercise: Exercise;
  onSubmit: (answer: string, timeSpentMs: number) => void;
  startTime: number;
}

export function WordOrderExercise({ exercise, onSubmit, startTime }: WordOrderExerciseProps) {
  const { hapticLight } = useAudio();

  const words = useMemo(() => {
    const wordList: string[] = exercise.options?.words ||
      exercise.correctAnswer.split(' ').sort(() => Math.random() - 0.5);
    return wordList;
  }, [exercise]);

  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [availableWords, setAvailableWords] = useState<number[]>(
    words.map((_, i) => i)
  );

  const handleSelectWord = (wordIndex: number) => {
    hapticLight();
    setSelectedWords([...selectedWords, wordIndex]);
    setAvailableWords(availableWords.filter(i => i !== wordIndex));
  };

  const handleRemoveWord = (position: number) => {
    hapticLight();
    const wordIndex = selectedWords[position];
    setSelectedWords(selectedWords.filter((_, i) => i !== position));
    setAvailableWords([...availableWords, wordIndex].sort((a, b) => a - b));
  };

  const currentAnswer = selectedWords.map(i => words[i]).join(' ');

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{strings.arrangeWords}</Text>

      {exercise.promptEs && (
        <Text style={styles.prompt}>{exercise.promptEs}</Text>
      )}

      {/* Selected words area */}
      <View style={styles.answerArea}>
        {selectedWords.length === 0 ? (
          <Text style={styles.placeholder}>Toca las palabras para formar la oracion</Text>
        ) : (
          <View style={styles.wordRow}>
            {selectedWords.map((wordIndex, position) => (
              <TouchableOpacity
                key={`selected-${position}`}
                style={styles.selectedTile}
                onPress={() => handleRemoveWord(position)}
              >
                <Text style={styles.selectedTileText}>{words[wordIndex]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Available words */}
      <View style={styles.wordBank}>
        {availableWords.map((wordIndex) => (
          <TouchableOpacity
            key={`available-${wordIndex}`}
            style={styles.wordTile}
            onPress={() => handleSelectWord(wordIndex)}
          >
            <Text style={styles.wordTileText}>{words[wordIndex]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title={strings.checkAnswer}
        onPress={() => onSubmit(currentAnswer, Date.now() - startTime)}
        disabled={selectedWords.length === 0}
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
    marginBottom: spacing.sm,
  },
  prompt: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  answerArea: {
    minHeight: 80,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    borderStyle: 'dashed',
    padding: spacing.md,
    marginBottom: spacing.xl,
    justifyContent: 'center',
  },
  placeholder: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: fontSize.sm,
  },
  wordRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  selectedTile: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  selectedTileText: {
    color: colors.textLight,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  wordBank: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    flex: 1,
    alignContent: 'flex-start',
  },
  wordTile: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  wordTileText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.text,
  },
  checkBtn: {
    marginTop: spacing.lg,
  },
});
