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
    width: 312,
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '800',
    marginLeft: -8,
  },
});
