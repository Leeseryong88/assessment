'use client';

import { useState } from 'react';
import { VOUCHER_CODE, VOUCHER_DURATION, VOUCHER_EXPIRES } from '../lib/migration';

type VoucherOfferCardProps = {
  variant?: 'modal' | 'page';
  mentionFeatureList?: boolean;
};

export default function VoucherOfferCard({
  variant = 'modal',
  mentionFeatureList = true,
}: VoucherOfferCardProps) {
  const [copied, setCopied] = useState(false);
  const isPage = variant === 'page';

  const copyVoucher = async () => {
    try {
      await navigator.clipboard.writeText(VOUCHER_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className={`rounded-xl border border-cyan-200 bg-cyan-50/60 ${isPage ? 'p-4' : 'p-3.5'}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-black text-cyan-700">무료 {VOUCHER_DURATION} AI 이용권</span>
        <span className="text-[11px] font-bold text-slate-500">등록 기한 {VOUCHER_EXPIRES}까지</span>
      </div>
      <div className={`flex gap-2 ${isPage ? 'flex-col sm:flex-row sm:items-center' : 'items-center'}`}>
        <code
          className={`flex-1 rounded-lg bg-slate-900 text-center font-mono font-bold tracking-[0.18em] text-white ${
            isPage ? 'px-3 py-3 text-xl' : 'px-3 py-2.5 text-lg'
          }`}
        >
          {VOUCHER_CODE}
        </code>
        <button
          type="button"
          onClick={copyVoucher}
          className={`shrink-0 rounded-lg bg-slate-800 text-sm font-black text-white transition hover:bg-slate-700 ${
            isPage ? 'px-4 py-3' : 'px-3 py-2.5'
          }`}
        >
          {copied ? '복사됨' : isPage ? '코드 복사' : '복사'}
        </button>
      </div>
      <p className="mt-2 text-[12px] font-semibold leading-5 text-slate-500">
        회원가입 후 이용권을 등록하면{' '}
        {mentionFeatureList ? '아래 유료 AI 기능을 ' : 'AI 서비스를 '}
        <strong className="font-black text-slate-700">{VOUCHER_DURATION}</strong>간 바로 사용할 수 있습니다.
      </p>
    </section>
  );
}
