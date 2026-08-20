'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TopBar from '../components/TopBar';
import ModuSafeCta, { ModuSafeLogo } from '../components/ModuSafeCta';
import PaidAiToolsSection from '../components/PaidAiToolsSection';
import VoucherOfferCard from '../components/VoucherOfferCard';
import {
  ENDED_FEATURES,
  type EndedFeatureKey,
} from '../lib/migration';
import { useVoucherOfferActive } from '../lib/useVoucherOfferActive';

export default function ServiceEndedPage() {
  const [featureTitle, setFeatureTitle] = useState<string | null>(null);
  const showVoucher = useVoucherOfferActive();

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('feature');
    if (key && key in ENDED_FEATURES) {
      setFeatureTitle(ENDED_FEATURES[key as EndedFeatureKey].title);
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-100">
      <TopBar />
      <section className="mx-auto max-w-2xl px-4 py-8 md:py-14">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-6 sm:px-8">
            <div className="flex items-start gap-3">
              <ModuSafeLogo size={56} className="rounded-2xl" />
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-cyan-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-cyan-800">
                  {showVoucher ? '이용권 · 이전 안내' : '이전 안내'}
                </span>
                <h1 className="mt-3 text-2xl font-black leading-snug tracking-tight text-slate-950 sm:text-3xl">
                  그동안 정말 감사했습니다
                </h1>
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 sm:text-base">
              {featureTitle ? (
                <>
                  <strong className="font-black text-slate-800">{featureTitle}</strong> 기능은 「모두의 안전」으로
                  이전되었습니다.{' '}
                </>
              ) : null}
              AI-riska와 함께해 주신 모든 분들께 진심으로 감사드립니다. 지난{' '}
              <strong className="font-black text-slate-800">1년간의 테스트</strong>와 현장 피드백을 바탕으로,
              안전관리자를 위한 종합 플랫폼 「모두의 안전」으로 새롭게 거듭났습니다.
            </p>
          </div>

          <div className="space-y-4 px-5 py-5 sm:px-8 sm:py-6">
            {showVoucher ? <VoucherOfferCard variant="page" /> : null}
            <PaidAiToolsSection voucherActive={showVoucher} heading="h2" />
            {showVoucher ? null : (
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-[12px] font-semibold leading-5 text-slate-500">
                캘린더, 안전일지, TBM 등 기본 기능은 회원가입만으로 이용할 수 있습니다.
              </p>
            )}
            <ModuSafeCta label="모두의 안전으로 이동" />
            <Link
              href="/"
              className="block text-center text-sm font-bold text-slate-500 transition hover:text-slate-800"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
