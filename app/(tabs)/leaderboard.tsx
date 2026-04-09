import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGamificationStore } from '../../src/stores/useGamificationStore';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { strings } from '../../src/constants/i18n';
import { LEAGUES } from '../../src/constants/gamification';

const DEMO_LEADERBOARD = [
  { rank: 1, name: 'Carlos M.', xp: 850, league: 'oro' },
  { rank: 2, name: 'Ana L.', xp: 720, league: 'oro' },
  { rank: 3, name: 'Pedro R.', xp: 680, league: 'plata' },
  { rank: 4, name: 'Maria G.', xp: 540, league: 'plata' },
  { rank: 5, name: 'Jose H.', xp: 420, league: 'plata' },
  { rank: 6, name: 'Laura S.', xp: 380, league: 'bronce' },
  { rank: 7, name: 'Diego T.', xp: 310, league: 'bronce' },
  { rank: 8, name: 'Sofia V.', xp: 250, league: 'bronce' },
];

export default function LeaderboardScreen() {
  const gamification = useGamificationStore(s => s.gamification);
  const profile = useAuthStore(s => s.profile);
  const currentLeague = LEAGUES.find(l => l.id === (gamification?.currentLeague || 'bronce'));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.leaderboardTitle}</Text>

        <View style={styles.leagueCard}>
          <Text style={styles.leagueEmoji}>{currentLeague?.icon || '🥉'}</Text>
          <View>
            <Text style={styles.leagueName}>Liga {currentLeague?.name || 'Bronce'}</Text>
            <Text style={styles.leagueXp}>{gamification?.weeklyXp || 0} XP esta semana</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {DEMO_LEADERBOARD.map((entry) => {
          const isCurrentUser = entry.rank === 4; // Simulated
          return (
            <View
              key={entry.rank}
              style={[styles.row, isCurrentUser && styles.rowHighlighted]}
            >
              <Text style={[styles.rank, entry.rank <= 3 && styles.rankTop]}>
                {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
              </Text>
              <View style={styles.avatar}>
                <Ionicons name="person-circle" size={40} color={colors.textMuted} />
              </View>
              <View style={styles.nameSection}>
                <Text style={[styles.name, isCurrentUser && styles.nameHighlighted]}>
                  {isCurrentUser ? (profile?.displayName || 'Tu') : entry.name}
                </Text>
              </View>
              <View style={styles.xpBadge}>
                <Ionicons name="flash" size={14} color={colors.xp} />
                <Text style={styles.xpText}>{entry.xp}</Text>
              </View>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.md,
  },
  leagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 2,
  },
  leagueEmoji: {
    fontSize: 36,
  },
  leagueName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  leagueXp: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  rowHighlighted: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  rank: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textSecondary,
    width: 30,
    textAlign: 'center',
  },
  rankTop: {
    fontSize: 20,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  nameHighlighted: {
    color: colors.primary,
    fontWeight: '700',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  xpText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
  },
});
