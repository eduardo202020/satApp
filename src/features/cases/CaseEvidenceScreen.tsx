import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { StatusPill } from '../../shared/components/StatusPill';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from './hooks/useCases';

const evidenceImages: Record<string, ImageSourcePropType> = {
  'demo-papeleta-g11': require('../../../assets/evidence/papeleta.gif'),
};

const maxEvidenceScale = 4;
const horizontalPanBase = 140;
const verticalPanBase = 230;

export default function CaseEvidenceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const evidenceItems = item.evidence ?? [];

  return (
    <ScreenShell
      eyebrow="Detectar"
      title="Revisa qué ocurrió"
      description="Antes de decidir, contrasta la informacion registrada en el caso."
      compact
    >
      <View style={styles.banner}>
        <MaterialCommunityIcons name="shield-check-outline" size={24} color={colors.blue} />
        <Text style={styles.bannerText}>Verifica fecha, lugar y evidencia antes de pagar o presentar descargo.</Text>
      </View>
      <View style={styles.list}>
        {evidenceItems.length > 0 ? (
          evidenceItems.map((evidence) => {
            const imageSource = evidence.imageAsset ? evidenceImages[evidence.imageAsset] : undefined;

            return (
              <View style={styles.card} key={evidence.id}>
                <View style={[styles.visual, imageSource ? styles.imageVisual : null]}>
                  {imageSource ? (
                    <ZoomableEvidenceImage
                      accessibilityLabel={evidence.imageAlt ?? evidence.title}
                      source={imageSource}
                    />
                  ) : (
                    <>
                      <MaterialCommunityIcons name={evidence.type === 'photo' ? 'camera-outline' : 'clipboard-text-outline'} size={54} color={colors.blue} />
                      <StatusPill label="Evidencia registrada" tone="info" />
                    </>
                  )}
                </View>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>{evidence.title}</Text>
                  {evidence.isMock ? <StatusPill label="Demo" tone="attention" /> : null}
                </View>
                <Text style={styles.description}>{evidence.description}</Text>
                <Text style={styles.meta}>{evidence.location}</Text>
                <Text style={styles.meta}>{new Date(evidence.capturedAt).toLocaleString('es-PE')}</Text>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <MaterialCommunityIcons name="file-eye-outline" size={42} color={colors.blue} />
            <Text style={styles.title}>Evidencia no disponible</Text>
            <Text style={styles.description}>
              Este caso demo aun no tiene foto o registro asociado. Verifica el expediente oficial antes de decidir.
            </Text>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="Regresar" variant="secondary" onPress={() => navigateTo(`/caso/${item.id}`)} />
      </View>
    </ScreenShell>
  );
}

function ZoomableEvidenceImage({
  accessibilityLabel,
  source,
}: {
  accessibilityLabel: string;
  source: ImageSourcePropType;
}) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = clamp(savedScale.value * event.scale, 1, maxEvidenceScale);
    })
    .onEnd(() => {
      if (scale.value < 1.05) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        return;
      }

      savedScale.value = scale.value;
      const maxTranslateX = horizontalPanBase * (scale.value - 1);
      const maxTranslateY = verticalPanBase * (scale.value - 1);
      translateX.value = clamp(translateX.value, -maxTranslateX, maxTranslateX);
      translateY.value = clamp(translateY.value, -maxTranslateY, maxTranslateY);
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scale.value <= 1) {
        return;
      }

      const maxTranslateX = horizontalPanBase * (scale.value - 1);
      const maxTranslateY = verticalPanBase * (scale.value - 1);
      translateX.value = clamp(savedTranslateX.value + event.translationX, -maxTranslateX, maxTranslateX);
      translateY.value = clamp(savedTranslateY.value + event.translationY, -maxTranslateY, maxTranslateY);
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
      <Animated.Image
        accessibilityLabel={accessibilityLabel}
        resizeMode="contain"
        source={source}
        style={[styles.evidenceImage, animatedImageStyle]}
      />
    </GestureDetector>
  );
}

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
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
  imageVisual: { backgroundColor: colors.ink, minHeight: 320, overflow: 'hidden', padding: 8 },
  evidenceImage: { aspectRatio: 595 / 875, borderRadius: 6, height: 300, maxWidth: '100%', width: '100%' },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'space-between', marginTop: 14 },
  title: { color: colors.ink, flex: 1, fontSize: 17, fontWeight: '900' },
  description: { color: colors.muted, fontSize: 13, fontWeight: '700', lineHeight: 19, marginTop: 6 },
  meta: { color: colors.muted, fontSize: 11, fontWeight: '700', marginTop: 7 },
  emptyCard: { alignItems: 'center', backgroundColor: colors.card, borderColor: colors.line, borderRadius: 8, borderWidth: 1, padding: 20 },
  actions: { marginTop: 16 },
});
