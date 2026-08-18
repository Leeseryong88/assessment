'use client';

import { NEW_SITE_URL } from '../lib/migration';

/** 투명 배경 로고 (크롭된 마크) */
export const MODU_SAFE_LOGO = '/icon.png';
/** 흰 배경 타일 — 배너·CTA·파비콘에서 대비가 분명함 */
export const MODU_SAFE_BRAND_ICON = '/brand-icon.png';

type ModuSafeCtaProps = {
  variant?: 'button' | 'chip' | 'banner';
  label?: string;
  className?: string;
};

export function ModuSafeLogo({
  size = 40,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={MODU_SAFE_BRAND_ICON}
        alt="모두의 안전"
        width={size}
        height={size}
        className="h-full w-full object-cover"
        decoding="async"
      />
    </span>
  );
}

export default function ModuSafeCta({
  variant = 'button',
  label = '모두의 안전으로 이동',
  className = '',
}: ModuSafeCtaProps) {
  if (variant === 'chip') {
    return (
      <a
        href={NEW_SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-3 text-[11px] font-black text-slate-900 shadow-sm transition hover:bg-cyan-50 md:text-xs ${className}`}
      >
        <ModuSafeLogo size={22} className="rounded-full" />
        {label}
      </a>
    );
  }

  if (variant === 'banner') {
    return (
      <a
        href={NEW_SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-slate-900 shadow-sm transition hover:bg-cyan-50 ${className}`}
      >
        <ModuSafeLogo size={28} className="rounded-lg" />
        {label}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 17L17 7M17 7H9M17 7V15"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    );
  }

  return (
    <a
      href={NEW_SITE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex w-full items-center justify-center gap-2.5 rounded-xl bg-white px-4 py-3.5 text-base font-black text-slate-900 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-cyan-300 ${className}`}
    >
      <ModuSafeLogo size={36} />
      <span className="min-w-0 text-left leading-tight">
        {label}
        <span className="mt-0.5 block text-[11px] font-bold tracking-wide text-slate-500">
          modu-safe.com
        </span>
      </span>
      <svg className="ml-auto shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7 17L17 7M17 7H9M17 7V15"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
