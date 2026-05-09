import { useTranslation } from 'react-i18next';

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? 'en';

  const buttons = [
    { code: 'en', label: 'ENG' },
    { code: 'he', label: 'Hebrew' },
  ];

  return (
    <div className="inline-flex items-center gap-1.5 sm:gap-2" role="group" aria-label="Language selector">
      {buttons.map(({ code, label }) => {
        const active = current === code;
        return (
          <button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            aria-pressed={active}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition sm:px-4 sm:py-2 sm:text-sm ${
              active
                ? 'border-2 border-brand-ink bg-white text-brand-ink shadow-sm'
                : 'border border-brand-line bg-white text-brand-muted hover:border-brand-ink hover:text-brand-ink'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
