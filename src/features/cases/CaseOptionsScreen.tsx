import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';
import { toneColor } from '../../shared/data/prototypeData';
import { navigateTo } from '../../shared/navigation/routes';
import { useCases } from './hooks/useCases';
import { useCaseJourney } from './hooks/useCaseJourney';
import { analyzeCaseDiscount, formatSoles } from './utils/discounts';

export default function CaseOptionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const { recommendedOptions } = useCaseJourney(item.id);
  const discount = analyzeCaseDiscount(item);
  const displayOptions = recommendedOptions.map((option) => {
    if (option.action !== 'pagar' && !option.title.toLowerCase().includes('descuento')) {
      return option;
    }

    if (discount.rule) {
      return {
        ...option,
        description: `Monto estimado: ${formatSoles(discount.payableAmount)} de ${formatSoles(discount.baseAmount)}.`,
        title: `Pagar con ${discount.rule.percentage}% de descuento`,
      };
    }

    return {
      ...option,
      description: discount.reason,
      title: 'Pagar monto sin descuento vigente',
      tone: 'attention' as const,
    };
  });

  return (
    <ScreenShell
      eyebrow="Opciones"
      title="Que puedes hacer ahora?"
      description={`Segun el estado de ${item.ticketCode ?? item.id}, estas son las acciones recomendadas.`}
      compact
    >
      <View style={styles.discountCard}>
        <View style={styles.discountHeader}>
          <View>
            <Text style={styles.kicker}>Descuento segun consulta</Text>
            <Text style={styles.discountTitle}>{discount.summary}</Text>
          </View>
          <View style={[styles.badge, discount.rule ? styles.badgeSafe : styles.badgeAttention]}>
            <Text style={[styles.badgeText, discount.rule ? styles.badgeTextSafe : styles.badgeTextAttention]}>
              {discount.rule ? `${discount.rule.percentage}%` : 'Sin beneficio'}
            </Text>
          </View>
        </View>

        <Text style={styles.discountReason}>{discount.reason}</Text>

        <View style={styles.amountGrid}>
          <AmountItem label="Monto base" value={formatSoles(discount.baseAmount)} />
          <AmountItem label="Ahorro" value={discount.rule ? formatSoles(discount.discountAmount) : 'S/ 0.00'} />
          <AmountItem label="Monto a pagar" value={formatSoles(discount.payableAmount)} highlight />
        </View>

        <View style={styles.metaGrid}>
          <MetaItem label="Emision" value={discount.issueDateLabel} />
          <MetaItem label="Consulta" value={discount.queryDateLabel} />
          <MetaItem
            label="Dias habiles"
            value={discount.businessDaysElapsed === null ? 'Por validar' : `${discount.businessDaysElapsed}`}
          />
        </View>
      </View>

      <View style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Cronologia de descuentos</Text>
        {discount.timeline.map((step) => (
          <View style={styles.timelineStep} key={`${step.title}-${step.date}`}>
            <View style={[styles.timelineDot, { backgroundColor: stepStateColor[step.state] }]} />
            <View style={styles.timelineText}>
              <Text style={styles.timelineDate}>{step.date}</Text>
              <Text style={styles.timelineTitle}>{step.title}</Text>
              <Text style={styles.timelineDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.list}>
        {displayOptions.map((option) => (
          <View style={[styles.option, { backgroundColor: option.tone === 'safe' ? colors.greenLight : option.tone === 'info' ? colors.blueLight : colors.amberLight }]} key={option.title}>
            <MaterialCommunityIcons name={option.icon} size={28} color={toneColor[option.tone]} />
            <View style={styles.optionText}>
              <Text style={styles.title}>{option.title}</Text>
              <Text style={styles.description}>{option.description}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        {displayOptions.some((option) => option.action === 'presentar_descargo') && (
          <PrimaryButton label="Preparar descargo" onPress={() => navigateTo(`/caso/${id}/tramite`)} />
        )}
        <PrimaryButton label="Preparar checklist" variant="secondary" onPress={() => navigateTo(`/caso/${id}/checklist`)} />
      </View>
    </ScreenShell>
  );
}

function AmountItem({ highlight, label, value }: { highlight?: boolean; label: string; value: string }) {
  return (
    <View style={[styles.amountItem, highlight && styles.amountHighlight]}>
      <Text style={styles.amountLabel}>{label}</Text>
      <Text style={[styles.amountValue, highlight && styles.amountValueHighlight]}>{value}</Text>
    </View>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const stepStateColor = {
  attention: colors.amber,
  pending: '#B6C1D2',
  risk: colors.red,
  safe: colors.green,
};

const styles = StyleSheet.create({
  amountGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  amountHighlight: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  amountItem: {
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 10,
  },
  amountLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  amountValue: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 6,
  },
  amountValueHighlight: {
    color: colors.cream,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeAttention: {
    backgroundColor: colors.amberLight,
  },
  badgeSafe: {
    backgroundColor: colors.greenLight,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '900',
  },
  badgeTextAttention: {
    color: '#9A6B00',
  },
  badgeTextSafe: {
    color: colors.green,
  },
  discountCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  discountHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  discountReason: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 10,
  },
  discountTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 3,
  },
  kicker: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  list: {
    gap: 12,
    marginTop: 16,
  },
  metaGrid: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metaValue: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  option: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  optionText: {
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
  },
  timelineCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  timelineDate: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
  },
  timelineDescription: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 3,
  },
  timelineDot: {
    borderRadius: 7,
    height: 14,
    marginTop: 5,
    width: 14,
  },
  timelineStep: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  timelineText: {
    flex: 1,
  },
  timelineTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
  },
});
