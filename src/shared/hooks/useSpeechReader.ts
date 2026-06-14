import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';

export function useSpeechReader() {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  async function toggleSpeech(text: string) {
    if (speaking) {
      await Speech.stop();
      setSpeaking(false);
      return;
    }

    setSpeaking(true);
    Speech.speak(text, {
      language: 'es-PE',
      pitch: 1,
      rate: 0.9,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  }

  return {
    speaking,
    toggleSpeech,
  };
}
