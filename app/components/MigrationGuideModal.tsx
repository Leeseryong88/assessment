'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useVoucherOfferActive } from '../lib/useVoucherOfferActive';
import ModuSafeCta, { ModuSafeLogo } from './ModuSafeCta';
import PaidAiToolsSection from './PaidAiToolsSection';
import VoucherOfferCard from './VoucherOfferCard';

type MigrationGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  badge?: string;
  title?: string;
  description?: ReactNode;
};

export default function MigrationGuideModal({
  isOpen,
  onClose,
  badge,
  title = '그동안 정말 감사했습니다',
  description = 'AI-riska와 함께해 주신 모든 분들께 진심으로 감사드립니다. 지난 1년간의 테스트와 현장 피드백을 바탕으로, 안전관리자를 위한 종합 플랫폼 「모두의 안전」으로 새롭게 거듭났습니다.',
}: MigrationGuideModalProps) {
  const [mounted, setMounted] = useState(false);
  const showVoucher = useVoucherOfferActive();
  const resolvedBadge = badge ?? (showVoucher ? '이용권 · 이전 안내' : '이전 안내');

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
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/60 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="migration-guide-title"
      onClick={onClose}
    >
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ${
          showVoucher ? 'max-w-2xl' : 'max-w-lg'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className={`shrink-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 pb-4 pt-5 sm:px-6 sm:pt-6 ${
            showVoucher ? 'border-b border-slate-100' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <ModuSafeLogo size={52} className="rounded-2xl" />
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-cyan-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-cyan-800">
                  {resolvedBadge}
                </span>
                <h2
                  id="migration-guide-title"
                  className="mt-2 text-xl font-black leading-snug tracking-tight text-slate-950 sm:text-2xl"
                >
                  {title}
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
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 sm:text-[15px]">
            {description}
          </p>
        </div>

        {showVoucher ? (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
            <VoucherOfferCard />
            <PaidAiToolsSection voucherActive />
          </div>
        ) : null}

        <div
          className={`shrink-0 space-y-2 bg-white px-5 py-3 sm:px-6 ${
            showVoucher ? 'border-t border-slate-100' : 'pt-0 sm:pt-0'
          }`}
        >
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
