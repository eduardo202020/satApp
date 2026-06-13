import type { IconName } from '../../shared/types/ui';

export type InfoPage = {
  title: string;
  eyebrow: string;
  description: string;
  icon: IconName;
  points: string[];
};

export const infoPages = {
  'canales-sat': {
    eyebrow: 'SAT',
    title: 'Canales oficiales SAT',
    description: 'Accesos de referencia para orientar la siguiente accion.',
    icon: 'office-building-outline',
    points: [
      'Mesa de partes digital para presentar solicitudes.',
      'Portal institucional para consultar servicios.',
      'Canales de atencion oficiales antes de actuar.',
    ],
  },
} satisfies Record<string, InfoPage>;
