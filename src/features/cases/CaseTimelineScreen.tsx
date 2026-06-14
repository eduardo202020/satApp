import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from './hooks/useCases';
import { analyzeCaseDiscount, formatSoles } from './utils/discounts';

type DayTone = 'initial' | 'reduced' | 'issued' | 'consultation' | 'weekend' | 'outside' | 'none';

export default function CaseTimelineScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const discount = analyzeCaseDiscount(item);
  const issueDate = parseCaseDate(item.issueDate) ?? new Date();
  const queryDate = parseCaseDate(item.queryDate) ?? new Date();
  const calendarMonth = startOfMonth(issueDate);
  const calendarDays = getCalendarDays(calendarMonth);
  const supportsDiscount = item.canDiscount && !discount.reason.toLowerCase().includes('excluido');

  return (
    <ScreenShell
      eyebrow="Línea de tiempo"
      title="Calendario de descuentos"
      description="Mira en qué días aplica cada beneficio. Los fines de semana no suman como días hábiles."
      compact
    >
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <MaterialCommunityIcons name="calendar-clock" size={30} color={colors.blue} />
          <View style={styles.summaryText}>
            <Text style={styles.kicker}>Consulta de fechas</Text>
            <Text style={styles.summaryTitle}>{MONTH_LABELS[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}</Text>
          </View>
        </View>
        <View style={styles.metaGrid}>
          <MetaItem label="Emisión" value={formatLongDate(issueDate)} />
          <MetaItem label="Consulta" value={formatLongDate(queryDate)} />
          <MetaItem
            label="Días hábiles"
            value={discount.businessDaysElapsed === null ? 'Por validar' : `${discount.businessDaysElapsed}`}
          />
        </View>
      </View>

      <View style={styles.legendCard}>
        <LegendItem color={colors.green} label="83%" text="Primeros 5 días hábiles" />
        <LegendItem color={colors.amber} label="67%" text="Desde el sexto día hábil, si aún aplica" />
        <LegendItem color={colors.blue} label="Hoy" text="Fecha usada para la consulta" />
      </View>

      <View style={styles.calendarCard}>
        <View style={styles.weekRow}>
          {WEEK_LABELS.map((label) => (
            <Text key={label} style={styles.weekLabel}>{label}</Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {calendarDays.map((day) => {
            const tone = getDayTone({ date: day.date, inCurrentMonth: day.inCurrentMonth, issueDate, queryDate, supportsDiscount });
            const isQueryDate = isSameDate(day.date, queryDate);

            return (
              <View
                key={day.key}
                style={[
                  styles.dayCell,
                  dayToneStyle[tone],
                  isQueryDate && styles.queryDay,
                  !day.inCurrentMonth && styles.outsideDay,
                ]}
              >
                <Text style={[styles.dayNumber, (tone === 'initial' || tone === 'reduced' || tone === 'issued') && styles.dayNumberStrong]}>
                  {day.date.getDate()}
                </Text>
                <Text style={[styles.dayName, !isBusinessDay(day.date) && styles.weekendText]}>
                  {SHORT_DAY_LABELS[(day.date.getDay() + 6) % 7]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.intervalCard}>
        <Text style={styles.kicker}>Cómo leerlo</Text>
        <IntervalRow
          icon="numeric-1-circle-outline"
          title="Primer tramo"
          text="Los cuadros verdes representan los primeros 5 días hábiles posteriores a la emisión."
        />
        <IntervalRow
          icon="numeric-2-circle-outline"
          title="Segundo tramo"
          text="Los cuadros amarillos muestran el tramo posterior, siempre que la etapa del caso permita beneficio."
        />
        <IntervalRow
          icon="calendar-weekend-outline"
          title="Fines de semana"
          text="Sábados y domingos se muestran en gris porque no cuentan como días hábiles."
        />
      </View>

      {!supportsDiscount && (
        <View style={styles.noticeCard}>
          <MaterialCommunityIcons name="information-outline" size={24} color={colors.blue} />
          <Text style={styles.noticeText}>{discount.reason}</Text>
        </View>
      )}

      <Pressable
        accessibilityRole="button"
        onPress={() => navigateTo(discount.rule ? `/caso/${item.id}/pago` : `/caso/${item.id}/opciones`)}
        style={[styles.payCard, discount.rule ? styles.payCardActive : styles.payCardNeutral]}
      >
        <View style={styles.payIcon}>
          <MaterialCommunityIcons name={discount.rule ? 'cash-check' : 'clipboard-text-outline'} size={28} color={discount.rule ? colors.green : colors.blue} />
        </View>
        <View style={styles.payText}>
          <Text style={styles.payTitle}>{discount.rule ? 'Pagar con beneficio' : 'Ver opciones de pago'}</Text>
          <Text style={styles.payDescription}>
            {discount.rule
              ? `Monto estimado: ${formatSoles(discount.payableAmount)}.`
              : 'Revisa las acciones disponibles para este caso.'}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={26} color={colors.muted} />
      </Pressable>
    </ScreenShell>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function LegendItem({ color, label, text }: { color: string; label: string; text: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <View style={styles.legendText}>
        <Text style={styles.legendLabel}>{label}</Text>
        <Text style={styles.legendBody}>{text}</Text>
      </View>
    </View>
  );
}

function IntervalRow({ icon, text, title }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; text: string; title: string }) {
  return (
    <View style={styles.intervalRow}>
      <MaterialCommunityIcons name={icon} size={24} color={colors.blue} />
      <View style={styles.intervalText}>
        <Text style={styles.intervalTitle}>{title}</Text>
        <Text style={styles.intervalBody}>{text}</Text>
      </View>
    </View>
  );
}

function getDayTone({
  date,
  inCurrentMonth,
  issueDate,
  queryDate,
  supportsDiscount,
}: {
  date: Date;
  inCurrentMonth: boolean;
  issueDate: Date;
  queryDate: Date;
  supportsDiscount: boolean;
}): DayTone {
  if (!inCurrentMonth) return 'outside';
  if (isSameDate(date, issueDate)) return 'issued';
  if (isSameDate(date, queryDate)) return 'consultation';
  if (!isBusinessDay(date)) return 'weekend';

  const elapsed = countBusinessDaysAfter(issueDate, date);

  if (elapsed < 1) return 'none';
  if (!supportsDiscount) return 'none';
  if (elapsed <= 5) return 'initial';
  return 'reduced';
}

function getCalendarDays(month: Date) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const start = new Date(year, monthIndex, 1 - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);

    return {
      date,
      inCurrentMonth: date.getMonth() === monthIndex,
      key: date.toISOString(),
    };
  });
}

function parseCaseDate(value?: string) {
  if (!value) return null;

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (isoMatch) {
    return new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]), 12);
  }

  const slashMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (slashMatch) {
    return new Date(Number(slashMatch[3]), Number(slashMatch[2]) - 1, Number(slashMatch[1]), 12);
  }

  return null;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function countBusinessDaysAfter(startDate: Date, endDate: Date) {
  if (endDate <= startDate) return 0;

  let count = 0;
  const current = new Date(startDate);
  current.setDate(current.getDate() + 1);

  while (current <= endDate) {
    if (isBusinessDay(current)) count += 1;
    current.setDate(current.getDate() + 1);
  }

  return count;
}

function isBusinessDay(date: Date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function formatLongDate(date: Date) {
  return `${FULL_DAY_LABELS[(date.getDay() + 6) % 7]} ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

const MONTH_LABELS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEK_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const SHORT_DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const FULL_DAY_LABELS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const dayToneStyle = {
  consultation: { backgroundColor: colors.blueLight, borderColor: colors.blue },
  initial: { backgroundColor: colors.greenLight, borderColor: '#BFE8D2' },
  issued: { backgroundColor: colors.blue, borderColor: colors.blue },
  none: { backgroundColor: colors.card, borderColor: colors.line },
  outside: { backgroundColor: '#F7F9FC', borderColor: '#EDF2F8' },
  reduced: { backgroundColor: colors.amberLight, borderColor: '#F4D37B' },
  weekend: { backgroundColor: '#F1F4F8', borderColor: colors.line },
};

const styles = StyleSheet.create({
  calendarCard: {
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
    maxWidth: 780,
    padding: 12,
    width: '100%',
  },
  dayCell: {
    borderRadius: 9,
    borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    margin: 2,
    padding: 5,
    width: `${100 / 7 - 1}%`,
  },
  dayName: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
  dayNumber: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  dayNumberStrong: {
    color: colors.ink,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  intervalBody: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 3,
  },
  intervalCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginTop: 14,
    padding: 16,
  },
  intervalRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  intervalText: {
    flex: 1,
  },
  intervalTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  kicker: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  legendBody: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
  },
  legendCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    padding: 12,
  },
  legendDot: {
    borderRadius: 7,
    height: 14,
    marginTop: 3,
    width: 14,
  },
  legendItem: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  legendLabel: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  legendText: {
    flex: 1,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  metaItem: {
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 10,
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metaValue: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 16,
    marginTop: 5,
  },
  noticeCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.blueLight,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    padding: 14,
  },
  noticeText: {
    color: colors.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
  outsideDay: {
    opacity: 0.38,
  },
  payCard: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    padding: 16,
  },
  payCardActive: {
    backgroundColor: colors.greenLight,
    borderColor: '#BFE8D2',
  },
  payCardNeutral: {
    backgroundColor: colors.blueLight,
    borderColor: '#CFE0FF',
  },
  payDescription: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
    marginTop: 3,
  },
  payIcon: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  payText: {
    flex: 1,
  },
  payTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  queryDay: {
    borderWidth: 2,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  summaryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 3,
  },
  weekLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    width: `${100 / 7}%`,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekendText: {
    color: colors.muted,
  },
});
