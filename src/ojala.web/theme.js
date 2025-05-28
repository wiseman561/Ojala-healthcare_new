import { createTheme } from '@mui/material/styles';

// Define the unified Ojalá Healthcare Platform theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Standard Blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0', // Standard Purple
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    error: {
      main: '#d32f2f', // Standard Red
    },
    warning: {
      main: '#ed6c02', // Standard Orange
    },
    info: {
      main: '#0288d1', // Standard Light Blue
    },
    success: {
      main: '#2e7d32', // Standard Green
    },
    background: {
      default: '#f5f5f5', // Light grey background
      paper: '#ffffff', // White paper background
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    // Define a consistent size scale (adjust as needed)
    h1: { fontSize: '2.5rem', fontWeight: 500 },
    h2: { fontSize: '2rem', fontWeight: 500 },
    h3: { fontSize: '1.75rem', fontWeight: 500 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
    subtitle1: { fontSize: '1rem', fontWeight: 400 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.43 },
    button: { fontSize: '0.875rem', fontWeight: 500, textTransform: 'none' }, // Standardize button text
    caption: { fontSize: '0.75rem', fontWeight: 400 },
    overline: { fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase' },
  },
  spacing: 8, // Base spacing unit (8px)
  shape: {
    borderRadius: 8, // Standard border radius for most components
  },
  components: {
    // Standardize Button styles
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Use theme's shape.borderRadius
          textTransform: 'none', // Already in typography, but good to reinforce
          // Add standard padding (MUI defaults are usually okay, but can override)
          // Define hover/focus states if needed (MUI provides defaults)
        },
      },
      defaultProps: {
        disableElevation: true, // Flat buttons by default
      }
    },
    // Standardize Card styles
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Slightly larger radius for cards
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Consistent shadow
        },
      },
    },
    // Standardize TextField/Input styles
    MuiTextField: {
      defaultProps: {
        variant: 'outlined', // Default to outlined style
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Use theme's shape.borderRadius
        },
      },
    },
    // Standardize Alert styles
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Use theme's shape.borderRadius
        },
      },
    },
    // Standardize Modal/Dialog styles (often rely on Paper)
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12, // Match Card radius
        },
      },
    },
    // Standardize Table styles (MUI defaults are reasonable, customize if needed)
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600, // Bolder table headers
        },
      },
    },
    // Standardize Link styles
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#1976d2', // Use primary color
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default theme;

