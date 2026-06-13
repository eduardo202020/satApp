import { DefaultTheme } from '@react-navigation/native';

export const colors = {
  background: '#F5F8FC',
  card: '#FFFFFF',
  ink: '#071D49',
  muted: '#5E6A83',
  line: '#DFE7F2',
  navy: '#062A78',
  navyDark: '#031C58',
  blue: '#0E5BEA',
  blueLight: '#E8F1FF',
  green: '#1FA463',
  greenLight: '#E8F8EF',
  amber: '#F5B518',
  amberLight: '#FFF6DB',
  red: '#EE3F46',
  redLight: '#FFECEF',
  cyan: '#159AD6',
  cyanLight: '#E9F7FE',
  cream: '#FFFFFF',
};

export const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.ink,
    border: colors.line,
    primary: colors.navy,
  },
};
