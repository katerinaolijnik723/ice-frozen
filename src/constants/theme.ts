/**
 * IceFrozen theme - OCEAN_FRESH preset + 2 accent overrides (deepAbyss, goldFish).
 * The preset name stays 'ocean-fresh'.
 */

export const theme = {
  name: 'ocean-fresh',

  colors: {
    bg: {
      primary: '#E8F4F8',
      secondary: '#D1E7EE',
      tertiary: '#B8DBE5',
      accent: '#9DCEDB',
    },
    ocean: {
      deep: '#00558B',
      wave: '#00A6CB',
      foam: '#7DDDD3',
      seafoam: '#A8E6D9',
      coral: '#FF8C61',
      sun: '#FFD66B',
      // --- accent overrides required by the brief ---
      deepAbyss: '#013A5E',
      goldFish: '#F5C451',
    },
    text: {
      primary: '#003547',
      secondary: '#00558B',
      accent: '#00A6CB',
      muted: '#4C7F96',
      onDark: '#FFFFFF',
      onDarkSoft: '#D1E7EE',
      onDarkMuted: '#9DCEDB',
    },
    ui: {
      border: '#B8DBE5',
      divider: '#D1E7EE',
      overlay: 'rgba(0, 53, 71, 0.55)',
      glass: 'rgba(232, 244, 248, 0.88)',
      glassDark: 'rgba(255, 255, 255, 0.08)',
      glassDarkBorder: 'rgba(255, 255, 255, 0.16)',
      danger: '#FF4656',
    },
  },

  gradients: {
    primary: ['#00A6CB', '#00558B'],
    button: ['#00A6CB', '#00558B'],
    progress: ['#00A6CB', '#9DCEDB'],
    reward: ['#F5C451', '#FF8C61'],
    rim: ['#E8F4F8', '#B8DBE5'],
    // per-screen luminance bands (AuroraBackdrop variants)
    deep: ['rgba(1,58,94,0.92)', 'rgba(0,85,139,0.88)', 'rgba(1,58,94,0.96)'],
    ice: ['rgba(232,244,248,0.08)', 'rgba(157,206,219,0.42)', 'rgba(209,231,238,0.92)'],
    game: ['rgba(1,58,94,0.72)', 'rgba(0,85,139,0.80)', 'rgba(1,58,94,0.94)'],
    result: ['rgba(1,58,94,0.90)', 'rgba(0,85,139,0.86)', 'rgba(1,58,94,0.96)'],
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '900' as const, letterSpacing: 6 },
    title: { fontSize: 34, fontWeight: '900' as const, letterSpacing: 4 },
    section: { fontSize: 18, fontWeight: '800' as const, letterSpacing: 2 },
    body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 2 },
    score: {
      fontSize: 52,
      fontWeight: '900' as const,
      letterSpacing: 1,
      fontVariant: ['tabular-nums' as const],
    },
    stat: {
      fontSize: 22,
      fontWeight: '800' as const,
      fontVariant: ['tabular-nums' as const],
    },
  },

  radius: { sm: 8, md: 14, lg: 18, xl: 22, xxl: 28, pill: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  shadows: {
    cta: {
      shadowColor: '#00A6CB',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 18,
      elevation: 12,
    },
    card: {
      shadowColor: '#00558B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 8,
    },
    sheet: {
      shadowColor: '#00558B',
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.18,
      shadowRadius: 26,
      elevation: 16,
    },
    glow: {
      shadowColor: '#00A6CB',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.45,
      shadowRadius: 24,
      elevation: 14,
    },
  },

  animation: {
    spring: { tension: 46, friction: 8 },
    press: { tension: 300, friction: 12 },
    sheet: { tension: 50, friction: 9 },
    fade: 300,
  },
};

export type Theme = typeof theme;
