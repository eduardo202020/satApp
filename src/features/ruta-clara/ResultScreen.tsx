import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { CaseCard } from '../../shared/components/CaseCard';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResponsiveGrid } from '../../shared/components/ResponsiveGrid';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { useResponsiveLayout } from '../../shared/hooks/useResponsiveLayout';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from '../cases/hooks/useCases';
import { findCasesBySearch, searchFieldLabel, type CaseSearchField } from './utils/caseSearch';

export default function ResultScreen() {
  const { isWide } = useResponsiveLayout();
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
  const registrationQuery = buildRegistrationQuery(queryField, queryInput);

  return (
    <ScreenShell
      eyebrow="Resultado"
      title={hasMatches ? `Se encontro ${resultCountLabel}` : 'No encontramos papeletas'}
      description={
        hasMatches
          ? `Estas son las papeletas asociadas a ${searchFieldLabel(queryField)}.`
          : 'Puede que el SAT aun no haya procesado la papeleta. Si ya la tienes, registrala para seguimiento.'
      }
    >
      {hasMatches ? (
        <>
          <ResponsiveGrid minItemWidth={360} style={styles.resultsList}>
            {matches.map((item) => (
              <View style={styles.cardWrap} key={item.id}>
                <CaseCard item={item} compact />
              </View>
            ))}
          </ResponsiveGrid>
        </>
      ) : (
        <>
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="file-search-outline" size={42} color={colors.blue} />
            <Text style={styles.emptyTitle}>Datos consultados</Text>
            <Text style={styles.emptyValue}>{queryInput || 'Sin dato ingresado'}</Text>
            <Text style={styles.emptyText}>
              No encontramos papeletas asociadas a ese dato. Si la papeleta fue emitida hace poco, puede tardar unos dias en aparecer.
            </Text>
          </View>
          <View style={styles.registerCard}>
            <View style={styles.registerIcon}>
              <MaterialCommunityIcons name="file-plus-outline" size={30} color={colors.blue} />
            </View>
            <View style={styles.registerText}>
              <Text style={styles.registerTitle}>Ya tengo la papeleta fisica</Text>
              <Text style={styles.registerBody}>
                Registrala de forma preliminar para recordar el pago, preparar documentos y seguirla cuando aparezca en SAT.
              </Text>
            </View>
          </View>
          <View style={[styles.actions, isWide && styles.actionsWide]}>
            <PrimaryButton
              label="Registrar papeleta"
              onPress={() => navigateTo(`/(drawer)/(tabs)/inicio/registrar-papeleta?${registrationQuery}`)}
              style={isWide && styles.actionButtonWide}
            />
            <PrimaryButton
              label="Corregir datos"
              onPress={() => navigateTo('/(drawer)/(tabs)/inicio/consulta')}
              style={isWide && styles.actionButtonWide}
            />
            <PrimaryButton
              label="Consultar por voz"
              variant="secondary"
              onPress={() => navigateTo('/(drawer)/(tabs)/inicio/voz')}
              style={isWide && styles.actionButtonWide}
            />
          </View>
        </>
      )}
    </ScreenShell>
  );
}

function buildRegistrationQuery(field?: CaseSearchField, input?: string) {
  const params = [];

  if (field) {
    params.push(`field=${encodeURIComponent(field)}`);
  }

  if (input) {
    params.push(`input=${encodeURIComponent(input)}`);
  }

  return params.join('&');
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
  actionsWide: {
    flexDirection: 'row',
  },
  actionButtonWide: {
    flex: 1,
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
  registerBody: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
  },
  registerCard: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    padding: 16,
  },
  registerIcon: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  registerText: {
    flex: 1,
  },
  registerTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
});
