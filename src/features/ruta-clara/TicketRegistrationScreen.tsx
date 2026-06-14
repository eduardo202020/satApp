import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { registerPendingTicket } from '../cases/pendingRegistrations';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import {
  documentSegments,
  plateSegments,
  SegmentedField,
  ticketCodeSegments,
} from '../../shared/components/SegmentedField';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { normalizeSearchValue, type CaseSearchField } from './utils/caseSearch';

export default function TicketRegistrationScreen() {
  const { field, input } = useLocalSearchParams<{
    field?: CaseSearchField;
    input?: string;
  }>();
  const queryField = Array.isArray(field) ? field[0] : field;
  const queryInput = Array.isArray(input) ? input[0] : input;
  const normalizedInput = normalizeSearchValue(queryInput ?? '');
  const [plate, setPlate] = useState(queryField === 'plate' ? normalizedInput : '');
  const [ticketNumber, setTicketNumber] = useState(queryField === 'ticket' ? normalizedInput : '');
  const [documentNumber, setDocumentNumber] = useState(queryField === 'document' ? normalizedInput : '');
  const [issueDate, setIssueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('La papeleta aun no aparece en la consulta, pero ya tengo el documento.');
  const [attachment, setAttachment] = useState<AttachedImage | null>(null);
  const [attachmentError, setAttachmentError] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(new Date()));
  const attached = Boolean(attachment);
  const ready = normalizeSearchValue(plate).length === 6 && normalizeSearchValue(ticketNumber).length >= 3 && attached;

  function submitRegistration() {
    if (!ready) {
      return;
    }

    const registeredCase = registerPendingTicket({
      amount,
      attachmentName: attachment?.fileName,
      attachmentUri: attachment?.uri,
      attached,
      documentNumber,
      issueDate,
      note,
      plate,
      ticketNumber,
    });
    const query = [
      'kind=registro-papeleta',
      `caseId=${encodeURIComponent(registeredCase.id)}`,
      `plate=${encodeURIComponent(registeredCase.plate)}`,
      `ticket=${encodeURIComponent(registeredCase.ticketCode ?? registeredCase.ticketNumber ?? registeredCase.id)}`,
    ].join('&');

    navigateTo(`/(drawer)/(tabs)/inicio/confirmacion?${query}`);
  }

  function openCalendar() {
    setCalendarMonth(startOfMonth(parseDisplayDate(issueDate) ?? new Date()));
    setCalendarOpen(true);
  }

  async function pickTicketPhoto() {
    setAttachmentError('');

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setAttachmentError('Activa el permiso de fotos para adjuntar la papeleta.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      allowsMultipleSelection: false,
      mediaTypes: ['images'],
      quality: 0.75,
      selectionLimit: 1,
    });

    if (result.canceled) {
      return;
    }

    const selected = result.assets[0];

    if (!selected) {
      return;
    }

    setAttachment({
      fileName: selected.fileName ?? 'foto-papeleta.jpg',
      height: selected.height,
      mimeType: selected.mimeType,
      uri: selected.uri,
      width: selected.width,
    });
  }

  return (
    <ScreenShell
      eyebrow="Registro"
      title="Registrar papeleta"
      description="Si ya tienes la papeleta pero aun no aparece en el SAT, registrala para darle seguimiento."
    >
      <View style={styles.notice}>
        <MaterialCommunityIcons name="timer-sand" size={28} color={colors.amber} />
        <View style={styles.noticeText}>
          <Text style={styles.noticeTitle}>Puede tardar unos dias</Text>
          <Text style={styles.noticeBody}>
            Algunas papeletas no aparecen de inmediato. Este registro preliminar te ayuda a recordar, preparar el pago y revisar luego.
          </Text>
        </View>
      </View>

      <View style={styles.segmentedForm}>
        <SegmentedField
          helper="Ejemplo: ABC-123"
          icon="car-outline"
          label="Placa del vehiculo"
          onChange={setPlate}
          segments={plateSegments}
          value={plate}
        />
        <SegmentedField
          helper="Codigo corto G11 o numero completo de la papeleta"
          icon="file-document-outline"
          label="Numero o codigo de papeleta"
          mode="code"
          onChange={setTicketNumber}
          segments={ticketCodeSegments}
          value={ticketNumber}
        />
        <SegmentedField
          helper="Opcional. Ayuda a asociar el caso"
          icon="account-outline"
          label="DNI"
          onChange={setDocumentNumber}
          segments={documentSegments}
          value={documentNumber}
        />
      </View>

      <View style={styles.form}>
        <View style={styles.row}>
          <View style={styles.rowItem}>
            <DateField
              helper="Opcional"
              icon="calendar-outline"
              label="Fecha"
              onPress={openCalendar}
              placeholder="Seleccionar fecha"
              value={issueDate}
            />
          </View>
          <View style={styles.rowItem}>
            <Field
              helper="Opcional"
              icon="cash"
              keyboardType="decimal-pad"
              label="Monto"
              onChangeText={setAmount}
              placeholder="440.00"
              value={amount}
            />
          </View>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={pickTicketPhoto}
        style={[styles.attachment, attached && styles.attachmentReady]}
      >
        {attachment ? (
          <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
        ) : (
          <View style={styles.attachmentIcon}>
            <MaterialCommunityIcons name="image-plus" size={30} color={colors.blue} />
          </View>
        )}
        <View style={styles.attachmentText}>
          <Text style={styles.attachmentTitle}>{attached ? 'Foto adjunta' : 'Adjuntar foto de la papeleta'}</Text>
          <Text style={styles.attachmentBody}>
            {attachment?.fileName ?? 'Selecciona una foto clara desde tu celular.'}
          </Text>
          <Text style={styles.attachmentAction}>{attached ? 'Toca para cambiar la foto' : 'Abrir galeria'}</Text>
        </View>
        <View style={styles.attachmentStatus}>
          <MaterialCommunityIcons
            name={attached ? 'file-check-outline' : 'file-upload-outline'}
            size={26}
            color={attached ? colors.green : colors.blue}
          />
        </View>
      </Pressable>
      {attachmentError ? <Text style={styles.attachmentError}>{attachmentError}</Text> : null}

      <View style={styles.noteCard}>
        <Text style={styles.label}>Nota para seguimiento</Text>
        <TextInput
          multiline
          onChangeText={setNote}
          style={styles.noteInput}
          textAlignVertical="top"
          value={note}
        />
      </View>

      <View style={styles.checklist}>
        <ChecklistItem done={normalizeSearchValue(plate).length === 6} label="Placa completa" />
        <ChecklistItem done={normalizeSearchValue(ticketNumber).length >= 3} label="Numero o codigo de papeleta" />
        <ChecklistItem done={attached} label="Foto o copia para sustento" />
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Registrar para seguimiento" disabled={!ready} onPress={submitRegistration} />
        <PrimaryButton label="Volver a consulta" variant="secondary" onPress={() => navigateTo('/(drawer)/(tabs)/inicio/consulta')} />
      </View>

      <CalendarModal
        month={calendarMonth}
        onChangeMonth={setCalendarMonth}
        onClose={() => setCalendarOpen(false)}
        onSelect={(date) => {
          setIssueDate(formatDisplayDate(date));
          setCalendarOpen(false);
        }}
        selectedValue={issueDate}
        visible={calendarOpen}
      />
    </ScreenShell>
  );
}

type AttachedImage = {
  fileName: string;
  height?: number;
  mimeType?: string;
  uri: string;
  width?: number;
};

type FieldProps = {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  helper: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  keyboardType?: 'default' | 'number-pad' | 'decimal-pad';
  label: string;
  maxLength?: number;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
};

function Field({
  autoCapitalize = 'none',
  helper,
  icon,
  keyboardType = 'default',
  label,
  maxLength,
  onChangeText,
  placeholder,
  value,
}: FieldProps) {
  return (
    <View style={styles.fieldCard}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldIcon}>
          <MaterialCommunityIcons name={icon} size={22} color={colors.blue} />
        </View>
        <View style={styles.fieldText}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldHelper}>{helper}</Text>
        </View>
      </View>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={value}
      />
    </View>
  );
}

type DateFieldProps = {
  helper: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>['name'];
  label: string;
  onPress: () => void;
  placeholder: string;
  value: string;
};

function DateField({ helper, icon, label, onPress, placeholder, value }: DateFieldProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.fieldCard}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldIcon}>
          <MaterialCommunityIcons name={icon} size={22} color={colors.blue} />
        </View>
        <View style={styles.fieldText}>
          <Text style={styles.fieldLabel}>{label}</Text>
          <Text style={styles.fieldHelper}>{helper}</Text>
        </View>
      </View>
      <View style={styles.dateInput}>
        <Text style={[styles.dateValue, !value && styles.datePlaceholder]}>{value || placeholder}</Text>
        <MaterialCommunityIcons name="chevron-down" size={22} color={colors.muted} />
      </View>
    </Pressable>
  );
}

type CalendarModalProps = {
  month: Date;
  onChangeMonth: (date: Date) => void;
  onClose: () => void;
  onSelect: (date: Date) => void;
  selectedValue: string;
  visible: boolean;
};

function CalendarModal({ month, onChangeMonth, onClose, onSelect, selectedValue, visible }: CalendarModalProps) {
  const selectedDate = parseDisplayDate(selectedValue);
  const days = getCalendarDays(month);

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalBackdrop}>
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <Pressable
              accessibilityLabel="Mes anterior"
              accessibilityRole="button"
              onPress={() => onChangeMonth(addMonths(month, -1))}
              style={styles.calendarNav}
            >
              <MaterialCommunityIcons name="chevron-left" size={26} color={colors.ink} />
            </Pressable>
            <Text style={styles.calendarMonth}>
              {MONTH_LABELS[month.getMonth()]} {month.getFullYear()}
            </Text>
            <Pressable
              accessibilityLabel="Mes siguiente"
              accessibilityRole="button"
              onPress={() => onChangeMonth(addMonths(month, 1))}
              style={styles.calendarNav}
            >
              <MaterialCommunityIcons name="chevron-right" size={26} color={colors.ink} />
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {WEEK_LABELS.map((label, index) => (
              <Text key={`${label}-${index}`} style={styles.weekText}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {days.map((day) => {
              const selected = selectedDate ? isSameDate(selectedDate, day.date) : false;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={day.key}
                  onPress={() => onSelect(day.date)}
                  style={[styles.dayCell, !day.inCurrentMonth && styles.dayOutside, selected && styles.daySelected]}
                >
                  <Text style={[styles.dayText, !day.inCurrentMonth && styles.dayTextOutside, selected && styles.dayTextSelected]}>
                    {day.date.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.calendarFooter}>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.calendarCancel}>
              <Text style={styles.calendarCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => onSelect(new Date())} style={styles.calendarToday}>
              <Text style={styles.calendarTodayText}>Hoy</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <View style={styles.checkItem}>
      <MaterialCommunityIcons
        name={done ? 'check-circle' : 'circle-outline'}
        size={22}
        color={done ? colors.green : colors.muted}
      />
      <Text style={[styles.checkText, done && styles.checkTextDone]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
    marginTop: 18,
  },
  attachment: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
    padding: 16,
  },
  attachmentBody: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 4,
  },
  attachmentIcon: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  attachmentAction: {
    color: colors.blue,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 6,
  },
  attachmentError: {
    color: colors.red,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  attachmentImage: {
    backgroundColor: colors.card,
    borderRadius: 12,
    height: 58,
    width: 58,
  },
  attachmentReady: {
    backgroundColor: colors.greenLight,
    borderColor: '#BFE8D2',
  },
  attachmentStatus: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  attachmentText: {
    flex: 1,
  },
  attachmentTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  checkItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  checkText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  checkTextDone: {
    color: colors.ink,
  },
  checklist: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    marginTop: 14,
    padding: 14,
  },
  calendarCancel: {
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 13,
  },
  calendarCancelText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  calendarCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    width: '90%',
  },
  calendarFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  calendarHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarMonth: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  calendarNav: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 10,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  calendarToday: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    flex: 1,
    paddingVertical: 13,
  },
  calendarTodayText: {
    color: colors.card,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  dateInput: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  datePlaceholder: {
    color: colors.muted,
  },
  dateValue: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: `${100 / 7}%`,
  },
  dayOutside: {
    opacity: 0.36,
  },
  daySelected: {
    backgroundColor: colors.blue,
  },
  dayText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  dayTextOutside: {
    color: colors.muted,
  },
  dayTextSelected: {
    color: colors.card,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  fieldCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  fieldHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  fieldHelper: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  fieldIcon: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 10,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  fieldLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  fieldText: {
    flex: 1,
  },
  form: {
    gap: 10,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 12,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  label: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(2, 12, 34, 0.48)',
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  noteCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 14,
  },
  noteInput: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    minHeight: 86,
    marginTop: 8,
  },
  notice: {
    alignItems: 'center',
    backgroundColor: colors.amberLight,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    padding: 16,
  },
  noticeBody: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
  },
  noticeText: {
    flex: 1,
  },
  noticeTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowItem: {
    flex: 1,
  },
  segmentedForm: {
    gap: 10,
    marginTop: 16,
  },
  weekRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  weekText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    width: `${100 / 7}%`,
  },
});

const MONTH_LABELS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEK_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return startOfMonth(new Date(date.getFullYear(), date.getMonth() + amount, 1));
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

function formatDisplayDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}/${month}/${date.getFullYear()}`;
}

function parseDisplayDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);

  if (!match) {
    return null;
  }

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(year, month, day);

  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }

  return date;
}

function isSameDate(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}
