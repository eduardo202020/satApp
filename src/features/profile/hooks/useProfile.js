import { colors } from '../../../shared/styles/theme';

export function useProfile() {
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
