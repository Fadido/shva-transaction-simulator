import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { isRtl } from './i18n';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Simulator } from './pages/Simulator';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? 'en';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl(lang) ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Simulator />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
