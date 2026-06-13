import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { HeaderAlertButton, HeaderMenuButton } from '../../../src/navigation/HeaderButtons';
import { colors } from '../../../src/shared/styles/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '900',
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.line,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="casos"
        options={{
          title: 'Mis casos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export const stackHeaderOptions = {
  headerStyle: {
    backgroundColor: colors.navy,
  },
  headerTintColor: colors.cream,
  headerTitleStyle: {
    color: colors.cream,
    fontSize: 17,
    fontWeight: '900' as const,
  },
  headerLeft: () => <HeaderMenuButton />,
  headerRight: () => <HeaderAlertButton />,
};
