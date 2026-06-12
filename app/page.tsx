'use client';

import { useRouter } from 'next/navigation';
import TopBar from './components/TopBar';

const FEATURES = [
  {
    title: '사진분석',
    description: '현장 사진을 기반으로 위험요인과 개선대책을 확인합니다.',
    route: '/camera',
    icon: 'camera',
  },
  {
    title: '위험성평가',
    description: '공정별 위험요인, 위험도, 감소대책을 작성합니다.',
    route: '/assessment',
    icon: 'assessment',
  },
  {
    title: '안전보건계획서',
    description: '공사 개요와 현장 조건을 바탕으로 계획서를 생성합니다.',
    route: '/health-safety-plan',
    icon: 'plan',
  },
  {
    title: '안전보건관리비 계획서',
    description: '산업안전보건관리비 사용계획을 항목별로 구성합니다.',
    route: '/safety-management-fee',
    icon: 'fee',
  },
  {
    title: 'TBM 일지',
    description: '작업 전 안전점검회의 일지를 A4 출력 양식으로 작성합니다.',
    route: '/tbm',
    icon: 'tbm',
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

  return (
    <main className="min-h-screen bg-slate-100">
      <TopBar />
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-4xl">
            어떤 안전관리 기능을 사용하시겠습니까?
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-600 md:text-base">
            필요한 기능을 선택하면 해당 작성 화면으로 이동합니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {FEATURES.map((feature) => (
            <button
              key={feature.route}
              type="button"
              onClick={() => router.push(feature.route)}
              className="group min-h-[190px] rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <FeatureIcon type={feature.icon} />
                </svg>
              </div>
              <h2 className="text-lg font-black text-slate-950">{feature.title}</h2>
              <p className="mt-2 text-sm font-semibold leading-5 text-slate-500">{feature.description}</p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
