import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ResponsiveGrid } from '../../shared/components/ResponsiveGrid';
import {
  documentSegments,
  plateSegments,
  SegmentedField,
  ticketCodeSegments,
  type SegmentConfig,
} from '../../shared/components/SegmentedField';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { useResponsiveLayout } from '../../shared/hooks/useResponsiveLayout';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import type { IconName } from '../../shared/types/ui';
import { normalizeSearchValue, type CaseSearchField, type CaseSearchRequest } from './utils/caseSearch';

const inputs = [
  {
    segments: plateSegments,
    helper: 'Formato guiado: ABC-123',
    icon: 'car-outline',
    id: 'plate',
    label: 'Placa del vehiculo',
  },
  {
    segments: ticketCodeSegments,
    helper: 'Usa G11 o el codigo completo de 9 caracteres',
    icon: 'file-document-outline',
    id: 'ticket',
    label: 'Codigo de infraccion',
    mode: 'code',
  },
  {
    segments: documentSegments,
    helper: 'DNI de 8 digitos',
    icon: 'account-outline',
    id: 'document',
    label: 'DNI',
  },
] satisfies Array<{
  helper: string;
  icon: IconName;
  id: CaseSearchField;
  label: string;
  mode?: 'code';
  segments: SegmentConfig[];
}>;

export default function ConsultationScreen() {
  const { isWide } = useResponsiveLayout();
  const [values, setValues] = useState<Record<CaseSearchField, string>>({
    document: '',
    plate: '',
    ticket: '',
  });
  const searchRequest = getSearchRequest(values);

  function updateField(field: CaseSearchField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function searchCase(request = searchRequest) {
    if (!request) {
      return;
    }

    const query = buildQueryParams({
      field: request.field,
      input: request.input,
    });

    navigateTo(`/(drawer)/(tabs)/inicio/resultado?${query}`);
  }

  return (
    <ScreenShell
      eyebrow="Consulta"
      title="Que dato tienes a la mano?"
      description="Elige el dato que tengas. Te mostraremos estado, descuentos y proximos pasos."
    >
      <ResponsiveGrid minItemWidth={420} style={styles.list}>
        {inputs.map((item) => {
          const fieldSearchRequest = getFieldSearchRequest(item.id, values[item.id]);

          return (
            <SegmentedField
              actionLabel={`Buscar por ${item.label}`}
              actionReady={Boolean(fieldSearchRequest)}
              helper={item.helper}
              icon={item.icon}
              key={item.label}
              label={item.label}
              mode={item.mode}
              onAction={() => {
                if (fieldSearchRequest) {
                  searchCase(fieldSearchRequest);
                }
              }}
              onChange={(value) => updateField(item.id, value)}
              onSubmit={() => {
                if (fieldSearchRequest) {
                  searchCase(fieldSearchRequest);
                }
              }}
              segments={item.segments}
              value={values[item.id]}
            />
          );
        })}
      </ResponsiveGrid>

      <View style={styles.helpCard}>
        <MaterialCommunityIcons name="information-outline" size={20} color={colors.blue} />
        <Text style={styles.helpText}>
          Con la placa o DNI veremos las papeletas asociadas. Si ya tienes el numero de papeleta, iremos directo al caso.
        </Text>
      </View>

      <View style={[styles.actions, isWide && styles.actionsWide]}>
        <PrimaryButton
          label="Ver resultado"
          disabled={!searchRequest}
          onPress={searchCase}
          style={isWide && styles.actionButtonWide}
        />
        <PrimaryButton
          label="No se que dato usar"
          variant="secondary"
          onPress={() => navigateTo('/(drawer)/(tabs)/inicio/voz')}
          style={isWide && styles.actionButtonWide}
        />
      </View>
    </ScreenShell>
  );
}

function getSearchRequest(values: Record<CaseSearchField, string>): CaseSearchRequest | null {
  return (
    getFieldSearchRequest('ticket', values.ticket) ??
    getFieldSearchRequest('plate', values.plate) ??
    getFieldSearchRequest('document', values.document)
  );
}

function getFieldSearchRequest(field: CaseSearchField, value: string): CaseSearchRequest | null {
  const input = normalizeSearchValue(value);

  if (field === 'ticket' && isTicketSearchReady(input)) {
    return { field, input };
  }

  if (field === 'plate' && input.length === 6) {
    return { field, input };
  }

  if (field === 'document' && input.length === 8) {
    return { field, input };
  }

  return null;
}

function isTicketSearchReady(ticket: string) {
  return /^[GLM][0-9]{2}$/.test(ticket) || /^[GLM][0-9]{8}$/.test(ticket);
}

function buildQueryParams(values: CaseSearchRequest) {
  const params = [
    `field=${encodeURIComponent(values.field)}`,
    `input=${encodeURIComponent(values.input)}`,
  ];

  return params.join('&');
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
    marginTop: 18,
  },
  actionsWide: {
    flexDirection: 'row',
  },
  actionButtonWide: {
    flex: 1,
  },
  helpCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    padding: 14,
  },
  helpText: {
    color: colors.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  list: {
    gap: 10,
    marginTop: 16,
  },
});
