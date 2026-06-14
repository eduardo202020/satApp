import { useEffect, useState } from 'react';

import { fetchKnowledgeCases } from '../../../shared/api/satApi';
import { cases as prototypeCases } from '../../../shared/data/prototypeData';

export function useCases() {
  const [cases, setCases] = useState(prototypeCases);

  useEffect(() => {
    let active = true;

    fetchKnowledgeCases()
      .then((items) => {
        if (active && items.length > 0) {
          setCases(items);
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
