import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar } from '../components/TopBar';
import { RegionSelect } from '../components/RegionSelect';
import { HourMinutePicker } from '../components/HourMinutePicker';
import { HeroMockup } from '../components/HeroMockup';
import { TransactionsCarousel } from '../components/TransactionsCarousel';
import { useTransactionsStore } from '../store/useTransactionsStore';
import type { RegionCode } from '../types';

function buildSubmittedAtUtc(hour: number, minute: number): string {
  const now = new Date();
  const utc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, minute, 0)
  );
  return utc.toISOString();
}

export function Simulator() {
  const { t } = useTranslation();
  const [region, setRegion] = useState<RegionCode | ''>('');
  const initialNow = new Date();
  const [time, setTime] = useState({
    hour: initialNow.getHours(),
    minute: initialNow.getMinutes(),
  });
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{
    kind: 'ok' | 'err';
    key: 'result.approvedToast' | 'result.rejectedToast' | 'auth.errorGeneric';
  } | null>(null);

  const { approved, fetchApproved, submit } = useTransactionsStore();

  useEffect(() => {
    fetchApproved();
  }, [fetchApproved]);

  const submitTransaction = async () => {
    if (!region || busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      const result = await submit(region, buildSubmittedAtUtc(time.hour, time.minute));
      setFeedback(
        result.status === 'Approved'
          ? { kind: 'ok', key: 'result.approvedToast' }
          : { kind: 'err', key: 'result.rejectedToast' }
      );
    } catch {
      setFeedback({ kind: 'err', key: 'auth.errorGeneric' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Visual section */}
          <div className="order-1 flex flex-col items-center gap-4 text-center lg:order-2 lg:gap-6">
            <span className="pill">{t('app.badge')}</span>
            <h1 className="w-full max-w-[630px] text-center font-rubik text-[24px] font-normal leading-[1.5] text-[#363636]">
              {t('app.title')}
            </h1>
            <HeroMockup />
          </div>

          {/* Form column */}
          <div className="order-2 flex flex-col gap-5 lg:order-1 lg:gap-6">
            <div className="mx-auto w-full max-w-md lg:mx-0">
              <RegionSelect value={region} onChange={setRegion} />
            </div>
            <div className="mx-auto w-full max-w-md lg:mx-0">
              <HourMinutePicker
                value={time}
                onChange={setTime}
                onOk={submitTransaction}
                okDisabled={!region}
                okBusy={busy}
              />
            </div>
            {feedback && (
              <p
                role="status"
                className={`mx-auto w-full max-w-md text-sm font-medium lg:mx-0 ${
                  feedback.kind === 'ok' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {t(feedback.key)}
              </p>
            )}
          </div>
        </div>

        <section className="mt-12 flex flex-col gap-4 sm:mt-16 sm:gap-5">
          <h2 className="text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-[#1E1E1E]">
            {t('list.title')}
          </h2>
          <TransactionsCarousel items={approved} />
        </section>
      </main>
    </div>
  );
}
