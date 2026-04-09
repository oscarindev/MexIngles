// MexIngles Theme - Mexican-inspired colors with green/white/red accents
export const colors = {
  // Primary - Mexican Green
  primary: '#1B5E20',
  primaryLight: '#4CAF50',
  primaryDark: '#0D3B12',

  // Secondary - Warm Red
  secondary: '#D32F2F',
  secondaryLight: '#EF5350',
  secondaryDark: '#B71C1C',

  // Accent - Gold/Amber
  accent: '#FF8F00',
  accentLight: '#FFB300',
  accentDark: '#E65100',

  // Backgrounds
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceElevated: '#F5F5F5',

  // Text
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  textMuted: '#9E9E9E',

  // Gamification
  xp: '#FFB300',
  hearts: '#E53935',
  streak: '#FF6D00',
  gems: '#7C4DFF',

  // Exercise feedback
  correct: '#4CAF50',
  correctBg: '#E8F5E9',
  incorrect: '#E53935',
  incorrectBg: '#FFEBEE',

  // Leagues
  bronce: '#8D6E63',
  plata: '#90A4AE',
  oro: '#FFB300',
  diamante: '#00BCD4',

  // UI
  border: '#E0E0E0',
  disabled: '#BDBDBD',
  overlay: 'rgba(0,0,0,0.5)',
  shadow: 'rgba(0,0,0,0.1)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  title: 34,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
