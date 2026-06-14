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
    fetchClearDiagnosis(
      item.id,
      `Quiero entender la papeleta ${item.ticketCode ?? item.id} de placa ${item.plate} y decidir qué hacer.`,
    )
      .then(setDiagnosis)
      .catch((reason: Error) => setError(reason.message));
  }, [item.id, item.plate, item.ticketCode]);

  return (
    <ScreenShell
      eyebrow="Entender"
      title="Entender mi situación"
      description="Una explicación simple de tu papeleta, tus fechas y los riesgos antes de decidir."
      compact
    >
      <View style={styles.heroCard}>
        <Text style={styles.label}>Tu caso, en simple</Text>
        <Text style={styles.title}>{diagnosis?.currentStatus ?? item.stage}</Text>
        <Text style={styles.caseMeta}>
          Papeleta {item.ticketNumber ?? item.ticketCode ?? item.id} · Placa {item.plate} · Monto {item.amount}
        </Text>
        <StatusPill label={`Riesgo ${item.risk}`} tone={riskToneForCase(item.risk)} />
      </View>

      {!diagnosis && !error && (
        <Text style={styles.loading}>Estamos preparando una explicación clara con las reglas y fechas de tu caso.</Text>
      )}

      <Section title="Lo que está pasando" lines={displayLines(diagnosis?.plainExplanation ?? item.summary ?? item.nextStep)} />
      <Section title="Fechas y descuento" lines={diagnosis?.deadlines ?? [item.dueDate]} tone="attention" />
      <Section
        title="Qué puede pasar si no haces nada"
        lines={diagnosis?.risks ?? ['El caso puede avanzar de etapa si no pagas, reclamas o revisas el expediente a tiempo.']}
        tone={item.risk === 'Alto' ? 'risk' : 'attention'}
      />
      {!!diagnosis?.availableActions.length && (
        <Section title="Qué puedes hacer ahora" lines={diagnosis.availableActions.map(formatActionLabel)} tone="info" />
      )}
      {!!diagnosis?.sources.length && (
        <Section title="De dónde sale esta explicación" lines={diagnosis.sources} tone="info" compact />
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.disclaimer}>
        {diagnosis?.disclaimer ?? 'Esta orientación te ayuda a decidir el siguiente paso. Confirma siempre en el expediente y canales oficiales del SAT.'}
      </Text>
      <View style={styles.actions}>
        <PrimaryButton label="Ver opciones para resolver" onPress={() => navigateTo(`/caso/${item.id}/opciones`)} />
      </View>
    </ScreenShell>
  );
}

function formatActionLabel(action: string) {
  const labels: Record<string, string> = {
    consultar_deuda: 'Consultar deuda: revisa cuánto figura pendiente antes de pagar o reclamar.',
    consultar_expediente: 'Consultar expediente: confirma la etapa oficial y guarda cualquier constancia.',
    consultar_orden_captura: 'Consultar orden de captura: si aparece este riesgo, revisa el canal oficial cuanto antes.',
    consultar_papeleta: 'Consultar papeleta: revisa número, placa, código, fecha y monto registrados.',
    dar_seguimiento: 'Dar seguimiento: vuelve a revisar el expediente hasta que exista una respuesta.',
    pagar: 'Pagar en línea: si reconoces la infracción, pagar a tiempo evita que el caso avance.',
    presentar_apelacion: 'Presentar apelación: si ya existe resolución y no estás de acuerdo, actúa dentro del plazo.',
    presentar_descargo: 'Presentar descargo: si no estás de acuerdo, explica por qué y adjunta sustento.',
    presentar_reclamo: 'Presentar reclamo: responde el informe o acto indicado antes de que venza el plazo.',
    presentar_solicitud: 'Presentar solicitud: pide la revisión o prórroga que corresponda por canal oficial.',
    regularizar_deuda: 'Regularizar deuda: si la sanción ya está firme, atiende la deuda para evitar cobranza.',
    revisar_papeleta: 'Revisar papeleta: mira primero la evidencia y confirma si los datos coinciden.',
  };

  return labels[action] ?? action.replace(/_/g, ' ');
}

function riskToneForCase(risk: string) {
  if (risk === 'Alto') return 'risk';
  if (risk === 'Medio') return 'attention';
  return 'safe';
}

function displayLines(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function Section({
  compact,
  lines,
  title,
  tone,
}: {
  compact?: boolean;
  lines: string[];
  title: string;
  tone?: 'attention' | 'info' | 'risk';
}) {
  return (
    <View style={[styles.card, tone === 'attention' && styles.attention, tone === 'info' && styles.info, tone === 'risk' && styles.risk]}>
      <Text style={styles.label}>{title}</Text>
      {lines.map((line, index) => (
        <View style={styles.lineRow} key={`${title}-${index}`}>
          <View style={[styles.bullet, compact && styles.bulletSmall]} />
          <Text style={[styles.body, compact && styles.bodySmall]}>{line}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    marginTop: 16,
    padding: 18,
  },
  card: { backgroundColor: colors.card, borderColor: colors.line, borderRadius: 8, borderWidth: 1, gap: 10, marginTop: 12, padding: 18 },
  attention: { backgroundColor: colors.amberLight },
  info: { backgroundColor: colors.blueLight },
  risk: { backgroundColor: colors.redLight },
  label: { color: colors.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: colors.ink, fontSize: 22, fontWeight: '900', lineHeight: 28 },
  caseMeta: { color: colors.ink, fontSize: 15, fontWeight: '800', lineHeight: 22 },
  loading: { color: colors.muted, fontSize: 14, fontWeight: '800', lineHeight: 20, marginTop: 12 },
  lineRow: { alignItems: 'flex-start', flexDirection: 'row', gap: 10 },
  bullet: { backgroundColor: colors.blue, borderRadius: 5, height: 10, marginTop: 7, width: 10 },
  bulletSmall: { height: 7, marginTop: 7, width: 7 },
  body: { color: colors.ink, flex: 1, fontSize: 15, fontWeight: '700', lineHeight: 23 },
  bodySmall: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  disclaimer: { color: colors.muted, fontSize: 12, fontWeight: '700', lineHeight: 18, marginTop: 14 },
  error: { color: colors.red, fontSize: 13, fontWeight: '800', marginTop: 12 },
  actions: { marginTop: 16 },
});
