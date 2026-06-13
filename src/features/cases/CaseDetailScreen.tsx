import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { StatusPill } from '../../shared/components/StatusPill';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from './hooks/useCases';

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const riskTone = item.risk === 'Alto' ? 'risk' : item.risk === 'Medio' ? 'attention' : 'safe';

  return (
    <ScreenShell
      eyebrow="Detalle del caso"
      title={`Papeleta ${item.ticketCode ?? item.id}`}
      description="Informacion ordenada para entender en que etapa estas y que puedes hacer."
      compact
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.code}>{item.ticketCode ?? item.id}</Text>
          <StatusPill label={item.status} tone={riskTone} />
        </View>
        <Detail label="Infraccion" value={item.infraction} />
        <Detail label="Placa" value={item.plate} />
        <Detail label="Monto" value={item.amount} />
        <Detail label="Fecha de emision" value={item.issueDate} />
        <Detail label="Lugar" value={item.location} />
        <Detail label="Riesgo" value={item.risk} tone={riskTone} />
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Revisar evidencia" onPress={() => navigateTo(`/caso/${id}/evidencia`)} />
        <PrimaryButton label="Entender mi situación" variant="secondary" onPress={() => navigateTo(`/caso/${id}/diagnostico`)} />
        <PrimaryButton label="Ver linea de tiempo" onPress={() => navigateTo(`/caso/${id}/timeline`)} />
        <PrimaryButton label="Ver opciones" variant="secondary" onPress={() => navigateTo(`/caso/${id}/opciones`)} />
      </View>
    </ScreenShell>
  );
}

function Detail({ label, value, tone }: { label: string; value: string; tone?: 'safe' | 'attention' | 'risk' }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[
          styles.detailValue,
          tone === 'risk' && styles.riskText,
          tone === 'attention' && styles.attentionText,
          tone === 'safe' && styles.safeText,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    marginTop: 16,
    padding: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  code: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
  },
  detail: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
  },
  riskText: {
    color: colors.red,
  },
  attentionText: {
    color: '#9A6B00',
  },
  safeText: {
    color: colors.green,
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
});
