import { Stack } from 'expo-router';

import { useStackHeaderOptions } from '../_layout';

export default function InicioStackLayout() {
  const headerOptions = useStackHeaderOptions();

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: 'Papeleta Clara' }} />
      <Stack.Screen name="consulta" options={{ title: 'Consulta' }} />
      <Stack.Screen name="voz" options={{ title: 'Consulta por voz' }} />
      <Stack.Screen name="resultado" options={{ title: 'Resultado' }} />
      <Stack.Screen name="registrar-papeleta" options={{ title: 'Registrar papeleta' }} />
      <Stack.Screen name="confirmacion" options={{ title: 'Confirmacion' }} />
    </Stack>
  );
}
