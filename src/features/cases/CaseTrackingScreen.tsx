import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { fetchCaseTracking } from '../../shared/api/satApi';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { StatusPill } from '../../shared/components/StatusPill';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import type { CaseTracking } from '../../shared/types/ui';
import { useCases } from './hooks/useCases';

export default function CaseTrackingScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getCaseById } = useCases();
  const fallback = getCaseById(id);
  const [tracking, setTracking] = useState<CaseTracking | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchCaseTracking(id).then(setTracking).catch(() => undefined);
  }, [id]);

  const item = tracking?.case ?? fallback;

  return (
    <ScreenShell
      eyebrow="Seguimiento"
      title={`Caso ${item.ticketCode ?? item.id}`}
      description="Tu accion ya forma parte del expediente y puedes seguir su avance desde aqui."
    >
      <View style={styles.card}>
        <Text style={styles.label}>Estado actual</Text>
        <Text style={styles.state}>{item.stage}</Text>
        <StatusPill label={tracking?.submissions.length ? 'Descargo registrado' : 'Sin trámites registrados'} tone={tracking?.submissions.length ? 'safe' : 'attention'} />
      </View>
      {tracking?.submissions.map((submission) => (
        <View style={styles.card} key={submission.id}>
          <Text style={styles.label}>Constancia</Text>
          <Text style={styles.receipt}>{submission.receiptNumber}</Text>
          <Text style={styles.value}>{submission.summary}</Text>
          <Text style={styles.meta}>{new Date(submission.createdAt).toLocaleString('es-PE')}</Text>
        </View>
      ))}
      {tracking?.alerts.map((alert) => (
        <View style={styles.alert} key={alert.id}>
          <Text style={styles.label}>Alerta generada</Text>
          <Text style={styles.value}>{alert.title}</Text>
          <Text style={styles.meta}>{alert.description}</Text>
        </View>
      ))}
      <View style={styles.card}>
        <Text style={styles.label}>Próximo paso</Text>
        <Text style={styles.value}>{item.nextStep}</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Ver centro de alertas" onPress={() => navigateTo('/alertas')} />
        <PrimaryButton label="Ver línea de tiempo" variant="secondary" onPress={() => navigateTo(`/caso/${item.id}/timeline`)} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 9,
    marginTop: 12,
    padding: 16,
  },
  alert: {
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    gap: 6,
    marginTop: 12,
    padding: 16,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  state: {
    color: colors.green,
    fontSize: 20,
    fontWeight: '900',
  },
  receipt: {
    color: colors.blue,
    fontSize: 21,
    fontWeight: '900',
  },
  value: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
});
