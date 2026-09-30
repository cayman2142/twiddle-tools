import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';

/* /privacy is the static privacy.html (Chrome Web Store links to it). In
 * production the Worker serves it before the SPA; this only catches dev. */
function StaticPrivacy() {
  useEffect(() => {
    window.location.replace('/privacy.html');
  }, []);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/privacy" element={<StaticPrivacy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
