import type {
  CaseOption,
  CaseRecord,
  ChecklistItem,
  OfficialChannel,
  TimelineStep,
} from '../types/ui';

type ApiCase = {
  id: string;
  ticket_code: string;
  ticket_number: string;
  plate: string;
  amount: number | null;
  issue_date: string;
  due_date_label: string;
  stage_name: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  discount_available: boolean;
  next_step: string;
  summary: string;
  infraction: { descripcion: string } | null;
};

type ApiJourney = {
  timeline: TimelineStep[];
  options: Array<Omit<CaseOption, 'icon'> & { action: string }>;
  checklist: ChecklistItem[];
  official_channel: OfficialChannel | null;
};

type ApiCaseDetail = {
  case: ApiCase;
  journey: ApiJourney;
};

const actionIcons: Record<string, CaseOption['icon']> = {
  consultar_deuda: 'cash',
  consultar_expediente: 'file-search-outline',
  consultar_orden_captura: 'car-emergency',
  consultar_papeleta: 'file-document-outline',
  dar_seguimiento: 'timeline-clock-outline',
  pagar: 'credit-card-check-outline',
  presentar_apelacion: 'file-document-edit-outline',
  presentar_descargo: 'file-document-edit-outline',
  presentar_reclamo: 'file-document-edit-outline',
  presentar_solicitud: 'file-document-edit-outline',
  regularizar_deuda: 'cash-check',
  revisar_papeleta: 'text-box-search-outline',
};

function getApiBaseUrl() {
  return process.env.EXPO_PUBLIC_SAT_API_URL?.replace(/\/$/, '') ?? null;
}

async function apiFetch<T>(path: string): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('EXPO_PUBLIC_SAT_API_URL no está configurada.');
  }

  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`SAT API respondió ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

function riskLabel(risk: ApiCase['risk_level']): CaseRecord['risk'] {
  if (risk === 'critical' || risk === 'high') {
    return 'Alto';
  }
  if (risk === 'medium') {
    return 'Medio';
  }
  return 'Bajo';
}

function mapCase(item: ApiCase): CaseRecord {
  return {
    id: item.id,
    ticketCode: item.ticket_code,
    ticketNumber: item.ticket_number,
    infraction: item.infraction?.descripcion ?? 'Descripción pendiente de validación',
    plate: item.plate,
    amount: item.amount === null ? 'Monto por verificar' : `S/ ${item.amount.toFixed(2)}`,
    dueDate: item.due_date_label,
    issueDate: item.issue_date,
    location: 'Caso demo sin ubicación real',
    status: item.stage_name,
    risk: riskLabel(item.risk_level),
    canDiscount: item.discount_available,
    stage: item.stage_name,
    nextStep: item.next_step,
    summary: item.summary,
  };
}

function mapJourney(journey: ApiJourney) {
  return {
    timelineSteps: journey.timeline,
    recommendedOptions: journey.options.map((item) => ({
      ...item,
      icon: actionIcons[item.action] ?? 'arrow-right-circle-outline',
    })),
    checklist: journey.checklist,
    officialChannel: journey.official_channel,
  };
}

export async function fetchKnowledgeCases() {
  const payload = await apiFetch<ApiCase[]>('/cases');
  return payload.map(mapCase);
}

export async function fetchKnowledgeCaseJourney(caseId: string) {
  const payload = await apiFetch<ApiCaseDetail>(`/cases/${encodeURIComponent(caseId)}`);
  return {
    case: mapCase(payload.case),
    ...mapJourney(payload.journey),
  };
}
