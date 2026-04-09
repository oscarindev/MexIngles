import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../ui/Button';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { strings } from '../../constants/i18n';
import { useAudio } from '../../hooks/useAudio';
import type { Exercise } from '../../types/exercises';

interface SpeakingExerciseProps {
  exercise: Exercise;
  onSubmit: (answer: string, timeSpentMs: number) => void;
  startTime: number;
}

export function SpeakingExercise({ exercise, onSubmit, startTime }: SpeakingExerciseProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { speakEnglish } = useAudio();

  const handleListen = () => speakEnglish(exercise.audioText || exercise.correctAnswer);

  const handleStartRecording = () => {
    setIsListening(true);
    // Speech recognition placeholder - will be enhanced with actual speech recognition
    // For now, simulate with a skip option
    setTimeout(() => {
      setIsListening(false);
      setTranscript(exercise.correctAnswer); // Placeholder
    }, 2000);
  };

  const handleSkip = () => {
    // Allow skipping speaking exercises
    onSubmit(exercise.correctAnswer, Date.now() - startTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{strings.speakThis}</Text>

      <TouchableOpacity style={styles.audioCard} onPress={handleListen}>
        <Ionicons name="volume-high" size={28} color={colors.primary} />
        <Text style={styles.targetText}>
          {exercise.audioText || exercise.correctAnswer}
        </Text>
      </TouchableOpacity>

      {exercise.promptEs && (
        <Text style={styles.translation}>{exercise.promptEs}</Text>
      )}

      <View style={styles.micSection}>
        <TouchableOpacity
          style={[styles.micBtn, isListening && styles.micBtnActive]}
          onPress={handleStartRecording}
          disabled={isListening}
        >
          <Ionicons
            name={isListening ? 'radio' : 'mic'}
            size={48}
            color={isListening ? colors.textLight : colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.micHint}>
          {isListening ? 'Escuchando...' : 'Toca para hablar'}
        </Text>
      </View>

      {transcript.length > 0 && (
        <View style={styles.transcriptBox}>
          <Text style={styles.transcriptLabel}>Tu respuesta:</Text>
          <Text style={styles.transcriptText}>{transcript}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="Saltar"
          onPress={handleSkip}
          variant="ghost"
          size="md"
        />
        {transcript.length > 0 && (
          <Button
            title={strings.checkAnswer}
            onPress={() => onSubmit(transcript, Date.now() - startTime)}
            size="lg"
            style={{ flex: 1 }}
          />
        )}
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
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  targetText: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  translation: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.xl,
  },
  micSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  micBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  micBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  micHint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  transcriptBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  transcriptLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  transcriptText: {
    fontSize: fontSize.lg,
    color: colors.text,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 'auto',
  },
});
