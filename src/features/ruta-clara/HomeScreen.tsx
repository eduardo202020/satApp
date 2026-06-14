import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ResponsiveGrid } from '../../shared/components/ResponsiveGrid';
import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useConsultationOptions } from './hooks/useConsultationOptions';
import { useCases } from '../cases/hooks/useCases';

export default function HomeScreen() {
  const options = useConsultationOptions();
  const { cases } = useCases();
  const primaryCaseId = cases[0]?.id ?? 'G11';

  function openOption(href: string) {
    if (href === 'case-detail') {
      navigateTo(`/caso/${primaryCaseId}`);
      return;
    }

    if (href === 'case-options') {
      navigateTo(`/caso/${primaryCaseId}/opciones`);
      return;
    }

    navigateTo(href);
  }

  return (
    <ScreenShell
      eyebrow="Inicio"
      title="Que necesitas hacer hoy?"
      description="Consulta tu papeleta, revisa descuentos y sigue los pasos recomendados."
    >
      <ResponsiveGrid minItemWidth={330} style={styles.section}>
        {options.map((item) => (
          <Pressable
            key={item.title}
            style={styles.option}
            onPress={() => openOption(item.href)}
          >
            <View style={styles.optionIcon}>
              <MaterialCommunityIcons name={item.icon} size={26} color={colors.blue} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{item.title}</Text>
              <Text style={styles.optionDescription}>{item.description}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={colors.muted} />
          </Pressable>
        ))}
      </ResponsiveGrid>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
    marginTop: 18,
  },
  option: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 90,
    padding: 16,
  },
  optionIcon: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  optionDescription: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 4,
  },
});
