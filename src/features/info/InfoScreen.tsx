import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '../../shared/components/ScreenShell';
import { colors } from '../../shared/styles/theme';
import type { InfoPage } from './infoContent';

type InfoScreenProps = {
  page: InfoPage;
};

export default function InfoScreen({ page }: InfoScreenProps) {
  return (
    <ScreenShell
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      compact
    >
      <View style={styles.iconCard}>
        <MaterialCommunityIcons name={page.icon} size={42} color={colors.blue} />
      </View>
      <View style={styles.list}>
        {page.points.map((point) => (
          <View style={styles.row} key={point}>
            <View style={styles.dot} />
            <Text style={styles.point}>{point}</Text>
          </View>
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  iconCard: {
    alignItems: 'center',
    backgroundColor: colors.blueLight,
    borderRadius: 8,
    marginTop: 16,
    padding: 22,
  },
  list: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    marginTop: 16,
    padding: 16,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  dot: {
    backgroundColor: colors.blue,
    borderRadius: 5,
    height: 10,
    marginTop: 5,
    width: 10,
  },
  point: {
    color: colors.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
});
