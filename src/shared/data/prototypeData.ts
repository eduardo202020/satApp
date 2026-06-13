import { colors } from '../styles/theme';
import type {
  AlertTone,
  CaseAlert,
  CaseOption,
  CaseRecord,
  ChecklistItem,
  IconName,
  TimelineStep,
} from '../types/ui';

export const cases: CaseRecord[] = [
  {
    id: 'G11',
    infraction: 'Estacionar en zona rigida',
    plate: 'ABC-123',
    amount: 'S/ 440.00',
    dueDate: '28/05/2025',
    issueDate: '23/05/2025',
    location: 'Av. Arequipa 1234 - Lince',
    status: 'En plazo inicial',
    risk: 'Bajo',
    canDiscount: true,
    stage: 'Papeleta emitida',
    nextStep: 'Pagar con descuento o presentar descargo',
  },
  {
    id: 'M20',
    infraction: 'No respetar semaforo',
    plate: 'SAT-202',
    amount: 'S/ 2,575.00',
    dueDate: 'Vencio hace 3 dias',
    issueDate: '18/05/2025',
    location: 'Av. Javier Prado con Guardia Civil',
    status: 'Sancion firme',
    risk: 'Alto',
    canDiscount: false,
    stage: 'Riesgo coactivo',
    nextStep: 'Revisar medidas y canal oficial',
  },
  {
    id: 'G46',
    infraction: 'Exceso de velocidad',
    plate: 'LIM-046',
    amount: 'S/ 880.00',
    dueDate: 'En revision',
    issueDate: '20/05/2025',
    location: 'Via Expresa - tramo central',
    status: 'Apelacion presentada',
    risk: 'Medio',
    canDiscount: false,
    stage: 'Descargo presentado',
    nextStep: 'Hacer seguimiento al expediente',
  },
];

export const timelineSteps: TimelineStep[] = [
  {
    title: 'Papeleta emitida',
    date: '23/05/2025',
    state: 'safe',
    description: 'El SAT registro la infraccion y abrio el plazo inicial.',
  },
  {
    title: 'Inicio del procedimiento',
    date: '23/05/2025',
    state: 'safe',
    description: 'La ruta ya puede consultarse y seguirse desde la app.',
  },
  {
    title: 'Plazo de 5 dias habiles',
    date: 'Vigente',
    state: 'attention',
    description: 'Puedes pagar o presentar descargo dentro del plazo.',
  },
  {
    title: 'Resolucion final de sancion',
    date: 'Pendiente',
    state: 'pending',
    description: 'Se activa si no se registra una accion a tiempo.',
  },
  {
    title: 'Plazo de apelacion',
    date: '15 dias habiles',
    state: 'pending',
    description: 'Etapa disponible luego de una resolucion.',
  },
];

export const recommendedOptions: CaseOption[] = [
  {
    title: 'Pagar con descuento',
    description: 'Aprovecha el beneficio disponible antes del vencimiento.',
    tone: 'safe',
    icon: 'shield-check-outline',
  },
  {
    title: 'Presentar descargo',
    description: 'Si no estas de acuerdo con la infraccion.',
    tone: 'info',
    icon: 'file-document-edit-outline',
  },
  {
    title: 'Ver mas opciones',
    description: 'Apelacion y otras rutas segun la etapa.',
    tone: 'attention',
    icon: 'map-search-outline',
  },
];

export const checklist: ChecklistItem[] = [
  { label: 'Numero de papeleta', done: true },
  { label: 'Placa del vehiculo', done: true },
  { label: 'Documento de identidad', done: true },
  { label: 'Evidencia o sustento opcional', done: false },
];

export const alerts: CaseAlert[] = [
  {
    id: 'alerta-riesgo-m20',
    caseId: 'M20',
    title: 'Riesgo alto',
    description: 'Tu caso M20 puede pasar a ejecucion coactiva.',
    time: 'Hoy, 9:00 a.m.',
    tone: 'risk',
  },
  {
    id: 'alerta-plazo-g11',
    caseId: 'G11',
    title: 'Plazo por vencer',
    description: 'Tu papeleta G11 vence manana 28/05/2025.',
    time: 'Hoy, 8:30 a.m.',
    tone: 'attention',
  },
  {
    id: 'alerta-recordatorio-g46',
    caseId: 'G46',
    title: 'Recordatorio activo',
    description: 'Tienes 1 recordatorio programado.',
    time: 'Ayer, 5:20 p.m.',
    tone: 'info',
  },
];

export const consultationOptions = [
  {
    title: 'Consultar mi papeleta',
    description: 'Busca por placa, numero de papeleta o documento.',
    icon: 'magnify-scan' as IconName,
    href: '/(drawer)/(tabs)/inicio/consulta',
  },
  {
    title: 'Probar caso ficticio',
    description: 'Explora ejemplos para conocer tu ruta clara.',
    icon: 'flask-outline' as IconName,
    href: '/(drawer)/(tabs)/inicio/resultado',
  },
  {
    title: 'Entender una papeleta',
    description: 'Explicamos los conceptos principales.',
    icon: 'text-box-search-outline' as IconName,
    href: '/(drawer)/fuentes',
  },
  {
    title: 'Ver si tengo descuento',
    description: 'Revisa plazos y beneficios disponibles.',
    icon: 'clock-check-outline' as IconName,
    href: '/caso/G11/opciones',
  },
  {
    title: 'Revisar riesgo de captura o retencion',
    description: 'Conoce el nivel de riesgo del caso.',
    icon: 'alert-outline' as IconName,
    href: '/alertas',
  },
];

export const toneColor: Record<AlertTone | CaseOption['tone'], string> = {
  risk: colors.red,
  attention: colors.amber,
  info: colors.blue,
  safe: colors.green,
};
