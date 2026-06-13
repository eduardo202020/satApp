import type { IconName } from '../../shared/types/ui';

export type InfoPage = {
  title: string;
  eyebrow: string;
  description: string;
  icon: IconName;
  points: string[];
};

export const infoPages: Record<string, InfoPage> = {
  ayuda: {
    eyebrow: 'Soporte',
    title: 'Ayuda',
    description: 'Preguntas frecuentes y guias para entender tu ruta clara.',
    icon: 'help-circle-outline',
    points: [
      'Como consultar una papeleta con datos ficticios.',
      'Que significan los estados y riesgos del caso.',
      'Como seguir plazos, opciones y checklist.',
    ],
  },
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
  fuentes: {
    eyebrow: 'Transparencia',
    title: 'Fuentes oficiales',
    description: 'Base normativa e informacion publica para explicar la ruta.',
    icon: 'file-search-outline',
    points: [
      'Normativa de papeletas y procedimientos.',
      'Informacion publica del SAT.',
      'Referencias usadas para el prototipo.',
    ],
  },
  'datos-abiertos': {
    eyebrow: 'Datos',
    title: 'Datos abiertos',
    description: 'Estadisticas y reportes que pueden alimentar el producto.',
    icon: 'chart-box-outline',
    points: [
      'Indicadores de estado por tipo de infraccion.',
      'Riesgos y recordatorios anonimizados.',
      'Tableros futuros para decisiones ciudadanas.',
    ],
  },
  privacidad: {
    eyebrow: 'Seguridad',
    title: 'Privacidad',
    description: 'Este prototipo usa datos ficticios y no guarda datos personales.',
    icon: 'shield-lock-outline',
    points: [
      'No usamos datos personales reales.',
      'Los tokens de enlace serian temporales.',
      'La validacion protege el acceso al caso.',
    ],
  },
  acerca: {
    eyebrow: 'Prototipo',
    title: 'Acerca del prototipo',
    description: 'Papeleta Clara convierte procesos complejos en rutas simples.',
    icon: 'information-outline',
    points: [
      'Inspirado en Hackathon InnovaSAT Lab 2025.',
      'Demo mobile con Expo Go y datos ficticios.',
      'Objetivo: entender, decidir y actuar a tiempo.',
    ],
  },
};
