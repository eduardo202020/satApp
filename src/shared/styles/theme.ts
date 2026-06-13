import { DefaultTheme } from '@react-navigation/native';

export const colors = {
  background: '#EEF4F1',
  card: '#FFFFFF',
  ink: '#16211C',
  muted: '#6A716C',
  line: '#DCE4DE',
  green: '#1D5F45',
  greenLight: '#D7E8DB',
  saffron: '#E8B247',
  clay: '#B96B47',
  cream: '#FFF8E8',
};

export const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.ink,
    border: colors.line,
    primary: colors.green,
  },
};
