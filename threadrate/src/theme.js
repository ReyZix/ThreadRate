// src/theme.js
import { createTheme } from '@mui/material/styles';

// Your provided color palette
const pennBlue = '#091540';
const cornflowerBlue = '#7692FF';
const uranianBlue = '#ABD2FA';
const yInMnBlue = '#3D518C';
const persianBlue = '#1B2CC1';

export const theme = createTheme({
  palette: {
    // 1. The most important change: set the mode to 'light'
    mode: 'light',

    // 2. Set the interactive colors to your blues
    primary: {
      main: persianBlue, // Your vibrant blue for buttons, links, etc.
      contrastText: '#ffffff', // Text on primary-colored buttons will be white
    },
    secondary: {
      main: cornflowerBlue, // Your other blue as a secondary accent
      contrastText: '#ffffff',
    },

    // 3. Set the backgrounds to white and a light grey
    background: {
      default: '#FFFFFF', // A very light, clean grey for the main page background
      paper: '#FFFFFF',   // Pure white for Cards, AppBars, form containers, etc.
    },

    // 4. Set the text colors to your dark blues for readability
    text: {
      primary: pennBlue,       // Your darkest blue for titles and main text
      secondary: yInMnBlue,    // A muted dark blue for subtitles and secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
        fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                textTransform: 'none',
            },
        },
    },
    // Optional: Make the AppBar use the white 'paper' background by default
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // Set AppBar background to pure white
          color: pennBlue, // Set AppBar text color to your dark blue
        }
      }
    }
  },
});