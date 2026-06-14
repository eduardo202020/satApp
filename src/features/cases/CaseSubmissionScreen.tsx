import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { submitCaseAction } from '../../shared/api/satApi';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from './hooks/useCases';

const requirements = ['Copia de la papeleta o resolución', 'Documento de identidad', 'Evidencia o sustento'];

export default function CaseSubmissionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const [checked, setChecked] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<SupportFile[]>([]);
  const [attachmentError, setAttachmentError] = useState('');
  const [statement, setStatement] = useState('No estoy de acuerdo con la papeleta y solicito que se revise la evidencia adjunta.');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const attached = attachments.length > 0;
  const ready = checked.length === requirements.length && attached && statement.trim().length >= 10;

  async function pickSupportFiles() {
    setAttachmentError('');

    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: true,
        type: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });

      if (result.canceled) {
        return;
      }

      setAttachments((current) => [
        ...current,
        ...result.assets.map((asset) => ({
          mimeType: asset.mimeType,
          name: asset.name,
          size: asset.size,
          uri: asset.uri,
        })),
      ]);
    } catch {
      setAttachmentError('No pudimos abrir el selector de archivos. Intentalo nuevamente.');
    }
  }

  function removeAttachment(uri: string) {
    setAttachments((current) => current.filter((attachment) => attachment.uri !== uri));
  }

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      const submission = await submitCaseAction(item.id, {
        action: 'presentar_descargo',
        userStatement: statement,
        checklist: checked,
        attachments: attachments.map((attachment) => attachment.name),
      });
      navigateTo(`/caso/${item.id}/constancia?submissionId=${submission.id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'No se pudo registrar el tramite.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenShell
      eyebrow="Actuar"
      title="Prepara tu descargo"
      description="Completa los datos necesarios para registrar y seguir tu solicitud."
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
      <Pressable style={[styles.attachment, attached && styles.attachmentReady]} onPress={pickSupportFiles}>
        <MaterialCommunityIcons name={attached ? 'file-check-outline' : 'file-plus-outline'} size={28} color={attached ? colors.green : colors.blue} />
        <View style={styles.attachmentText}>
          <Text style={styles.rowText}>{attached ? 'Agregar otro sustento' : 'Adjuntar sustento'}</Text>
          <Text style={styles.hint}>Puedes subir fotos, PDF o documentos que respalden tu caso.</Text>
        </View>
      </Pressable>
      {!!attachmentError && <Text style={styles.error}>{attachmentError}</Text>}
      {attachments.length > 0 && (
        <View style={styles.filesCard}>
          <Text style={styles.label}>Archivos adjuntos</Text>
          {attachments.map((attachment) => (
            <View style={styles.fileRow} key={attachment.uri}>
              <MaterialCommunityIcons name={fileIconForMime(attachment.mimeType)} size={22} color={colors.blue} />
              <View style={styles.fileText}>
                <Text style={styles.fileName}>{attachment.name}</Text>
                <Text style={styles.fileMeta}>{formatFileSize(attachment.size)}</Text>
              </View>
              <Pressable accessibilityRole="button" onPress={() => removeAttachment(attachment.uri)} style={styles.removeButton}>
                <MaterialCommunityIcons name="close" size={18} color={colors.muted} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.actions}>
        <PrimaryButton label={submitting ? 'Registrando...' : 'Registrar descargo'} disabled={!ready || submitting} onPress={submit} />
      </View>
    </ScreenShell>
  );
}

type SupportFile = {
  mimeType?: string;
  name: string;
  size?: number;
  uri: string;
};

function fileIconForMime(mimeType?: string) {
  if (mimeType?.startsWith('image/')) return 'image-outline';
  if (mimeType === 'application/pdf') return 'file-pdf-box';
  return 'file-document-outline';
}

function formatFileSize(size?: number) {
  if (!size) return 'Tamaño no disponible';
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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
  filesCard: { backgroundColor: colors.card, borderColor: colors.line, borderRadius: 8, borderWidth: 1, gap: 10, marginTop: 12, padding: 16 },
  fileMeta: { color: colors.muted, fontSize: 11, fontWeight: '700', marginTop: 2 },
  fileName: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  fileRow: { alignItems: 'center', borderTopColor: colors.line, borderTopWidth: 1, flexDirection: 'row', gap: 10, minHeight: 52, paddingTop: 8 },
  fileText: { flex: 1 },
  hint: { color: colors.muted, fontSize: 11, fontWeight: '700', marginTop: 4 },
  removeButton: { alignItems: 'center', height: 36, justifyContent: 'center', width: 36 },
  error: { color: colors.red, fontSize: 13, fontWeight: '800', marginTop: 12 },
  actions: { marginTop: 16 },
});
