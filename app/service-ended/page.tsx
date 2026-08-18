'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TopBar from '../components/TopBar';
import ModuSafeCta, { ModuSafeLogo } from '../components/ModuSafeCta';
import {
  ENDED_FEATURES,
  PAID_AI_TOOLS,
  VOUCHER_CODE,
  VOUCHER_DURATION,
  VOUCHER_EXPIRES,
  type EndedFeatureKey,
} from '../lib/migration';

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function ServiceEndedPage() {
  const [featureTitle, setFeatureTitle] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('feature');
    if (key && key in ENDED_FEATURES) {
      setFeatureTitle(ENDED_FEATURES[key as EndedFeatureKey].title);
    }
  }, []);

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
    <main className="min-h-screen bg-slate-100">
      <TopBar />
      <section className="mx-auto max-w-2xl px-4 py-8 md:py-14">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-6 sm:px-8">
            <div className="flex items-start gap-3">
              <ModuSafeLogo size={56} className="rounded-2xl" />
              <div className="min-w-0">
                <span className="inline-flex rounded-full bg-cyan-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-cyan-800">
                  이용권 · 이전 안내
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
            <section className="rounded-xl border border-cyan-200 bg-cyan-50/60 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-black text-cyan-700">무료 {VOUCHER_DURATION} AI 이용권</span>
                <span className="text-[11px] font-bold text-slate-500">등록 기한 {VOUCHER_EXPIRES}까지</span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <code className="flex-1 rounded-lg bg-slate-900 px-3 py-3 text-center font-mono text-xl font-bold tracking-[0.18em] text-white">
                  {VOUCHER_CODE}
                </code>
                <button
                  type="button"
                  onClick={copyVoucher}
                  className="rounded-lg bg-slate-800 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-700"
                >
                  {copied ? '복사됨' : '코드 복사'}
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
                  <h2 className="text-base font-black text-slate-950">이용권으로 사용할 수 있는 기능</h2>
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
