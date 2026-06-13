import { useEffect, useState } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

type VoiceIntent = {
  label: string;
  value: string;
};

function getRecognitionAvailable() {
  try {
    return ExpoSpeechRecognitionModule.isRecognitionAvailable();
  } catch {
    return false;
  }
}

function parseVoiceIntent(text: string): VoiceIntent[] {
  const normalized = text.toUpperCase();
  const intents: VoiceIntent[] = [];
  const plateMatch = normalized.match(/\b[A-Z]{3}[-\s]?\d{3}\b/);
  const caseMatch = normalized.match(/\bG\d{2}\b/);

  if (plateMatch) {
    intents.push({ label: 'Placa detectada', value: plateMatch[0].replace(/\s/g, '-') });
  }

  if (caseMatch) {
    intents.push({ label: 'Papeleta detectada', value: caseMatch[0] });
  }

  if (normalized.includes('DESCUENTO')) {
    intents.push({ label: 'Intencion', value: 'Consultar descuento' });
  }

  if (normalized.includes('RIESGO') || normalized.includes('CAPTURA')) {
    intents.push({ label: 'Intencion', value: 'Revisar riesgo' });
  }

  if (normalized.includes('PAGAR') || normalized.includes('PAGO')) {
    intents.push({ label: 'Intencion', value: 'Ver opciones de pago' });
  }

  return intents;
}

export function useVoiceTranscription() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const intents = parseVoiceIntent(finalTranscript || transcript);

  useEffect(() => {
    setIsAvailable(getRecognitionAvailable());
  }, []);

  useEffect(() => {
    if (!isListening) {
      return undefined;
    }

    const timer = setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isListening]);

  useSpeechRecognitionEvent('start', () => {
    setErrorMessage(null);
    setIsListening(true);
    setVolumeLevel(0);
  });

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
    setVolumeLevel(0);
  });

  useSpeechRecognitionEvent('soundstart', () => {
    setVolumeLevel((level) => Math.max(level, 0.24));
  });

  useSpeechRecognitionEvent('soundend', () => {
    setVolumeLevel(0);
  });

  useSpeechRecognitionEvent('volumechange', (event) => {
    const normalized = Math.max(0, Math.min(1, event.value / 10));
    setVolumeLevel((level) => level * 0.35 + normalized * 0.65);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results
      .map((result) => result.transcript)
      .filter(Boolean)
      .join(' ')
      .trim();

    if (!text) {
      return;
    }

    setTranscript(text);

    if (event.isFinal) {
      setFinalTranscript(text);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    setIsListening(false);
    setVolumeLevel(0);
    setErrorMessage(event.message || `Error de reconocimiento: ${event.error}`);
  });

  async function startListening({ reset = true } = {}) {
    const available = getRecognitionAvailable();
    setIsAvailable(available);

    if (!available) {
      setErrorMessage('El reconocimiento de voz no esta disponible en este dispositivo.');
      return;
    }

    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();

    if (!permission.granted) {
      setErrorMessage('Necesitamos permiso de microfono y reconocimiento de voz.');
      return;
    }

    if (reset) {
      setElapsedSeconds(0);
      setTranscript('');
      setFinalTranscript('');
    }

    setErrorMessage(null);

    ExpoSpeechRecognitionModule.start({
      lang: 'es-PE',
      interimResults: true,
      continuous: false,
      maxAlternatives: 1,
      volumeChangeEventOptions: {
        enabled: true,
        intervalMillis: 80,
      },
    });
  }

  function stopListening() {
    ExpoSpeechRecognitionModule.stop();
  }

  function cancelListening() {
    ExpoSpeechRecognitionModule.abort();
    setElapsedSeconds(0);
    setIsListening(false);
    setVolumeLevel(0);
    setTranscript('');
    setFinalTranscript('');
    setErrorMessage(null);
  }

  function resetTranscript() {
    setElapsedSeconds(0);
    setVolumeLevel(0);
    setTranscript('');
    setFinalTranscript('');
    setErrorMessage(null);
  }

  return {
    cancelListening,
    elapsedSeconds,
    errorMessage,
    finalTranscript,
    intents,
    isAvailable,
    isListening,
    resetTranscript,
    startListening,
    stopListening,
    transcript,
    volumeLevel,
  };
}
