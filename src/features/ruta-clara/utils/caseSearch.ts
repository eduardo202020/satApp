import type { CaseRecord } from '../../../shared/types/ui';

export type CaseSearchField = 'document' | 'plate' | 'ticket';

export type CaseSearchRequest = {
  field: CaseSearchField;
  input: string;
};

export function findCasesBySearch(cases: CaseRecord[], request: CaseSearchRequest) {
  const input = normalizeSearchValue(request.input);

  if (!input) {
    return [];
  }

  return cases.filter((item) => {
    if (request.field === 'plate') {
      return normalizeSearchValue(item.plate) === input;
    }

    if (request.field === 'document') {
      return normalizeSearchValue(item.documentNumber ?? '') === input;
    }

    return (
      normalizeSearchValue(item.ticketCode ?? item.id) === input ||
      normalizeSearchValue(item.ticketNumber ?? '') === input ||
      normalizeSearchValue(item.searchTicketNumber ?? '') === input ||
      normalizeSearchValue(item.id) === input
    );
  });
}

export function normalizeSearchValue(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function searchFieldLabel(field?: string) {
  if (field === 'plate') return 'placa';
  if (field === 'document') return 'DNI';
  if (field === 'ticket') return 'papeleta';
  return 'dato';
}
