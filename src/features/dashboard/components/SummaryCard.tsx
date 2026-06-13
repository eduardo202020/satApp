import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../shared/styles/theme';
import type { IconName } from '../../../shared/types/ui';

export type SummaryItem = {
  label: string;
  value: string;
  icon: IconName;
};

type SummaryCardProps = {
  item: SummaryItem;
};

export function SummaryCard({ item }: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIcon}>
        <MaterialCommunityIcons name={item.icon} size={22} color={colors.green} />
      </View>
      <Text style={styles.summaryValue}>{item.value}</Text>
      <Text style={styles.summaryLabel}>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 132,
    padding: 14,
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: colors.greenLight,
    borderRadius: 8,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  summaryValue: {
    color: colors.ink,
    fontSize: 29,
    fontWeight: '900',
    marginTop: 14,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
});
