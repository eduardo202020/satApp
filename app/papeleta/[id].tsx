import { Redirect, useLocalSearchParams } from 'expo-router';

import { asHref } from '../../src/shared/navigation/routes';

export default function PapeletaDeepLinkRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const caseId = Array.isArray(id) ? id[0] : id;

  return <Redirect href={asHref(`/caso/${caseId}`)} />;
}
