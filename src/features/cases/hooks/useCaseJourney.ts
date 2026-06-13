import { useEffect, useState } from 'react';

import { fetchKnowledgeCaseJourney } from '../../../shared/api/satApi';
import {
  checklist,
  recommendedOptions,
  timelineSteps,
} from '../../../shared/data/prototypeData';
import type { OfficialChannel } from '../../../shared/types/ui';

export function useCaseJourney(caseId?: string) {
  const [journey, setJourney] = useState<{
    checklist: typeof checklist;
    recommendedOptions: typeof recommendedOptions;
    timelineSteps: typeof timelineSteps;
    officialChannel: OfficialChannel | null;
  }>({
    checklist,
    recommendedOptions,
    timelineSteps,
    officialChannel: null,
  });

  useEffect(() => {
    if (!caseId) {
      return undefined;
    }

    let active = true;
    fetchKnowledgeCaseJourney(caseId)
      .then((result) => {
        if (active) {
          setJourney(result);
        }
      })
      .catch(() => {
        // Keep the prototype journey when FastAPI is offline.
      });

    return () => {
      active = false;
    };
  }, [caseId]);

  return journey;
}
