import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { fetchSubmission } from '../../shared/api/satApi';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { StatusPill } from '../../shared/components/StatusPill';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import type { SubmissionRecord } from '../../shared/types/ui';

export default function SubmissionReceiptScreen() {
  const { id, submissionId } = useLocalSearchParams<{ id: string; submissionId: string }>();
  const [submission, setSubmission] = useState<SubmissionRecord | null>(null);

  useEffect(() => {
    if (submissionId) fetchSubmission(submissionId).then(setSubmission).catch(() => undefined);
  }, [submissionId]);

  return (
    <ScreenShell
      eyebrow="Constancia"
      title="Descargo registrado"
      description="Se genero una constancia y se actualizo el seguimiento del caso."
      compact
    >
      <View style={styles.success}>
        <MaterialCommunityIcons name="check-decagram" size={56} color={colors.green} />
        <StatusPill label="Registro exitoso" tone="safe" />
        <Text style={styles.receipt}>{submission?.receiptNumber ?? 'Generando constancia...'}</Text>
        <Text style={styles.body}>{submission?.summary ?? 'Consultando el registro.'}</Text>
      </View>
      {!!submission && (
        <View style={styles.card}>
          <Detail label="Acción" value="Presentar descargo" />
          <Detail label="Estado" value={submission.status} />
          <Detail label="Adjunto" value={submission.attachments.join(', ')} />
          <Detail label="Fecha" value={new Date(submission.createdAt).toLocaleString('es-PE')} />
        </View>
      )}
      <View style={styles.actions}>
        <PrimaryButton label="Seguir mi caso" onPress={() => navigateTo(`/caso/${id}/seguimiento`)} />
        <PrimaryButton label="Ver alerta generada" variant="secondary" onPress={() => navigateTo('/alertas')} />
      </View>
    </ScreenShell>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.detail}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  success: { alignItems: 'center', backgroundColor: colors.greenLight, borderRadius: 8, gap: 10, marginTop: 16, padding: 24 },
  receipt: { color: colors.ink, fontSize: 24, fontWeight: '900' },
  body: { color: colors.muted, fontSize: 13, fontWeight: '700', lineHeight: 19, textAlign: 'center' },
  card: { backgroundColor: colors.card, borderColor: colors.line, borderRadius: 8, borderWidth: 1, marginTop: 12, padding: 16 },
  detail: { borderBottomColor: colors.line, borderBottomWidth: 1, gap: 4, paddingVertical: 10 },
  label: { color: colors.muted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  value: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  actions: { gap: 10, marginTop: 16 },
});
