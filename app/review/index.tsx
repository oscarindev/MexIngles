import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { colors, spacing, fontSize } from '../../src/constants/theme';
import { strings } from '../../src/constants/i18n';

export default function ReviewScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="refresh-circle" size={80} color={colors.primary} />
        <Text style={styles.title}>{strings.reviewWords}</Text>
        <Text style={styles.subtitle}>{strings.noWordsToReview}</Text>
        <Text style={styles.hint}>
          Completa mas lecciones para agregar palabras a tu cola de repaso.
          El sistema de repeticion espaciada te ayudara a recordar lo que aprendes.
        </Text>
        <Button
          title="Volver"
          onPress={() => router.back()}
          variant="outline"
          size="md"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
  hint: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
});
