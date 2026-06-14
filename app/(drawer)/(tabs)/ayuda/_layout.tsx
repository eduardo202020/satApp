import { Stack } from 'expo-router';

import { stackHeaderOptions } from '../_layout';

export default function HelpStackLayout() {
  return (
    <Stack screenOptions={stackHeaderOptions}>
      <Stack.Screen name="index" options={{ title: 'Ayuda' }} />
    </Stack>
  );
}
