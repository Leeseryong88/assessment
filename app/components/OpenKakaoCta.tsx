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
          <h3 className={`${isHome ? 'text-lg md:text-2xl' : 'text-base md:text-xl'} font-black leading-tight text-slate-950`}>
            오픈 카톡방 참여자 대상
            <span className="mt-2 inline-flex rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white shadow-sm md:ml-2 md:mt-0 md:text-sm">
              오픈시 한달이용권 제공
            </span>
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
            정식 오픈 시 해당 카카오톡 방에 공지하고, 방에 계신 분들께 <span className="font-black text-blue-700">한 달 이용권</span>을 제공합니다.
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
