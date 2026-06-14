import { useEffect, useState } from 'react';

import { fetchAlerts } from '../../../shared/api/satApi';
import { alerts as prototypeAlerts } from '../../../shared/data/prototypeData';

export function useAlerts() {
  const [alerts, setAlerts] = useState(prototypeAlerts);

  useEffect(() => {
    let active = true;
    fetchAlerts()
      .then((items) => {
        if (active && items.length > 0) setAlerts(items);
      })
      .catch(() => {
        // Keep local alerts while FastAPI is offline.
      });
    return () => {
      active = false;
    };
  }, []);

  return {
    alerts,
    getAlertById: (id?: string | string[]) =>
      alerts.find((item) => item.id === (Array.isArray(id) ? id[0] : id)) ?? alerts[0],
  };
}
