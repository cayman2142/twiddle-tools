import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Privacy } from './pages/Privacy';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/privacy.html" element={<Navigate to="/privacy" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
