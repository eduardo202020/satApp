import { alerts } from '../../../shared/data/prototypeData';

export function useAlerts() {
  return {
    alerts,
    getAlertById: (id?: string | string[]) =>
      alerts.find((item) => item.id === (Array.isArray(id) ? id[0] : id)) ?? alerts[0],
  };
}
