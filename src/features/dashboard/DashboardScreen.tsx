import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ActionRow } from '../../shared/components/ActionRow';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';
import { SummaryCard } from './components/SummaryCard';
import { useDashboardData } from './hooks/useDashboardData';

export default function DashboardScreen() {
  const { summaryCards, tasks } = useDashboardData();

  return (
    <ScreenShell
      eyebrow="Panel principal"
      title="Resumen operativo"
      description="Una vista rapida para revisar pendientes, actividad reciente y el siguiente paso del dia."
    >
      <View style={styles.summaryGrid}>
        {summaryCards.map((item) => (
          <SummaryCard item={item} key={item.label} />
        ))}
      </View>

      <View style={styles.highlightCard}>
        <View style={styles.highlightIcon}>
          <MaterialCommunityIcons name="progress-clock" size={28} color={colors.green} />
        </View>
        <View style={styles.highlightText}>
          <Text style={styles.highlightTitle}>Tramite en progreso</Text>
          <Text style={styles.bodyText}>
            La revision inicial esta completa. Falta validar los documentos anexos
            antes de enviar el cierre.
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Siguientes acciones</Text>
      </View>
      {tasks.map((item) => (
        <ActionRow item={item} key={item.title} />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  highlightCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.green,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 14,
    marginTop: 16,
    padding: 18,
  },
  highlightIcon: {
    alignItems: 'center',
    backgroundColor: colors.cream,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  highlightText: {
    flex: 1,
  },
  highlightTitle: {
    color: colors.cream,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
  },
  bodyText: {
    color: '#F8EED5',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  sectionHeader: {
    marginTop: 24,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
  },
});
