import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/theme';
import type { CaseStatus, RiskLevel } from '../types/ui';

type StatusPillProps = {
  label: CaseStatus | RiskLevel | string;
  tone?: 'safe' | 'attention' | 'risk' | 'info';
};

export function StatusPill({ label, tone = 'safe' }: StatusPillProps) {
  const toneStyle = toneStyles[tone];

  return (
    <View style={[styles.pill, { backgroundColor: toneStyle.background }]}>
      <Text style={[styles.label, { color: toneStyle.color }]}>{label}</Text>
    </View>
  );
}

const toneStyles = {
  safe: { background: colors.greenLight, color: colors.green },
  attention: { background: colors.amberLight, color: '#9A6B00' },
  risk: { background: colors.redLight, color: colors.red },
  info: { background: colors.blueLight, color: colors.blue },
};

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: '900',
  },
});
