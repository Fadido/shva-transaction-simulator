import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { REGIONS, type RegionCode } from '../types';

interface Props {
  value: RegionCode | '';
  onChange: (v: RegionCode) => void;
}

export function RegionSelect({ value, onChange }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  const labels = useMemo(
    () => REGIONS.map((code) => ({ code, label: t(`regions.${code}`) })),
    [t]
  );

  const filtered = query
    ? labels.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()))
    : labels;

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selectedLabel = value ? t(`regions.${value}`) : '';

  return (
    <div ref={wrapRef} className="relative">
      <span
        className="absolute -top-2 start-3 z-10 bg-white px-1 text-[11px] font-medium text-brand-teal"
        aria-hidden
      >
        {t('form.regionLabel')}
      </span>

      <div
        className={`flex items-center gap-2 rounded-lg border bg-white px-3 py-2.5 text-sm transition ${
          open
            ? 'border-brand-purple ring-2 ring-brand-purple/20'
            : 'border-brand-purple/70'
        }`}
      >
        <input
          type="text"
          className="flex-1 bg-transparent outline-none placeholder:text-brand-muted"
          placeholder={t('form.regionPlaceholder')}
          value={open ? query : selectedLabel}
          onFocus={() => {
            setOpen(true);
            setQuery('');
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          aria-label={t('form.regionLabel')}
        />
        {(value || query) && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              if (value) onChange('' as RegionCode);
            }}
            className="text-brand-muted transition hover:text-brand-ink"
            aria-label="Clear"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="m9 9 6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <ul
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-brand-line bg-white shadow-pop animate-fadeIn"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-brand-muted">{t('form.noMatch')}</li>
          ) : (
            filtered.map((r) => (
              <li key={r.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(r.code);
                    setQuery('');
                    setOpen(false);
                  }}
                  role="option"
                  aria-selected={value === r.code}
                  className={`block w-full px-4 py-3 text-start text-sm transition hover:bg-brand-softer ${
                    value === r.code ? 'bg-brand-softer/60 font-medium' : ''
                  }`}
                >
                  {r.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
