import { colors } from '../../../shared/styles/theme';

export function useDashboardData() {
  return {
    summaryCards: [
      { label: 'Pendientes', value: '04', icon: 'clipboard-text-clock-outline' },
      { label: 'Esta semana', value: '12', icon: 'calendar-check-outline' },
      { label: 'Alertas', value: '02', icon: 'bell-badge-outline' },
    ],
    tasks: [
      { title: 'Validar documentacion', meta: 'Hoy, 10:30 AM', color: colors.green },
      { title: 'Revisar tramite activo', meta: 'Manana, 8:00 AM', color: colors.saffron },
      { title: 'Actualizar datos de perfil', meta: 'Viernes, 4:15 PM', color: colors.clay },
    ],
  };
}
