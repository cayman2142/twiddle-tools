import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './app/tokens.css';
import '../vendor/chrome/spec-lens.css';
import './app/base.css';
import './app/scene-stage.css';
import './marketing/marketing.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
