import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AppLogo } from '../shared/components/AppLogo';
import { colors } from '../shared/styles/theme';

export function CustomDrawerContent(props) {
  return (
    <View style={styles.drawer}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScroll}
      >
        <LinearGradient
          colors={[colors.green, '#274F40']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.drawerHero}
        >
          <AppLogo />
          <Text style={styles.drawerTitle}>satApp</Text>
          <Text style={styles.drawerSubtitle}>Gestion centralizada</Text>
        </LinearGradient>

        <View style={styles.drawerItems}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <View style={styles.statusDot} />
        <View>
          <Text style={styles.footerTitle}>Conexion activa</Text>
          <Text style={styles.footerText}>Expo Go + WSL2</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: colors.card,
  },
  drawerScroll: {
    paddingTop: 0,
  },
  drawerHero: {
    paddingHorizontal: 22,
    paddingBottom: 28,
    paddingTop: 34,
  },
  drawerTitle: {
    color: colors.cream,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 18,
  },
  drawerSubtitle: {
    color: 'rgba(255, 248, 232, 0.76)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  drawerItems: {
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  drawerFooter: {
    alignItems: 'center',
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  statusDot: {
    backgroundColor: colors.green,
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  footerTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  footerText: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
});
