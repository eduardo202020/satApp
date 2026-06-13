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
  infraction: string;
  plate: string;
  amount: string;
  dueDate: string;
  issueDate: string;
  location: string;
  status: CaseStatus;
  risk: RiskLevel;
  canDiscount: boolean;
  stage: string;
  nextStep: string;
  summary?: string;
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
};

export type OfficialChannel = {
  id: string;
  name: string;
  citizen_need: string;
  url: string | null;
  description: string;
};
