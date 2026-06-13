import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../styles/theme';
import type { ActionItem } from '../types/ui';

type ActionRowProps = {
  item: ActionItem;
};

export function ActionRow({ item }: ActionRowProps) {
  return (
    <Pressable style={styles.actionRow}>
      <View style={[styles.actionMarker, { backgroundColor: item.color }]} />
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{item.title}</Text>
        <Text style={styles.actionMeta}>{item.meta}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
    minHeight: 74,
    paddingHorizontal: 14,
  },
  actionMarker: {
    borderRadius: 7,
    height: 42,
    width: 8,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  actionMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },
});
