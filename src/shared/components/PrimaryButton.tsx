import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../styles/theme';

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({ label, onPress, variant = 'primary', disabled = false, style }: PrimaryButtonProps) {
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, isSecondary && styles.secondaryButton, disabled && styles.disabled, style]}
    >
      <Text style={[styles.label, isSecondary && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.navy,
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButton: {
    backgroundColor: colors.blueLight,
  },
  label: {
    color: colors.cream,
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryLabel: {
    color: colors.navy,
  },
  disabled: {
    opacity: 0.5,
  },
});
