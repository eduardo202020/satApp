import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { navigateTo } from '../shared/navigation/routes';
import { colors } from '../shared/styles/theme';
import { drawerRoutes, type DrawerRoute } from './drawerItems';

const primaryRoute = drawerRoutes[0];
const secondaryRoutes = drawerRoutes.slice(1);

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();
  const activeRouteName = props.state.routeNames[props.state.index];

  function openRoute(route: DrawerRoute) {
    if (route.externalUrl) {
      Linking.openURL(route.externalUrl);
      props.navigation.dispatch(DrawerActions.closeDrawer());
      return;
    }

    navigateTo(route.name === '(tabs)' ? '/(drawer)/(tabs)' : `/(drawer)/${route.name}`);
    props.navigation.dispatch(DrawerActions.closeDrawer());
  }

  return (
    <View style={styles.drawer}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScroll}
      >
        <LinearGradient
          colors={[colors.navy, colors.navyDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.drawerHero, { paddingTop: Math.max(insets.top + 14, 36) }]}
        >
          <Text style={styles.drawerTitle}>Papeleta Clara</Text>
          <Text style={styles.drawerSubtitle}>Entiende, decide y actua a tiempo.</Text>
        </LinearGradient>

        <View style={styles.drawerBody}>
          <Text style={styles.sectionLabel}>Principal</Text>
          <DrawerLink
            icon={primaryRoute.icon}
            label={primaryRoute.title}
            active={activeRouteName === primaryRoute.name}
            onPress={() => openRoute(primaryRoute)}
          />

          <Text style={[styles.sectionLabel, styles.supportLabel]}>Accesos</Text>
          <View style={styles.supportGroup}>
            {secondaryRoutes.map((route) => (
              <DrawerLink
                key={route.name}
                icon={route.icon}
                label={route.title}
                active={activeRouteName === route.name}
                onPress={() => openRoute(route)}
              />
            ))}
          </View>
        </View>
      </DrawerContentScrollView>

      <View style={[styles.drawerFooter, { paddingBottom: Math.max(insets.bottom + 14, 22) }]}>
        <View style={styles.footerIcon}>
          <MaterialCommunityIcons name="shield-check-outline" size={23} color={colors.blue} />
        </View>
        <View style={styles.footerCopy}>
          <Text style={styles.footerTitle}>Consulta segura</Text>
          <Text style={styles.footerText}>Verifica tus datos antes de actuar.</Text>
        </View>
      </View>
    </View>
  );
}

function DrawerLink({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.drawerLink, active && styles.drawerLinkActive]}
    >
      <View style={[styles.linkIcon, active && styles.linkIconActive]}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color={active ? colors.navy : colors.muted}
        />
      </View>
      <Text style={[styles.linkLabel, active && styles.linkLabelActive]}>{label}</Text>
    </Pressable>
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
    borderBottomRightRadius: 28,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 18,
  },
  drawerTitle: {
    color: colors.cream,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28,
  },
  drawerSubtitle: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
    maxWidth: 230,
  },
  drawerBody: {
    paddingHorizontal: 14,
    paddingTop: 18,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: 8,
    paddingHorizontal: 10,
    textTransform: 'uppercase',
  },
  supportLabel: {
    marginTop: 18,
  },
  supportGroup: {
    gap: 3,
  },
  drawerLink: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 10,
  },
  drawerLinkActive: {
    backgroundColor: colors.blueLight,
  },
  linkIcon: {
    alignItems: 'center',
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  linkIconActive: {
    backgroundColor: colors.card,
  },
  linkLabel: {
    color: colors.muted,
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },
  linkLabelActive: {
    color: colors.navy,
    fontWeight: '900',
  },
  drawerFooter: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderTopColor: colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  footerIcon: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  footerCopy: {
    flex: 1,
  },
  footerTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  footerText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 3,
  },
});
