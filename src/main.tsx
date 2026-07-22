import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { SmoothScrollProvider } from './providers/SmoothScrollProvider';
import './styles/index.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <SmoothScrollProvider>
          <App />
        </SmoothScrollProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
