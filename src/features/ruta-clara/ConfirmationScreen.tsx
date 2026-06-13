import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';

export default function ConfirmationScreen() {
  return (
    <ScreenShell
      eyebrow="Confirmacion"
      title="Accion registrada"
      description="Tu proceso fue registrado correctamente y recibiras alertas sobre los siguientes pasos."
    >
      <View style={styles.success}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="check" size={50} color={colors.cream} />
        </View>
        <Text style={styles.title}>Ruta clara actualizada</Text>
        <Text style={styles.body}>Puedes volver a tus casos o iniciar una nueva consulta.</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Ver mis casos" onPress={() => navigateTo('/(drawer)/(tabs)/casos')} />
        <PrimaryButton label="Ir a inicio" variant="secondary" onPress={() => navigateTo('/(drawer)/(tabs)/inicio')} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  success: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 24,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  title: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 18,
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
