import { createTheme } from '@mui/material/styles';
// Cấu hình theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0d401c', // Màu chủ đạo của website
      light: '#3d704c',
      dark: '#062910',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#52320a',        
      light: 'rgb(207,216,220)',      
      dark: 'rgba(189, 185, 185, 0.5)',         
      contrastText: '#ffffff',  
    },
    error: {
      main: '#F44336'
    },
    warning: {
      main: '#FF9800'
    },
    info: {
      main: '#2196F3'
    },
    success: {
      main: '#4CAF50'
    },
    text: {
        primary: '#000000',
        secondary: '#ffffff'
    },
    background: {
      default: '#ffffff',
      paper: 'rgba(189, 185, 185, 0.5)'                  
    }

  },
  typography: {
    fontFamily: 'var(--font-utm-avo)',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 500,
    fontWeightMedium: 700,
    fontWeightBold: 900,
    body1: {
      fontSize: '0.875rem',       // ≈ 16px
      lineHeight: 1.5,        
      letterSpacing: '0.02em' 
    },
    body2: {
      fontSize: '1.125rem',   // ≈ 18px
      lineHeight: 1.5,
      letterSpacing: '0.02em'
    },
  }
});

export default theme;