import { createTheme } from '@mui/material';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 730,
      md: 900,
      lg: 1100,
      xl: 1536,
    },
  },
});

enum EScreen {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile'
}

export type TScreen = {
  screen?: EScreen
}

