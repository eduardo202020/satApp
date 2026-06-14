import { Stack } from 'expo-router';

import { HeaderAlertButton, HeaderMenuButton } from '../../../src/navigation/HeaderButtons';
import { colors } from '../../../src/shared/styles/theme';

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerShadowVisible: false,
        headerRight: () => <HeaderAlertButton />,
        headerTintColor: colors.cream,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: colors.cream,
          fontSize: 17,
          fontWeight: '900',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerLeft: () => <HeaderMenuButton />,
          title: 'Perfil',
        }}
      />
      <Stack.Screen name="validacion" options={{ title: 'Validacion' }} />
      <Stack.Screen name="preferencias" options={{ title: 'Preferencias' }} />
      <Stack.Screen name="seguridad" options={{ title: 'Seguridad' }} />
    </Stack>
  );
}
