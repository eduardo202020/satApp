import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type ActionItem = {
  title: string;
  meta: string;
  color: string;
};

export type RiskLevel = 'Bajo' | 'Medio' | 'Alto';

export type CaseStatus = string;

export type CaseRecord = {
  id: string;
  ticketCode?: string;
  ticketNumber?: string;
  searchTicketNumber?: string;
  documentNumber?: string;
  infraction: string;
  plate: string;
  amount: string;
  dueDate: string;
  issueDate: string;
  queryDate?: string;
  location: string;
  status: CaseStatus;
  risk: RiskLevel;
  canDiscount: boolean;
  stage: string;
  nextStep: string;
  summary?: string;
  evidence?: EvidenceItem[];
  latestSubmission?: SubmissionRecord | null;
};

export type EvidenceItem = {
  id: string;
  type: string;
  title: string;
  description: string;
  capturedAt: string;
  location: string;
  isMock: boolean;
};

export type SubmissionRecord = {
  id: string;
  receiptNumber: string;
  caseId: string;
  action: string;
  status: string;
  summary: string;
  userStatement: string;
  checklist: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
};

export type TimelineStep = {
  title: string;
  date: string;
  state: 'safe' | 'attention' | 'risk' | 'pending';
  description: string;
};

export type CaseOption = {
  title: string;
  description: string;
  tone: 'safe' | 'info' | 'attention';
  icon: IconName;
  action?: string;
};

export type ChecklistItem = {
  label: string;
  done: boolean;
};

export type AlertTone = 'risk' | 'attention' | 'info';

export type CaseAlert = {
  id: string;
  caseId: string;
  title: string;
  description: string;
  time: string;
  tone: AlertTone;
  kind?: string;
};

export type CaseTracking = {
  case: CaseRecord;
  submissions: SubmissionRecord[];
  alerts: CaseAlert[];
};

export type ClearDiagnosis = {
  currentStatus: string;
  plainExplanation: string;
  deadlines: string[];
  risks: string[];
  userNarrativeSummary: string;
  availableActions: string[];
  sources: string[];
  disclaimer: string;
};

export type OfficialChannel = {
  id: string;
  name: string;
  citizen_need: string;
  url: string | null;
  description: string;
};
