import { Redirect } from 'expo-router';

import { asHref } from '../src/shared/navigation/routes';

export default function IndexRoute() {
  return <Redirect href={asHref('/(drawer)/(tabs)/inicio')} />;
}
