import type { IconName } from '../../../shared/types/ui';

export type ProfileAction = {
  title: string;
  description: string;
  icon: IconName;
  href: string;
};

export function useProfile() {
  return {
    initials: 'JD',
    name: 'Juan Diaz',
    role: 'Conductor verificado',
    phone: '+51 *** *** 789',
    documentStatus: 'Identidad pendiente de validacion',
    actions: [
      {
        title: 'Validar identidad',
        description: 'Confirma que eres el titular antes de abrir casos sensibles.',
        icon: 'account-check-outline' as IconName,
        href: '/(drawer)/perfil/validacion',
      },
      {
        title: 'Preferencias',
        description: 'Gestiona recordatorios, alertas y canales de contacto.',
        icon: 'tune-variant' as IconName,
        href: '/(drawer)/perfil/preferencias',
      },
      {
        title: 'Seguridad',
        description: 'Revisa sesiones, privacidad y proteccion de enlaces.',
        icon: 'shield-lock-outline' as IconName,
        href: '/(drawer)/perfil/seguridad',
      },
    ] satisfies ProfileAction[],
  };
}
