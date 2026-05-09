import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionCard } from './TransactionCard';
import type { TransactionResponse } from '../types';
import { isRtl } from '../i18n';

interface Props {
  items: TransactionResponse[];
}

const ArrowLeft = () => (
  <svg width="12.86" height="12.44" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M7.72168 0.372375C7.60329 0.372443 7.48894 0.404554 7.38965 0.463195L7.29492 0.531555L7.29395 0.532531L0.693359 6.26105C0.592708 6.3486 0.512344 6.45703 0.457031 6.57843C0.401717 6.69986 0.373046 6.83171 0.373046 6.96515C0.373061 7.09858 0.401707 7.23044 0.457031 7.35187C0.512362 7.47327 0.592685 7.5817 0.693359 7.66925L0.694335 7.66925L7.33594 13.431L7.33691 13.43C7.43312 13.515 7.55418 13.5569 7.67187 13.5569L9.26953 13.5569C9.7472 13.5569 9.95998 12.9689 9.60644 12.6595L9.60547 12.6585L4.24023 8.00128L13.4648 8.00128C13.7474 8.00122 13.9773 7.77206 13.9775 7.48956L13.9775 6.44073C13.9774 6.15814 13.7474 5.9281 13.4648 5.92804L4.23926 5.92804L9.60352 1.27179L9.60352 1.27081C9.96168 0.960705 9.74173 0.372646 9.26855 0.372375L7.72168 0.372375Z"
      fill="#363636"
      stroke="#363636"
      strokeWidth="0.745423"
    />
  </svg>
);

const ArrowRight = () => (
  <svg width="12.86" height="12.44" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path
      d="M6.62817 13.5578C6.74657 13.5578 6.8609 13.5256 6.96021 13.467L7.05493 13.3986L7.05591 13.3977L13.6565 7.66914C13.7572 7.58157 13.8375 7.4732 13.8928 7.35176C13.9482 7.23031 13.9768 7.09851 13.9768 6.96504C13.9768 6.83159 13.9482 6.69976 13.8928 6.57832C13.8513 6.48715 13.7957 6.40338 13.7278 6.33028L13.6565 6.26094L7.01392 0.499222L7.01294 0.500198C6.91686 0.415249 6.79654 0.372373 6.67896 0.372269H5.08032C4.60264 0.372269 4.38982 0.961275 4.74341 1.27071L4.74438 1.27168L10.1106 5.92891H0.88501C0.602462 5.92897 0.372498 6.15811 0.372314 6.44063V7.48946C0.372438 7.77203 0.602423 8.00209 0.88501 8.00215H10.1106L4.74634 12.6584V12.6594C4.38821 12.9695 4.60816 13.5575 5.0813 13.5578H6.62817Z"
      fill="#363636"
      stroke="#363636"
      strokeWidth="0.745429"
    />
  </svg>
);

export function TransactionsCarousel({ items }: Props) {
  const { t, i18n } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rtl = isRtl(i18n.resolvedLanguage ?? 'en');

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const sign = rtl ? -dir : dir;
    el.scrollBy({ left: sign * 260, behavior: 'smooth' });
  };

  if (items.length === 0) {
    return <p className="text-brand-muted">{t('list.empty')}</p>;
  }

  const arrowBtn =
    'absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-white transition hover:scale-105';
  const arrowStyle: React.CSSProperties = {
    borderRadius: '73.7974px',
    boxShadow: '0px 6.70886px 14.9086px rgba(0, 0, 0, 0.08)',
    padding: '8.94514px',
    boxSizing: 'border-box',
  };

  return (
    <div className="relative px-10">
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Previous"
        className={`${arrowBtn} start-0`}
        style={arrowStyle}
      >
        {rtl ? <ArrowRight /> : <ArrowLeft />}
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Next"
        className={`${arrowBtn} end-0`}
        style={arrowStyle}
      >
        {rtl ? <ArrowLeft /> : <ArrowRight />}
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
      >
        {items.map((tx) => (
          <div key={tx.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
            <TransactionCard tx={tx} />
          </div>
        ))}
      </div>
    </div>
  );
}
