import { MaterialCommunityIcons } from '@expo/vector-icons';

import type { IconName } from '../shared/types/ui';

export type DrawerRoute = {
  name: string;
  title: string;
  icon: IconName;
  externalUrl?: string;
};

export const drawerRoutes = [
  {
    name: '(tabs)',
    title: 'Inicio',
    icon: 'home-outline',
  },
  {
    name: 'perfil',
    title: 'Perfil',
    icon: 'account-circle-outline',
  },
  {
    name: 'canales-sat',
    title: 'Canales oficiales SAT',
    icon: 'office-building-outline',
  },
  {
    name: 'whatsat',
    title: 'WhatSAT',
    icon: 'whatsapp',
    externalUrl:
      'https://wa.me/51999431111?text=Hola%20SAT%2C%20necesito%20hacer%20una%20consulta%20sobre%20una%20papeleta.',
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
