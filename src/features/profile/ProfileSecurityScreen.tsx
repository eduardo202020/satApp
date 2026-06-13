import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';

const securityItems = [
  'Los enlaces inteligentes usan tokens temporales.',
  'La validacion protege casos abiertos desde alertas.',
  'Este prototipo no guarda datos personales reales.',
];

export default function ProfileSecurityScreen() {
  return (
    <ScreenShell
      eyebrow="Seguridad"
      title="Proteccion de cuenta"
      description="Resumen de medidas pensadas para proteger tus consultas y enlaces."
      compact
    >
      <View style={styles.list}>
        {securityItems.map((item) => (
          <View style={styles.row} key={item}>
            <MaterialCommunityIcons name="shield-check-outline" size={24} color={colors.blue} />
            <Text style={styles.label}>{item}</Text>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
    marginTop: 16,
  },
  row: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  label: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
});
