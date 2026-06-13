import { cases } from '../../../shared/data/prototypeData';

export function useCases() {
  return {
    cases,
    getCaseById: (id?: string | string[]) =>
      cases.find((item) => item.id === (Array.isArray(id) ? id[0] : id)) ?? cases[0],
  };
}
