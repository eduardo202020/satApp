import { StyleSheet } from 'react-native';

import { CaseCard } from '../../shared/components/CaseCard';
import { ResponsiveGrid } from '../../shared/components/ResponsiveGrid';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { useCases } from './hooks/useCases';

export default function CasesListScreen() {
  const { cases } = useCases();

  return (
    <ScreenShell
      eyebrow="Seguimiento"
      title="Mis casos"
      description="Retoma casos consultados, revisa plazos y continua con el siguiente paso."
    >
      <ResponsiveGrid minItemWidth={420} style={styles.grid}>
        {cases.map((item) => (
          <CaseCard item={item} key={item.id} style={styles.card} />
        ))}
      </ResponsiveGrid>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 0,
  },
  grid: {
    marginTop: 16,
  },
});
