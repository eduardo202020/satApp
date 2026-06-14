import { useEffect, useState } from 'react';

import { fetchKnowledgeCases } from '../../../shared/api/satApi';
import { cases as prototypeCases } from '../../../shared/data/prototypeData';
import {
  getPendingRegisteredCases,
  subscribePendingRegisteredCases,
} from '../pendingRegistrations';

export function useCases() {
  const [sourceCases, setSourceCases] = useState(prototypeCases);
  const [registeredCases, setRegisteredCases] = useState(getPendingRegisteredCases());
  const cases = [
    ...registeredCases,
    ...sourceCases.filter((sourceCase) => !registeredCases.some((item) => item.id === sourceCase.id)),
  ];

  useEffect(() => subscribePendingRegisteredCases(setRegisteredCases), []);

  useEffect(() => {
    let active = true;

    fetchKnowledgeCases()
      .then((items) => {
        if (active && items.length > 0) {
          setSourceCases(items);
        }
      })
      .catch(() => {
        // The local prototype remains available when FastAPI is offline.
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    cases,
    getCaseById: (id?: string | string[]) => {
      const value = normalizeCaseLookupValue(Array.isArray(id) ? id[0] : id);

      return (
        cases.find((item) => {
          const aliases = [
            item.id,
            item.ticketCode,
            item.ticketNumber,
            item.searchTicketNumber,
            item.plate,
            item.documentNumber,
            ...(item.searchAliases ?? []),
          ].map(normalizeCaseLookupValue);

          return aliases.includes(value);
        }) ?? cases[0]
      );
    },
  };
}

function normalizeCaseLookupValue(value?: string) {
  return (value ?? '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}
