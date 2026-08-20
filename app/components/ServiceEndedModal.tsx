'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useVoucherOfferActive } from '../lib/useVoucherOfferActive';
import ModuSafeCta, { ModuSafeLogo } from './ModuSafeCta';
import VoucherOfferCard from './VoucherOfferCard';

type ServiceEndedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
};

export default function ServiceEndedModal({
  isOpen,
  onClose,
  featureTitle = '해당 기능',
}: ServiceEndedModalProps) {
  const [mounted, setMounted] = useState(false);
  const showVoucher = useVoucherOfferActive();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/60 p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-ended-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-amber-50 via-white to-cyan-50 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <ModuSafeLogo size={52} className="rounded-2xl" />
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-amber-800">
                  베타 종료
                </span>
                <h2
                  id="service-ended-title"
                  className="mt-2 text-xl font-black leading-snug tracking-tight text-slate-950 sm:text-2xl"
                >
                  {featureTitle} 베타 기간이 종료되었습니다
                </h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:text-slate-800"
              aria-label="닫기"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
            이 기능은 「모두의 안전」(<strong className="font-black text-slate-800">modu-safe.com</strong>)에서
            더 안정적으로 이용할 수 있습니다.
          </p>
        </div>

        <div className="space-y-3 px-5 py-4 sm:px-6">
          {showVoucher ? <VoucherOfferCard mentionFeatureList={false} /> : null}
          <ModuSafeCta label="모두의 안전으로 이동" />
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
