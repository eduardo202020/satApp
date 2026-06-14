import { AppHeaderNavigation } from './AppHeaderNavigation';
import { HeaderAlertButton, HeaderMenuButton } from './HeaderButtons';
import { useResponsiveLayout } from '../shared/hooks/useResponsiveLayout';
import { colors } from '../shared/styles/theme';

type AppStackHeaderOptions = {
  showMenuOnMobile?: boolean;
};

export function useAppStackHeaderOptions({
  showMenuOnMobile = false,
}: AppStackHeaderOptions = {}) {
  const { isWeb } = useResponsiveLayout();

  return {
    headerBackVisible: !isWeb,
    headerLeft: !isWeb && showMenuOnMobile ? () => <HeaderMenuButton /> : undefined,
    headerRight: !isWeb ? () => <HeaderAlertButton /> : undefined,
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: colors.navy,
    },
    headerTintColor: colors.cream,
    headerTitle: isWeb ? () => <AppHeaderNavigation /> : undefined,
    headerTitleAlign: 'center' as const,
    headerTitleStyle: {
      color: colors.cream,
      fontSize: 17,
      fontWeight: '900' as const,
    },
  };
}
