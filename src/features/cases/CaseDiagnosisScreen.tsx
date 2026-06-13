import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { fetchClearDiagnosis } from '../../shared/api/satApi';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { StatusPill } from '../../shared/components/StatusPill';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import type { ClearDiagnosis } from '../../shared/types/ui';
import { useCases } from './hooks/useCases';

export default function CaseDiagnosisScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const [diagnosis, setDiagnosis] = useState<ClearDiagnosis | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    fetchClearDiagnosis(id, 'Quiero entender la papeleta G11 y decidir si presentar descargo.')
      .then(setDiagnosis)
      .catch((reason: Error) => setError(reason.message));
  }, [id]);

  return (
    <ScreenShell
      eyebrow="Comprender"
      title="Diagnóstico claro"
      description="Traducimos la etapa y sus opciones a lenguaje ciudadano, conservando fuentes y advertencias."
      compact
    >
      <View style={styles.card}>
        <Text style={styles.label}>Estado actual</Text>
        <Text style={styles.title}>{diagnosis?.currentStatus ?? item.stage}</Text>
        <StatusPill label={`Riesgo ${item.risk}`} tone={item.risk === 'Alto' ? 'risk' : 'attention'} />
      </View>
      <Section title="Qué significa" lines={[diagnosis?.plainExplanation ?? item.summary ?? item.nextStep]} />
      <Section title="Plazo" lines={diagnosis?.deadlines ?? [item.dueDate]} tone="attention" />
      <Section title="Riesgos" lines={diagnosis?.risks ?? ['Verifica la información con el expediente oficial.']} />
      {!!diagnosis?.sources.length && <Section title="Fuentes consideradas" lines={diagnosis.sources} tone="info" />}
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.disclaimer}>{diagnosis?.disclaimer ?? 'Diagnóstico informativo. Verifica siempre el expediente y los canales oficiales del SAT.'}</Text>
      <View style={styles.actions}>
        <PrimaryButton label="Ver mis opciones" onPress={() => navigateTo(`/caso/${id}/opciones`)} />
      </View>
    </ScreenShell>
  );
}

function Section({ title, lines, tone }: { title: string; lines: string[]; tone?: 'attention' | 'info' }) {
  return (
    <View style={[styles.card, tone === 'attention' && styles.attention, tone === 'info' && styles.info]}>
      <Text style={styles.label}>{title}</Text>
      {lines.map((line) => <Text style={styles.body} key={line}>{line}</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderColor: colors.line, borderRadius: 8, borderWidth: 1, gap: 8, marginTop: 12, padding: 16 },
  attention: { backgroundColor: colors.amberLight },
  info: { backgroundColor: colors.blueLight },
  label: { color: colors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: colors.ink, fontSize: 20, fontWeight: '900' },
  body: { color: colors.ink, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  disclaimer: { color: colors.muted, fontSize: 11, fontWeight: '700', lineHeight: 17, marginTop: 14 },
  error: { color: colors.red, fontSize: 13, fontWeight: '800', marginTop: 12 },
  actions: { marginTop: 16 },
});
