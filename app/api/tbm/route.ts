import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateContentWithFallback } from '@/app/lib/gemini-fallback';

type TbmRisk = {
  hazard: string;
  measure: string;
};

type TbmAiResponse = {
  risks: TbmRisk[];
  educationContent: string;
  ppe: string[];
  notes: string;
  warning?: string;
};

const DEFAULT_RISKS: TbmRisk[] = [
  {
    hazard: '작업 구역 내 이동 동선과 장비 작업 반경이 중첩되어 협착 또는 충돌 위험이 있음',
    measure: '작업 전 장비 유도자를 지정하고 출입 통제선을 설치하며 작업자 이동 동선을 분리한다.',
  },
  {
    hazard: '자재 적치 상태 불량 및 바닥 정리 미흡으로 전도, 낙하, 걸림 위험이 있음',
    measure: '자재는 지정 장소에 높이를 낮춰 적치하고 통로의 장애물과 잔재물을 즉시 정리한다.',
  },
  {
    hazard: '고소부 또는 단부 주변 작업 중 추락 위험이 있음',
    measure: '안전난간, 개구부 덮개, 안전대 걸이시설을 확인하고 고소 작업자는 안전대를 체결한다.',
  },
  {
    hazard: '전동공구, 임시전기 사용 중 누전 또는 감전 위험이 있음',
    measure: '누전차단기 작동 상태와 접지 상태를 확인하고 손상된 전선과 공구는 사용을 금지한다.',
  },
  {
    hazard: '작업자 간 신호 불일치와 무리한 단독 작업으로 사고 발생 위험이 있음',
    measure: '작업 순서와 신호 방법을 TBM에서 공유하고 2인 1조 작업과 관리감독자 확인을 실시한다.',
  },
  {
    hazard: '중량물 취급 중 허리 부상 또는 손 끼임 위험이 있음',
    measure: '중량물은 운반 장비를 사용하고 손 위치를 확인한 뒤 구령에 맞춰 공동 작업한다.',
  },
  {
    hazard: '분진, 소음, 비산물 발생으로 호흡기 및 안면 부상 위험이 있음',
    measure: '작업 특성에 맞는 보안경, 방진마스크, 귀마개를 착용하고 비산 방지 조치를 설치한다.',
  },
  {
    hazard: '작업 종료 후 잔류 위험요인 방치로 후속 작업자 사고 위험이 있음',
    measure: '작업 종료 전 정리정돈, 전원 차단, 위험구역 표지와 인수인계를 확인한다.',
  },
];

const WEATHER_RISKS: Record<string, TbmRisk> = {
  비: {
    hazard: '우천으로 바닥과 발판이 미끄러워 전도 및 추락 위험이 증가함',
    measure: '미끄럼 구간을 즉시 배수 및 정리하고 미끄럼 방지 조치와 안전화 상태를 확인한다.',
  },
  눈: {
    hazard: '강설 및 결빙으로 이동 통로, 계단, 발판에서 미끄러짐 위험이 큼',
    measure: '제설, 제빙, 모래 살포 후 작업을 시작하고 결빙 구간은 출입을 통제한다.',
  },
  폭염: {
    hazard: '폭염 환경에서 장시간 작업 시 열탈진, 열사병 등 온열질환 위험이 있음',
    measure: '물, 그늘, 휴식 시간을 확보하고 고열 작업자는 동료 확인과 이상 증상 보고를 실시한다.',
  },
  한파: {
    hazard: '한파로 인한 손발 감각 저하와 결빙 구간 미끄러짐 위험이 있음',
    measure: '방한 보호구를 착용하고 작업 전 스트레칭, 결빙 제거, 짧은 휴식 주기를 적용한다.',
  },
  바람: {
    hazard: '강풍으로 자재, 공구, 가설재가 날리거나 흔들려 낙하 및 전도 위험이 있음',
    measure: '비산 가능 자재를 결속하고 양중, 고소, 외부 작업은 풍속 확인 후 중지 기준을 적용한다.',
  },
};

const WEATHER_KEYWORDS: Record<string, string[]> = {
  비: ['비', '우천', '강우', '미끄러', '배수'],
  눈: ['눈', '강설', '결빙', '제설', '제빙'],
  폭염: ['폭염', '온열', '열사병', '열탈진', '고열'],
  한파: ['한파', '저체온', '방한', '결빙'],
  바람: ['바람', '강풍', '풍속', '비산', '날림'],
};

const DEFAULT_PPE = ['안전모', '안전화', '안전대', '보안경', '작업장갑'];

const DEFAULT_EDUCATION_LINES = [
  '금일 작업 범위, 작업 순서, 작업자별 역할과 신호 방법을 공유한다.',
  '추락, 협착, 감전, 낙하물 등 핵심 위험요인과 작업별 안전대책을 확인한다.',
  '작업 전 보호구 착용 상태와 공구, 장비, 안전시설 이상 유무를 점검한다.',
  '비상 상황 발생 시 작업 중지, 즉시 보고, 대피 동선과 응급 연락 절차를 숙지한다.',
  '작업 종료 전 정리정돈, 전원 차단, 잔류 위험요인 제거를 실시한다.',
];

function clampRiskCount(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 5;
  return Math.min(8, Math.max(3, Math.trunc(parsed)));
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function fallbackRisks(weather: string, count: number) {
  const weatherRisk = WEATHER_RISKS[weather];
  const pool = weatherRisk ? [weatherRisk, ...DEFAULT_RISKS] : DEFAULT_RISKS;
  return pool.slice(0, count);
}

function fallbackEducation() {
  return DEFAULT_EDUCATION_LINES.map((line, index) => `${index + 1}) ${line}`).join('\n');
}

function normalizeEducation(value: unknown) {
  const text = cleanText(value);
  if (!text) return fallbackEducation();

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+\s*[\).]\s*/, '').trim())
    .filter(Boolean);

  if (lines.length < 4) return fallbackEducation();
  return lines.slice(0, 6).map((line, index) => `${index + 1}) ${line}`).join('\n');
}

function normalizePpe(value: unknown) {
  if (!Array.isArray(value)) return DEFAULT_PPE;
  const ppe = value.map((item) => cleanText(item)).filter(Boolean);
  if (ppe.length < 3) return DEFAULT_PPE;
  return ppe.slice(0, 6);
}

function extractJsonText(text: string) {
  const withoutFence = text.replace(/```json|```/gi, '').trim();
  if (withoutFence.startsWith('{') && withoutFence.endsWith('}')) {
    return withoutFence;
  }

  const start = withoutFence.indexOf('{');
  if (start === -1) return '';

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = start; index < withoutFence.length; index += 1) {
    const char = withoutFence[index];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return withoutFence.slice(start, index + 1);
      }
    }
  }

  return '';
}

function normalizeResponse(raw: Partial<TbmAiResponse> | null, weather: string, count: number, warning?: string): TbmAiResponse {
  const fallback = fallbackRisks(weather, count);
  const rawRisks = Array.isArray(raw?.risks) ? raw?.risks ?? [] : [];
  const risks = rawRisks
    .map((risk) => ({
      hazard: cleanText(risk?.hazard),
      measure: cleanText(risk?.measure),
    }))
    .filter((risk) => risk.hazard && risk.measure)
    .slice(0, count);

  while (risks.length < count) {
    risks.push(fallback[risks.length] || DEFAULT_RISKS[risks.length % DEFAULT_RISKS.length]);
  }

  const weatherRisk = WEATHER_RISKS[weather];
  if (weatherRisk) {
    const keywords = WEATHER_KEYWORDS[weather] || [weather];
    const hasWeatherRisk = risks.some((risk) => {
      const combined = `${risk.hazard} ${risk.measure}`;
      return keywords.some((keyword) => combined.includes(keyword));
    });

    if (!hasWeatherRisk) {
      risks[0] = weatherRisk;
    }
  }

  return {
    risks,
    educationContent: normalizeEducation(raw?.educationContent),
    ppe: normalizePpe(raw?.ppe),
    notes: cleanText(raw?.notes) || '작업 전 현장 상태와 작업자 건강 상태를 확인하고, 위험요인이 추가 확인되면 즉시 작업을 중지한 뒤 관리감독자에게 보고한다.',
    warning: cleanText(raw?.warning) || warning,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const riskCount = clampRiskCount(body?.riskCount);
  const weather = cleanText(body?.weather) || '맑음';
  const workContent = cleanText(body?.workContent);
  const riskHint = cleanText(body?.riskHint);

  const fallback = normalizeResponse(null, weather, riskCount, 'AI 응답을 사용할 수 없어 기본 TBM 항목으로 작성했습니다.');

  try {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(fallback);
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

    const prompt = `
당신은 한국 건설/산업 현장의 베테랑 안전관리자입니다.
작업 전 안전점검회의(TBM) 일지에 들어갈 항목만 작성하세요.

[입력 정보]
- 작성일자: ${cleanText(body?.date) || '정보 없음'}
- 날씨: ${weather}
- 현장/장소: ${cleanText(body?.site) || '정보 없음'}
- 작업시간: ${cleanText(body?.workTime) || '정보 없음'}
- 공종/작업명: ${cleanText(body?.workName) || '정보 없음'}
- 작업인원: ${cleanText(body?.workerCount) || '정보 없음'}
- 진행자: ${cleanText(body?.leader) || '정보 없음'}
- 금일 작업내용: ${workContent || '정보 없음'}
- 추가 위험요인 힌트: ${riskHint || '없음'}

[작성 규칙]
- 한국 건설/산업 현장 용어로 구체적으로 작성
- risks는 정확히 ${riskCount}개 작성
- risks의 hazard와 measure는 반드시 1:1로 대응
- 날씨가 비/눈/폭염/한파/바람 중 하나이면 관련 위험과 대책을 반드시 반영
- educationContent는 4~6개 항목으로 작성하고 각 줄은 "1) ", "2) " 형식, 줄바꿈은 \\n 사용
- ppe는 3~6개 배열
- notes는 1~2문장
- warning은 입력이 모호하거나 현장 확인이 필요한 경우에만 작성
- JSON만 응답하고 마크다운, 코드펜스, 설명 문장은 절대 포함하지 말 것

[응답 형식]
{
  "risks": [{ "hazard": "...", "measure": "..." }],
  "educationContent": "1) ...\\n2) ...",
  "ppe": ["안전모", "안전화"],
  "notes": "...",
  "warning": "선택적 경고 메시지"
}
`;

    const result = await generateContentWithFallback(genAI, prompt, { minTextLength: 700 });
    const text = result.response.text();
    const jsonText = extractJsonText(text);

    if (!jsonText) {
      return NextResponse.json(fallback);
    }

    const parsed = JSON.parse(jsonText) as Partial<TbmAiResponse>;
    return NextResponse.json(normalizeResponse(parsed, weather, riskCount));
  } catch (error) {
    console.error('TBM generation error:', error);
    return NextResponse.json(fallback);
  }
}
