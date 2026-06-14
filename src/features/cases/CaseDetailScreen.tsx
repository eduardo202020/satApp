import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ResponsiveGrid } from '../../shared/components/ResponsiveGrid';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { StatusPill } from '../../shared/components/StatusPill';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import type { IconName } from '../../shared/types/ui';
import { useCases } from './hooks/useCases';

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const riskTone = item.risk === 'Alto' ? 'risk' : item.risk === 'Medio' ? 'attention' : 'safe';
  const explorationItems: Array<{
    description: string;
    href: string;
    icon: IconName;
    title: string;
  }> = [
    {
      description: 'Foto, lugar y registro del hecho antes de decidir.',
      href: `/caso/${item.id}/evidencia`,
      icon: 'camera-outline',
      title: 'Revisar evidencia',
    },
    {
      description: 'Explicación sencilla del caso, fechas, descuento y riesgos.',
      href: `/caso/${item.id}/diagnostico`,
      icon: 'text-box-search-outline',
      title: 'Entender mi situación',
    },
    {
      description: 'Ruta PAS/PEC: dónde estás y qué puede pasar después.',
      href: `/caso/${item.id}/timeline`,
      icon: 'timeline-clock-outline',
      title: 'Línea de tiempo',
    },
    {
      description: 'Acciones disponibles, descuento estimado y preparación.',
      href: `/caso/${item.id}/opciones`,
      icon: 'clipboard-check-outline',
      title: 'Opciones y descuento',
    },
  ];

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
        <Detail label="Número de papeleta" value={item.ticketNumber ?? 'Por validar'} />
        <Detail label="Infracción" value={item.infraction} />
        <Detail label="Placa" value={item.plate} />
        <Detail label="Monto" value={item.amount} />
        <Detail label="Fecha de emisión" value={item.issueDate} />
        <Detail label="Fecha de consulta" value={item.queryDate ?? 'No registrada'} />
        <Detail label="Plazo / vencimiento" value={item.dueDate} />
        <Detail label="Lugar" value={item.location} />
        <Detail label="Riesgo" value={item.risk} tone={riskTone} />
        <Detail
          label="Descuento"
          value={item.canDiscount ? 'Disponible, sujeto a validación oficial' : 'No disponible en esta etapa'}
          tone={item.canDiscount ? 'safe' : 'attention'}
        />
        <Detail label="Siguiente paso" value={item.nextStep} />
      </View>

      {!!item.summary && (
        <View style={styles.summaryCard}>
          <Text style={styles.sectionKicker}>Resumen del caso</Text>
          <Text style={styles.summaryText}>{item.summary}</Text>
        </View>
      )}

      {!!item.latestSubmission && (
        <View style={styles.summaryCard}>
          <Text style={styles.sectionKicker}>Último trámite registrado</Text>
          <Text style={styles.summaryTitle}>{item.latestSubmission.receiptNumber}</Text>
          <Text style={styles.summaryText}>{item.latestSubmission.summary}</Text>
        </View>
      )}

      <View style={styles.exploreHeader}>
        <Text style={styles.sectionKicker}>Qué revisar ahora</Text>
        <Text style={styles.exploreCopy}>
          Cada sección cubre una parte distinta del caso para evitar repetir información.
        </Text>
      </View>

      <ResponsiveGrid minItemWidth={360} style={styles.actions}>
        {explorationItems.map((entry) => (
          <Pressable key={entry.title} onPress={() => navigateTo(entry.href)} style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name={entry.icon} size={24} color={colors.blue} />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{entry.title}</Text>
              <Text style={styles.actionDescription}>{entry.description}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.muted} />
          </Pressable>
        ))}
      </ResponsiveGrid>
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
    lineHeight: 21,
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
    marginTop: 12,
  },
  summaryCard: {
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    gap: 6,
    marginTop: 12,
    padding: 16,
  },
  sectionKicker: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  summaryTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  summaryText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  exploreHeader: {
    gap: 5,
    marginTop: 16,
  },
  exploreCopy: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 86,
    padding: 14,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  actionDescription: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 3,
  },
});
