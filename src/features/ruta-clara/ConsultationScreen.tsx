import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import type { IconName } from '../../shared/types/ui';
import { normalizeSearchValue, type CaseSearchField, type CaseSearchRequest } from './utils/caseSearch';

const inputs = [
  {
    segments: [
      { kind: 'letter', length: 3, separator: '-' },
      { kind: 'number', length: 3 },
    ],
    helper: 'Formato guiado: ABC-123',
    icon: 'car-outline',
    id: 'plate',
    label: 'Placa del vehiculo',
  },
  {
    segments: [
      { choices: ['G', 'L', 'M'], kind: 'choice', length: 1 },
      { kind: 'number', length: 8 },
    ],
    helper: 'Elige G, L o M y completa 8 digitos',
    icon: 'file-document-outline',
    id: 'ticket',
    label: 'Codigo de infraccion',
    mode: 'code',
  },
  {
    segments: [{ kind: 'number', length: 8 }],
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

type SegmentConfig = {
  choices?: string[];
  kind: SegmentKind;
  length: number;
  separator?: string;
};

type SegmentKind = 'choice' | 'letter' | 'number';

export default function ConsultationScreen() {
  const [values, setValues] = useState<Record<CaseSearchField, string>>({
    document: '',
    plate: '',
    ticket: '',
  });
  const searchRequest = getSearchRequest(values);

  function updateField(field: CaseSearchField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function searchCase() {
    if (!searchRequest) {
      return;
    }

    const query = buildQueryParams({
      field: searchRequest.field,
      input: searchRequest.input,
    });

    navigateTo(`/(drawer)/(tabs)/inicio/resultado?${query}`);
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
            helper={item.helper}
            icon={item.icon}
            key={item.label}
            label={item.label}
            mode={item.mode}
            onChange={(value) => updateField(item.id, value)}
            segments={item.segments}
            value={values[item.id]}
          />
        ))}
      </View>

      <View style={styles.helpCard}>
        <MaterialCommunityIcons name="information-outline" size={20} color={colors.blue} />
        <Text style={styles.helpText}>
          Con la placa o DNI veremos las papeletas asociadas. Si ya tienes el numero de papeleta, iremos directo al caso.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Buscar papeletas" disabled={!searchRequest} onPress={searchCase} />
        <PrimaryButton label="No se que dato usar" variant="secondary" onPress={() => navigateTo('/(drawer)/(tabs)/inicio/voz')} />
      </View>
    </ScreenShell>
  );
}

function SegmentedField({
  helper,
  icon,
  label,
  mode,
  onChange,
  segments,
  value,
}: {
  helper: string;
  icon: IconName;
  label: string;
  mode?: 'code';
  onChange: (value: string) => void;
  segments: SegmentConfig[];
  value: string;
}) {
  const segmentKinds = segments.flatMap((segment) => Array.from({ length: segment.length }, () => segment.kind));
  const segmentChoices = segments.flatMap((segment) => Array.from({ length: segment.length }, () => segment.choices ?? []));
  const totalLength = segmentKinds.length;
  const refs = useRef<Array<TextInput | null>>([]);
  const [openChoiceIndex, setOpenChoiceIndex] = useState<number | null>(null);
  const chars = Array.from({ length: totalLength }, (_, index) => value[index] ?? '');

  function updateCharacter(rawValue: string, index: number) {
    const sanitized = sanitizeSegmentValue(rawValue);
    const nextChars = [...chars];

    if (sanitized.length > 1) {
      let targetIndex = index;

      sanitized.split('').forEach((char) => {
        while (targetIndex < totalLength && !isAllowedForKind(char, segmentKinds[targetIndex], segmentChoices[targetIndex])) {
          targetIndex += 1;
        }

        if (targetIndex < totalLength) {
          nextChars[targetIndex] = char;
          targetIndex += 1;
        }
      });
      onChange(nextChars.join('').slice(0, totalLength));
      refs.current[Math.min(targetIndex, totalLength - 1)]?.focus();
      return;
    }

    nextChars[index] = isAllowedForKind(sanitized, segmentKinds[index], segmentChoices[index]) ? sanitized : '';
    onChange(nextChars.join('').slice(0, totalLength));

    if (nextChars[index] && index < totalLength - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function selectChoice(choice: string, index: number) {
    const nextChars = [...chars];
    nextChars[index] = choice;
    onChange(nextChars.join('').slice(0, totalLength));
    setOpenChoiceIndex(null);
    refs.current[index + 1]?.focus();
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
      <View style={styles.inputHeader}>
        <View style={styles.inputIcon}>
          <MaterialCommunityIcons name={icon} size={34} color={colors.blue} />
        </View>
        <View style={styles.inputText}>
          <Text style={styles.inputLabel}>{label}</Text>
          <Text style={styles.inputHint}>{helper}</Text>
        </View>
      </View>
      <View style={[styles.segmentRow, mode === 'code' && styles.segmentRowCode]}>
        {segments.map((segment, groupIndex) => {
          if (segment.kind === 'choice') {
            const currentIndex = charIndex;
            charIndex += segment.length;

            return (
              <View key={`group-${groupIndex}`} style={styles.choiceGroup}>
                <Pressable
                  onPress={() => setOpenChoiceIndex(openChoiceIndex === currentIndex ? null : currentIndex)}
                  style={[styles.choiceButton, chars[currentIndex] && styles.choiceButtonActive]}
                >
                  <Text style={[styles.choiceButtonText, chars[currentIndex] && styles.choiceButtonTextActive]}>
                    {chars[currentIndex] || 'Tipo'}
                  </Text>
                  <MaterialCommunityIcons
                    name={openChoiceIndex === currentIndex ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={chars[currentIndex] ? colors.cream : colors.muted}
                  />
                </Pressable>
              </View>
            );
          }

          const boxes = Array.from({ length: segment.length }, () => {
            const currentIndex = charIndex;
            const kind = segmentKinds[currentIndex];
            charIndex += 1;
            return (
              <TextInput
                autoCapitalize={kind === 'letter' ? 'characters' : 'none'}
                key={currentIndex}
                keyboardType={kind === 'number' ? 'number-pad' : 'default'}
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
                style={[styles.segmentBox, mode === 'code' && styles.segmentBoxCode]}
                value={chars[currentIndex]}
              />
            );
          });

          return (
            <View key={`group-${groupIndex}`} style={styles.segmentGroup}>
              {boxes}
              {segment.separator ? <Text style={styles.fixedSeparator}>{segment.separator}</Text> : null}
            </View>
          );
        })}
      </View>
      {openChoiceIndex !== null ? (
        <View style={styles.choiceMenu}>
          {segments
            .find((segment) => segment.kind === 'choice')
            ?.choices?.map((choice) => (
              <Pressable key={choice} onPress={() => selectChoice(choice, openChoiceIndex)} style={styles.choiceMenuOption}>
                <Text style={styles.choiceMenuText}>{choice}</Text>
              </Pressable>
            ))}
        </View>
      ) : null}
    </View>
  );
}

function sanitizeSegmentValue(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function isAllowedForKind(value: string, kind: SegmentKind, choices: string[]) {
  if (!value) {
    return false;
  }

  if (kind === 'choice') {
    return choices.includes(value);
  }

  return kind === 'number' ? /^[0-9]$/.test(value) : /^[A-Z]$/.test(value);
}

function getSearchRequest(values: Record<CaseSearchField, string>): CaseSearchRequest | null {
  const ticket = normalizeSearchValue(values.ticket);
  const plate = normalizeSearchValue(values.plate);
  const document = normalizeSearchValue(values.document);

  if (ticket.length === 9) {
    return { field: 'ticket', input: ticket };
  }

  if (plate.length === 6) {
    return { field: 'plate', input: plate };
  }

  if (document.length === 8) {
    return { field: 'document', input: document };
  }

  return null;
}

function buildQueryParams(values: CaseSearchRequest) {
  const params = [
    `field=${encodeURIComponent(values.field)}`,
    `input=${encodeURIComponent(values.input)}`,
  ];

  return params.join('&');
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
    marginTop: 16,
  },
  inputCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 78,
    padding: 16,
  },
  inputHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  inputIcon: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 14,
    height: 58,
    justifyContent: 'center',
    width: 58,
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
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 5,
    justifyContent: 'flex-start',
    marginLeft: -2,
    marginTop: 16,
    width: '100%',
  },
  segmentRowCode: {
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
    justifyContent: 'center',
    marginLeft: 0,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  segmentGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  choiceGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  choiceButton: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 2,
    height: 40,
    justifyContent: 'center',
    width: 52,
  },
  choiceButtonActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
  },
  choiceButtonText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  choiceButtonTextActive: {
    color: colors.cream,
  },
  choiceMenu: {
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 4,
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    padding: 8,
    shadowColor: colors.ink,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  choiceMenuOption: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    width: 44,
  },
  choiceMenuText: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: '900',
  },
  segmentBox: {
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    height: 40,
    padding: 0,
    textAlign: 'center',
    width: 30,
  },
  segmentBoxCode: {
    backgroundColor: colors.card,
    fontSize: 15,
    height: 40,
    width: 24,
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
