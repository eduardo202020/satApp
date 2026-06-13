import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';
import { useProcedures } from './hooks/useProcedures';

export default function ProceduresScreen() {
  const procedures = useProcedures();

  return (
    <ScreenShell
      eyebrow="Tramites"
      title="Flujo de gestion"
      description="Organiza solicitudes, revisiones y cierres desde una estructura simple."
    >
      <View style={styles.timeline}>
        {procedures.map((step, index) => (
          <View style={styles.timelineItem} key={step.title}>
            <View style={styles.timelineNumber}>
              <Text style={styles.timelineNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.timelineText}>
              <Text style={styles.actionTitle}>{step.title}</Text>
              <Text style={styles.actionMeta}>{step.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  timeline: {
    marginTop: 16,
  },
  timelineItem: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 10,
    padding: 16,
  },
  timelineNumber: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  timelineNumberText: {
    color: colors.cream,
    fontSize: 16,
    fontWeight: '900',
  },
  timelineText: {
    flex: 1,
  },
  actionTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  actionMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },
});
