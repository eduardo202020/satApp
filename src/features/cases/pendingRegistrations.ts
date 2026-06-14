import type { CaseRecord, SubmissionRecord } from '../../shared/types/ui';

type PendingRegistrationInput = {
  amount?: string;
  attachmentName?: string;
  attachmentUri?: string;
  attached: boolean;
  documentNumber?: string;
  issueDate?: string;
  note?: string;
  plate: string;
  ticketNumber: string;
};

type Listener = (cases: CaseRecord[]) => void;

const listeners = new Set<Listener>();
let registeredCases: CaseRecord[] = [];

export function getPendingRegisteredCases() {
  return registeredCases;
}

export function subscribePendingRegisteredCases(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function registerPendingTicket(input: PendingRegistrationInput) {
  const now = new Date();
  const timestamp = now.getTime();
  const normalizedTicket = normalizeValue(input.ticketNumber);
  const normalizedPlate = normalizeValue(input.plate);
  const ticketCode = getTicketCode(normalizedTicket);
  const ticketNumber = normalizedTicket || `REG${String(timestamp).slice(-6)}`;
  const id = `registro-${ticketNumber}-${String(timestamp).slice(-5)}`.toLowerCase();
  const receiptNumber = `REG-${String(timestamp).slice(-6)}`;
  const attachmentName = input.attachmentName?.trim() || 'foto-papeleta.jpg';
  const latestSubmission: SubmissionRecord = {
    action: 'registrar_papeleta',
    attachments: input.attached ? [attachmentName] : [],
    caseId: id,
    checklist: ['Datos principales', 'Copia o foto de la papeleta', 'Seguimiento pendiente'],
    createdAt: now.toISOString(),
    id: `submission-${timestamp}`,
    receiptNumber,
    status: 'Registrado para seguimiento',
    summary: 'Registro preliminar creado mientras el SAT procesa la papeleta.',
    updatedAt: now.toISOString(),
    userStatement: input.note?.trim() || 'Papeleta registrada por el usuario porque aun no aparece en consulta SAT.',
  };
  const caseRecord: CaseRecord = {
    amount: formatAmount(input.amount),
    canDiscount: false,
    documentNumber: normalizeValue(input.documentNumber),
    dueDate: 'Pendiente de procesamiento SAT',
    evidence: [
      {
        capturedAt: now.toISOString(),
        description: 'Adjunto registrado por el usuario para facilitar pago y seguimiento cuando el SAT procese la papeleta.',
        id: `evidence-${timestamp}`,
        isMock: true,
        imageAsset: input.attachmentUri,
        location: 'Adjunto del usuario',
        title: 'Foto o copia de papeleta',
        type: 'photo',
      },
    ],
    id,
    infraction: ticketCode ? `Codigo ${ticketCode} pendiente de validacion` : 'Papeleta pendiente de validacion',
    issueDate: input.issueDate?.trim() || 'Por validar',
    latestSubmission,
    location: 'Por validar',
    nextStep: 'Conserva la papeleta y revisa Mis casos. Cuando el SAT la procese, podras pagar o seguir el tramite.',
    plate: formatPlate(input.plate),
    queryDate: now.toISOString().slice(0, 10),
    risk: 'Bajo',
    searchAliases: [
      id,
      ticketCode,
      ticketNumber,
      input.ticketNumber,
      input.plate,
      normalizedPlate,
      input.documentNumber,
      receiptNumber,
    ].filter((value): value is string => Boolean(value)),
    searchTicketNumber: ticketNumber,
    stage: 'Registro preliminar',
    status: 'Pendiente de registro SAT',
    summary: 'Esta papeleta fue registrada manualmente porque aun no aparece en la consulta. Sirve para recordatorio, seguimiento y preparacion de pago.',
    ticketCode,
    ticketNumber,
  };

  registeredCases = [caseRecord, ...registeredCases.filter((item) => item.ticketNumber !== ticketNumber)];
  emit();

  return caseRecord;
}

function emit() {
  listeners.forEach((listener) => listener(registeredCases));
}

function normalizeValue(value?: string) {
  return (value ?? '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function getTicketCode(ticketNumber: string) {
  if (/^[GLM][0-9]{2}/.test(ticketNumber)) {
    return ticketNumber.slice(0, 3);
  }

  return undefined;
}

function formatPlate(value: string) {
  const normalized = normalizeValue(value);

  if (/^[A-Z]{3}[0-9]{3}$/.test(normalized)) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
  }

  return value.trim().toUpperCase() || 'Por validar';
}

function formatAmount(value?: string) {
  const amount = value?.trim();

  if (!amount) {
    return 'Monto por confirmar';
  }

  return amount.toUpperCase().startsWith('S/') ? amount : `S/ ${amount}`;
}
