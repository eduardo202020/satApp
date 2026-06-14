import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { toneColor } from '../../shared/data/prototypeData';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useAlerts } from './hooks/useAlerts';

export default function AlertDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getAlertById } = useAlerts();
  const alert = getAlertById(id);

  return (
    <ScreenShell
      eyebrow="Detalle de alerta"
      title={alert.title}
      description={alert.description}
      compact
    >
      <View style={styles.card}>
        <MaterialCommunityIcons name="clock-alert-outline" size={42} color={toneColor[alert.tone]} />
        <Text style={styles.title}>{alert.caseId}</Text>
        <Text style={styles.body}>
          Aun puedes revisar tu caso, entender opciones y decidir el siguiente paso.
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Ver caso relacionado" onPress={() => navigateTo(`/caso/${alert.caseId}`)} />
        <PrimaryButton label="Ver opciones" variant="secondary" onPress={() => navigateTo(`/caso/${alert.caseId}/opciones`)} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 24,
  },
  title: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
    marginTop: 12,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
});
