import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { IconName } from '../shared/types/ui';

type DrawerRoute = {
  name: string;
  title: string;
  icon: IconName;
};

export const drawerRoutes = [
  {
    name: '(tabs)',
    title: 'Papeleta Clara',
    icon: 'check-decagram-outline',
  },
  {
    name: 'ayuda',
    title: 'Ayuda',
    icon: 'help-circle-outline',
  },
  {
    name: 'canales-sat',
    title: 'Canales oficiales SAT',
    icon: 'office-building-outline',
  },
  {
    name: 'fuentes',
    title: 'Fuentes oficiales',
    icon: 'file-search-outline',
  },
  {
    name: 'datos-abiertos',
    title: 'Datos abiertos',
    icon: 'chart-box-outline',
  },
  {
    name: 'privacidad',
    title: 'Privacidad',
    icon: 'shield-lock-outline',
  },
  {
    name: 'acerca',
    title: 'Acerca del prototipo',
    icon: 'information-outline',
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
