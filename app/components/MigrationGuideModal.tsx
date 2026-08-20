'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  PAID_AI_TOOLS,
  VOUCHER_CODE,
  VOUCHER_DURATION,
  VOUCHER_EXPIRES,
} from '../lib/migration';
import ModuSafeCta, { ModuSafeLogo } from './ModuSafeCta';

type MigrationGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  badge?: string;
  title?: string;
  description?: ReactNode;
};

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function MigrationGuideModal({
  isOpen,
  onClose,
  badge = '이용권 · 이전 안내',
  title = '그동안 정말 감사했습니다',
  description = 'AI-riska와 함께해 주신 모든 분들께 진심으로 감사드립니다. 지난 1년간의 테스트와 현장 피드백을 바탕으로, 안전관리자를 위한 종합 플랫폼 「모두의 안전」으로 새롭게 거듭났습니다.',
}: MigrationGuideModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const copyVoucher = async () => {
    try {
      await navigator.clipboard.writeText(VOUCHER_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/60 p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="migration-guide-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="shrink-0 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <ModuSafeLogo size={52} className="rounded-2xl" />
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-cyan-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-cyan-800">
                  {badge}
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

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          <section className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-3.5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-black text-cyan-700">무료 {VOUCHER_DURATION} AI 이용권</span>
              <span className="text-[11px] font-bold text-slate-500">등록 기한 {VOUCHER_EXPIRES}까지</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-slate-900 px-3 py-2.5 text-center font-mono text-lg font-bold tracking-[0.18em] text-white">
                {VOUCHER_CODE}
              </code>
              <button
                type="button"
                onClick={copyVoucher}
                className="shrink-0 rounded-lg bg-slate-800 px-3 py-2.5 text-sm font-black text-white transition hover:bg-slate-700"
              >
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
            <p className="mt-2 text-[12px] font-semibold leading-5 text-slate-500">
              회원가입 후 이용권을 등록하면 아래 유료 AI 기능을{' '}
              <strong className="font-black text-slate-700">{VOUCHER_DURATION}</strong>간 바로 사용할 수 있습니다.
            </p>
          </section>

          <section className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
            <div className="mb-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full bg-sky-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                  이용권 적용
                </span>
                <h3 className="text-base font-black text-slate-950">이용권으로 사용할 수 있는 기능</h3>
              </div>
              <p className="text-[12px] font-semibold leading-5 text-slate-600">
                모두의 안전 유료 AI 기능입니다. 이용권 등록 후 {VOUCHER_DURATION}간 이용할 수 있습니다.
              </p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {PAID_AI_TOOLS.map((item) => (
                <li key={item.title} className="flex items-start gap-2 text-[13px] font-semibold text-slate-700">
                  <CheckIcon />
                  <span>
                    <span className="font-black text-slate-900">{item.title}</span>
                    {item.desc ? <span className="text-slate-500"> · {item.desc}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="shrink-0 space-y-2 border-t border-slate-100 bg-white px-5 py-3 sm:px-6">
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
