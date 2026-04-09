import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/stores/useAuthStore';
import { colors } from '../src/constants/theme';

export default function RootLayout() {
  const initialize = useAuthStore(s => s.initialize);

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="lesson/[lessonId]"
          options={{ gestureEnabled: false, animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="review/index" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="story/[storyId]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="chat/index" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </>
  );
}
