import { Stack } from 'expo-router';

import { useStackHeaderOptions } from '../_layout';

export default function CasesStackLayout() {
  const headerOptions = useStackHeaderOptions();

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: 'Mis casos' }} />
      <Stack.Screen name="seguimiento" options={{ title: 'Seguimiento' }} />
      <Stack.Screen name="alertas-caso" options={{ title: 'Alertas del caso' }} />
    </Stack>
  );
}
