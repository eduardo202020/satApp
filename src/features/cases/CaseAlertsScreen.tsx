import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { alerts } from '../../shared/data/prototypeData';

export default function CaseAlertsScreen() {
  return (
    <ScreenShell
      eyebrow="Alertas del caso"
      title="Recordatorios activos"
      description="Alertas relacionadas a tus casos guardados y plazos cercanos."
    >
      <View style={styles.list}>
        {alerts.map((alert) => (
          <View style={styles.card} key={alert.id}>
            <Text style={styles.title}>{alert.title}</Text>
            <Text style={styles.description}>{alert.description}</Text>
            <PrimaryButton label="Ver alerta" variant="secondary" onPress={() => navigateTo(`/alertas/${alert.id}`)} />
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginTop: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
});
