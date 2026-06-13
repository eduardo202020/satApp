import InfoScreen from '../../src/features/info/InfoScreen';
import { infoPages } from '../../src/features/info/infoContent';

export default function SatChannelsRoute() {
  return <InfoScreen page={infoPages['canales-sat']} />;
}
