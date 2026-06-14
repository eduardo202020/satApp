import { Platform, useWindowDimensions } from 'react-native';

export function useResponsiveLayout() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const isWide = isTablet;

  return {
    contentMaxWidth: isDesktop ? 1080 : 760,
    isDesktop,
    isTablet,
    isWeb,
    isWide,
    screenPadding: isDesktop ? 32 : 20,
    tabBarWidth: Math.min(Math.max(width - 48, 320), 520),
    width,
  };
}
