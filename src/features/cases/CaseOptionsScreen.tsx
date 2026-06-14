import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';
import { toneColor } from '../../shared/data/prototypeData';
import { navigateTo } from '../../shared/navigation/routes';
import { useCases } from './hooks/useCases';
import { useCaseJourney } from './hooks/useCaseJourney';
import { analyzeCaseDiscount, formatSoles } from './utils/discounts';

const SAT_PAYMENT_URL = 'https://www.sat.gob.pe/pagosenlinea/';

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
          <View
            style={[
              styles.timelineStep,
              step.isCurrent && styles.timelineStepCurrent,
              step.isCurrent && {
                backgroundColor: stepCurrentBackground[step.state],
                borderColor: stepStateColor[step.state],
              },
            ]}
            key={`${step.title}-${step.date}`}
          >
            <View style={[styles.timelineDot, { backgroundColor: stepStateColor[step.state] }]} />
            <View style={styles.timelineText}>
              <View style={styles.timelineHeader}>
                <Text style={styles.timelineDate}>{step.date}</Text>
                {step.isCurrent && (
                  <View style={styles.currentPill}>
                    <Text style={styles.currentPillText}>Estado actual</Text>
                  </View>
                )}
              </View>
              <Text style={styles.timelineTitle}>{step.title}</Text>
              <Text style={styles.timelineDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.list}>
        {displayOptions.map((option) => {
          const target = getOptionTarget(option);
          const optionStyle = [
            styles.option,
            { backgroundColor: option.tone === 'safe' ? colors.greenLight : option.tone === 'info' ? colors.blueLight : colors.amberLight },
          ];
          const content = (
            <>
              <MaterialCommunityIcons name={option.icon} size={28} color={toneColor[option.tone]} />
              <View style={styles.optionText}>
                <Text style={styles.title}>{option.title}</Text>
                <Text style={styles.description}>{option.description}</Text>
              </View>
              {target && (
                <View style={styles.optionArrow}>
                  <MaterialCommunityIcons name="chevron-right" size={34} color={toneColor[option.tone]} />
                </View>
              )}
            </>
          );

          if (!target) {
            return (
              <View style={optionStyle} key={option.title}>
                {content}
              </View>
            );
          }

          return (
            <Pressable
              accessibilityLabel={`${option.title}. Continuar`}
              accessibilityRole="button"
              key={option.title}
              onPress={() => handleOptionPress(target, item.id)}
              style={({ pressed }) => [optionStyle, pressed && styles.optionPressed]}
            >
              {content}
            </Pressable>
          );
        })}
      </View>
    </ScreenShell>
  );
}

type OptionTarget = 'payment' | 'submission' | 'more';

function getOptionTarget(option: { action?: string; title: string }): OptionTarget | null {
  const normalizedTitle = normalizeOptionTitle(option.title);

  if (option.action === 'pagar' || option.action === 'regularizar_deuda') {
    return 'payment';
  }

  if (option.action === 'presentar_descargo' || normalizedTitle.includes('presentar descargo')) {
    return 'submission';
  }

  if (option.action === 'revisar_papeleta' || normalizedTitle.includes('ver mas opciones')) {
    return 'more';
  }

  return null;
}

function handleOptionPress(target: OptionTarget, caseId: string) {
  if (target === 'payment') {
    void Linking.openURL(SAT_PAYMENT_URL);
    return;
  }

  if (target === 'submission') {
    navigateTo(`/caso/${caseId}/tramite`);
    return;
  }

  navigateTo(`/caso/${caseId}/checklist`);
}

function normalizeOptionTitle(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
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

const stepCurrentBackground = {
  attention: colors.amberLight,
  pending: colors.blueLight,
  risk: colors.redLight,
  safe: colors.greenLight,
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
  currentPill: {
    backgroundColor: colors.navy,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  currentPillText: {
    color: colors.cream,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
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
  optionArrow: {
    alignItems: 'center',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  optionPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
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
    flexShrink: 1,
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
  timelineHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  timelineStep: {
    borderColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    padding: 10,
  },
  timelineStepCurrent: {
    shadowColor: colors.navy,
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
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
