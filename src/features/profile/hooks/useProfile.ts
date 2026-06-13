import { colors } from '../../../shared/styles/theme';
import type { ActionItem } from '../../../shared/types/ui';

type Profile = {
  initials: string;
  name: string;
  role: string;
  details: ActionItem[];
};

export function useProfile(): Profile {
  return {
    initials: 'EG',
    name: 'Eduardo Guevara',
    role: 'Administrador de satApp',
    details: [
      {
        title: 'Entorno',
        meta: 'WSL2 sobre Ubuntu',
        color: colors.green,
      },
      {
        title: 'Modo recomendado',
        meta: 'npm run start:tunnel -- --clear',
        color: colors.saffron,
      },
    ],
  };
}
