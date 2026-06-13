import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';

export default function ProfileValidationScreen() {
  return (
    <ScreenShell
      eyebrow="Validacion"
      title="Verifica tu identidad"
      description="Por seguridad, necesitamos confirmar que eres tu antes de mostrar informacion sensible."
      compact
    >
      <View style={styles.card}>
        <Text style={styles.label}>Metodo sugerido</Text>
        <Text style={styles.title}>Codigo por SMS</Text>
        <Text style={styles.text}>Enviaremos un codigo al numero asociado a tu cuenta demo.</Text>
      </View>
      <PrimaryButton label="Enviar codigo" />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    marginBottom: 16,
    marginTop: 16,
    padding: 18,
  },
  label: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  text: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
});
