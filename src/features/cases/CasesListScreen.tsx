import { CaseCard } from '../../shared/components/CaseCard';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { useCases } from './hooks/useCases';

export default function CasesListScreen() {
  const { cases } = useCases();

  return (
    <ScreenShell
      eyebrow="Seguimiento"
      title="Mis casos"
      description="Retoma casos ya consultados, revisa plazos y continua tu ruta clara."
    >
      {cases.map((item) => (
        <CaseCard item={item} key={item.id} />
      ))}
    </ScreenShell>
  );
}
