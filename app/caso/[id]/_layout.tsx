import { Stack } from 'expo-router';

import { useAppStackHeaderOptions } from '../../../src/navigation/useAppStackHeaderOptions';

export default function CaseStackLayout() {
  const headerOptions = useAppStackHeaderOptions();

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: 'Detalle del caso' }} />
      <Stack.Screen name="timeline" options={{ title: 'Linea de tiempo' }} />
      <Stack.Screen name="opciones" options={{ title: 'Opciones' }} />
      <Stack.Screen name="checklist" options={{ title: 'Checklist' }} />
      <Stack.Screen name="canal-oficial" options={{ title: 'Canal oficial SAT' }} />
      <Stack.Screen name="evidencia" options={{ title: 'Evidencia' }} />
      <Stack.Screen name="diagnostico" options={{ title: 'Entender mi situación' }} />
      <Stack.Screen name="pago" options={{ title: 'Pago' }} />
      <Stack.Screen name="tramite" options={{ title: 'Preparar descargo' }} />
      <Stack.Screen name="constancia" options={{ title: 'Constancia' }} />
      <Stack.Screen name="seguimiento" options={{ title: 'Seguimiento' }} />
    </Stack>
  );
}
