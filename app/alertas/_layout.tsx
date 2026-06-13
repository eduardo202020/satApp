import { Stack } from 'expo-router';

import { colors } from '../../src/shared/styles/theme';

export default function AlertsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.cream,
        headerTitleStyle: {
          color: colors.cream,
          fontSize: 17,
          fontWeight: '900',
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Centro de alertas' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle de alerta' }} />
      <Stack.Screen name="configurar" options={{ title: 'Configurar alertas' }} />
    </Stack>
  );
}
