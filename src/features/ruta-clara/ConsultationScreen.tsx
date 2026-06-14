import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import type { IconName } from '../../shared/types/ui';
import { useCases } from '../cases/hooks/useCases';

const inputs = [
  {
    groups: [3, 3],
    helper: 'Formato guiado: ABC-123',
    icon: 'car-outline',
    id: 'plate',
    keyboardType: 'default',
    label: 'Placa del vehiculo',
  },
  {
    groups: [3, 6],
    helper: 'Puedes usar el numero 011-125456 o codigo G11',
    icon: 'file-document-outline',
    id: 'ticket',
    keyboardType: 'default',
    label: 'Numero de papeleta',
  },
  {
    groups: [8],
    helper: 'DNI de 8 digitos',
    icon: 'account-outline',
    id: 'document',
    keyboardType: 'number-pad',
    label: 'DNI',
  },
] satisfies Array<{
  groups: number[];
  helper: string;
  icon: IconName;
  id: SearchField;
  keyboardType: 'default' | 'number-pad';
  label: string;
}>;

type SearchField = 'document' | 'plate' | 'ticket';

export default function ConsultationScreen() {
  const { cases } = useCases();
  const [values, setValues] = useState<Record<SearchField, string>>({
    document: '',
    plate: '',
    ticket: '',
  });
  const hasSearch = Object.values(values).some((value) => value.trim().length > 0);

  function updateField(field: SearchField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function searchCase() {
    const match = findMatchingCase();
    const query = buildQueryParams({
      caseId: match?.id,
      exact: match ? '1' : '0',
      input: values.plate || values.ticket || values.document,
    });

    navigateTo(`/(drawer)/(tabs)/inicio/resultado?${query}`);
  }

  function findMatchingCase() {
    const plate = normalize(values.plate);
    const ticket = normalize(values.ticket);

    return cases.find((item) => {
      const itemPlate = normalize(item.plate);
      const itemTicketCode = normalize(item.ticketCode ?? item.id);
      const itemTicketNumber = normalize(item.ticketNumber ?? '');

      return (
        (plate.length > 0 && itemPlate === plate) ||
        (ticket.length > 0 &&
          (itemTicketCode === ticket || itemTicketNumber === ticket || normalize(item.id) === ticket))
      );
    });
  }

  return (
    <ScreenShell
      eyebrow="Consulta"
      title="Que dato tienes a la mano?"
      description="Elige el dato que tengas. Te mostraremos estado, descuentos y proximos pasos."
    >
      <View style={styles.list}>
        {inputs.map((item) => (
          <SegmentedField
            groups={item.groups}
            helper={item.helper}
            icon={item.icon}
            key={item.label}
            keyboardType={item.keyboardType}
            label={item.label}
            onChange={(value) => updateField(item.id, value)}
            value={values[item.id]}
          />
        ))}
      </View>

      <View style={styles.helpCard}>
        <MaterialCommunityIcons name="information-outline" size={20} color={colors.blue} />
        <Text style={styles.helpText}>
          Puedes buscar con uno o varios datos. Si no hay coincidencia exacta, te pediremos revisar la informacion.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Buscar papeleta" disabled={!hasSearch} onPress={searchCase} />
        <PrimaryButton label="No se que dato usar" variant="secondary" onPress={() => navigateTo('/(drawer)/(tabs)/inicio/voz')} />
      </View>
    </ScreenShell>
  );
}

function SegmentedField({
  groups,
  helper,
  icon,
  keyboardType,
  label,
  onChange,
  value,
}: {
  groups: number[];
  helper: string;
  icon: IconName;
  keyboardType: 'default' | 'number-pad';
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  const totalLength = groups.reduce((total, group) => total + group, 0);
  const refs = useRef<Array<TextInput | null>>([]);
  const chars = Array.from({ length: totalLength }, (_, index) => value[index] ?? '');

  function updateCharacter(rawValue: string, index: number) {
    const sanitized = sanitizeSegmentValue(rawValue, keyboardType);
    const nextChars = [...chars];

    if (sanitized.length > 1) {
      sanitized
        .slice(0, totalLength - index)
        .split('')
        .forEach((char, offset) => {
          nextChars[index + offset] = char;
        });
      onChange(nextChars.join('').slice(0, totalLength));
      refs.current[Math.min(index + sanitized.length, totalLength - 1)]?.focus();
      return;
    }

    nextChars[index] = sanitized;
    onChange(nextChars.join('').slice(0, totalLength));

    if (sanitized && index < totalLength - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleBackspace(index: number) {
    if (chars[index] || index === 0) {
      return;
    }

    refs.current[index - 1]?.focus();
  }

  let charIndex = 0;

  return (
    <View style={styles.inputCard}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.blue} />
      <View style={styles.inputText}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Text style={styles.inputHint}>{helper}</Text>
        <View style={styles.segmentRow}>
          {groups.map((groupLength, groupIndex) => {
            const boxes = Array.from({ length: groupLength }, () => {
              const currentIndex = charIndex;
              charIndex += 1;
              return (
                <TextInput
                  autoCapitalize="characters"
                  key={currentIndex}
                  keyboardType={keyboardType}
                  maxLength={1}
                  onChangeText={(rawValue) => updateCharacter(rawValue, currentIndex)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                      handleBackspace(currentIndex);
                    }
                  }}
                  ref={(ref) => {
                    refs.current[currentIndex] = ref;
                  }}
                  selectTextOnFocus
                  style={styles.segmentBox}
                  value={chars[currentIndex]}
                />
              );
            });

            return (
              <View key={`group-${groupIndex}`} style={styles.segmentGroup}>
                {boxes}
                {groupIndex < groups.length - 1 ? <Text style={styles.fixedSeparator}>-</Text> : null}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function normalize(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function sanitizeSegmentValue(value: string, keyboardType: 'default' | 'number-pad') {
  const pattern = keyboardType === 'number-pad' ? /[^0-9]/g : /[^A-Z0-9]/g;
  return value.toUpperCase().replace(pattern, '');
}

function buildQueryParams(values: { caseId?: string; exact: string; input: string }) {
  const params = [
    `exact=${encodeURIComponent(values.exact)}`,
    `input=${encodeURIComponent(values.input)}`,
  ];

  if (values.caseId) {
    params.push(`caseId=${encodeURIComponent(values.caseId)}`);
  }

  return params.join('&');
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
    marginTop: 16,
  },
  inputCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 78,
    padding: 16,
  },
  inputText: {
    flex: 1,
  },
  inputLabel: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  inputHint: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  segmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 12,
  },
  segmentGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  segmentBox: {
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    height: 42,
    padding: 0,
    textAlign: 'center',
    width: 34,
  },
  fixedSeparator: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
    marginHorizontal: 1,
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
  actions: {
    gap: 10,
    marginTop: 18,
  },
});
