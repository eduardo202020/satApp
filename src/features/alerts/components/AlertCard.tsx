import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { toneColor } from '../../../shared/data/prototypeData';
import { navigateTo } from '../../../shared/navigation/routes';
import { colors } from '../../../shared/styles/theme';
import type { CaseAlert } from '../../../shared/types/ui';

type AlertCardProps = {
  item: CaseAlert;
};

export function AlertCard({ item }: AlertCardProps) {
  return (
    <Pressable style={styles.card} onPress={() => navigateTo(`/alertas/${item.id}`)}>
      <View style={[styles.icon, { backgroundColor: `${toneColor[item.tone]}18` }]}>
        <MaterialCommunityIcons name={iconByTone[item.tone]} size={28} color={toneColor[item.tone]} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={[styles.link, { color: toneColor[item.tone] }]}>Ver caso</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </Pressable>
  );
}

const iconByTone = {
  risk: 'alert-outline',
  attention: 'clock-alert-outline',
  info: 'information-outline',
} as const;

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  copy: {
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
  link: {
    fontSize: 12,
    fontWeight: '900',
    marginTop: 8,
  },
  time: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    maxWidth: 66,
    textAlign: 'right',
  },
});
