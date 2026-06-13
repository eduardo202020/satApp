import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import type { IconName } from '../../shared/types/ui';

const inputs = [
  { label: 'Placa del vehiculo', value: 'ABC-123', icon: 'car-outline' },
  { label: 'Numero de papeleta', value: 'Ej. 011-125456', icon: 'file-document-outline' },
  { label: 'DNI / RUC del conductor', value: 'Documento asociado', icon: 'account-outline' },
  { label: 'No se que tengo', value: 'Necesito orientacion', icon: 'help-circle-outline' },
] satisfies { label: string; value: string; icon: IconName }[];

export default function ConsultationScreen() {
  return (
    <ScreenShell
      eyebrow="Consulta"
      title="Que dato tienes a la mano?"
      description="Elige un punto de partida. Para esta demo usaremos datos ficticios."
    >
      <View style={styles.list}>
        {inputs.map((item) => (
          <Pressable key={item.label} style={styles.inputCard}>
            <MaterialCommunityIcons name={item.icon} size={24} color={colors.blue} />
            <View style={styles.inputText}>
              <Text style={styles.inputLabel}>{item.label}</Text>
              <Text style={styles.inputValue}>{item.value}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
          </Pressable>
        ))}
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Buscar papeleta ficticia" onPress={() => navigateTo('/(drawer)/(tabs)/inicio/resultado')} />
        <PrimaryButton label="Usar caso ficticio" variant="secondary" onPress={() => navigateTo('/caso/G11')} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
    marginTop: 16,
  },
  inputCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 70,
    padding: 14,
  },
  inputText: {
    flex: 1,
  },
  inputLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  inputValue: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  actions: {
    gap: 10,
    marginTop: 18,
  },
});
