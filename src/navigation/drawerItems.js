import { MaterialCommunityIcons } from '@expo/vector-icons';

export const drawerRoutes = [
  {
    name: 'inicio/index',
    title: 'Inicio',
    icon: 'view-dashboard-outline',
  },
  {
    name: 'tramites/index',
    title: 'Tramites',
    icon: 'file-document-edit-outline',
  },
  {
    name: 'calendario/index',
    title: 'Calendario',
    icon: 'calendar-month-outline',
  },
  {
    name: 'perfil/index',
    title: 'Perfil',
    icon: 'account-circle-outline',
  },
];

export function drawerIcon(name) {
  return ({ color, size }) => (
    <MaterialCommunityIcons name={name} size={size} color={color} />
  );
}
