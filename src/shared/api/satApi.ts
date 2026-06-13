import type {
  CaseAlert,
  CaseOption,
  CaseRecord,
  CaseTracking,
  ChecklistItem,
  ClearDiagnosis,
  EvidenceItem,
  OfficialChannel,
  SubmissionRecord,
  TimelineStep,
} from '../types/ui';

type ApiEvidence = {
  id: string;
  type: string;
  title: string;
  description: string;
  captured_at: string;
  location: string;
  is_mock: boolean;
};

type ApiSubmission = {
  id: string;
  receipt_number: string;
  case_id: string;
  action: string;
  status: string;
  summary: string;
  user_statement: string;
  checklist: string[];
  attachments: string[];
  created_at: string;
  updated_at: string;
};

type ApiAlert = {
  id: string;
  case_id: string;
  title: string;
  description: string;
  tone: CaseAlert['tone'];
  kind: string;
  created_at: string;
};

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
  evidence?: ApiEvidence[];
  latest_submission?: ApiSubmission | null;
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

type ApiDiagnosis = {
  current_status: string;
  plain_explanation: string;
  deadlines: string[];
  risks: string[];
  user_narrative_summary: string;
  available_actions: string[];
  sources: Array<string | { file: string; page: number | null; url: string | null }>;
  disclaimer: string;
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

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new Error('EXPO_PUBLIC_SAT_API_URL no está configurada.');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(detail?.detail ?? `SAT API respondió ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

function riskLabel(risk: ApiCase['risk_level']): CaseRecord['risk'] {
  if (risk === 'critical' || risk === 'high') return 'Alto';
  if (risk === 'medium') return 'Medio';
  return 'Bajo';
}

function mapEvidence(item: ApiEvidence): EvidenceItem {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    capturedAt: item.captured_at,
    location: item.location,
    isMock: item.is_mock,
  };
}

function mapSubmission(item: ApiSubmission): SubmissionRecord {
  return {
    id: item.id,
    receiptNumber: item.receipt_number,
    caseId: item.case_id,
    action: item.action,
    status: item.status,
    summary: item.summary,
    userStatement: item.user_statement,
    checklist: item.checklist,
    attachments: item.attachments,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

function mapAlert(item: ApiAlert): CaseAlert {
  return {
    id: item.id,
    caseId: item.case_id,
    title: item.title,
    description: item.description,
    time: new Date(item.created_at).toLocaleString('es-PE'),
    tone: item.tone,
    kind: item.kind,
  };
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
    location: item.evidence?.[0]?.location ?? 'Caso demo sin ubicación real',
    status: item.stage_name,
    risk: riskLabel(item.risk_level),
    canDiscount: item.discount_available,
    stage: item.stage_name,
    nextStep: item.next_step,
    summary: item.summary,
    evidence: item.evidence?.map(mapEvidence) ?? [],
    latestSubmission: item.latest_submission ? mapSubmission(item.latest_submission) : null,
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
  const payload = await apiRequest<ApiCase[]>('/cases');
  return payload.map(mapCase);
}

export async function fetchKnowledgeCaseJourney(caseId: string) {
  const payload = await apiRequest<ApiCaseDetail>(`/cases/${encodeURIComponent(caseId)}`);
  return { case: mapCase(payload.case), ...mapJourney(payload.journey) };
}

export async function fetchClearDiagnosis(caseId: string, narrative: string): Promise<ClearDiagnosis> {
  const payload = await apiRequest<{ diagnosis: ApiDiagnosis }>('/diagnostico-claro', {
    method: 'POST',
    body: JSON.stringify({
      caseId,
      userNarrativeTranscript: narrative,
      queryDate: new Date().toISOString().slice(0, 10),
    }),
  });
  return {
    currentStatus: payload.diagnosis.current_status,
    plainExplanation: payload.diagnosis.plain_explanation,
    deadlines: payload.diagnosis.deadlines,
    risks: payload.diagnosis.risks,
    userNarrativeSummary: payload.diagnosis.user_narrative_summary,
    availableActions: payload.diagnosis.available_actions,
    sources: payload.diagnosis.sources.map((source) => {
      if (typeof source === 'string') return source;
      return `${source.file}${source.page ? `, página ${source.page}` : ''}${source.url ? ` · ${source.url}` : ''}`;
    }),
    disclaimer: payload.diagnosis.disclaimer,
  };
}

export async function submitCaseAction(
  caseId: string,
  payload: { action: string; userStatement: string; checklist: string[]; attachments: string[] },
) {
  const response = await apiRequest<{ submission: ApiSubmission }>(
    `/cases/${encodeURIComponent(caseId)}/actions`,
    { method: 'POST', body: JSON.stringify(payload) },
  );
  return mapSubmission(response.submission);
}

export async function fetchSubmission(submissionId: string) {
  return mapSubmission(await apiRequest<ApiSubmission>(`/submissions/${encodeURIComponent(submissionId)}`));
}

export async function fetchCaseTracking(caseId: string): Promise<CaseTracking> {
  const response = await apiRequest<{ case: ApiCase; submissions: ApiSubmission[]; alerts: ApiAlert[] }>(
    `/cases/${encodeURIComponent(caseId)}/tracking`,
  );
  return {
    case: mapCase(response.case),
    submissions: response.submissions.map(mapSubmission),
    alerts: response.alerts.map(mapAlert),
  };
}

export async function fetchAlerts() {
  return (await apiRequest<ApiAlert[]>('/alerts')).map(mapAlert);
}
