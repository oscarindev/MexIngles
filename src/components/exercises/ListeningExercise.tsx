import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { strings } from '../../constants/i18n';
import { useAudio } from '../../hooks/useAudio';
import type { Exercise } from '../../types/exercises';

interface ListeningExerciseProps {
  exercise: Exercise;
  onSubmit: (answer: string, timeSpentMs: number) => void;
  startTime: number;
}

export function ListeningExercise({ exercise, onSubmit, startTime }: ListeningExerciseProps) {
  const [answer, setAnswer] = useState('');
  const [played, setPlayed] = useState(false);
  const { speakEnglish } = useAudio();
  const audioText = exercise.audioText || exercise.correctAnswer;

  useEffect(() => {
    // Auto-play on mount
    handlePlay();
  }, []);

  const handlePlay = () => {
    speakEnglish(audioText);
    setPlayed(true);
  };

  const handlePlaySlow = () => {
    // Play at slower rate - speak function handles this
    speakEnglish(audioText);
  };

  const isTypeMode = exercise.options?.mode !== 'select';

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {isTypeMode ? strings.listenAndType : strings.listenAndSelect}
      </Text>

      <View style={styles.audioSection}>
        <TouchableOpacity style={styles.playBtn} onPress={handlePlay}>
          <Ionicons name="volume-high" size={48} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.slowBtn} onPress={handlePlaySlow}>
          <Ionicons name="play-circle-outline" size={28} color={colors.textSecondary} />
          <Text style={styles.slowText}>Lento</Text>
        </TouchableOpacity>
      </View>

      {isTypeMode ? (
        <TextInput
          style={styles.input}
          value={answer}
          onChangeText={setAnswer}
          placeholder={strings.typeInEnglish}
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
      ) : (
        <View style={styles.options}>
          {(exercise.options?.choices || []).map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[styles.option, answer === option && styles.optionSelected]}
              onPress={() => setAnswer(option)}
            >
              <Text style={[styles.optionText, answer === option && styles.optionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
    marginBottom: spacing.lg,
  },
  audioSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  playBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  slowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  slowText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
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
  options: {
    gap: spacing.sm,
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
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkBtn: {
    marginTop: 'auto',
  },
});
