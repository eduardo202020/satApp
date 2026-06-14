import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ResponsiveGrid } from '../../shared/components/ResponsiveGrid';
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
        description: `Puedes pagar un monto estimado de ${formatSoles(discount.payableAmount)}.`,
        title: `Pagar con beneficio`,
      };
    }

    return {
      ...option,
      description: 'Puedes revisar el monto y elegir el siguiente paso.',
      title: 'Ver pago disponible',
      tone: 'attention' as const,
    };
  });

  return (
    <ScreenShell
      eyebrow="Opciones"
      title="Qué puedes hacer"
      description="Elige una acción según lo que quieres hacer con tu papeleta."
      compact
    >
      <View style={styles.discountCard}>
        <View style={styles.discountHeader}>
          <View>
            <Text style={styles.kicker}>Beneficio disponible</Text>
            <Text style={styles.discountTitle}>{discount.rule ? 'Tienes descuento vigente' : 'Sin descuento vigente'}</Text>
          </View>
          <View style={[styles.badge, discount.rule ? styles.badgeSafe : styles.badgeAttention]}>
            <Text style={[styles.badgeText, discount.rule ? styles.badgeTextSafe : styles.badgeTextAttention]}>
              {discount.rule ? `${discount.rule.percentage}%` : 'Sin beneficio'}
            </Text>
          </View>
        </View>

        <Text style={styles.discountReason}>
          {discount.rule
            ? 'Si decides pagar ahora, este es el estimado calculado con la fecha de la papeleta.'
            : 'Puedes continuar con pago regular o revisar si corresponde presentar un descargo.'}
        </Text>

        <View style={styles.amountGrid}>
          <AmountItem label="Monto base" value={formatSoles(discount.baseAmount)} />
          <AmountItem label="Ahorro" value={discount.rule ? formatSoles(discount.discountAmount) : 'S/ 0.00'} />
          <AmountItem label="Monto a pagar" value={formatSoles(discount.payableAmount)} highlight />
        </View>
      </View>

      <ResponsiveGrid minItemWidth={330} style={styles.list}>
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
      </ResponsiveGrid>
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
    navigateTo(`/caso/${caseId}/pago`);
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
});
