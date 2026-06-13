import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { submitCaseAction } from '../../shared/api/satApi';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';

const requirements = ['Copia de la papeleta o resolución', 'Documento de identidad', 'Evidencia o sustento'];

export default function CaseSubmissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [checked, setChecked] = useState<string[]>([]);
  const [attached, setAttached] = useState(false);
  const [statement, setStatement] = useState('No estoy de acuerdo con la papeleta G11 y solicito que se revise la evidencia ficticia adjunta.');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const ready = checked.length === requirements.length && attached && statement.trim().length >= 10;

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      const submission = await submitCaseAction(id, {
        action: 'presentar_descargo',
        userStatement: statement,
        checklist: checked,
        attachments: ['sustento-demo-g11.pdf'],
      });
      navigateTo(`/caso/${id}/constancia?submissionId=${submission.id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo registrar el trámite demo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenShell
      eyebrow="Actuar"
      title="Prepara tu descargo"
      description="Simularemos el registro de un descargo sin enviarlo a ningún sistema oficial."
      compact
    >
      <View style={styles.card}>
        <Text style={styles.label}>Checklist obligatorio</Text>
        {requirements.map((requirement) => {
          const done = checked.includes(requirement);
          return (
            <Pressable style={styles.row} key={requirement} onPress={() => setChecked(done ? checked.filter((value) => value !== requirement) : [...checked, requirement])}>
              <MaterialCommunityIcons name={done ? 'check-circle' : 'circle-outline'} size={24} color={done ? colors.green : colors.muted} />
              <Text style={styles.rowText}>{requirement}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Tu explicación</Text>
        <TextInput multiline value={statement} onChangeText={setStatement} style={styles.input} />
      </View>
      <Pressable style={[styles.attachment, attached && styles.attachmentReady]} onPress={() => setAttached(!attached)}>
        <MaterialCommunityIcons name={attached ? 'file-check-outline' : 'file-plus-outline'} size={28} color={attached ? colors.green : colors.blue} />
        <View style={styles.attachmentText}>
          <Text style={styles.rowText}>{attached ? 'sustento-demo-g11.pdf' : 'Adjuntar sustento demo'}</Text>
          <Text style={styles.hint}>Archivo ficticio para demostrar el flujo.</Text>
        </View>
      </Pressable>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.actions}>
        <PrimaryButton label={submitting ? 'Registrando...' : 'Registrar descargo demo'} disabled={!ready || submitting} onPress={submit} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderColor: colors.line, borderRadius: 8, borderWidth: 1, gap: 10, marginTop: 12, padding: 16 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  row: { alignItems: 'center', borderTopColor: colors.line, borderTopWidth: 1, flexDirection: 'row', gap: 10, minHeight: 50 },
  rowText: { color: colors.ink, flex: 1, fontSize: 14, fontWeight: '800' },
  input: { borderColor: colors.line, borderRadius: 8, borderWidth: 1, color: colors.ink, fontSize: 14, lineHeight: 20, minHeight: 120, padding: 12, textAlignVertical: 'top' },
  attachment: { alignItems: 'center', backgroundColor: colors.blueLight, borderRadius: 8, flexDirection: 'row', gap: 12, marginTop: 12, padding: 16 },
  attachmentReady: { backgroundColor: colors.greenLight },
  attachmentText: { flex: 1 },
  hint: { color: colors.muted, fontSize: 11, fontWeight: '700', marginTop: 4 },
  error: { color: colors.red, fontSize: 13, fontWeight: '800', marginTop: 12 },
  actions: { marginTop: 16 },
});
