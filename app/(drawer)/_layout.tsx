import { Drawer } from 'expo-router/drawer';

import { AppHeaderNavigation } from '../../src/navigation/AppHeaderNavigation';
import { CustomDrawerContent } from '../../src/navigation/CustomDrawerContent';
import { drawerIcon, drawerRoutes } from '../../src/navigation/drawerItems';
import { drawerStyles } from '../../src/navigation/drawerStyles';
import { useResponsiveLayout } from '../../src/shared/hooks/useResponsiveLayout';
import { colors } from '../../src/shared/styles/theme';

export default function DrawerLayout() {
  const { isWeb } = useResponsiveLayout();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="(tabs)"
      screenOptions={{
        drawerActiveBackgroundColor: colors.blueLight,
        drawerActiveTintColor: colors.navy,
        drawerInactiveTintColor: colors.muted,
        drawerLabelStyle: drawerStyles.drawerLabel,
        drawerStyle: drawerStyles.drawerPanel,
        headerShadowVisible: false,
        headerLeft: undefined,
        headerRight: undefined,
        headerStyle: drawerStyles.header,
        headerTitle: isWeb ? () => <AppHeaderNavigation /> : undefined,
        headerTintColor: colors.cream,
        headerTitleAlign: 'center',
        headerTitleStyle: drawerStyles.headerTitle,
        overlayColor: 'rgba(22, 33, 28, 0.38)',
        sceneStyle: drawerStyles.scene,
      }}
    >
      {drawerRoutes.filter((route) => !route.externalUrl).map((route) => (
        <Drawer.Screen
          key={route.name}
          name={route.name}
          options={{
            drawerIcon: drawerIcon(route.icon),
            drawerLabel: route.title,
            headerShown: route.name !== '(tabs)' && route.name !== 'perfil',
            title: route.title,
          }}
        />
      ))}
    </Drawer>
  );
}
