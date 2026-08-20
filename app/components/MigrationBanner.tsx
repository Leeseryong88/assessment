'use client';

import { useState } from 'react';
import ModuSafeCta, { ModuSafeLogo } from './ModuSafeCta';
import MigrationGuideModal from './MigrationGuideModal';
import { useVoucherOfferActive } from '../lib/useVoucherOfferActive';

type MigrationBannerProps = {
  compact?: boolean;
};

export default function MigrationBanner({ compact = false }: MigrationBannerProps) {
  const [guideOpen, setGuideOpen] = useState(false);
  const showVoucher = useVoucherOfferActive();

  if (compact) {
    return (
      <>
        <div className="border-b border-cyan-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-[11px] font-bold leading-snug md:text-xs">
            <p className="flex min-w-0 flex-1 items-center gap-2">
              <ModuSafeLogo size={24} className="rounded-md" />
              <span>
                <span className="mr-1.5 rounded bg-cyan-400/20 px-1.5 py-0.5 text-cyan-200">이전 안내</span>
                일부 기능은 「모두의 안전」으로 이전되었습니다. 사진분석·위험성평가는 하루 1번 제한적인 무료로 이용할 수 있습니다.
              </span>
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              {showVoucher ? (
                <button
                  type="button"
                  onClick={() => setGuideOpen(true)}
                  className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-black text-white transition hover:bg-white/20"
                >
                  이용권 안내
                </button>
              ) : null}
              <ModuSafeCta variant="chip" label="modu-safe.com" />
            </div>
          </div>
        </div>
        <MigrationGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
      </>
    );
  }

  return (
    <>
      <section className="mb-5 overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white shadow-sm md:mb-8">
        <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center md:gap-6 md:p-5">
          <div className="flex gap-3">
            <ModuSafeLogo size={52} className="mt-0.5 rounded-2xl" />
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-cyan-300">서비스 이전 안내</p>
              <h2 className="mt-1.5 text-lg font-black leading-snug tracking-tight md:text-xl">
                AI-riska가 「모두의 안전」으로 이어집니다
              </h2>
              <p className="mt-1.5 text-[13px] font-semibold leading-5 text-slate-300 md:text-sm md:leading-6">
                무료 베타를 마치고 종합 안전관리 플랫폼으로 이전합니다.
                <br />
                <span className="text-white">사진분석·위험성평가는 하루 1번 제한적인 무료로 이용할 수 있습니다.</span>{' '}
                그 외 기능은 「모두의 안전」에서 이용해 주세요.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
            <ModuSafeCta variant="banner" label="새 사이트 바로가기" />
            {showVoucher ? (
              <button
                type="button"
                onClick={() => setGuideOpen(true)}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                이용권·이전 안내
              </button>
            ) : null}
          </div>
        </div>
      </section>
      <MigrationGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
