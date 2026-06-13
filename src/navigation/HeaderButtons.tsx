import { DrawerActions, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { navigateTo } from '../shared/navigation/routes';
import { colors } from '../shared/styles/theme';

export function HeaderMenuButton() {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={styles.iconButton}
    >
      <MaterialCommunityIcons name="menu" size={24} color={colors.cream} />
    </Pressable>
  );
}

export function HeaderAlertButton() {
  return (
    <View style={styles.alertWrap}>
      <Pressable onPress={() => navigateTo('/alertas')} style={styles.iconButton}>
        <MaterialCommunityIcons name="bell-outline" size={22} color={colors.cream} />
      </Pressable>
      <View style={styles.badge} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  alertWrap: {
    marginRight: 6,
  },
  badge: {
    backgroundColor: colors.red,
    borderColor: colors.navy,
    borderRadius: 5,
    borderWidth: 1,
    height: 10,
    position: 'absolute',
    right: 9,
    top: 9,
    width: 10,
  },
});
