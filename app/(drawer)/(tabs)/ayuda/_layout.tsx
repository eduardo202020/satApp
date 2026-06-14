import { Stack } from 'expo-router';

import { useStackHeaderOptions } from '../_layout';

export default function HelpStackLayout() {
  const headerOptions = useStackHeaderOptions();

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: 'Ayuda' }} />
    </Stack>
  );
}
