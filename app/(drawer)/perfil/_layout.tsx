import { Stack } from 'expo-router';

import { HeaderAlertButton, HeaderMenuButton } from '../../../src/navigation/HeaderButtons';
import { useAppStackHeaderOptions } from '../../../src/navigation/useAppStackHeaderOptions';

export default function ProfileStackLayout() {
  const headerOptions = useAppStackHeaderOptions();

  return (
    <Stack
      screenOptions={headerOptions}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <HeaderMenuButton />,
          headerRight: () => <HeaderAlertButton />,
          title: 'Perfil',
        }}
      />
      <Stack.Screen name="validacion" options={{ title: 'Validacion' }} />
      <Stack.Screen name="preferencias" options={{ title: 'Preferencias' }} />
      <Stack.Screen name="seguridad" options={{ title: 'Seguridad' }} />
    </Stack>
  );
}
