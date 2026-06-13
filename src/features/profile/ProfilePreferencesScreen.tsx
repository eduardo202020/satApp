import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';

const preferences = [
  'Recibir alertas de vencimiento',
  'Usar WhatSAT como canal principal',
  'Mostrar casos guardados al iniciar',
];

export default function ProfilePreferencesScreen() {
  return (
    <ScreenShell
      eyebrow="Preferencias"
      title="Canales y alertas"
      description="Ajusta como quieres recibir avisos y recordatorios de tus casos."
      compact
    >
      <View style={styles.list}>
        {preferences.map((item) => (
          <View style={styles.row} key={item}>
            <MaterialCommunityIcons name="toggle-switch" size={34} color={colors.green} />
            <Text style={styles.label}>{item}</Text>
          </View>
        ))}
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
    minHeight: 58,
  },
  label: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
});
