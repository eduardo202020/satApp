import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from './hooks/useCases';
import { useCaseJourney } from './hooks/useCaseJourney';

export default function CaseChecklistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const { checklist } = useCaseJourney();
  const item = getCaseById(id);

  return (
    <ScreenShell
      eyebrow="Checklist"
      title="Antes de continuar"
      description="Prepara la informacion necesaria para actuar con menos friccion."
      compact
    >
      <View style={styles.list}>
        {checklist.map((entry) => (
          <View style={styles.row} key={entry.label}>
            <MaterialCommunityIcons
              name={entry.done ? 'check-circle' : 'circle-outline'}
              size={24}
              color={entry.done ? colors.green : colors.muted}
            />
            <Text style={styles.label}>{entry.label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Ir al canal oficial" onPress={() => navigateTo(`/caso/${item.id}/canal-oficial`)} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 52,
  },
  label: {
    color: colors.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  actions: {
    marginTop: 16,
  },
});
