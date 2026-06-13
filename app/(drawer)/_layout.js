import { Drawer } from 'expo-router/drawer';

import { CustomDrawerContent } from '../../src/navigation/CustomDrawerContent';
import { drawerIcon, drawerRoutes } from '../../src/navigation/drawerItems';
import { drawerStyles } from '../../src/navigation/drawerStyles';
import { colors } from '../../src/shared/styles/theme';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="inicio/index"
      screenOptions={{
        drawerActiveBackgroundColor: colors.greenLight,
        drawerActiveTintColor: colors.green,
        drawerInactiveTintColor: colors.muted,
        drawerLabelStyle: drawerStyles.drawerLabel,
        drawerStyle: drawerStyles.drawerPanel,
        headerShadowVisible: false,
        headerStyle: drawerStyles.header,
        headerTintColor: colors.cream,
        headerTitleStyle: drawerStyles.headerTitle,
        overlayColor: 'rgba(22, 33, 28, 0.38)',
        sceneStyle: drawerStyles.scene,
      }}
    >
      {drawerRoutes.map((route) => (
        <Drawer.Screen
          key={route.name}
          name={route.name}
          options={{
            drawerIcon: drawerIcon(route.icon),
            drawerLabel: route.title,
            title: route.title,
          }}
        />
      ))}
    </Drawer>
  );
}
