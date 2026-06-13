import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { navigateTo } from '../../shared/navigation/routes';
import { colors } from '../../shared/styles/theme';
import { useConsultationOptions } from './hooks/useConsultationOptions';

export default function HomeScreen() {
  const options = useConsultationOptions();

  return (
    <ScreenShell
      eyebrow="Ruta clara"
      title="Que necesitas hacer hoy?"
      description="Te guiamos paso a paso para entender una papeleta, conocer opciones y actuar a tiempo."
    >
      <View style={styles.demoNotice}>
        <MaterialCommunityIcons name="shield-check-outline" size={26} color={colors.navy} />
        <View style={styles.noticeText}>
          <Text style={styles.noticeTitle}>Demo con datos ficticios</Text>
          <Text style={styles.noticeBody}>No usamos datos personales reales.</Text>
        </View>
      </View>

      <View style={styles.section}>
        {options.map((item) => (
          <Pressable
            key={item.title}
            style={styles.option}
            onPress={() => navigateTo(item.href)}
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
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  demoNotice: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    padding: 14,
  },
  noticeText: {
    flex: 1,
  },
  noticeTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  noticeBody: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
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
    minHeight: 82,
    padding: 14,
  },
  optionIcon: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  optionDescription: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
    marginTop: 4,
  },
});
