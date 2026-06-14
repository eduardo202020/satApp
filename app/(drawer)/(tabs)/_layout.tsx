import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { HeaderAlertButton, HeaderMenuButton } from '../../../src/navigation/HeaderButtons';
import { colors } from '../../../src/shared/styles/theme';

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="inicio"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.muted,
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabBarItem,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          elevation: 0,
          height: 78,
          paddingBottom: 8,
          paddingHorizontal: 8,
          paddingTop: 8,
          shadowColor: colors.navy,
          shadowOffset: { height: -4, width: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
        },
      }}
    >
      <Tabs.Screen
        name="casos"
        options={{
          title: 'Casos',
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} icon={focused ? 'briefcase' : 'briefcase-outline'} label="Casos" />
          ),
        }}
      />
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} icon={focused ? 'home-variant' : 'home-variant-outline'} label="Inicio" />
          ),
        }}
      />
      <Tabs.Screen
        name="ayuda"
        options={{
          title: 'Ayuda',
          tabBarIcon: ({ focused }) => (
            <TabItem focused={focused} icon={focused ? 'help-circle' : 'help-circle-outline'} label="Ayuda" />
          ),
        }}
      />
    </Tabs>
  );
}

export const stackHeaderOptions = {
  headerTitleAlign: 'center' as const,
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

function TabItem({ focused, icon, label }: { focused: boolean; icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      <MaterialCommunityIcons name={icon} size={24} color={focused ? colors.card : colors.muted} />
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
    alignItems: 'center',
    height: 62,
    justifyContent: 'center',
    paddingVertical: 0,
  },
  tabItem: {
    alignItems: 'center',
    borderRadius: 18,
    gap: 2,
    height: 54,
    justifyContent: 'center',
    minWidth: 86,
    paddingHorizontal: 12,
  },
  tabItemFocused: {
    backgroundColor: colors.navy,
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 14,
  },
  tabLabelFocused: {
    color: colors.card,
  },
});
