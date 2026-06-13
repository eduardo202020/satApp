import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useVoiceTranscription } from './hooks/useVoiceTranscription';

export default function VoiceAssistantScreen() {
  const voice = useVoiceTranscription();
  const visibleTranscript = voice.finalTranscript || voice.transcript;

  return (
    <ScreenShell
      eyebrow="Voz"
      title="Consulta por voz"
      description="Habla en lenguaje natural y convertimos tu consulta en texto para procesarla."
      compact
    >
      <View style={styles.panel}>
        <View style={styles.micHalo}>
          <MaterialCommunityIcons
            name={voice.isListening ? 'waveform' : 'microphone-outline'}
            size={42}
            color={colors.cream}
          />
        </View>
        <Text style={styles.status}>
          {voice.isListening ? 'Escuchando tu consulta...' : 'Listo para escuchar'}
        </Text>
        <Text style={styles.helper}>
          Prueba: "Tengo la papeleta G11 y quiero saber si tengo descuento".
        </Text>

        <Pressable
          disabled={!voice.isAvailable}
          onPress={voice.isListening ? voice.stopListening : voice.startListening}
          style={[
            styles.primaryButton,
            voice.isListening && styles.stopButton,
            !voice.isAvailable && styles.disabledButton,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            {voice.isListening ? 'Detener escucha' : 'Empezar a hablar'}
          </Text>
        </Pressable>
      </View>

      {voice.errorMessage ? (
        <View style={styles.errorCard}>
          <MaterialCommunityIcons name="alert-circle-outline" size={22} color={colors.red} />
          <Text style={styles.errorText}>{voice.errorMessage}</Text>
        </View>
      ) : null}

      <View style={styles.transcriptCard}>
        <Text style={styles.cardLabel}>Transcripcion</Text>
        <Text style={[styles.transcriptText, !visibleTranscript && styles.placeholder]}>
          {visibleTranscript || 'El texto reconocido aparecera aqui.'}
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

        <Pressable onPress={voice.resetTranscript} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpiar transcripcion</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: 10,
    marginTop: 16,
    padding: 22,
  },
  micHalo: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 42,
    borderWidth: 1,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  status: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 16,
    textAlign: 'center',
  },
  helper: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 8,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  stopButton: {
    backgroundColor: colors.red,
  },
  disabledButton: {
    opacity: 0.48,
  },
  primaryButtonText: {
    color: colors.cream,
    fontSize: 14,
    fontWeight: '900',
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
