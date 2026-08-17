'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from './Icons';
import { OPEN_KAKAO_URL } from './OpenKakaoCta';

const STORAGE_KEY = 'service-notice-hide-date';

/** 8/21 23:59:59 KST — 이후에는 알림 모달을 띄우지 않음 */
const NOTICE_UNTIL_MS = Date.parse('2026-08-21T23:59:59+09:00');

function getKstDateString() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export default function ServiceNoticeModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (Date.now() > NOTICE_UNTIL_MS) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === getKstDateString()) return;
      setIsOpen(true);
    } catch {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const hideToday = () => {
    try {
      localStorage.setItem(STORAGE_KEY, getKstDateString());
    } catch {
      // localStorage may be unavailable
    }
    setIsOpen(false);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-notice-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
          <div>
            <p className="text-xs font-black tracking-wide text-blue-100">중요 안내</p>
            <h3 id="service-notice-title" className="mt-1 text-xl font-black">
              서비스 이용 안내
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full p-1 transition-colors hover:bg-white/20"
            aria-label="닫기"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-6">
          <p className="text-base font-black leading-7 text-slate-900">
            <span className="text-blue-700">8월 24일 이후</span> 일부 서비스가 종료됩니다.
          </p>
          <p className="text-sm font-semibold leading-6 text-slate-600">
            모든 서비스를 계속 이용하시려면 오픈카톡방에 참여해 주세요.
            정식 오픈까지 함께 기다려 주시면 안내를 받으실 수 있습니다.
          </p>

          <a
            href={OPEN_KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={hideToday}
            className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-300 px-5 py-3.5 text-sm font-black text-yellow-950 shadow-sm transition hover:bg-yellow-400 active:scale-95"
          >
            오픈카톡 참여하기
          </a>

          <button
            type="button"
            onClick={hideToday}
            className="w-full py-2 text-sm font-bold text-slate-400 transition hover:text-slate-600"
          >
            오늘 그만보기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
