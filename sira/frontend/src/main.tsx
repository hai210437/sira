import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Routes from './Routes.tsx'
import "./i18n/index.ts";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <Routes />
    </I18nextProvider>
  </StrictMode>
)
