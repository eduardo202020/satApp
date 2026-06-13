import { Stack } from 'expo-router';

import { stackHeaderOptions } from '../_layout';

export default function CasesStackLayout() {
  return (
    <Stack screenOptions={stackHeaderOptions}>
      <Stack.Screen name="index" options={{ title: 'Mis casos' }} />
      <Stack.Screen name="seguimiento" options={{ title: 'Seguimiento' }} />
      <Stack.Screen name="alertas-caso" options={{ title: 'Alertas del caso' }} />
    </Stack>
  );
}
