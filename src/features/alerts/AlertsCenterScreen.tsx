import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { AlertCard } from './components/AlertCard';
import { useAlerts } from './hooks/useAlerts';

export default function AlertsCenterScreen() {
  const { alerts } = useAlerts();

  return (
    <ScreenShell
      eyebrow="Campanita"
      title="Centro de alertas"
      description="Urgencias, recordatorios y plazos conectados con tus casos."
      compact
    >
      <View style={styles.list}>
        {alerts.map((item) => (
          <AlertCard item={item} key={item.id} />
        ))}
      </View>
      <View style={styles.action}>
        <PrimaryButton label="Configurar recordatorios" onPress={() => navigateTo('/alertas/configurar')} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    marginTop: 16,
  },
  action: {
    marginTop: 16,
  },
});
