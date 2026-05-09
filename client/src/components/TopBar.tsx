import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/useAuthStore';
import { LanguageToggle } from './LanguageToggle';
import { Logo } from './Logo';

export function TopBar() {
  const { t } = useTranslation();
  const { email, logout } = useAuthStore();

  return (
    <header className="border-b border-brand-line bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Logo className="h-8 sm:h-10" />
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle />
          {email && (
            <button
              onClick={logout}
              className="btn-ghost px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm"
              aria-label={t('nav.logout')}
            >
              {t('nav.logout')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
