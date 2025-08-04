// src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// --- MUI Imports ---
// 1. Import the ThemeProvider to make the theme available to all components
import { ThemeProvider } from '@mui/material/styles';
// 2. CssBaseline applies a consistent baseline style (like resetting margins) and the background color
import CssBaseline from '@mui/material/CssBaseline';
// 3. Import the custom theme you created in theme.js
import { theme } from './theme';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {/* 4. Wrap your entire App component with the ThemeProvider */}
      <ThemeProvider theme={theme}>
        {/* CssBaseline goes inside the provider */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </StrictMode>
  );
} else {
  console.error('❌ Root element not found in index.html');
}