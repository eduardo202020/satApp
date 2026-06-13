import { StyleSheet } from 'react-native';

import { colors } from '../shared/styles/theme';

export const drawerStyles = StyleSheet.create({
  scene: {
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.green,
  },
  headerTitle: {
    color: colors.cream,
    fontSize: 19,
    fontWeight: '800',
  },
  drawerPanel: {
    backgroundColor: colors.card,
    width: 304,
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '800',
    marginLeft: -8,
  },
});
