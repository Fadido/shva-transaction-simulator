import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Value {
  hour: number;
  minute: number;
}

interface Props {
  value: Value;
  onChange: (v: Value) => void;
  /** Optional handler invoked when the user clicks OK - typically the form submit. */
  onOk?: () => void;
  okDisabled?: boolean;
  okBusy?: boolean;
}

const pad = (n: number) => n.toString().padStart(2, '0');
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function HourMinutePicker({ value, onChange, onOk, okDisabled, okBusy }: Props) {
  const { t } = useTranslation();
  const [active, setActive] = useState<'hour' | 'minute' | null>('hour');

  const update = (field: keyof Value, raw: string) => {
    const max = field === 'hour' ? 23 : 59;
    const cleaned = raw.replace(/\D/g, '').slice(-2);
    const n = clamp(parseInt(cleaned || '0', 10), 0, max);
    onChange({ ...value, [field]: n });
  };

  const setNow = () => {
    const now = new Date();
    onChange({ hour: now.getHours(), minute: now.getMinutes() });
  };

  const inputCls = (field: 'hour' | 'minute') =>
    `flex h-16 w-20 items-center justify-center rounded-xl border-2 text-center text-3xl font-semibold tabular-nums outline-none transition sm:h-20 sm:w-24 sm:text-4xl ${
      active === field
        ? 'border-brand-purple bg-white text-brand-purple shadow-card'
        : 'border-transparent bg-white/60 text-brand-muted'
    }`;

  return (
    <div className="rounded-2xl bg-brand-lavender p-4 sm:p-5">
      <p className="mb-3 text-sm font-medium text-brand-ink sm:mb-4">{t('form.enterTime')}</p>

      <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
        <div className="flex flex-col items-center gap-1">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            value={pad(value.hour)}
            onFocus={(e) => {
              setActive('hour');
              e.currentTarget.select();
            }}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) => update('hour', e.target.value)}
            className={inputCls('hour')}
            aria-label={t('form.hour')}
          />
          <span className="text-xs text-brand-muted">{t('form.hour')}</span>
        </div>
        <span className="-mt-5 text-3xl font-semibold text-brand-ink">:</span>
        <div className="flex flex-col items-center gap-1">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            value={pad(value.minute)}
            onFocus={(e) => {
              setActive('minute');
              e.currentTarget.select();
            }}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) => update('minute', e.target.value)}
            className={inputCls('minute')}
            aria-label={t('form.minute')}
          />
          <span className="text-xs text-brand-muted">{t('form.minute')}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={setNow}
          className="text-[#49454F] transition hover:opacity-80"
          aria-label={t('form.useNow')}
          title={t('form.useNow')}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-center gap-4 text-sm font-medium">
          <button
            type="button"
            onClick={setNow}
            className="text-[#65558F] transition hover:opacity-80"
          >
            {t('form.cancel')}
          </button>
          <button
            type="button"
            onClick={() => {
              setActive(null);
              onOk?.();
            }}
            disabled={okBusy || okDisabled}
            className="font-semibold text-[#65558F] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {okBusy ? t('form.submitting') : t('form.ok')}
          </button>
        </div>
      </div>
    </div>
  );
}
