import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSegments } from 'expo-router';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { useResponsiveLayout } from '../shared/hooks/useResponsiveLayout';
import { navigateTo } from '../shared/navigation/routes';
import { colors } from '../shared/styles/theme';
import { HeaderAlertButton } from './HeaderButtons';
import { drawerRoutes } from './drawerItems';

const headerTabs = [
  {
    icon: 'briefcase-outline',
    label: 'Casos',
    route: '/(drawer)/(tabs)/casos',
    segment: 'casos',
  },
  {
    icon: 'home-variant-outline',
    label: 'Inicio',
    route: '/(drawer)/(tabs)/inicio',
    segment: 'inicio',
  },
  {
    icon: 'help-circle-outline',
    label: 'Ayuda',
    route: '/(drawer)/(tabs)/ayuda',
    segment: 'ayuda',
  },
] as const;

const drawerHeaderItems = drawerRoutes
  .filter((route) => route.name !== '(tabs)')
  .map((route) => ({
    icon: route.icon,
    label: route.name === 'canales-sat' ? 'Canales SAT' : route.title,
    route: route.name,
    externalUrl: route.externalUrl,
    segment: route.name,
  }));

export function AppHeaderNavigation() {
  const { contentMaxWidth, width } = useResponsiveLayout();
  const segments = useSegments();
  const activeSegment = getActiveSegment(segments.map(String));
  const headerWidth = Math.min(Math.max(width - 32, 320), Math.max(contentMaxWidth, 1220));

  return (
    <View style={[styles.wrap, { width: headerWidth }]}>
      <View style={styles.side}>
        <Pressable
          accessibilityLabel="Ir al inicio de SatApp"
          accessibilityRole="link"
          onPress={() => navigateTo('/(drawer)/(tabs)/inicio')}
          style={styles.brandLink}
        >
          <Image
            source={require('../../assets/icon.png')}
            resizeMode="contain"
            style={styles.brandIcon}
          />
          <Text style={styles.brand}>SatApp</Text>
        </Pressable>
      </View>

      <View style={styles.nav}>
        {headerTabs.map((item) => {
          const active = item.segment === activeSegment;

          return (
            <Pressable
              accessibilityRole="link"
              key={item.segment}
              onPress={() => navigateTo(item.route)}
              style={[styles.navItem, active && styles.navItemActive]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={18}
                color={active ? colors.navy : 'rgba(255, 255, 255, 0.78)'}
              />
              <Text style={[styles.navLabel, active && styles.navLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.side, styles.sideRight]}>
        <View style={styles.utilityNav}>
          {drawerHeaderItems.map((item) => {
            const active = item.segment === activeSegment;

            return (
              <Pressable
                accessibilityRole="link"
                key={item.segment}
                onPress={() => {
                  if (item.externalUrl) {
                    Linking.openURL(item.externalUrl);
                    return;
                  }

                  navigateTo(`/(drawer)/${item.route}`);
                }}
                style={[styles.utilityItem, active && styles.utilityItemActive]}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={17}
                  color={active ? colors.navy : 'rgba(255, 255, 255, 0.76)'}
                />
                <Text style={[styles.utilityLabel, active && styles.utilityLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <HeaderAlertButton />
      </View>
    </View>
  );
}

function getActiveSegment(segments: string[]) {
  if (segments.includes('casos') || segments.includes('caso')) {
    return 'casos';
  }

  if (segments.includes('ayuda')) {
    return 'ayuda';
  }

  if (segments.includes('perfil')) {
    return 'perfil';
  }

  if (segments.includes('canales-sat')) {
    return 'canales-sat';
  }

  return 'inicio';
}

const styles = StyleSheet.create({
  brand: {
    color: colors.cream,
    fontSize: 17,
    fontWeight: '900',
  },
  brandIcon: {
    borderRadius: 10,
    height: 36,
    width: 36,
  },
  brandLink: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 10,
    paddingRight: 12,
  },
  nav: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    padding: 4,
  },
  navItem: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    minHeight: 38,
    paddingHorizontal: 14,
  },
  navItemActive: {
    backgroundColor: colors.card,
  },
  navLabel: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 13,
    fontWeight: '900',
  },
  navLabelActive: {
    color: colors.navy,
  },
  wrap: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  side: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  sideRight: {
    flex: 2,
    justifyContent: 'flex-end',
  },
  utilityItem: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 5,
    minHeight: 34,
    paddingHorizontal: 10,
  },
  utilityItemActive: {
    backgroundColor: colors.card,
  },
  utilityLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '900',
  },
  utilityLabelActive: {
    color: colors.navy,
  },
  utilityNav: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
});
