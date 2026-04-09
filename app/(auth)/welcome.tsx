import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { colors, spacing, fontSize } from '../../src/constants/theme';
import { strings } from '../../src/constants/i18n';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>MexIngles</Text>
            <Text style={styles.flagEmoji}>🇲🇽 → 🇺🇸</Text>
          </View>

          <Text style={styles.title}>{strings.welcome}</Text>
          <Text style={styles.subtitle}>{strings.tagline}</Text>
        </View>

        <View style={styles.features}>
          <FeatureRow icon="📚" text="Lecciones interactivas paso a paso" />
          <FeatureRow icon="🔥" text="Rachas diarias y logros" />
          <FeatureRow icon="🗣️" text="Practica tu pronunciacion" />
          <FeatureRow icon="🤖" text="Conversaciones con IA" />
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          title={strings.register}
          onPress={() => router.push('/(auth)/register')}
          size="lg"
          style={styles.registerBtn}
        />
        <Button
          title={strings.login}
          onPress={() => router.push('/(auth)/login')}
          variant="outline"
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

function FeatureRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.textLight,
    letterSpacing: -1,
  },
  flagEmoji: {
    fontSize: 32,
    marginTop: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  features: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.textLight,
    fontWeight: '500',
  },
  buttons: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  registerBtn: {
    backgroundColor: colors.textLight,
  },
});
