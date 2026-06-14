import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { useResponsiveLayout } from '../../shared/hooks/useResponsiveLayout';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useCases } from './hooks/useCases';
import { analyzeCaseDiscount, formatSoles } from './utils/discounts';

type PaymentMethod = 'card' | 'bank' | 'yape';
type PaymentStep = 'method' | 'yape' | 'success';

export default function CasePaymentScreen() {
  const { isWide } = useResponsiveLayout();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const discount = analyzeCaseDiscount(item);
  const amount = formatSoles(discount.payableAmount);
  const [method, setMethod] = useState<PaymentMethod>('yape');
  const [step, setStep] = useState<PaymentStep>('method');
  const [phone, setPhone] = useState('');
  const [approvalCode, setApprovalCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const approvalInputRef = useRef<TextInput>(null);
  const orderNumber = `SAT-${(item.ticketNumber ?? item.ticketCode ?? item.id).replace(/[^A-Z0-9]/gi, '').slice(0, 6)}`;
  const canPay = normalizeDigits(phone).length === 9 && normalizeDigits(approvalCode).length === 6 && !processing;

  function continueFromMethod() {
    if (method === 'yape') {
      setStep('yape');
    }
  }

  function payWithYape() {
    if (!canPay) {
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
    }, 1400);
  }

  if (step === 'success') {
    return (
      <ScreenShell
        eyebrow="Pago"
        title="Pago registrado"
        description="Tu pago fue procesado correctamente para este prototipo."
        compact
      >
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <MaterialCommunityIcons name="check" size={52} color={colors.card} />
          </View>
          <Text style={styles.successTitle}>¡Gracias!</Text>
          <Text style={styles.successText}>Hemos procesado tu pago exitosamente.</Text>
          <View style={styles.receiptLine} />
          <Text style={styles.receiptLabel}>Número de orden</Text>
          <Text style={styles.order}>{orderNumber}</Text>
          <Text style={styles.receiptLabel}>Total</Text>
          <Text style={styles.total}>{amount}</Text>
        </View>
        <View style={[styles.actions, isWide && styles.actionsWide]}>
          <PrimaryButton
            label="Ver seguimiento"
            onPress={() => navigateTo(`/caso/${item.id}/seguimiento`)}
            style={isWide && styles.actionButtonWide}
          />
          <PrimaryButton
            label="Volver a mis casos"
            variant="secondary"
            onPress={() => navigateTo('/(drawer)/(tabs)/casos')}
            style={isWide && styles.actionButtonWide}
          />
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      eyebrow="Pago"
      title={step === 'method' ? 'Elige cómo pagar' : 'Pago con Yape'}
      description={step === 'method' ? 'Selecciona un medio de pago. Por ahora Yape está habilitado en el prototipo.' : 'Ingresa tu celular y el código de aprobación de Yape.'}
      compact
    >
      <View style={styles.summaryCard}>
        <Text style={styles.kicker}>Papeleta {item.ticketCode ?? item.id}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Monto a pagar</Text>
          <Text style={styles.summaryAmount}>{amount}</Text>
        </View>
        <Text style={styles.summaryHelp}>
          {discount.rule ? 'Incluye el beneficio estimado disponible.' : 'Monto estimado según la información del caso.'}
        </Text>
      </View>

      {step === 'method' ? (
        <>
          <View style={styles.methodsCard}>
            <PaymentOption
              description="Realiza tu pago en cuotas o directo."
              disabled
              icon="credit-card-outline"
              label="Tarjeta de crédito y débito"
              method="card"
              selected={method === 'card'}
              onSelect={setMethod}
            />
            <PaymentOption
              description="Pago mediante transferencia o depósito."
              disabled
              icon="bank-outline"
              label="Transferencias bancarias"
              method="bank"
              selected={method === 'bank'}
              onSelect={setMethod}
            />
            <PaymentOption
              description="Disponible ahora para esta demostración."
              icon="cellphone-check"
              label="Pago con Yape"
              method="yape"
              selected={method === 'yape'}
              onSelect={setMethod}
            />
          </View>
          <View style={styles.actions}>
            <PrimaryButton label="Continuar" disabled={method !== 'yape'} onPress={continueFromMethod} style={isWide && styles.singleActionWide} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.yapeCard}>
            <View style={styles.yapeLogo}>
              <Text style={styles.yapeLogoText}>yape</Text>
            </View>
            <Text style={styles.inputLabel}>Ingresa tu celular Yape</Text>
            <TextInput
              keyboardType="number-pad"
              maxLength={9}
              onChangeText={(value) => setPhone(normalizeDigits(value).slice(0, 9))}
              placeholder="949 930 037"
              placeholderTextColor={colors.muted}
              style={styles.phoneInput}
              value={phone}
            />
            <Text style={styles.inputLabel}>Código de aprobación</Text>
            <Pressable accessibilityRole="button" onPress={() => approvalInputRef.current?.focus()} style={styles.codeInputWrap}>
              <TextInput
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={(value) => setApprovalCode(normalizeDigits(value).slice(0, 6))}
                ref={approvalInputRef}
                style={styles.hiddenCodeInput}
                value={approvalCode}
              />
              {Array.from({ length: 6 }, (_, index) => (
                <View key={index} style={[styles.codeBox, approvalCode[index] && styles.codeBoxFilled]}>
                  <Text style={styles.codeText}>{approvalCode[index] ?? ''}</Text>
                </View>
              ))}
            </Pressable>
            <Text style={styles.helper}>Encuéntralo en el menú de Yape.</Text>
          </View>
          {processing && (
            <View style={styles.processingCard}>
              <ActivityIndicator color={colors.blue} />
              <Text style={styles.processingText}>Validando pago con Yape...</Text>
            </View>
          )}
          <View style={[styles.actions, isWide && styles.actionsWide]}>
            <PrimaryButton
              label={processing ? 'Procesando...' : `Pagar ${amount}`}
              disabled={!canPay}
              onPress={payWithYape}
              style={isWide && styles.actionButtonWide}
            />
            <PrimaryButton
              label="Cambiar método"
              variant="secondary"
              disabled={processing}
              onPress={() => setStep('method')}
              style={isWide && styles.actionButtonWide}
            />
          </View>
        </>
      )}
    </ScreenShell>
  );
}

function PaymentOption({
  description,
  disabled,
  icon,
  label,
  method,
  onSelect,
  selected,
}: {
  description: string;
  disabled?: boolean;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  method: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => onSelect(method)}
      style={[styles.methodRow, selected && styles.methodSelected, disabled && styles.methodDisabled]}
    >
      <MaterialCommunityIcons name={selected ? 'radiobox-marked' : 'radiobox-blank'} size={24} color={selected ? colors.blue : colors.muted} />
      <View style={styles.methodIcon}>
        <MaterialCommunityIcons name={icon} size={26} color={disabled ? colors.muted : colors.blue} />
      </View>
      <View style={styles.methodText}>
        <Text style={styles.methodLabel}>{label}</Text>
        <Text style={styles.methodDescription}>{description}</Text>
      </View>
    </Pressable>
  );
}

function normalizeDigits(value: string) {
  return value.replace(/\D/g, '');
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
    marginTop: 16,
  },
  actionsWide: {
    flexDirection: 'row',
  },
  actionButtonWide: {
    flex: 1,
  },
  singleActionWide: {
    alignSelf: 'center',
    minWidth: 320,
  },
  codeBox: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 42,
  },
  codeBoxFilled: {
    borderColor: colors.blue,
  },
  codeInputWrap: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    position: 'relative',
  },
  codeText: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  helper: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  hiddenCodeInput: {
    bottom: 0,
    left: 0,
    opacity: 0.01,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  inputLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 16,
  },
  kicker: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  methodDescription: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 3,
  },
  methodDisabled: {
    opacity: 0.58,
  },
  methodIcon: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 10,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  methodLabel: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  methodRow: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 14,
  },
  methodSelected: {
    backgroundColor: colors.blueLight,
    borderColor: colors.blue,
  },
  methodText: {
    flex: 1,
  },
  methodsCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginTop: 14,
    padding: 14,
  },
  order: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 20,
  },
  phoneInput: {
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
    minHeight: 52,
    paddingHorizontal: 12,
  },
  processingCard: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    padding: 12,
  },
  processingText: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  receiptLabel: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
    marginTop: 10,
    textTransform: 'uppercase',
  },
  receiptLine: {
    backgroundColor: colors.line,
    height: 1,
    marginVertical: 20,
    width: '100%',
  },
  successCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
    padding: 24,
  },
  successIcon: {
    alignItems: 'center',
    backgroundColor: '#050505',
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  successText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  successTitle: {
    color: colors.ink,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 20,
  },
  summaryAmount: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
    padding: 16,
  },
  summaryHelp: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  total: {
    color: colors.ink,
    fontSize: 42,
    fontWeight: '900',
    marginTop: 8,
  },
  yapeCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 14,
    padding: 18,
  },
  yapeLogo: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F1E8FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  yapeLogoText: {
    color: '#742C91',
    fontSize: 20,
    fontWeight: '900',
  },
});
