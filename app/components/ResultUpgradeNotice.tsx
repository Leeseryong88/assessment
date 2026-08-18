'use client';

import { VOUCHER_CODE, VOUCHER_DURATION } from '../lib/migration';
import ModuSafeCta, { ModuSafeLogo } from './ModuSafeCta';

type ResultUpgradeNoticeProps = {
  featureLabel?: string;
  className?: string;
};

export default function ResultUpgradeNotice({
  featureLabel = '결과',
  className = '',
}: ResultUpgradeNoticeProps) {
  return (
    <aside
      className={`overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-white shadow-sm ${className}`}
      aria-label="모두의 안전 안내"
    >
      <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center md:gap-5 md:p-5">
        <div className="flex min-w-0 gap-3">
          <ModuSafeLogo size={48} className="mt-0.5 rounded-2xl" />
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-cyan-300">
              저장 · 더 좋은 결과
            </p>
            <h3 className="mt-1.5 text-base font-black leading-snug tracking-tight md:text-lg">
              {featureLabel} 저장과 고도화된 AI는 「모두의 안전」에서
            </h3>
            <p className="mt-1.5 text-[13px] font-semibold leading-5 text-slate-300 md:text-sm md:leading-6">
              결과를 저장·관리하고 더 정확한 문서를 원하시면 새롭게 개편된{' '}
              <strong className="font-black text-white">모두의 안전</strong>을 이용해 주세요.
              무료 {VOUCHER_DURATION} 이용권 코드{' '}
              <span className="font-mono font-black tracking-wider text-cyan-200">{VOUCHER_CODE}</span>
              로 바로 시작할 수 있습니다.
            </p>
          </div>
        </div>
        <ModuSafeCta variant="banner" label="모두의 안전 이용하기" className="w-full md:w-auto" />
      </div>
    </aside>
  );
}
