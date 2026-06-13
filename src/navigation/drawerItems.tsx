import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { IconName } from '../shared/types/ui';

type DrawerRoute = {
  name: string;
  title: string;
  icon: IconName;
};

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
] satisfies DrawerRoute[];

type DrawerIconProps = {
  color: string;
  size: number;
};

export function drawerIcon(name: IconName) {
  return ({ color, size }: DrawerIconProps) => (
    <MaterialCommunityIcons name={name} size={size} color={color} />
  );
}
