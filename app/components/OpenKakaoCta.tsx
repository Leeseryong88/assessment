'use client';

import Image from 'next/image';

export const OPEN_KAKAO_URL = 'https://open.kakao.com/o/pzQkU4zi';

type OpenKakaoCtaProps = {
  variant?: 'home' | 'notice' | 'result';
  className?: string;
};

export default function OpenKakaoCta({ variant = 'result', className = '' }: OpenKakaoCtaProps) {
  const isHome = variant === 'home';
  const isNotice = variant === 'notice';

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
            <span className="text-xs font-black text-blue-700">오픈카톡 참여자 대상</span>
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
            BETA 테스트 종료 이후 <span className="font-black text-blue-700">무료 이용권</span>을 받고자 하는 분은 오픈카톡으로 들어와
            정식 출시를 함께 기다려 주세요.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isNotice && (
            <div className="hidden rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:block">
              <Image src="/QR.png" width={92} height={92} alt="안전관리 서류 자동화 오픈카톡 QR 코드" className="h-[92px] w-[92px]" />
            </div>
          )}
          <a
            href={OPEN_KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-300 px-5 py-3 text-sm font-black text-yellow-950 shadow-sm transition hover:bg-yellow-400 active:scale-95 sm:w-auto"
          >
            오픈카톡 참여하기
          </a>
        </div>
      </div>
    </div>
  );
}
