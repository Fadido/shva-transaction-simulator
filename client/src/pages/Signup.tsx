import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { LanguageToggle } from '../components/LanguageToggle';
import { Logo } from '../components/Logo';
import type { AuthResponse } from '../types';

export function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { data } = await api.post<AuthResponse>('/auth/signup', { email, password });
      setAuth(data.token, data.email);
      navigate('/', { replace: true });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const data = err.response.data as { error?: string; errors?: string[] };
        setError(data.errors?.join(' ') ?? data.error ?? t('auth.errorGeneric'));
      } else {
        setError(t('auth.errorGeneric'));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-brand-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
          <Logo />
          <LanguageToggle />
        </div>
      </header>
      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
        <h1 className="text-center text-2xl font-semibold text-brand">{t('auth.signupTitle')}</h1>
        <form onSubmit={onSubmit} className="card flex flex-col gap-4">
          <label className="text-sm font-medium text-slate-700">
            {t('auth.email')}
            <input
              type="email"
              autoComplete="email"
              required
              className="input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            {t('auth.password')}
            <input
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="input mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? '…' : t('auth.signupCta')}
          </button>
        </form>
        <p className="text-center text-sm text-slate-600">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="font-medium text-brand-purple hover:underline">
            {t('auth.loginCta')}
          </Link>
        </p>
      </main>
    </div>
  );
}
