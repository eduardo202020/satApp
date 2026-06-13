import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';
import { useCalendarItems } from './hooks/useCalendarItems';

export default function CalendarScreen() {
  const calendarItems = useCalendarItems();

  return (
    <ScreenShell
      eyebrow="Calendario"
      title="Agenda cercana"
      description="Fechas clave para mantener los procesos visibles y accionables."
    >
      {calendarItems.map((item) => (
        <View style={styles.calendarCard} key={item.title}>
          <View style={styles.dateBadge}>
            <Text style={styles.dateDay}>{item.day}</Text>
            <Text style={styles.dateMonth}>{item.month}</Text>
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>{item.title}</Text>
            <Text style={styles.actionMeta}>{item.time}</Text>
          </View>
        </View>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginTop: 12,
    padding: 14,
  },
  dateBadge: {
    alignItems: 'center',
    backgroundColor: colors.greenLight,
    borderRadius: 8,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  dateDay: {
    color: colors.green,
    fontSize: 23,
    fontWeight: '900',
  },
  dateMonth: {
    color: colors.green,
    fontSize: 11,
    fontWeight: '900',
  },
  actionText: {
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
