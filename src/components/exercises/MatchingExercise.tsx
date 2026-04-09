import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { strings } from '../../constants/i18n';
import { useAudio } from '../../hooks/useAudio';
import type { Exercise } from '../../types/exercises';

interface MatchingExerciseProps {
  exercise: Exercise;
  onSubmit: (answer: string, timeSpentMs: number) => void;
  startTime: number;
}

export function MatchingExercise({ exercise, onSubmit, startTime }: MatchingExerciseProps) {
  const pairs: Array<{ en: string; es: string }> = exercise.options?.pairs || [];
  const { hapticLight, hapticSuccess, hapticError } = useAudio();

  const shuffledEn = useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5).map(p => p.en),
    [pairs]
  );
  const shuffledEs = useMemo(
    () => [...pairs].sort(() => Math.random() - 0.5).map(p => p.es),
    [pairs]
  );

  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedEs, setSelectedEs] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [incorrectFlash, setIncorrectFlash] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  const handleEnSelect = (word: string) => {
    if (matchedPairs.has(word)) return;
    hapticLight();
    setSelectedEn(word);
    if (selectedEs) {
      checkMatch(word, selectedEs);
    }
  };

  const handleEsSelect = (word: string) => {
    if (matchedPairs.has(word)) return;
    hapticLight();
    setSelectedEs(word);
    if (selectedEn) {
      checkMatch(selectedEn, word);
    }
  };

  const checkMatch = (en: string, es: string) => {
    const isMatch = pairs.some(p => p.en === en && p.es === es);
    if (isMatch) {
      hapticSuccess();
      const newMatched = new Set(matchedPairs);
      newMatched.add(en);
      newMatched.add(es);
      setMatchedPairs(newMatched);
      setSelectedEn(null);
      setSelectedEs(null);

      // Check if all matched
      if (newMatched.size === pairs.length * 2) {
        setTimeout(() => {
          onSubmit(
            mistakes === 0 ? 'perfect' : `${mistakes} mistakes`,
            Date.now() - startTime
          );
        }, 500);
      }
    } else {
      hapticError();
      setMistakes(m => m + 1);
      setIncorrectFlash(true);
      setTimeout(() => {
        setSelectedEn(null);
        setSelectedEs(null);
        setIncorrectFlash(false);
      }, 600);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{strings.matchPairs}</Text>

      <View style={styles.columns}>
        <View style={styles.column}>
          {shuffledEn.map((word, i) => (
            <TouchableOpacity
              key={`en-${i}`}
              style={[
                styles.tile,
                matchedPairs.has(word) && styles.tileMatched,
                selectedEn === word && styles.tileSelected,
                selectedEn === word && incorrectFlash && styles.tileIncorrect,
              ]}
              onPress={() => handleEnSelect(word)}
              disabled={matchedPairs.has(word)}
            >
              <Text
                style={[
                  styles.tileText,
                  matchedPairs.has(word) && styles.tileTextMatched,
                ]}
              >
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.column}>
          {shuffledEs.map((word, i) => (
            <TouchableOpacity
              key={`es-${i}`}
              style={[
                styles.tile,
                matchedPairs.has(word) && styles.tileMatched,
                selectedEs === word && styles.tileSelected,
                selectedEs === word && incorrectFlash && styles.tileIncorrect,
              ]}
              onPress={() => handleEsSelect(word)}
              disabled={matchedPairs.has(word)}
            >
              <Text
                style={[
                  styles.tileText,
                  matchedPairs.has(word) && styles.tileTextMatched,
                ]}
              >
                {word}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    marginBottom: spacing.lg,
  },
  columns: {
    flexDirection: 'row',
    gap: spacing.md,
    flex: 1,
  },
  column: {
    flex: 1,
    gap: spacing.sm,
  },
  tile: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  tileSelected: {
    borderColor: colors.primary,
    backgroundColor: '#E8F5E9',
  },
  tileMatched: {
    borderColor: colors.correct,
    backgroundColor: colors.correctBg,
    opacity: 0.6,
  },
  tileIncorrect: {
    borderColor: colors.incorrect,
    backgroundColor: colors.incorrectBg,
  },
  tileText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  tileTextMatched: {
    color: colors.correct,
  },
});
