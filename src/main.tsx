import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NavrasaProvider } from './context/NavrasaContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavrasaProvider>
      <App />
    </NavrasaProvider>
  </StrictMode>,
);
