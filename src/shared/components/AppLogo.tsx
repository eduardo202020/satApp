import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors } from '../styles/theme';

export function AppLogo() {
  return (
    <View style={styles.logo}>
      <MaterialCommunityIcons name="satellite-uplink" size={26} color={colors.cream} />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 248, 232, 0.18)',
    borderColor: 'rgba(255, 248, 232, 0.32)',
    borderRadius: 18,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
});
