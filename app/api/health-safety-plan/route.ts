import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const { answers, workDetails } = await request.json();

    // Gemini API 설정
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `
안전보건계획서를 작성해주세요. 다음의 **[표준 양식 및 스타일 지침]**을 반드시 준수하여 생성 시마다 형식이 변하지 않도록 하세요.

[표준 양식 및 스타일 지침]
1. CSS 정의: 아래의 <style> 블록을 HTML 최상단에 포함하고, 모든 요소는 이 클래스명과 속성을 따르도록 작성하세요.
   <style>
     .report-wrapper { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; color: #333; line-height: 1.6; padding: 10px; }
     .report-title { font-size: 24pt; font-weight: bold; text-align: center; margin-bottom: 50px; padding: 20px; border: 2px solid #333; }
     h2 { font-size: 16pt; font-weight: bold; border-left: 8px solid #1e40af; padding-left: 15px; margin-top: 40px; margin-bottom: 15px; background: #f1f5f9; padding-top: 8px; padding-bottom: 8px; border-bottom: 1px solid #cbd5e1; }
     h3 { font-size: 13pt; font-weight: bold; margin-top: 25px; margin-bottom: 10px; color: #1e293b; }
     table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 10pt; table-layout: fixed; }
     th { background-color: #f8fafc; border: 1px solid #94a3b8; padding: 10px; font-weight: bold; text-align: center; color: #334155; }
     td { border: 1px solid #94a3b8; padding: 10px; vertical-align: middle; word-break: break-all; }
     section { page-break-inside: avoid; margin-bottom: 40px; }
     .red-text { color: red; font-weight: normal; }
   </style>

2. HTML 구조 준수:
   - 전체 내용을 <div class="report-wrapper">로 감싸세요.
   - 주 제목은 <h1 class="report-title">안전보건관리계획서</h1>로 고정하세요.
   - 1단계 항목(섹션)은 <h2>로, 2단계 세부 항목은 <h3>로 작성하세요.
   - 모든 표는 <table><thead><tr>...</tr></thead><tbody>...</tbody></table> 구조를 정확히 지키세요.

3. 법령 및 전문성 지침:
   - **안전보건관리비 집행계획**: '건설업 산업안전보건관리비 계상 및 사용기준'에 따른 9가지 법정 항목(안전시설비, 보호구비 등)을 포함한 상세 표를 만드세요.
   - **안전보건교육 계획**: '산업안전보건법 시행규칙 별표 4'에 따른 법정 시간(분기 6시간, 신규 8시간 등)이 포함된 표준 시간표 형식을 유지하세요.

4. 가상 데이터 처리:
   - 답변이 없는 부분은 반드시 <span class="red-text">...</span>로 감싸 전문 내용을 채우되, 글자 크기나 폰트는 주변과 동일하게 유지하세요.

5. 금지 사항:
   - **[중요] "A4 기준", "전문 보고서 스타일 적용", "작성 지침" 등 형식에 관한 설명이나 AI의 내부 동작을 설명하는 텍스트를 보고서 본문에 절대 포함하지 마세요.**
   - 오직 실제 보고서 내용만 반환하세요.

[제공된 답변 데이터]
1. 공사명 및 현장 주소: ${answers.q1 || '정보 없음'}
2. 공사 기간: ${answers.q2 || '정보 없음'}
3. 공사계약금액: ${answers.q3 || '정보 없음'}
4. 시공자 및 책임자 연락처: ${answers.q4 || '정보 없음'}
5. 안전보건 관리조직 구성: ${answers.q5 || '정보 없음'}
6. 안전보건관리비 사용계획: ${answers.q6 || '정보 없음'}
7. 경영방침 및 목표: ${answers.q7 || '정보 없음'}
8. 안전보건 교육 계획: ${answers.q8 || '정보 없음'}
9. 현장 자체 점검 계획: ${answers.q9 || '정보 없음'}
10. 비상대응 및 병원 정보: ${answers.q10 || '정보 없음'}
11. 근로자 건강관리 대책: ${answers.q11 || '정보 없음'}
12. 협력업체 관리 계획: ${answers.q12 || '정보 없음'}

[공종별 세부 계획]
${Object.entries(workDetails || {}).map(([work, data]: any, index) => `
- 공종명: ${work}
- 세부 계획: ${data.detail || '정보 없음'}
- 도면 포함 여부: ${data.drawing ? `있음 (도면 위치: DRAWING_PLACEHOLDER_${index})` : '없음'}
`).join('\n')}

[문서 구성 요소 순서]
- 1. 공사 개요 (표 형식)
- 2. 안전보건 경영방침 및 목표
- 3. 안전보건 관리조직 및 역할 (표 형식)
- 4. 안전보건관리비 집행계획 (법정 9개 항목 표)
- 5. 안전보건 교육 및 점검 계획 (표 형식)
- 6. 공종별 세부 안전관리 계획 (도면 포함 시 DRAWING_PLACEHOLDER 삽입)
- 7. 위험성평가 및 사고 예방 대책
- 8. 비상대응 및 근로자 건강관리 (비상연락망 포함 표)
- 9. 협력업체 안전보건 관리 계획
- 하단 면책 문구: "<div style='margin-top: 30px; border-top: 1px solid #eee; pt: 10px; font-size: 0.8rem; color: #666;'>※ 본 문서는 AI로 생성되었으며 참고용으로만 사용하시기 바랍니다. 제공되지 않은 정보는 가상의 데이터로 작성되었습니다.</div>"

HTML 코드만 반환하세요.
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let planHtml = response.text().replace(/```html/g, '').replace(/```/g, '').trim();

    // DRAWING_PLACEHOLDER를 실제 Base64 이미지로 치환
    Object.entries(workDetails || {}).forEach(([work, data]: any, index) => {
      if (data.drawing) {
        planHtml = planHtml.replace(`DRAWING_PLACEHOLDER_${index}`, data.drawing);
      }
    });

    return NextResponse.json({ planHtml });
  } catch (error) {
    console.error('안전보건계획서 생성 오류:', error);
    return NextResponse.json(
      { error: '계획서 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

