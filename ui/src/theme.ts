import { createTheme, ThemeOptions } from '@mui/material/styles';

const muiTheme: ThemeOptions = {
    palette: {
        primary: {
            main: '#2196f3', // Primary color
            light: '#63a4ff', // Lighter shade of primary color
            dark: '#004ba0', // Darker shade of primary color
            contrastText: '#ffffff', // Text color on primary background
        },
        secondary: {
            main: '#dc004e', // Secondary color
            light: '#ff6f60', // Lighter shade of secondary color
            dark: '#9a0036', // Darker shade of secondary color
            contrastText: '#ffffff', // Text color on secondary background
        },
        error: {
            main: '#f44336', // Error color
        },
        warning: {
            main: '#ff9800', // Warning color
        },
        info: {
            main: '#2196f3', // Info color
        },
        success: {
            main: '#4caf50', // Success color
        },
        background: {
            default: '#ffffff', // Default background color
            paper: '#fafafa', // Background color for paper components
        },
        text: {
            primary: '#333333', // Primary text color
            secondary: '#666666', // Secondary text color
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
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
                    backgroundColor: '#000', // Override Toolbar background color
                    border: '1px solid rgba(51, 51, 51, 0.15)'
                },
            },
        },
    },
};

export default createTheme(muiTheme);