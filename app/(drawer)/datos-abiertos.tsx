import InfoScreen from '../../src/features/info/InfoScreen';
import { infoPages } from '../../src/features/info/infoContent';

export default function OpenDataRoute() {
  return <InfoScreen page={infoPages['datos-abiertos']} />;
}
