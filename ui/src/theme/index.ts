import { createTheme, ThemeOptions } from '@mui/material/styles';

const theme: ThemeOptions = {
    palette: {
        primary: {
            main: '#2196f3',
            light: '#63a4ff',
            dark: '#004ba0',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#dc004e',
            light: '#ff6f60',
            dark: '#9a0036',
            contrastText: '#ffffff'
        },
        error: {
            main: '#f44336',
        },
        warning: {
            main: '#ff9800',
        },
        info: {
            main: '#2196f3',
        },
        success: {
            main: '#4caf50',
        },
        background: {
            default: '#ffffff',
            paper: '#fafafa',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif !important',
        h1: {
            fontSize: '3rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h3: {
            fontSize: '2rem',
            fontWeight: 700,
        },
        h4: {
            fontSize: '1.75rem',
            fontWeight: 700,
        },
        h5: {
            fontSize: '1.5rem',
            fontWeight: 700,
        },
        h6: {
            fontSize: '1.25rem',
            fontWeight: 700,
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
        },
        caption: {
            fontSize: '0.75rem',
        },
        overline: {
            fontSize: '0.75rem',
            fontWeight: 400,
        },
    },
    spacing: 8,
    shape: {
        borderRadius: 4,
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
    zIndex: {
        mobileStepper: 1000,
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '0.8rem',
                    border: '1px solid rgba(51, 51, 51, 0.15)'
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#000',
                    border: '1px solid rgba(51, 51, 51, 0.15)'
                },
            },
        },
    },
};

export default createTheme(theme);