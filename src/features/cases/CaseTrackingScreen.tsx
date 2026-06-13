import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from './hooks/useCases';

export default function CaseTrackingScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id ?? 'G11');

  return (
    <ScreenShell
      eyebrow="Seguimiento"
      title={`Caso ${item.id}`}
      description="Vista de continuidad para revisar estado actual, ultima actualizacion y proximo paso."
    >
      <View style={styles.card}>
        <Text style={styles.label}>Estado actual</Text>
        <Text style={styles.state}>{item.stage}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Ultima actualizacion</Text>
        <Text style={styles.value}>23/05/2025 - 9:15 a.m.</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Proximo paso</Text>
        <Text style={styles.value}>{item.nextStep}</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Ver linea de tiempo" onPress={() => navigateTo(`/caso/${item.id}/timeline`)} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 16,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  state: {
    color: colors.green,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },
  value: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: 6,
  },
  actions: {
    marginTop: 16,
  },
});
