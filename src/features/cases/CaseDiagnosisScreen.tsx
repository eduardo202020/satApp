import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fetchClearDiagnosis } from '../../shared/api/satApi';
import { PrimaryButton } from '../../shared/components/PrimaryButton';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { StatusPill } from '../../shared/components/StatusPill';
import { useSpeechReader } from '../../shared/hooks/useSpeechReader';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import type { CaseRecord, ClearDiagnosis } from '../../shared/types/ui';
import { useCases } from './hooks/useCases';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
type Tone = 'safe' | 'attention' | 'risk' | 'info';

type ExplanationModel = {
  details: string[];
  friendlyMeaning: string;
  icon: IconName;
  mainIdea: string;
  reviewItems: string[];
  tone: Tone;
};

export default function CaseDiagnosisScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getCaseById } = useCases();
  const item = getCaseById(id);
  const explanation = buildExplanationModel(item);
  const [diagnosis, setDiagnosis] = useState<ClearDiagnosis | null>(null);
  const [ragAvailable, setRagAvailable] = useState(false);
  const { speaking, toggleSpeech } = useSpeechReader();
  const speechText = [
    `Papeleta ${item.ticketCode ?? item.id}.`,
    explanation.mainIdea,
    explanation.friendlyMeaning,
    'Por qué puede haberse generado.',
    ...explanation.details,
    'Antes de decidir, revisa lo siguiente.',
    ...explanation.reviewItems,
  ].join(' ');

  useEffect(() => {
    setDiagnosis(null);
    setRagAvailable(false);
    fetchClearDiagnosis(
      item.id,
      `Explica de forma sencilla por que se genero la papeleta ${item.ticketCode ?? item.id} de placa ${item.plate}.`,
    )
      .then((response) => {
        setDiagnosis(response);
        setRagAvailable(true);
      })
      .catch((reason: Error) => {
        console.warn('No se pudo cargar la explicacion RAG.', reason);
      });
  }, [item.id, item.plate, item.ticketCode]);

  return (
    <ScreenShell
      eyebrow="Explicación"
      title="Entender mi situación"
      description="Primero entendamos qué significa la papeleta y qué datos conviene revisar."
      compact
    >
      <View style={[styles.heroCard, cardTone[explanation.tone]]}>
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name={explanation.icon} size={34} color={toneColor[explanation.tone]} />
          </View>
          <StatusPill label={ragAvailable ? 'Explicación ampliada' : 'Guía simple'} tone={ragAvailable ? 'info' : explanation.tone} />
        </View>
        <Text style={styles.kicker}>Qué significa</Text>
        <Text style={styles.heroTitle}>{explanation.mainIdea}</Text>
        <Text style={styles.heroText}>{explanation.friendlyMeaning}</Text>
        <Pressable accessibilityRole="button" onPress={() => toggleSpeech(speechText)} style={styles.listenButton}>
          <MaterialCommunityIcons name={speaking ? 'stop-circle-outline' : 'volume-high'} size={20} color={colors.card} />
          <Text style={styles.listenText}>{speaking ? 'Detener lectura' : 'Escuchar explicación'}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.kicker}>Por qué puede haberse generado</Text>
        {explanation.details.map((detail) => (
          <InfoRow key={detail} icon="information-outline" text={detail} />
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.kicker}>Datos de esta papeleta</Text>
        <View style={styles.summaryGrid}>
          <SummaryItem label="Código" value={item.ticketCode ?? item.id} />
          <SummaryItem label="Placa" value={item.plate} />
        </View>
        <Text style={styles.infractionText}>{item.infraction}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.kicker}>Qué revisar antes de decidir</Text>
        {explanation.reviewItems.map((itemToReview) => (
          <InfoRow key={itemToReview} icon="checkbox-marked-circle-outline" text={itemToReview} />
        ))}
      </View>

      {!!diagnosis?.plainExplanation && (
        <View style={styles.ragCard}>
          <Text style={styles.kicker}>Explicación adicional</Text>
          <Text style={styles.ragText}>{diagnosis.plainExplanation}</Text>
        </View>
      )}

      <View style={styles.actions}>
        <PrimaryButton label="Revisar evidencia" onPress={() => navigateTo(`/caso/${item.id}/evidencia`)} />
        <PrimaryButton label="Ver qué puedo hacer" variant="secondary" onPress={() => navigateTo(`/caso/${item.id}/opciones`)} />
      </View>
    </ScreenShell>
  );
}

function buildExplanationModel(item: CaseRecord): ExplanationModel {
  const normalized = item.infraction
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (normalized.includes('zona rigida') || normalized.includes('estacionar')) {
    return {
      details: [
        'Se registra cuando el vehículo aparece detenido o estacionado en una zona donde no está permitido.',
        'Normalmente se revisa la señalización del lugar, la placa y la foto o acta asociada.',
      ],
      friendlyMeaning: 'No significa que debas pagar sin revisar. Primero confirma que la placa, el lugar y la evidencia correspondan.',
      icon: 'car-brake-parking',
      mainIdea: 'La papeleta se relaciona con estacionamiento',
      reviewItems: [
        'Que la placa coincida con tu vehículo.',
        'Que el lugar indicado sea reconocible.',
        'Que la foto o registro muestre claramente la situación.',
      ],
      tone: 'info',
    };
  }

  if (normalized.includes('semaforo')) {
    return {
      details: [
        'Se registra cuando el vehículo habría pasado una señal de tránsito que debía respetar.',
        'Conviene revisar fecha, hora, cruce y evidencia antes de tomar una decisión.',
      ],
      friendlyMeaning: 'La app te ayuda a ordenar la información para que sepas si corresponde pagar, revisar o preparar sustento.',
      icon: 'traffic-light-outline',
      mainIdea: 'La papeleta se relaciona con una señal de tránsito',
      reviewItems: [
        'Que el cruce indicado sea correcto.',
        'Que la fecha y hora coincidan con tu recorrido.',
        'Que la evidencia permita reconocer el vehículo.',
      ],
      tone: 'attention',
    };
  }

  if (normalized.includes('velocidad')) {
    return {
      details: [
        'Se registra cuando un control detecta que el vehículo superó el límite permitido.',
        'Es útil revisar el tramo, el límite aplicable y los datos del registro.',
      ],
      friendlyMeaning: 'Antes de actuar, mira si los datos del control coinciden con tu caso.',
      icon: 'speedometer',
      mainIdea: 'La papeleta se relaciona con velocidad',
      reviewItems: [
        'Que el tramo indicado corresponda a tu recorrido.',
        'Que la placa sea visible y correcta.',
        'Que el monto y código sean los esperados para esa infracción.',
      ],
      tone: 'attention',
    };
  }

  return {
    details: [
      'La papeleta aparece cuando una autoridad registra una posible infracción asociada a una placa o conductor.',
      'Lo importante es revisar los datos básicos antes de pagar o presentar un descargo.',
    ],
    friendlyMeaning: 'Esta pantalla te ayuda a entender la razón de la papeleta sin entrar todavía en pagos, descuentos o trámites.',
    icon: 'file-document-outline',
    mainIdea: 'La papeleta necesita revisión de datos',
    reviewItems: [
      'Que la placa o documento correspondan a tu caso.',
      'Que el código de infracción sea el correcto.',
      'Que tengas a la mano foto, acta o documento de sustento si vas a reclamar.',
    ],
    tone: 'info',
  };
}

function InfoRow({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.blue} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const toneColor: Record<Tone, string> = {
  attention: colors.amber,
  info: colors.blue,
  risk: colors.red,
  safe: colors.green,
};

const cardTone = {
  attention: { backgroundColor: colors.amberLight, borderColor: '#F4D37B' },
  info: { backgroundColor: colors.blueLight, borderColor: '#CFE0FF' },
  risk: { backgroundColor: colors.redLight, borderColor: '#F5B6BA' },
  safe: { backgroundColor: colors.greenLight, borderColor: '#BFE8D2' },
};

const styles = StyleSheet.create({
  actions: {
    gap: 10,
    marginTop: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    marginTop: 12,
    padding: 16,
  },
  heroCard: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 16,
    padding: 18,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  heroText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: 8,
  },
  heroTitle: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    marginTop: 4,
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  infoText: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  infractionText: {
    color: colors.ink,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 23,
    marginTop: 12,
  },
  kicker: {
    color: colors.blue,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
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
  ragCard: {
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    marginTop: 12,
    padding: 16,
  },
  ragText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  summaryItem: {
    backgroundColor: colors.background,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 12,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
    marginTop: 5,
  },
});
