import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CaseCard } from '../../shared/components/CaseCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from '../cases/hooks/useCases';
import { findCasesBySearch, searchFieldLabel, type CaseSearchField } from './utils/caseSearch';

export default function ResultScreen() {
  const { caseId, field, input } = useLocalSearchParams<{
    caseId?: string;
    field?: CaseSearchField;
    input?: string;
  }>();
  const { cases } = useCases();
  const queryInput = Array.isArray(input) ? input[0] : input;
  const queryField = Array.isArray(field) ? field[0] : field;
  const matches = queryField && queryInput
    ? findCasesBySearch(cases, { field: queryField, input: queryInput })
    : cases.filter((item) => item.id === caseId);
  const hasMatches = matches.length > 0;
  const resultCountLabel = matches.length === 1 ? '1 papeleta' : `${matches.length} papeletas`;

  return (
    <ScreenShell
      eyebrow="Resultado"
      title={hasMatches ? `Se encontro ${resultCountLabel}` : 'No encontramos papeletas'}
      description={
        hasMatches
          ? `Estas son las papeletas asociadas a ${searchFieldLabel(queryField)}.`
          : 'Verifica los datos ingresados o intenta con placa, DNI o numero de papeleta.'
      }
    >
      {hasMatches ? (
        <>
          <View style={styles.resultsList}>
            {matches.map((item) => (
              <View style={styles.cardWrap} key={item.id}>
                <CaseCard item={item} compact />
              </View>
            ))}
          </View>
        </>
      ) : (
        <>
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="file-search-outline" size={42} color={colors.blue} />
            <Text style={styles.emptyTitle}>Datos consultados</Text>
            <Text style={styles.emptyValue}>{queryInput || 'Sin dato ingresado'}</Text>
            <Text style={styles.emptyText}>
              No hay papeletas asociadas a ese dato en la informacion cargada. Revisa si la placa, DNI o papeleta estan bien escritos.
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
  resultsList: {
    gap: 12,
    marginTop: 16,
  },
  cardWrap: {
    marginTop: 0,
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
