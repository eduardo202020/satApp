import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';
import { toneColor } from '../../shared/data/prototypeData';
import { navigateTo } from '../../shared/navigation/routes';
import { useCases } from './hooks/useCases';
import { useCaseJourney } from './hooks/useCaseJourney';

export default function CaseOptionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const { recommendedOptions } = useCaseJourney(item.id);

  return (
    <ScreenShell
      eyebrow="Opciones"
      title="Que puedes hacer ahora?"
      description={`Segun el estado de ${item.ticketCode ?? item.id}, estas son las acciones recomendadas.`}
      compact
    >
      <View style={styles.list}>
        {recommendedOptions.map((option) => (
          <View style={[styles.option, { backgroundColor: option.tone === 'safe' ? colors.greenLight : option.tone === 'info' ? colors.blueLight : colors.amberLight }]} key={option.title}>
            <MaterialCommunityIcons name={option.icon} size={28} color={toneColor[option.tone]} />
            <View style={styles.optionText}>
              <Text style={styles.title}>{option.title}</Text>
              <Text style={styles.description}>{option.description}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        {recommendedOptions.some((option) => option.action === 'presentar_descargo') && (
          <PrimaryButton label="Preparar descargo demo" onPress={() => navigateTo(`/caso/${id}/tramite`)} />
        )}
        <PrimaryButton label="Preparar checklist" variant="secondary" onPress={() => navigateTo(`/caso/${id}/checklist`)} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginTop: 16,
  },
  option: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  optionText: {
    flex: 1,
  },
  title: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
});
