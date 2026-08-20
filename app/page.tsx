'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from './components/TopBar';
import MigrationBanner from './components/MigrationBanner';
import ServiceEndedModal from './components/ServiceEndedModal';
import {
  ENDED_FEATURES,
  NEW_SITE_URL,
  type EndedFeatureKey,
} from './lib/migration';

type FeatureItem = {
  title: string;
  description: string;
  route: string;
  icon: string;
  available: boolean;
  dailyLimit?: boolean;
  endedKey?: EndedFeatureKey;
};

const FEATURES: FeatureItem[] = [
  {
    title: '사진분석',
    description: '현장 사진을 기반으로 위험요인과 개선대책을 확인합니다.',
    route: '/camera',
    icon: 'camera',
    available: true,
    dailyLimit: true,
  },
  {
    title: '위험성평가',
    description: '공정별 위험요인, 위험도, 감소대책을 작성합니다.',
    route: '/assessment',
    icon: 'assessment',
    available: true,
    dailyLimit: true,
  },
  {
    title: ENDED_FEATURES.plan.title,
    description: ENDED_FEATURES.plan.description,
    route: ENDED_FEATURES.plan.path,
    icon: 'plan',
    available: false,
    endedKey: 'plan',
  },
  {
    title: ENDED_FEATURES.fee.title,
    description: ENDED_FEATURES.fee.description,
    route: ENDED_FEATURES.fee.path,
    icon: 'fee',
    available: false,
    endedKey: 'fee',
  },
  {
    title: ENDED_FEATURES.tbm.title,
    description: ENDED_FEATURES.tbm.description,
    route: ENDED_FEATURES.tbm.path,
    icon: 'tbm',
    available: false,
    endedKey: 'tbm',
  },
];

function FeatureIcon({ type }: { type: string }) {
  if (type === 'camera') {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h1.5l1-1.8A2 2 0 019.25 4h5.5a2 2 0 011.75 1.2l1 1.8H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9zm9 7a3 3 0 100-6 3 3 0 000 6z" />
    );
  }

  if (type === 'fee') {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.7 0-3 .9-3 2s1.3 2 3 2 3 .9 3 2-1.3 2-3 2m0-8V6m0 10v2m8-6a8 8 0 11-16 0 8 8 0 0116 0z" />
    );
  }

  if (type === 'tbm') {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    );
  }

  if (type === 'plan') {
    return (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.6L19 9.4V19a2 2 0 01-2 2z" />
    );
  }

  return (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5h6m-6 4h6m-7 4h8m-8 4h5M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
  );
}

export default function HomePage() {
  const router = useRouter();
  const [endedTitle, setEndedTitle] = useState<string | null>(null);

  const handleFeatureClick = (feature: FeatureItem) => {
    if (feature.available) {
      router.push(feature.route);
      return;
    }
    setEndedTitle(feature.title);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <TopBar />
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-5 md:py-14">
        <MigrationBanner />

        <div className="mb-5 md:mb-8">
          <h1 className="text-xl font-black leading-7 tracking-tight text-slate-950 md:text-4xl md:leading-tight">
            어떤 안전관리 기능을 이용하시겠습니까?
          </h1>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {FEATURES.map((feature) => (
            <button
              key={feature.route}
              type="button"
              onClick={() => handleFeatureClick(feature)}
              className={`group flex min-h-[92px] items-center gap-3 rounded-lg border p-4 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 md:block md:min-h-[210px] md:p-5 ${
                feature.available
                  ? 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md'
                  : 'border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-amber-50/40'
              }`}
            >
              <div
                className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition md:mb-4 md:h-11 md:w-11 ${
                  feature.available
                    ? 'bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <FeatureIcon type={feature.icon} />
                </svg>
                {feature.dailyLimit && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-blue-600 px-1.5 py-0.5 text-[9px] font-black leading-none text-white shadow-sm group-hover:bg-blue-700">
                    1/일
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h2 className="text-base font-black leading-5 text-slate-950 md:text-lg">{feature.title}</h2>
                  {feature.dailyLimit ? (
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-black leading-none text-blue-700">
                      1/일
                    </span>
                  ) : null}
                  {feature.available ? (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black uppercase leading-none text-emerald-700">
                      이용 가능
                    </span>
                  ) : (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-black uppercase leading-none text-amber-800">
                      이전됨
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs font-semibold leading-4 text-slate-500 md:mt-2 md:text-sm md:leading-5">
                  {feature.description}
                </p>
                {!feature.available && (
                  <p className="mt-1.5 text-[11px] font-bold text-amber-700 md:mt-2">
                    클릭 시 새 사이트 안내
                  </p>
                )}
              </div>
              <span
                className={`ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition md:hidden ${
                  feature.available
                    ? 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-[13px] font-semibold leading-6 text-slate-500 md:mt-10 md:text-sm">
          <span className="font-black text-red-600">
            사진분석과 위험성평가는 하루 1번 제한적인 무료로 이용할 수 있습니다.
          </span>
          <br className="hidden sm:block" />
          결과를 저장하거나 더 높은 수준의 AI 모델 결과가 필요하시면, 새롭게 개편된{' '}
          <a
            href={NEW_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-black text-blue-600 underline decoration-blue-300 underline-offset-2 transition hover:text-blue-700"
          >
            「모두의 안전」
          </a>
          을 이용해 주세요.
        </p>
      </section>

      <ServiceEndedModal
        isOpen={Boolean(endedTitle)}
        onClose={() => setEndedTitle(null)}
        featureTitle={endedTitle || undefined}
      />
    </main>
  );
}
