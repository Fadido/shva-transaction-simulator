import { useTranslation } from 'react-i18next';
import type { TransactionResponse } from '../types';

interface Props {
  tx: TransactionResponse;
}

export function TransactionCard({ tx }: Props) {
  const { t } = useTranslation();

  const time = new Date(tx.localTime).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <article
      className="box-border flex h-[103px] w-[260px] min-w-[240px] flex-shrink-0 flex-col items-start gap-6 rounded-lg border border-[#D9D9D9] bg-white p-5 sm:w-[290px] md:w-[310px] xl:w-[325.33px] sm:p-6"
    >
      <div className="flex w-full flex-col items-start gap-1">
        <h3 className="text-[20px] font-semibold leading-[120%] tracking-[-0.02em] text-[#1E1E1E] sm:text-[24px]">
          {t('list.timeLabel')}: <span className="tabular-nums">{time}</span>
        </h3>
        <p className="text-[14px] font-normal leading-[140%] text-[#1E1E1E] sm:text-[16px]">
          {t('list.timeZoneLabel')}: {t(`regions.${tx.region}`)}
        </p>
      </div>
    </article>
  );
}
