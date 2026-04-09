import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UnitCard } from '../../src/components/lesson/UnitCard';
import { LessonNode } from '../../src/components/lesson/LessonNode';
import { useAuthStore } from '../../src/stores/useAuthStore';
import { useProgressStore } from '../../src/stores/useProgressStore';
import { useGamificationStore } from '../../src/stores/useGamificationStore';
import { colors, spacing, fontSize } from '../../src/constants/theme';
import { strings } from '../../src/constants/i18n';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useAuthStore(s => s.profile);
  const { units, lessons, lessonProgress, loadCourseContent, loadUserProgress } = useProgressStore();
  const { gamification, loadGamification, updateStreak } = useGamificationStore();

  useEffect(() => {
    loadCourseContent();
    if (profile) {
      loadUserProgress(profile.id);
      loadGamification(profile.id);
      updateStreak(profile.id);
    }
  }, [profile]);

  const handleLessonPress = (lessonId: string) => {
    router.push(`/lesson/${lessonId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hola, {profile?.displayName || 'Estudiante'} 👋
          </Text>
          <Text style={styles.headerSubtitle}>{strings.tagline}</Text>
        </View>
        <View style={styles.headerStats}>
          <View style={styles.stat}>
            <Ionicons name="flame" size={20} color={colors.streak} />
            <Text style={styles.statText}>{gamification?.currentStreak || 0}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="heart" size={20} color={colors.hearts} />
            <Text style={styles.statText}>{gamification?.hearts ?? 5}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="flash" size={20} color={colors.xp} />
            <Text style={styles.statText}>{gamification?.totalXp || 0}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {units.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📚</Text>
            <Text style={styles.emptyTitle}>Bienvenido a MexIngles!</Text>
            <Text style={styles.emptyText}>
              Tu camino para aprender ingles americano comienza aqui.
              Las lecciones se cargaran pronto.
            </Text>

            {/* Demo lesson for testing */}
            <TouchableOpacity
              style={styles.demoBtn}
              onPress={() => router.push('/lesson/demo')}
            >
              <Ionicons name="play-circle" size={24} color={colors.textLight} />
              <Text style={styles.demoBtnText}>Probar leccion demo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          units.map(unit => {
            const unitLessons = lessons
              .filter(l => l.unitId === unit.id)
              .sort((a, b) => a.sortOrder - b.sortOrder);

            const completedCount = unitLessons.filter(
              l => lessonProgress[l.id]?.status === 'completed'
            ).length;

            return (
              <View key={unit.id} style={styles.unitSection}>
                <UnitCard
                  title={unit.titleEs}
                  icon={unit.icon}
                  description={unit.descriptionEs}
                  lessonsCompleted={completedCount}
                  totalLessons={unit.totalLessons}
                />
                <View style={styles.lessonNodes}>
                  {unitLessons.map((lesson, index) => {
                    const progress = lessonProgress[lesson.id];
                    return (
                      <LessonNode
                        key={lesson.id}
                        title={lesson.titleEs}
                        status={progress?.status || (index === 0 ? 'available' : 'locked')}
                        stars={progress?.stars || 0}
                        onPress={() => handleLessonPress(lesson.id)}
                        index={index}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })
        )}
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
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textLight,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  headerStats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    color: colors.textLight,
    fontWeight: '700',
    fontSize: fontSize.md,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  unitSection: {
    marginBottom: spacing.xl,
  },
  lessonNodes: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  demoBtnText: {
    color: colors.textLight,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
