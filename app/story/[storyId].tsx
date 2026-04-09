import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { useAudio } from '../../src/hooks/useAudio';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { strings } from '../../src/constants/i18n';

// Demo story content
const DEMO_STORY = {
  title: 'En la Cafeteria',
  segments: [
    {
      speaker: null,
      textEn: 'Maria walks into a coffee shop in New York City.',
      textEs: 'Maria entra a una cafeteria en la Ciudad de Nueva York.',
      highlights: { 'walks into': 'entra a', 'coffee shop': 'cafeteria' },
    },
    {
      speaker: 'Barista',
      textEn: 'Hi there! Welcome! What can I get for you?',
      textEs: 'Hola! Bienvenida! Que te puedo servir?',
      highlights: { 'What can I get for you': 'Que te puedo servir' },
    },
    {
      speaker: 'Maria',
      textEn: 'Hi! Can I have a medium coffee with milk, please?',
      textEs: 'Hola! Me puede dar un cafe mediano con leche, por favor?',
      highlights: { 'medium coffee': 'cafe mediano', 'with milk': 'con leche' },
    },
    {
      speaker: 'Barista',
      textEn: 'Sure thing! Would you like anything else? We have fresh pastries today.',
      textEs: 'Claro que si! Desea algo mas? Tenemos pan dulce fresco hoy.',
      highlights: { 'anything else': 'algo mas', 'fresh pastries': 'pan dulce fresco' },
    },
    {
      speaker: 'Maria',
      textEn: 'Yes, I\'ll take a chocolate muffin, please.',
      textEs: 'Si, quiero un muffin de chocolate, por favor.',
      highlights: { 'I\'ll take': 'quiero' },
    },
    {
      speaker: 'Barista',
      textEn: 'That will be $6.50. Cash or card?',
      textEs: 'Son $6.50. Efectivo o tarjeta?',
      highlights: { 'Cash or card': 'Efectivo o tarjeta' },
    },
    {
      speaker: 'Maria',
      textEn: 'Card, please. Thank you so much!',
      textEs: 'Tarjeta, por favor. Muchas gracias!',
      highlights: { 'Thank you so much': 'Muchas gracias' },
    },
    {
      speaker: 'Barista',
      textEn: 'You\'re welcome! Have a great day!',
      textEs: 'De nada! Que tenga un buen dia!',
      highlights: { 'Have a great day': 'Que tenga un buen dia' },
    },
  ],
};

export default function StoryScreen() {
  const { storyId } = useLocalSearchParams();
  const router = useRouter();
  const { speakEnglish } = useAudio();
  const [currentSegment, setCurrentSegment] = useState(0);
  const [showTranslation, setShowTranslation] = useState<Record<number, boolean>>({});
  const [selectedWord, setSelectedWord] = useState<{ word: string; translation: string } | null>(null);

  const story = DEMO_STORY;
  const isComplete = currentSegment >= story.segments.length;

  const handleNext = () => {
    if (currentSegment < story.segments.length) {
      setCurrentSegment(currentSegment + 1);
    }
  };

  const toggleTranslation = (index: number) => {
    setShowTranslation(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{story.title}</Text>
        <View style={{ width: 28 }} />
      </View>

      {isComplete ? (
        <View style={styles.complete}>
          <Text style={styles.completeEmoji}>📖</Text>
          <Text style={styles.completeTitle}>{strings.storyComplete}</Text>
          <Text style={styles.completeXp}>+15 XP</Text>
          <Button title={strings.continueBtn} onPress={() => router.back()} size="lg" />
        </View>
      ) : (
        <>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {story.segments.slice(0, currentSegment + 1).map((segment, index) => (
              <View key={index} style={styles.segment}>
                {segment.speaker && (
                  <Text style={styles.speaker}>{segment.speaker}</Text>
                )}
                <TouchableOpacity
                  onPress={() => speakEnglish(segment.textEn)}
                  style={styles.textBubble}
                >
                  <Text style={styles.englishText}>{segment.textEn}</Text>
                  <Ionicons name="volume-medium" size={18} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => toggleTranslation(index)}>
                  {showTranslation[index] ? (
                    <Text style={styles.spanishText}>{segment.textEs}</Text>
                  ) : (
                    <Text style={styles.tapTranslate}>{strings.tapWordToTranslate}</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
            <View style={{ height: 100 }} />
          </ScrollView>

          <View style={styles.bottomBar}>
            <Button
              title={currentSegment < story.segments.length - 1 ? strings.continueBtn : 'Terminar historia'}
              onPress={handleNext}
              size="lg"
            />
          </View>
        </>
      )}

      {selectedWord && (
        <View style={styles.wordPopup}>
          <Text style={styles.wordEn}>{selectedWord.word}</Text>
          <Text style={styles.wordEs}>{selectedWord.translation}</Text>
          <TouchableOpacity onPress={() => setSelectedWord(null)}>
            <Ionicons name="close-circle" size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  content: { flex: 1, padding: spacing.md },
  segment: { marginBottom: spacing.lg },
  speaker: {
    fontSize: fontSize.sm, fontWeight: '700', color: colors.primary,
    marginBottom: spacing.xs, textTransform: 'uppercase',
  },
  textBubble: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3,
    shadowRadius: 2, elevation: 1,
  },
  englishText: { flex: 1, fontSize: fontSize.md, color: colors.text, lineHeight: 24 },
  spanishText: {
    fontSize: fontSize.sm, color: colors.textSecondary, fontStyle: 'italic',
    marginTop: spacing.xs, paddingHorizontal: spacing.sm,
  },
  tapTranslate: {
    fontSize: fontSize.xs, color: colors.primary, marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  bottomBar: { padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  complete: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  completeEmoji: { fontSize: 64, marginBottom: spacing.md },
  completeTitle: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  completeXp: { fontSize: fontSize.xl, fontWeight: '700', color: colors.xp, marginBottom: spacing.xl },
  wordPopup: {
    position: 'absolute', bottom: 100, left: spacing.lg, right: spacing.lg,
    backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.lg,
    flexDirection: 'row', alignItems: 'center', gap: spacing.md, elevation: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  wordEn: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  wordEs: { flex: 1, fontSize: fontSize.md, color: colors.textSecondary },
});
