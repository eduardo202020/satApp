import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from './hooks/useCases';
import { useCaseJourney } from './hooks/useCaseJourney';

export default function OfficialChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const { officialChannel } = useCaseJourney(item.id);
  const channelName = officialChannel?.name ?? 'Mesa de Partes Digital';
  const channelDescription =
    officialChannel?.description ?? 'Presenta tu descargo o solicitud con los documentos preparados.';

  return (
    <ScreenShell
      eyebrow="Canal oficial SAT"
      title="Realiza tu accion final"
      description="Para completar este proceso, serias redirigido al canal oficial correspondiente."
      compact
    >
      <View style={styles.card}>
        <MaterialCommunityIcons name="office-building-outline" size={34} color={colors.blue} />
        <View style={styles.copy}>
          <Text style={styles.title}>{channelName}</Text>
          <Text style={styles.description}>{channelDescription}</Text>
        </View>
      </View>

      <View style={styles.checks}>
        {['Ya revisaste tu caso', 'Tienes tus documentos listos', 'Sabes que tramite realizar'].map((item) => (
          <View style={styles.check} key={item}>
            <MaterialCommunityIcons name="check" size={18} color={colors.green} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label={officialChannel?.url ? 'Abrir canal oficial' : 'Confirmar accion'}
          onPress={() => {
            if (officialChannel?.url) {
              Linking.openURL(officialChannel.url);
              return;
            }
            navigateTo('/(drawer)/(tabs)/inicio/confirmacion');
          }}
        />
        <PrimaryButton label="Volver a mi ruta" variant="secondary" onPress={() => navigateTo(`/caso/${item.id}`)} />
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
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
    padding: 16,
  },
  copy: {
    flex: 1,
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
    marginTop: 5,
  },
  checks: {
    gap: 9,
    marginTop: 16,
  },
  check: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  checkText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
  },
  actions: {
    gap: 10,
    marginTop: 18,
  },
});
