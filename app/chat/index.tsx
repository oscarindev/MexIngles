import React, { useState, useRef } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAudio } from '../../src/hooks/useAudio';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';
import { strings } from '../../src/constants/i18n';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  translation?: string;
  correction?: string;
}

const SCENARIOS = [
  { id: 'coffee', label: strings.chatCoffeeShop, emoji: '☕', prompt: 'You are a friendly barista at a coffee shop in the United States.' },
  { id: 'interview', label: strings.chatJobInterview, emoji: '💼', prompt: 'You are a hiring manager conducting a job interview in English.' },
  { id: 'restaurant', label: strings.chatRestaurant, emoji: '🍽️', prompt: 'You are a waiter at an American restaurant.' },
  { id: 'shopping', label: strings.chatShopping, emoji: '🛍️', prompt: 'You are a sales associate at a clothing store in America.' },
  { id: 'doctor', label: strings.chatDoctor, emoji: '🏥', prompt: 'You are a receptionist at a doctor\'s office.' },
];

export default function ChatScreen() {
  const router = useRouter();
  const { speakEnglish } = useAudio();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSelectScenario = (scenarioId: string) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    setSelectedScenario(scenarioId);
    const systemMessage: Message = {
      id: 'system-1',
      role: 'system',
      content: `Escenario: ${scenario.label}`,
    };
    const assistantMessage: Message = {
      id: 'assistant-1',
      role: 'assistant',
      content: getScenarioGreeting(scenarioId),
      translation: getScenarioGreetingEs(scenarioId),
    };
    setMessages([systemMessage, assistantMessage]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const response = generateSimpleResponse(input.trim(), selectedScenario || 'coffee');
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.en,
        translation: response.es,
        correction: response.correction,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  if (!selectedScenario) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{strings.chatTitle}</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.scenarioList}>
          <Text style={styles.scenarioPrompt}>{strings.chatScenarios}</Text>
          {SCENARIOS.map(scenario => (
            <TouchableOpacity
              key={scenario.id}
              style={styles.scenarioCard}
              onPress={() => handleSelectScenario(scenario.id)}
            >
              <Text style={styles.scenarioEmoji}>{scenario.emoji}</Text>
              <Text style={styles.scenarioLabel}>{scenario.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { setSelectedScenario(null); setMessages([]); }}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {SCENARIOS.find(s => s.id === selectedScenario)?.label}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages.filter(m => m.role !== 'system')}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
              <TouchableOpacity onPress={() => speakEnglish(item.content)}>
                <Text style={[styles.bubbleText, item.role === 'user' && styles.userBubbleText]}>
                  {item.content}
                </Text>
              </TouchableOpacity>
              {item.translation && (
                <Text style={styles.translationText}>{item.translation}</Text>
              )}
              {item.correction && (
                <View style={styles.correctionBox}>
                  <Ionicons name="bulb" size={14} color={colors.accent} />
                  <Text style={styles.correctionText}>{item.correction}</Text>
                </View>
              )}
            </View>
          )}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Escribiendo...</Text>
          </View>
        )}

        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder={strings.chatPlaceholder}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!input.trim()}
          >
            <Ionicons name="send" size={22} color={input.trim() ? colors.textLight : colors.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function getScenarioGreeting(id: string): string {
  const greetings: Record<string, string> = {
    coffee: "Hi there! Welcome to Joe's Coffee. What can I get for you today?",
    interview: "Hello! Thank you for coming in today. Please, have a seat. Can you tell me a little about yourself?",
    restaurant: "Good evening! Welcome to The Harvest Table. My name is Mike and I'll be your server tonight. Can I start you off with something to drink?",
    shopping: "Hi! Welcome to Fashion Street! Are you looking for anything in particular today?",
    doctor: "Good morning! Welcome to Downtown Medical. Do you have an appointment today?",
  };
  return greetings[id] || "Hello! How can I help you today?";
}

function getScenarioGreetingEs(id: string): string {
  const greetings: Record<string, string> = {
    coffee: "Hola! Bienvenido a Joe's Coffee. Que le puedo servir hoy?",
    interview: "Hola! Gracias por venir hoy. Por favor, tome asiento. Me puede contar un poco sobre usted?",
    restaurant: "Buenas noches! Bienvenido a The Harvest Table. Me llamo Mike y sere su mesero esta noche. Puedo empezar con algo de tomar?",
    shopping: "Hola! Bienvenido a Fashion Street! Busca algo en particular hoy?",
    doctor: "Buenos dias! Bienvenido a Downtown Medical. Tiene cita hoy?",
  };
  return greetings[id] || "Hola! Como puedo ayudarle hoy?";
}

function generateSimpleResponse(userInput: string, scenario: string): { en: string; es: string; correction?: string } {
  // Simple response generation - will be replaced with actual AI
  const lower = userInput.toLowerCase();

  if (scenario === 'coffee') {
    if (lower.includes('coffee') || lower.includes('latte') || lower.includes('cappuccino')) {
      return {
        en: "Great choice! What size would you like? We have small, medium, and large.",
        es: "Buena eleccion! Que tamano desea? Tenemos chico, mediano y grande.",
      };
    }
    return {
      en: "Sure! Anything else I can get for you?",
      es: "Claro! Algo mas que le pueda ofrecer?",
    };
  }

  return {
    en: "That's interesting! Can you tell me more about that?",
    es: "Que interesante! Me puede contar mas sobre eso?",
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  scenarioList: { flex: 1, padding: spacing.lg },
  scenarioPrompt: {
    fontSize: fontSize.xl, fontWeight: '700', color: colors.text, marginBottom: spacing.lg,
  },
  scenarioCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, padding: spacing.lg, borderRadius: borderRadius.lg,
    marginBottom: spacing.sm, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3, shadowRadius: 2, elevation: 1,
  },
  scenarioEmoji: { fontSize: 28 },
  scenarioLabel: { flex: 1, fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  messageList: { padding: spacing.md },
  bubble: {
    maxWidth: '80%', padding: spacing.md, borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end', backgroundColor: colors.primary,
  },
  assistantBubble: {
    alignSelf: 'flex-start', backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  bubbleText: { fontSize: fontSize.md, color: colors.text, lineHeight: 22 },
  userBubbleText: { color: colors.textLight },
  translationText: {
    fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  correctionBox: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginTop: spacing.xs, backgroundColor: '#FFF8E1', padding: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  correctionText: { fontSize: fontSize.xs, color: colors.accent, flex: 1 },
  typingIndicator: { paddingHorizontal: spacing.lg },
  typingText: { fontSize: fontSize.sm, color: colors.textMuted, fontStyle: 'italic' },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', padding: spacing.sm,
    borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm,
  },
  textInput: {
    flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.md, fontSize: fontSize.md, color: colors.text,
    maxHeight: 100, borderWidth: 1, borderColor: colors.border,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: colors.surfaceElevated },
});
