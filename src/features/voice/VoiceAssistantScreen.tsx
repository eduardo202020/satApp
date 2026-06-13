import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useVoiceTranscription } from './hooks/useVoiceTranscription';

export default function VoiceAssistantScreen() {
  const voice = useVoiceTranscription();
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pendingSend, setPendingSend] = useState(false);
  const visibleTranscript = voice.finalTranscript || voice.transcript;
  const hasTranscript = Boolean(visibleTranscript);

  useEffect(() => {
    if (pendingSend && hasTranscript) {
      setIsSubmitted(true);
      setIsPaused(false);
      setPendingSend(false);
    }
  }, [hasTranscript, pendingSend]);

  function startVoiceNote() {
    setIsPaused(false);
    setIsSubmitted(false);
    setPendingSend(false);
    voice.startListening();
  }

  function resumeVoiceNote() {
    setIsPaused(false);
    setIsSubmitted(false);
    setPendingSend(false);
    voice.startListening({ reset: false });
  }

  function pauseVoiceNote() {
    voice.stopListening();
    setIsPaused(true);
  }

  function cancelVoiceNote() {
    setIsPaused(false);
    setIsSubmitted(false);
    setPendingSend(false);
    voice.cancelListening();
  }

  function sendVoiceNote() {
    if (voice.isListening) {
      voice.stopListening();
    }

    setIsPaused(false);

    if (hasTranscript) {
      setIsSubmitted(true);
      return;
    }

    setPendingSend(true);
  }

  return (
    <ScreenShell
      eyebrow="Voz"
      title="Consulta por voz"
      description="Habla en lenguaje natural y convertimos tu consulta en texto para procesarla."
      compact
    >
      <View style={styles.chatPanel}>
        <View style={styles.chatBubble}>
          <View style={styles.chatIcon}>
            <MaterialCommunityIcons name="microphone-outline" size={22} color={colors.blue} />
          </View>
          <View style={styles.chatCopy}>
            <Text style={styles.chatTitle}>Consulta como nota de voz</Text>
            <Text style={styles.chatText}>
              Graba, pausa, cancela o envia tu consulta con una interaccion familiar.
            </Text>
          </View>
        </View>

        {voice.isListening ? (
          <VoiceRecordingComposer
            elapsedSeconds={voice.elapsedSeconds}
            onCancel={cancelVoiceNote}
            onPause={pauseVoiceNote}
            onSend={sendVoiceNote}
            volumeLevel={voice.volumeLevel}
          />
        ) : isPaused ? (
          <VoicePausedComposer
            elapsedSeconds={voice.elapsedSeconds}
            onCancel={cancelVoiceNote}
            onResume={resumeVoiceNote}
            onSend={sendVoiceNote}
          />
        ) : (
          <VoiceIdleComposer
            disabled={!voice.isAvailable}
            hasTranscript={hasTranscript}
            isSubmitted={isSubmitted}
            onStart={startVoiceNote}
            onSend={sendVoiceNote}
          />
        )}
      </View>

      <View style={styles.hintCard}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={21} color={colors.amber} />
        <View style={styles.hintCopy}>
          <Text style={styles.hintTitle}>Prueba una frase natural</Text>
          <Text style={styles.chatText}>
            "Tengo la papeleta G11 y quiero saber si tengo descuento".
          </Text>
        </View>
      </View>

      {voice.errorMessage ? (
        <View style={styles.errorCard}>
          <MaterialCommunityIcons name="alert-circle-outline" size={22} color={colors.red} />
          <Text style={styles.errorText}>{voice.errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.transcriptCard}>
        <Text style={styles.cardLabel}>
          {isSubmitted ? 'Consulta enviada' : 'Transcripcion'}
        </Text>
        <Text style={[styles.transcriptText, !visibleTranscript && styles.placeholder]}>
          {visibleTranscript || 'El texto reconocido aparecera aqui mientras hablas.'}
        </Text>
      </View>

      <View style={styles.processingCard}>
        <Text style={styles.cardLabel}>Procesamiento local</Text>
        {voice.intents.length > 0 ? (
          <View style={styles.intentList}>
            {voice.intents.map((intent) => (
              <View style={styles.intentRow} key={`${intent.label}-${intent.value}`}>
                <Text style={styles.intentLabel}>{intent.label}</Text>
                <Text style={styles.intentValue}>{intent.value}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.processingText}>
            Cuando detectemos placa, codigo o intencion, lo mostraremos aqui.
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          disabled={!visibleTranscript}
          onPress={() => navigateTo('/caso/G11')}
          style={[styles.secondaryButton, !visibleTranscript && styles.disabledOutline]}
        >
          <MaterialCommunityIcons name="arrow-right-circle-outline" size={20} color={colors.blue} />
          <Text style={styles.secondaryButtonText}>Procesar como caso ficticio</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setIsPaused(false);
            setIsSubmitted(false);
            setPendingSend(false);
            voice.resetTranscript();
          }}
          style={styles.clearButton}
        >
          <Text style={styles.clearButtonText}>Limpiar transcripcion</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

function VoiceIdleComposer({
  disabled,
  hasTranscript,
  isSubmitted,
  onSend,
  onStart,
}: {
  disabled: boolean;
  hasTranscript: boolean;
  isSubmitted: boolean;
  onSend: () => void;
  onStart: () => void;
}) {
  return (
    <View style={styles.idleComposer}>
      <View style={styles.messageInput}>
        <MaterialCommunityIcons name="message-text-outline" size={20} color={colors.muted} />
        <Text style={styles.messagePlaceholder}>
          {isSubmitted ? 'Consulta enviada' : 'Toca el microfono para hablar'}
        </Text>
      </View>
      {hasTranscript && !isSubmitted ? (
        <Pressable onPress={onSend} style={styles.smallSendButton}>
          <MaterialCommunityIcons name="send" size={18} color={colors.cream} />
        </Pressable>
      ) : (
        <Pressable
          disabled={disabled}
          onPress={onStart}
          style={[styles.micButton, disabled && styles.disabledButton]}
        >
          <MaterialCommunityIcons name="microphone" size={26} color={colors.cream} />
        </Pressable>
      )}
    </View>
  );
}

function VoiceRecordingComposer({
  elapsedSeconds,
  onCancel,
  onPause,
  onSend,
  volumeLevel,
}: {
  elapsedSeconds: number;
  onCancel: () => void;
  onPause: () => void;
  onSend: () => void;
  volumeLevel: number;
}) {
  return (
    <View style={styles.recordingComposer}>
      <View style={styles.recordingTop}>
        <Text style={styles.timerText}>{formatDuration(elapsedSeconds)}</Text>
        <Waveform volumeLevel={volumeLevel} />
      </View>
      <Text style={styles.recordingStatus}>Escuchando...</Text>
      <View style={styles.recordingControls}>
        <Pressable onPress={onCancel} style={styles.trashButton}>
          <MaterialCommunityIcons name="trash-can-outline" size={28} color={colors.red} />
        </Pressable>
        <Pressable onPress={onPause} style={styles.pauseButton}>
          <MaterialCommunityIcons name="pause" size={28} color={colors.red} />
        </Pressable>
        <Pressable onPress={onSend} style={styles.sendButton}>
          <MaterialCommunityIcons name="send" size={34} color={colors.cream} />
        </Pressable>
      </View>
    </View>
  );
}

function VoicePausedComposer({
  elapsedSeconds,
  onCancel,
  onResume,
  onSend,
}: {
  elapsedSeconds: number;
  onCancel: () => void;
  onResume: () => void;
  onSend: () => void;
}) {
  return (
    <View style={styles.recordingComposer}>
      <View style={styles.recordingTop}>
        <Text style={styles.timerText}>{formatDuration(elapsedSeconds)}</Text>
        <Waveform paused volumeLevel={0} />
      </View>
      <Text style={styles.recordingStatus}>Grabacion pausada</Text>
      <View style={styles.recordingControls}>
        <Pressable onPress={onCancel} style={styles.trashButton}>
          <MaterialCommunityIcons name="trash-can-outline" size={28} color={colors.red} />
        </Pressable>
        <Pressable onPress={onResume} style={styles.resumeButton}>
          <MaterialCommunityIcons name="play" size={30} color={colors.blue} />
        </Pressable>
        <Pressable onPress={onSend} style={styles.sendButton}>
          <MaterialCommunityIcons name="send" size={34} color={colors.cream} />
        </Pressable>
      </View>
    </View>
  );
}

function Waveform({
  paused = false,
  volumeLevel,
}: {
  paused?: boolean;
  volumeLevel: number;
}) {
  const pattern = [0.05, 0.1, 0.26, 0.74, 1, 0.86, 0.68, 0.48, 0.34, 0.24, 0.18, 0.14, 0.11, 0.1, 0.09, 0.1, 0.11, 0.13, 0.16, 0.19, 0.22];
  const level = paused || volumeLevel < 0.04 ? 0 : volumeLevel;

  return (
    <View style={styles.waveform}>
      {pattern.map((weight, index) => {
        const height = 4 + Math.round(level * weight * 50);

        return (
          <View
            key={`${weight}-${index}`}
            style={[
              styles.waveBar,
              paused && styles.waveBarPaused,
              {
                height,
                opacity: paused || level === 0 ? 0.42 : 0.52 + level * 0.42,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  chatPanel: {
    backgroundColor: colors.blueLight,
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 16,
    overflow: 'hidden',
    padding: 14,
  },
  chatBubble: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    padding: 14,
  },
  chatIcon: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  chatCopy: {
    flex: 1,
  },
  chatTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  chatText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 5,
  },
  hintCard: {
    alignItems: 'center',
    backgroundColor: colors.amberLight,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    padding: 14,
  },
  hintCopy: {
    flex: 1,
  },
  hintTitle: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  idleComposer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  messageInput: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 9,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  messagePlaceholder: {
    color: colors.muted,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  micButton: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  smallSendButton: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  disabledButton: {
    opacity: 0.48,
  },
  recordingComposer: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  recordingTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  timerText: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '800',
    minWidth: 58,
  },
  waveform: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'flex-end',
    minHeight: 58,
  },
  waveBar: {
    backgroundColor: colors.blue,
    borderRadius: 4,
    width: 5,
  },
  waveBarPaused: {
    backgroundColor: colors.muted,
  },
  recordingStatus: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  recordingControls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  trashButton: {
    alignItems: 'center',
    backgroundColor: colors.redLight,
    borderRadius: 38,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  pauseButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.red,
    borderRadius: 33,
    borderWidth: 4,
    height: 66,
    justifyContent: 'center',
    width: 66,
  },
  resumeButton: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderColor: colors.blue,
    borderRadius: 33,
    borderWidth: 3,
    height: 66,
    justifyContent: 'center',
    width: 66,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  errorCard: {
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    padding: 14,
  },
  errorText: {
    color: colors.red,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
  transcriptCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  cardLabel: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  transcriptText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 26,
    marginTop: 10,
  },
  placeholder: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  processingCard: {
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    marginTop: 14,
    padding: 16,
  },
  processingText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 8,
  },
  intentList: {
    gap: 8,
    marginTop: 10,
  },
  intentRow: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
  },
  intentLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  intentValue: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },
  actions: {
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    padding: 14,
  },
  disabledOutline: {
    opacity: 0.45,
  },
  secondaryButtonText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  clearButton: {
    alignItems: 'center',
    padding: 12,
  },
  clearButtonText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '900',
  },
});
