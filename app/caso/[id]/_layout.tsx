import { Stack } from 'expo-router';

import { colors } from '../../../src/shared/styles/theme';

export default function CaseStackLayout() {
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
      <Stack.Screen name="index" options={{ title: 'Detalle del caso' }} />
      <Stack.Screen name="timeline" options={{ title: 'Linea de tiempo' }} />
      <Stack.Screen name="opciones" options={{ title: 'Opciones' }} />
      <Stack.Screen name="checklist" options={{ title: 'Checklist' }} />
      <Stack.Screen name="canal-oficial" options={{ title: 'Canal oficial SAT' }} />
    </Stack>
  );
}
