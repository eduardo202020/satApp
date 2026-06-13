import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { StatusPill } from '../../shared/components/StatusPill';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from './hooks/useCases';

export default function CaseEvidenceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);

  return (
    <ScreenShell
      eyebrow="Detectar"
      title="Revisa qué ocurrió"
      description="Antes de decidir, contrasta la información registrada. Todo lo mostrado en esta historia es ficticio."
      compact
    >
      <View style={styles.banner}>
        <MaterialCommunityIcons name="shield-check-outline" size={24} color={colors.blue} />
        <Text style={styles.bannerText}>Caso demo: no contiene datos personales ni evidencia real.</Text>
      </View>
      <View style={styles.list}>
        {(item.evidence ?? []).map((evidence) => (
          <View style={styles.card} key={evidence.id}>
            <View style={styles.visual}>
              <MaterialCommunityIcons name={evidence.type === 'photo' ? 'camera-outline' : 'clipboard-text-outline'} size={54} color={colors.blue} />
              <StatusPill label="Evidencia ficticia" tone="info" />
            </View>
            <Text style={styles.title}>{evidence.title}</Text>
            <Text style={styles.description}>{evidence.description}</Text>
            <Text style={styles.meta}>{evidence.location}</Text>
            <Text style={styles.meta}>{new Date(evidence.capturedAt).toLocaleString('es-PE')}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Entender mi situación" onPress={() => navigateTo(`/caso/${id}/diagnostico`)} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    padding: 14,
  },
  bannerText: { color: colors.ink, flex: 1, fontSize: 13, fontWeight: '800', lineHeight: 18 },
  list: { gap: 12, marginTop: 12 },
  card: { backgroundColor: colors.card, borderColor: colors.line, borderRadius: 8, borderWidth: 1, padding: 16 },
  visual: { alignItems: 'center', backgroundColor: colors.background, borderRadius: 8, gap: 10, justifyContent: 'center', minHeight: 140 },
  title: { color: colors.ink, fontSize: 17, fontWeight: '900', marginTop: 14 },
  description: { color: colors.muted, fontSize: 13, fontWeight: '700', lineHeight: 19, marginTop: 6 },
  meta: { color: colors.muted, fontSize: 11, fontWeight: '700', marginTop: 7 },
  actions: { marginTop: 16 },
});
