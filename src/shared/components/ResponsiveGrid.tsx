import type { ReactNode } from 'react';
import { Children } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

type ResponsiveGridProps = {
  children: ReactNode;
  gap?: number;
  minItemWidth?: number;
  style?: StyleProp<ViewStyle>;
};

export function ResponsiveGrid({
  children,
  gap = 12,
  minItemWidth = 320,
  style,
}: ResponsiveGridProps) {
  const { isWide } = useResponsiveLayout();

  return (
    <View style={[styles.grid, isWide && styles.gridWide, { gap }, style]}>
      {Children.toArray(children).map((child, index) => (
        <View key={index} style={[styles.item, isWide && { flexBasis: minItemWidth, width: 'auto' }]}>
          {child}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',
  },
  gridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    flexGrow: 1,
    flexShrink: 1,
    width: '100%',
  },
});
