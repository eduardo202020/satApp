import { StyleSheet, Text, View } from 'react-native';

import { CaseCard } from '../../shared/components/CaseCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from '../cases/hooks/useCases';

export default function ResultScreen() {
  const { cases } = useCases();
  const result = cases[0];

  return (
    <ScreenShell
      eyebrow="Resultado"
      title="Se encontro 1 papeleta"
      description="Este resultado usa datos ficticios para mostrar como se veria la ruta clara."
    >
      <View style={styles.cardWrap}>
        <CaseCard item={result} compact />
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Siguiente paso recomendado</Text>
        <Text style={styles.summaryText}>{result.nextStep}</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Ver ruta clara" onPress={() => navigateTo(`/caso/${result.id}`)} />
        <PrimaryButton label="Nueva consulta" variant="secondary" onPress={() => navigateTo('/(drawer)/(tabs)/inicio/consulta')} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    marginTop: 16,
  },
  summary: {
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    marginTop: 14,
    padding: 16,
  },
  summaryTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  summaryText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 6,
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
});
