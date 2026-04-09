import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui/Card';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { strings } from '../../src/constants/i18n';

const DEMO_STORIES = [
  {
    id: 'story-coffee',
    titleEs: 'En la Cafeteria',
    titleEn: 'At the Coffee Shop',
    level: 'Principiante',
    minutes: 4,
    emoji: '☕',
    xp: 15,
  },
  {
    id: 'story-grocery',
    titleEs: 'En el Supermercado',
    titleEn: 'At the Grocery Store',
    level: 'Principiante',
    minutes: 5,
    emoji: '🛒',
    xp: 15,
  },
  {
    id: 'story-interview',
    titleEs: 'La Entrevista de Trabajo',
    titleEn: 'The Job Interview',
    level: 'Intermedio',
    minutes: 7,
    emoji: '💼',
    xp: 20,
  },
  {
    id: 'story-doctor',
    titleEs: 'En el Doctor',
    titleEn: 'At the Doctor',
    level: 'Intermedio',
    minutes: 6,
    emoji: '🏥',
    xp: 20,
  },
];

export default function StoriesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.storiesTitle}</Text>
        <Text style={styles.subtitle}>Aprende ingles a traves de historias interactivas</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Principiante</Text>
        {DEMO_STORIES.filter(s => s.level === 'Principiante').map(story => (
          <Card key={story.id} style={styles.storyCard} onPress={() => router.push(`/story/${story.id}`)}>
            <View style={styles.storyRow}>
              <Text style={styles.storyEmoji}>{story.emoji}</Text>
              <View style={styles.storyText}>
                <Text style={styles.storyTitle}>{story.titleEs}</Text>
                <Text style={styles.storySubtitle}>{story.titleEn}</Text>
                <View style={styles.storyMeta}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaText}>{story.minutes} min</Text>
                  <Ionicons name="flash" size={14} color={colors.xp} />
                  <Text style={styles.metaText}>{story.xp} XP</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
            </View>
          </Card>
        ))}

        <Text style={styles.sectionTitle}>Intermedio</Text>
        {DEMO_STORIES.filter(s => s.level === 'Intermedio').map(story => (
          <Card key={story.id} style={styles.storyCard} onPress={() => router.push(`/story/${story.id}`)}>
            <View style={styles.storyRow}>
              <Text style={styles.storyEmoji}>{story.emoji}</Text>
              <View style={styles.storyText}>
                <Text style={styles.storyTitle}>{story.titleEs}</Text>
                <Text style={styles.storySubtitle}>{story.titleEn}</Text>
                <View style={styles.storyMeta}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.metaText}>{story.minutes} min</Text>
                  <Ionicons name="flash" size={14} color={colors.xp} />
                  <Text style={styles.metaText}>{story.xp} XP</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
            </View>
          </Card>
        ))}
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
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  storyCard: {
    marginBottom: spacing.sm,
  },
  storyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  storyEmoji: {
    fontSize: 36,
  },
  storyText: {
    flex: 1,
  },
  storyTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  storySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  storyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
});
