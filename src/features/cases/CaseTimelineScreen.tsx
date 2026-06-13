import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';
import { useCases } from './hooks/useCases';
import { useCaseJourney } from './hooks/useCaseJourney';

export default function CaseTimelineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const { timelineSteps } = useCaseJourney(item.id);

  return (
    <ScreenShell
      eyebrow="Linea de tiempo"
      title={`Ruta de ${item.ticketCode ?? item.id}`}
      description="Cada etapa te muestra donde estas y que podria pasar despues."
      compact
    >
      <View style={styles.timeline}>
        {timelineSteps.map((step) => {
          const color = stateColor[step.state];
          return (
            <View style={styles.step} key={step.title}>
              <View style={[styles.dot, { backgroundColor: color }]}>
                <MaterialCommunityIcons name="check" size={14} color={colors.cream} />
              </View>
              <View style={styles.stepCard}>
                <Text style={styles.date}>{step.date}</Text>
                <Text style={styles.title}>{step.title}</Text>
                <Text style={styles.description}>{step.description}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScreenShell>
  );
}

const stateColor = {
  safe: colors.green,
  attention: colors.amber,
  risk: colors.red,
  pending: '#B6C1D2',
};

const styles = StyleSheet.create({
  timeline: {
    gap: 12,
    marginTop: 16,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    marginTop: 14,
    width: 28,
  },
  stepCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 14,
  },
  date: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '900',
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 5,
  },
});
