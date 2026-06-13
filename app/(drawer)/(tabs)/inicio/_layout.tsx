import { Stack } from 'expo-router';

import { stackHeaderOptions } from '../_layout';

export default function InicioStackLayout() {
  return (
    <Stack screenOptions={stackHeaderOptions}>
      <Stack.Screen name="index" options={{ title: 'Papeleta Clara' }} />
      <Stack.Screen name="consulta" options={{ title: 'Consulta' }} />
      <Stack.Screen name="resultado" options={{ title: 'Resultado' }} />
      <Stack.Screen name="confirmacion" options={{ title: 'Confirmacion' }} />
    </Stack>
  );
}
