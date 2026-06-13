import InfoScreen from '../../src/features/info/InfoScreen';
import { infoPages } from '../../src/features/info/infoContent';

export default function HelpRoute() {
  return <InfoScreen page={infoPages.ayuda} />;
}
