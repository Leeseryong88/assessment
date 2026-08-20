export const NEW_SITE_URL = 'https://modu-safe.com';
export const VOUCHER_CODE = 'E6YXX84F';
export const VOUCHER_EXPIRES = '2026년 9월 30일';
export const VOUCHER_DURATION = '7일';

/** 2026-09-30 23:59:59 KST — 이후에는 이용권 쿠폰 안내를 표시하지 않음 */
export const VOUCHER_UNTIL_MS = Date.parse('2026-09-30T23:59:59+09:00');

export function isVoucherOfferActive(now = Date.now()) {
  return now <= VOUCHER_UNTIL_MS;
}

/** 모두의 안전 — 회원가입만으로 무료 이용 */
export const FREE_TOOLS: { title: string; desc?: string }[] = [
  { title: '캘린더' },
  { title: '안전일지', desc: '매일 점검·작업 내용 기록' },
  { title: '조직도', desc: '조직 구조 도식·임명 관리' },
  { title: '회의록', desc: '법정 회의록·회차·증빙 보관' },
  { title: '유해위험기계기구', desc: '기계 대장·검사·인증 일정' },
  { title: '협력업체 관리', desc: '협력사·안전 서류 한곳 정리' },
  { title: 'TBM' },
  { title: '작업허가서', desc: '고위험 작업 허가·서명·이력' },
  { title: '근로자 의견청취', desc: '의견 접수 링크·확인' },
  { title: 'AI 저장소', desc: '작성·분석 결과 모아보기' },
];

/** 모두의 안전 — AI 기능(유료) */
export const PAID_AI_TOOLS: { title: string; desc?: string }[] = [
  { title: '중대재해처벌법', desc: '업무수행점검·반기점검' },
  { title: '안전보건관리규정', desc: '사업장 맞춤 규정 초안' },
  { title: '위험성평가', desc: '평가표·실시규정·보고 흐름' },
  { title: '안전관리비 계획서', desc: '관리비 산출·계획 문서' },
  { title: '사진분석', desc: '사진 기반 위험·개선 포인트' },
  { title: '안전보건계획서', desc: '공사 정보로 계획서 초안' },
  { title: '작업계획서', desc: '법정 작업계획서 양식 초안' },
  { title: '점검 체크리스트', desc: '점검 항목 맞춤 체크리스트' },
];

export type EndedFeatureKey = 'plan' | 'fee' | 'tbm';

export const ENDED_FEATURES: Record<
  EndedFeatureKey,
  { title: string; path: string; description: string }
> = {
  plan: {
    title: '안전보건계획서',
    path: '/health-safety-plan',
    description: '공사 개요와 현장 조건을 바탕으로 계획서를 작성합니다.',
  },
  fee: {
    title: '안전보건관리비 계획서',
    path: '/safety-management-fee',
    description: '산업안전보건관리비 사용계획서를 항목별로 구성합니다.',
  },
  tbm: {
    title: 'TBM 일지',
    path: '/tbm',
    description: '작업 전 안전조회회의 일지를 A4 출력 형식으로 작성합니다.',
  },
};

export const ENDED_PATH_TO_KEY: Record<string, EndedFeatureKey> = {
  '/health-safety-plan': 'plan',
  '/safety-management-fee': 'fee',
  '/tbm': 'tbm',
};

export const ALLOWED_PAGE_PREFIXES = ['/camera', '/assessment', '/service-ended'] as const;

export const ALLOWED_API_PREFIXES = [
  '/api/analyze',
  '/api/risk-assessment',
  '/api/additional-assessment',
  '/api/contact',
] as const;

export function getEndedFeatureTitle(key: string | null | undefined): string {
  if (!key || !(key in ENDED_FEATURES)) return '해당 기능';
  return ENDED_FEATURES[key as EndedFeatureKey].title;
}
