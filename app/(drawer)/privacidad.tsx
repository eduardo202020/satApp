import InfoScreen from '../../src/features/info/InfoScreen';
import { infoPages } from '../../src/features/info/infoContent';

export default function PrivacyRoute() {
  return <InfoScreen page={infoPages.privacidad} />;
}
