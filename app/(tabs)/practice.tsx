import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui/Card';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { strings } from '../../src/constants/i18n';

export default function PracticeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>{strings.practiceTitle}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card} onPress={() => router.push('/review')}>
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="refresh" size={28} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{strings.reviewWords}</Text>
              <Text style={styles.cardSubtitle}>{strings.wordsToReview}: 0</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="warning" size={28} color={colors.accent} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{strings.recentMistakes}</Text>
              <Text style={styles.cardSubtitle}>Practica tus errores recientes</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="library" size={28} color="#1976D2" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{strings.vocabularyList}</Text>
              <Text style={styles.cardSubtitle}>Todas las palabras que has aprendido</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
          </View>
        </Card>

        <Card style={styles.card} onPress={() => router.push('/chat')}>
          <View style={styles.cardRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="chatbubbles" size={28} color="#7B1FA2" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{strings.chatTitle}</Text>
              <Text style={styles.cardSubtitle}>Practica con inteligencia artificial</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.textMuted} />
          </View>
        </Card>
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
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
