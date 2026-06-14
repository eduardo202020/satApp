import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CaseCard } from '../../shared/components/CaseCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from '../cases/hooks/useCases';

export default function ResultScreen() {
  const { caseId, exact, input } = useLocalSearchParams<{
    caseId?: string;
    exact?: string;
    input?: string;
  }>();
  const { cases } = useCases();
  const result = cases.find((item) => item.id === caseId) ?? cases[0];
  const hasExactMatch = exact !== '0';

  return (
    <ScreenShell
      eyebrow="Resultado"
      title={hasExactMatch ? 'Se encontro 1 papeleta' : 'No encontramos coincidencia exacta'}
      description={
        hasExactMatch
          ? 'Revisa el estado, el monto y el siguiente paso recomendado.'
          : 'Verifica los datos ingresados o intenta con placa y numero de papeleta.'
      }
    >
      {hasExactMatch ? (
        <>
          <View style={styles.cardWrap}>
            <CaseCard item={result} compact />
          </View>
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Siguiente paso recomendado</Text>
            <Text style={styles.summaryText}>{result.nextStep}</Text>
          </View>
          <View style={styles.actions}>
            <PrimaryButton label="Ver detalle del caso" onPress={() => navigateTo(`/caso/${result.id}`)} />
            <PrimaryButton label="Nueva consulta" variant="secondary" onPress={() => navigateTo('/(drawer)/(tabs)/inicio/consulta')} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="file-search-outline" size={42} color={colors.blue} />
            <Text style={styles.emptyTitle}>Datos consultados</Text>
            <Text style={styles.emptyValue}>{Array.isArray(input) ? input[0] : input || 'Sin dato ingresado'}</Text>
            <Text style={styles.emptyText}>
              No hay un caso asociado a ese dato en la informacion cargada. Revisa si la placa o papeleta estan bien escritas.
            </Text>
          </View>
          <View style={styles.actions}>
            <PrimaryButton label="Corregir datos" onPress={() => navigateTo('/(drawer)/(tabs)/inicio/consulta')} />
            <PrimaryButton label="Consultar por voz" variant="secondary" onPress={() => navigateTo('/(drawer)/(tabs)/inicio/voz')} />
          </View>
        </>
      )}
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
  emptyCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 22,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 12,
  },
  emptyValue: {
    color: colors.blue,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 10,
    textAlign: 'center',
  },
});
