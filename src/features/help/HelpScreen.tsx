import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ResponsiveGrid } from '../../shared/components/ResponsiveGrid';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { useSpeechReader } from '../../shared/hooks/useSpeechReader';
import { useResponsiveLayout } from '../../shared/hooks/useResponsiveLayout';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const flowSteps: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: 'magnify-scan',
    title: '1. Consulta',
    text: 'Busca por placa, DNI o número de papeleta. Si no aparece, puedes registrarla para seguimiento.',
  },
  {
    icon: 'file-document-outline',
    title: '2. Entiende',
    text: 'Revisa qué significa la infracción y qué datos conviene confirmar antes de decidir.',
  },
  {
    icon: 'calendar-clock',
    title: '3. Mira fechas',
    text: 'La línea de tiempo te muestra días hábiles, descuentos y fecha de consulta en calendario.',
  },
  {
    icon: 'cash-check',
    title: '4. Actúa',
    text: 'Puedes pagar, preparar descargo o dar seguimiento al caso desde Mis casos.',
  },
];

const tabGuides: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: 'briefcase-outline',
    title: 'Casos',
    text: 'Aquí ves tus papeletas registradas y el estado de cada una.',
  },
  {
    icon: 'home-variant-outline',
    title: 'Inicio',
    text: 'Es el punto de partida para consultar, usar voz o revisar una papeleta.',
  },
  {
    icon: 'help-circle-outline',
    title: 'Ayuda',
    text: 'Explica cómo usar la app paso a paso cuando tengas dudas.',
  },
];

export default function HelpScreen() {
  const { isWide } = useResponsiveLayout();
  const { speaking, toggleSpeech } = useSpeechReader();
  const speechText = [
    'Cómo usar SatApp.',
    'Primero consulta tu papeleta por placa, DNI o número.',
    'Luego entra a entender mi situación para revisar qué significa la infracción.',
    'Después mira la línea de tiempo para conocer fechas y descuentos.',
    'Finalmente elige si quieres pagar, presentar un descargo o dar seguimiento desde tus casos.',
  ].join(' ');

  return (
    <ScreenShell
      eyebrow="Ayuda"
      title="Cómo usar SatApp"
      description="Una guía simple para consultar, entender y resolver una papeleta sin perderse."
    >
      <View style={styles.heroCard}>
        <MaterialCommunityIcons name="hand-heart-outline" size={34} color={colors.blue} />
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>No necesitas conocer trámites</Text>
          <Text style={styles.heroBody}>
            La app separa cada paso para que primero entiendas, luego revises fechas y finalmente decidas qué hacer.
          </Text>
          <Pressable accessibilityRole="button" onPress={() => toggleSpeech(speechText)} style={styles.listenButton}>
            <MaterialCommunityIcons name={speaking ? 'stop-circle-outline' : 'volume-high'} size={20} color={colors.card} />
            <Text style={styles.listenText}>{speaking ? 'Detener lectura' : 'Escuchar guía'}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Los 3 botones principales</Text>
        <ResponsiveGrid minItemWidth={300}>
          {tabGuides.map((item) => (
            <GuideCard key={item.title} {...item} />
          ))}
        </ResponsiveGrid>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Flujo recomendado</Text>
        <ResponsiveGrid minItemWidth={360}>
          {flowSteps.map((item) => (
            <GuideCard key={item.title} {...item} />
          ))}
        </ResponsiveGrid>
      </View>

      <View style={styles.tipCard}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={26} color={colors.amber} />
        <Text style={styles.tipText}>
          Si tienes dudas, empieza por Inicio. Si ya tienes una papeleta guardada, entra por Casos.
        </Text>
      </View>

      <View style={[styles.actions, isWide && styles.actionsWide]}>
        <Pressable style={styles.primaryAction} onPress={() => navigateTo('/(drawer)/(tabs)/inicio/consulta')}>
          <Text style={styles.primaryActionText}>Consultar una papeleta</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction} onPress={() => navigateTo('/(drawer)/(tabs)/casos')}>
          <Text style={styles.secondaryActionText}>Ver mis casos</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

function GuideCard({ icon, text, title }: { icon: IconName; text: string; title: string }) {
  return (
    <View style={styles.guideCard}>
      <View style={styles.guideIcon}>
        <MaterialCommunityIcons name={icon} size={26} color={colors.blue} />
      </View>
      <View style={styles.guideText}>
        <Text style={styles.guideTitle}>{title}</Text>
        <Text style={styles.guideBody}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
    marginTop: 16,
  },
  actionsWide: {
    flexDirection: 'row',
  },
  guideBody: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 3,
  },
  guideCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  guideIcon: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  guideText: {
    flex: 1,
  },
  guideTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  heroBody: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: 5,
  },
  heroCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.blueLight,
    borderColor: '#CFE0FF',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    padding: 16,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 24,
  },
  listenButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.navy,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  listenText: {
    color: colors.card,
    fontSize: 13,
    fontWeight: '900',
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: 10,
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
  },
  primaryActionText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 10,
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
  },
  secondaryActionText: {
    color: colors.navy,
    fontSize: 14,
    fontWeight: '900',
  },
  section: {
    gap: 10,
    marginTop: 18,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  tipCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.amberLight,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    padding: 14,
  },
  tipText: {
    color: colors.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
});
