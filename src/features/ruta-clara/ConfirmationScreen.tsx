import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';

export default function ConfirmationScreen() {
  const { caseId, kind, plate, ticket } = useLocalSearchParams<{
    caseId?: string;
    kind?: string;
    plate?: string;
    ticket?: string;
  }>();
  const isTicketRegistration = getParam(kind) === 'registro-papeleta';
  const registeredCaseId = getParam(caseId);
  const registeredPlate = getParam(plate);
  const registeredTicket = getParam(ticket);

  return (
    <ScreenShell
      eyebrow={isTicketRegistration ? 'Registro' : 'Confirmacion'}
      title={isTicketRegistration ? 'Papeleta registrada' : 'Accion registrada'}
      description={
        isTicketRegistration
          ? 'Creamos un caso pendiente para que puedas seguirlo aunque aun no aparezca en la consulta SAT.'
          : 'Tu proceso fue registrado correctamente y recibiras alertas sobre los siguientes pasos.'
      }
    >
      <View style={styles.success}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="check" size={50} color={colors.cream} />
        </View>
        <Text style={styles.title}>{isTicketRegistration ? 'Seguimiento activado' : 'Caso actualizado'}</Text>
        <Text style={styles.body}>
          {isTicketRegistration
            ? `Registramos ${registeredTicket || 'la papeleta'}${registeredPlate ? ` para la placa ${registeredPlate}` : ''}. La veras como pendiente en Mis casos.`
            : 'Puedes volver a tus casos o iniciar una nueva consulta.'}
        </Text>
      </View>
      <View style={styles.actions}>
        {isTicketRegistration && registeredCaseId ? (
          <PrimaryButton label="Ver caso registrado" onPress={() => navigateTo(`/caso/${registeredCaseId}`)} />
        ) : null}
        <PrimaryButton
          label="Ver mis casos"
          variant={isTicketRegistration && registeredCaseId ? 'secondary' : 'primary'}
          onPress={() => navigateTo('/(drawer)/(tabs)/casos')}
        />
        <PrimaryButton label="Ir a inicio" variant="secondary" onPress={() => navigateTo('/(drawer)/(tabs)/inicio')} />
      </View>
    </ScreenShell>
  );
}

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

const styles = StyleSheet.create({
  success: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    padding: 24,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  title: {
    color: colors.ink,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 18,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
});
