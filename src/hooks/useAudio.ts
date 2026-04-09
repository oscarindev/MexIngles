import { useCallback } from 'react';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../stores/useAuthStore';

export function useAudio() {
  const profile = useAuthStore(s => s.profile);
  const soundEnabled = profile?.soundEnabled !== false;
  const hapticsEnabled = profile?.hapticsEnabled !== false;

  const speak = useCallback(
    (text: string, language: string = 'en-US') => {
      if (!soundEnabled) return;
      Speech.stop();
      Speech.speak(text, {
        language,
        rate: 0.9,
        pitch: 1.0,
      });
    },
    [soundEnabled]
  );

  const speakEnglish = useCallback(
    (text: string) => speak(text, 'en-US'),
    [speak]
  );

  const speakSpanish = useCallback(
    (text: string) => speak(text, 'es-MX'),
    [speak]
  );

  const stopSpeaking = useCallback(() => {
    Speech.stop();
  }, []);

  const hapticSuccess = useCallback(() => {
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [hapticsEnabled]);

  const hapticError = useCallback(() => {
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [hapticsEnabled]);

  const hapticLight = useCallback(() => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [hapticsEnabled]);

  return {
    speak,
    speakEnglish,
    speakSpanish,
    stopSpeaking,
    hapticSuccess,
    hapticError,
    hapticLight,
  };
}
