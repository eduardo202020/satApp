import { Stack } from 'expo-router';

import { useAppStackHeaderOptions } from '../../src/navigation/useAppStackHeaderOptions';

export default function AlertsStackLayout() {
  const headerOptions = useAppStackHeaderOptions();

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: 'Centro de alertas' }} />
      <Stack.Screen name="[id]" options={{ title: 'Detalle de alerta' }} />
      <Stack.Screen name="configurar" options={{ title: 'Configurar alertas' }} />
    </Stack>
  );
}
