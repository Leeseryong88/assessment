'use client';

import { useEffect, useState } from 'react';

export const OPEN_KAKAO_URL = 'https://open.kakao.com/o/pzQkU4zi';

/** 8/7 23:59:59 KST */
const DEADLINE_MS = Date.parse('2026-08-07T23:59:59+09:00');

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

function getTimeLeft(now: number): TimeLeft {
  const totalMs = Math.max(0, DEADLINE_MS - now);
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalMs };
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

type OpenKakaoCtaProps = {
  variant?: 'home' | 'notice' | 'result';
  className?: string;
};

export default function OpenKakaoCta({ variant = 'result', className = '' }: OpenKakaoCtaProps) {
  const isHome = variant === 'home';
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const expired = timeLeft !== null && timeLeft.totalMs <= 0;

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 via-white to-blue-50 shadow-sm ${className}`}
    >
      <div className={`flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between ${isHome ? 'md:p-6' : 'md:p-5'}`}>
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-yellow-300 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-950">
              정식 오픈 혜택
            </span>
            <span className="text-xs font-black text-blue-700">8/7까지 오픈카톡 참여자 대상</span>
          </div>
          <h3 className={`${isHome ? 'text-base md:text-xl' : 'text-sm md:text-lg'} font-black leading-tight text-slate-950`}>
            오픈 카톡방 참여자 대상
            <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-lg font-black text-white shadow-md shadow-blue-100 md:ml-3 md:mt-0 md:text-2xl">
              <svg className="h-5 w-5 md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v3a2 2 0 010 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 010-4V7a2 2 0 012-2z" />
              </svg>
              한달이용권 제공
            </span>
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            <span className="font-black text-blue-700">8월 7일까지</span> 오픈카톡에 참여하신 분에 한해 BETA 종료 후{' '}
            <span className="font-black text-blue-700">무료 이용권</span>을 제공합니다. 정식 출시를 함께 기다려 주세요.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div
            className="inline-flex flex-col gap-1.5 rounded-xl border border-blue-100 bg-white px-3 py-2.5 shadow-sm"
            aria-live="polite"
          >
            <div className="flex items-center gap-1.5 text-[11px] font-black tracking-wide text-slate-500">
              <svg className="h-3.5 w-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {expired ? '참여 마감' : '혜택 마감까지'}
            </div>
            {timeLeft === null ? (
              <div className="h-8 w-48 animate-pulse rounded-md bg-slate-100" />
            ) : expired ? (
              <p className="text-sm font-black text-slate-700">오픈카톡 혜택 신청이 마감되었습니다.</p>
            ) : (
              <div className="flex items-end gap-1.5 font-black tabular-nums text-slate-950">
                <CountdownUnit value={timeLeft.days} label="일" />
                <span className="mb-0.5 text-lg text-blue-500">:</span>
                <CountdownUnit value={pad2(timeLeft.hours)} label="시" />
                <span className="mb-0.5 text-lg text-blue-500">:</span>
                <CountdownUnit value={pad2(timeLeft.minutes)} label="분" />
                <span className="mb-0.5 text-lg text-blue-500">:</span>
                <CountdownUnit value={pad2(timeLeft.seconds)} label="초" />
              </div>
            )}
          </div>

          <a
            href={OPEN_KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-black shadow-sm transition active:scale-95 sm:w-auto ${
              expired
                ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-yellow-300 text-yellow-950 hover:bg-yellow-400'
            }`}
            aria-disabled={expired}
            onClick={(e) => {
              if (expired) e.preventDefault();
            }}
          >
            {expired ? '참여 마감' : '오픈카톡 참여하기'}
          </a>
        </div>
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex min-w-[2.5rem] flex-col items-center rounded-lg bg-blue-600 px-2 py-1 text-white shadow-sm shadow-blue-100">
      <span className="text-lg leading-none md:text-xl">{value}</span>
      <span className="mt-0.5 text-[10px] font-bold tracking-wide text-blue-100">{label}</span>
    </div>
  );
}
