import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { useGamificationStore } from '../../src/stores/useGamificationStore';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { strings } from '../../src/constants/i18n';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, logout } = useAuthStore();
  const gamification = useGamificationStore(s => s.gamification);

  const handleLogout = () => {
    Alert.alert(
      strings.logout,
      'Estas seguro que deseas cerrar sesion?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: strings.logout, style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color={colors.textLight} />
          </View>
          <Text style={styles.displayName}>{profile?.displayName || 'Estudiante'}</Text>
          <Text style={styles.email}>{profile?.email || ''}</Text>
          <Text style={styles.level}>Nivel: {profile?.currentLevel || 'Principiante'}</Text>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.statistics}</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="flash" color={colors.xp} label={strings.totalXP} value={`${gamification?.totalXp || 0}`} />
            <StatCard icon="flame" color={colors.streak} label={strings.streak} value={`${gamification?.currentStreak || 0} dias`} />
            <StatCard icon="trophy" color={colors.oro} label={strings.longestStreak} value={`${gamification?.longestStreak || 0} dias`} />
            <StatCard icon="diamond" color={colors.gems} label="Gemas" value={`${gamification?.gems || 0}`} />
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.achievements}</Text>
          <Card>
            <View style={styles.achievementPreview}>
              <Text style={styles.achievementEmoji}>🏆</Text>
              <Text style={styles.achievementText}>Completa lecciones para desbloquear logros</Text>
            </View>
          </Card>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.settings}</Text>
          <Card>
            <SettingsRow icon="notifications" label={strings.notifications} />
            <SettingsRow icon="volume-high" label={strings.soundEffects} />
            <SettingsRow icon="phone-portrait" label={strings.hapticFeedback} />
            <SettingsRow icon="information-circle" label={strings.about} />
          </Card>
        </View>

        <View style={styles.logoutSection}>
          <Button
            title={strings.logout}
            onPress={handleLogout}
            variant="outline"
            size="md"
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, color, label, value }: { icon: string; color: string; label: string; value: string }) {
  return (
    <View style={statStyles.card}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function SettingsRow({ icon, label }: { icon: string; label: string }) {
  return (
    <TouchableOpacity style={settingStyles.row}>
      <Ionicons name={icon as any} size={22} color={colors.textSecondary} />
      <Text style={settingStyles.label}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.primary,
    paddingBottom: spacing.xxl,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  displayName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textLight,
  },
  email: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
  level: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  section: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  achievementPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.sm,
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    flex: 1,
  },
  logoutSection: {
    padding: spacing.lg,
  },
});

const statStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});

const settingStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceElevated,
  },
  label: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
  },
});
