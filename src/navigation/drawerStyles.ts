import { StyleSheet } from 'react-native';

import { colors } from '../shared/styles/theme';

export const drawerStyles = StyleSheet.create({
  scene: {
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.navy,
  },
  headerTitle: {
    color: colors.cream,
    fontSize: 19,
    fontWeight: '800',
  },
  drawerPanel: {
    backgroundColor: colors.card,
    borderBottomRightRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    width: 292,
  },
  drawerLabel: {
    fontSize: 14,
    fontWeight: '900',
    marginLeft: -4,
  },
});
