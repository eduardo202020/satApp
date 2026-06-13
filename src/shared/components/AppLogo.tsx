import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors } from '../styles/theme';

export function AppLogo() {
  return (
    <View style={styles.logo}>
      <MaterialCommunityIcons name="check-decagram-outline" size={30} color={colors.cream} />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderColor: 'rgba(255, 255, 255, 0.34)',
    borderRadius: 16,
    borderWidth: 1,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
});
