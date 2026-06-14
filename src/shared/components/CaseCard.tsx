import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { navigateTo } from '../navigation/routes';
import { colors } from '../styles/theme';
import type { CaseRecord } from '../types/ui';
import { PrimaryButton } from './PrimaryButton';
import { StatusPill } from './StatusPill';

type CaseCardProps = {
  item: CaseRecord;
  compact?: boolean;
};

export function CaseCard({ item, compact = false }: CaseCardProps) {
  const riskTone = item.risk === 'Alto' ? 'risk' : item.risk === 'Medio' ? 'attention' : 'safe';

  return (
    <Pressable
      style={[styles.card, compact && styles.compactCard]}
      onPress={() => navigateTo(`/caso/${item.id}`)}
    >
      <View style={styles.header}>
        <Text style={styles.code}>{item.ticketCode ?? item.id}</Text>
        <StatusPill label={item.status} tone={riskTone} />
      </View>

      <View style={styles.detailRows}>
        <Detail label="Infraccion" value={item.infraction} />
        <Detail label="Placa" value={item.plate} />
        <Detail label="Monto" value={item.amount} />
        <Detail label="Vence" value={item.dueDate} />
        <Detail label="Riesgo" value={item.risk} valueTone={riskTone} />
      </View>

      {compact && (
        <View style={styles.compactArrowWrap}>
          <View style={styles.compactArrow}>
            <MaterialCommunityIcons name="arrow-right" size={34} color={colors.cream} />
          </View>
        </View>
      )}

      {!compact && (
        <View style={styles.buttonRow}>
          <PrimaryButton label="Ver detalle" onPress={() => navigateTo(`/caso/${item.id}`)} />
        </View>
      )}
    </Pressable>
  );
}

function Detail({
  label,
  value,
  valueTone,
}: {
  label: string;
  value: string;
  valueTone?: 'safe' | 'attention' | 'risk';
}) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text
        style={[
          styles.detailValue,
          valueTone === 'risk' && styles.riskText,
          valueTone === 'attention' && styles.attentionText,
          valueTone === 'safe' && styles.safeText,
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
    marginTop: 12,
    padding: 16,
  },
  compactCard: {
    marginTop: 0,
  },
  compactArrowWrap: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
  compactArrow: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: 999,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  code: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  detailRows: {
    gap: 8,
    marginTop: 14,
  },
  detail: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
    minWidth: 76,
  },
  detailValue: {
    color: colors.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
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
  buttonRow: {
    marginTop: 16,
  },
});
