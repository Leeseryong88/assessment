'use client';

import React, { useState, useEffect, useRef } from 'react';
import TopBar from '../components/TopBar';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
  // 1. 공사 개요
  { 
    id: 'q1', 
    text: '공사 명칭과 공사 현장의 위치(주소)를 입력해주세요.', 
    placeholder: '예: 00지구 아파트 신축공사 / 서울시 00구 00동 123-4'
  },
  { 
    id: 'q2', 
    text: '공사 기간(착공일~준공일)은 언제인가요?', 
    placeholder: '예: 2024년 1월 1일 ~ 2025년 12월 31일 (24개월)',
    options: ['6개월 미만', '6개월 ~ 1년', '1년 ~ 2년', '2년 이상']
  },
  { 
    id: 'q3', 
    text: '총 공사계약금액(VAT 포함)은 얼마인가요?', 
    placeholder: '예: 100억원',
    options: ['10억 미만', '10억 ~ 50억', '50억 ~ 100억', '100억 이상']
  },
  { 
    id: 'q4', 
    text: '시공사(상호)와 현장소장의 성함 및 연락처를 입력해주세요.', 
    placeholder: '예: (주)안전건설 / 홍길동 소장 (010-1234-5678)'
  },
  // 2. 안전보건 관리체계
  { 
    id: 'q5', 
    text: '안전보건 관리 조직 구성(안전관리자, 보건관리자 등)을 입력해주세요.', 
    placeholder: '예: 소장 1명, 안전관리자 1명, 보건관리자 1명, 관리감독자 5명',
    options: ['안전/보건 전담자 배치', '소장 직접 관리체계', '외부 전문기관 위탁관리']
  },
  { 
    id: 'q6', 
    text: '안전보건관리비 총액과 항목별 사용 계획을 입력해주세요.', 
    placeholder: '예: 2.5억원 / 안전시설 50%, 개인보호구 30%, 교육/행사 20%',
    options: ['법정 요율 준수', '안전시설비 강화', '스마트 안전장비 구입']
  },
  // 3. 방침 및 목표
  { 
    id: 'q7', 
    text: '현장의 안전보건 경영방침과 올해의 구체적인 목표는 무엇인가요?', 
    placeholder: '예: 중대재해 ZERO / 무재해 365일 달성, 위험요인 100% 제거',
    options: ['중대재해 ZERO', '안전수칙 100% 준수', '자율 안전문화 정착']
  },
  // 4. 교육 및 점검
  { 
    id: 'q8', 
    text: '정기교육, 채용 시 교육 등 안전보건 교육 실시 계획은 어떠한가요?', 
    placeholder: '예: 신규자 1시간, 정기교육 월 2시간, 작업 전 TBM 매일 10분',
    options: ['매일 작업 전 TBM', '정기 안전점검의 날 운영', '전문강사 초빙 교육']
  },
  { 
    id: 'q9', 
    text: '현장 자체 점검(일일, 주간, 월간) 계획을 입력해주세요.', 
    placeholder: '예: 일일 소장 점검, 주간 합동 점검, 월간 경영층 점검',
    options: ['일일 작업 전 점검', '주간 노사 합동점검', '월간 정밀 안전점검']
  },
  // 5. 비상대응 및 건강관리
  { 
    id: 'q10', 
    text: '비상 시 신속한 대응을 위한 비상연락망과 인근 지정병원 정보가 있나요?', 
    placeholder: '예: 00병원(현장 5km), 비상연락망 구축 완료',
    options: ['인근 응급센터 협약', '현장 비상구급함 비치', '정기 비상대응 훈련']
  },
  { 
    id: 'q11', 
    text: '근로자 건강관리(검진, 휴게시설, 폭염/한파 대책)는 어떻게 하시나요?', 
    placeholder: '예: 냉온수기 비치, 휴게실 에어컨 설치, 정기 건강검진 실시',
    options: ['사내 휴게시설 운영', '온열질환 예방활동', '정기 건강진단']
  },
  // 6. 협력업체 관리
  { 
    id: 'q12', 
    text: '협력업체와의 안전보건 협의체 운영 및 합동 점검 계획을 입력해주세요.', 
    placeholder: '예: 매월 1회 협의체 회의, 협력사 안전수준 평가 실시',
    options: ['월간 협의체 운영', '협력사 합동 점검', '해당 없음']
  },
];

const WORK_TYPES = [
  '가설공사', '굴착공사', '철근콘크리트공사', '강구조물공사', '성토 및 법면공사', 
  '해체공사', '전기공사', '기타 특수공종'
];

export default function HealthSafetyPlanPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [subStep, setSubStep] = useState<'disclaimer' | 'main' | 'work-select' | 'work-detail'>('disclaimer');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [selectedWorks, setSelectedWorks] = useState<string[]>([]);
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);
  const [workDetails, setWorkDetails] = useState<Record<string, { detail: string, drawing?: string }>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [planHtml, setPlanHtml] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // html2pdf 스크립트는 더 이상 필요하지 않으므로 로드하지 않습니다.
  }, []);

  const handleOptionClick = (option: string) => {
    if (inputValue.includes(option)) return;
    setInputValue(prev => prev ? `${prev}, ${option}` : option);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, workType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWorkDetails(prev => ({
          ...prev,
          [workType]: { ...prev[workType], drawing: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setPlanHtml('');
    setSubStep('main'); // 유의사항 동의는 유지하고 바로 정보수집(main)으로 이동
    setCurrentStep(0);
    setAnswers({});
    setInputValue('');
    setSelectedWorks([]);
    setCurrentWorkIndex(0);
    setWorkDetails({});
  };

  const handlePrev = () => {
    if (subStep === 'main') {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
        setInputValue(answers[QUESTIONS[currentStep - 1].id] || '');
      } else {
        setSubStep('disclaimer');
      }
    } else if (subStep === 'work-select') {
      setSubStep('main');
      setCurrentStep(QUESTIONS.length - 1);
      setInputValue(answers[QUESTIONS[QUESTIONS.length - 1].id] || '');
    } else if (subStep === 'work-detail') {
      if (currentWorkIndex > 0) {
        setCurrentWorkIndex(currentWorkIndex - 1);
        setInputValue(workDetails[selectedWorks[currentWorkIndex - 1]]?.detail || '');
      } else {
        setSubStep('work-select');
      }
    }
  };

  const handleNext = () => {
    if (subStep === 'main') {
      const currentQuestion = QUESTIONS[currentStep];
      const newAnswers = { ...answers, [currentQuestion.id]: inputValue };
      setAnswers(newAnswers);
      setInputValue('');

      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setSubStep('work-select');
      }
    } else if (subStep === 'work-select') {
      if (selectedWorks.length > 0) {
        setSubStep('work-detail');
        setCurrentWorkIndex(0);
      } else {
        generatePlan(answers, {});
      }
    } else if (subStep === 'work-detail') {
      const currentWork = selectedWorks[currentWorkIndex];
      setWorkDetails(prev => ({
        ...prev,
        [currentWork]: { ...prev[currentWork], detail: inputValue }
      }));
      setInputValue('');

      if (currentWorkIndex < selectedWorks.length - 1) {
        setCurrentWorkIndex(currentWorkIndex + 1);
      } else {
        generatePlan(answers, workDetails);
      }
    }
  };

  const generatePlan = async (mainAnswers: Record<string, string>, details: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/health-safety-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: mainAnswers, workDetails: details }),
      });

      const data = await response.json();
      if (data.planHtml) {
        setPlanHtml(data.planHtml);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadHtml = () => {
    if (!planHtml) return;

    // 전체 HTML 문서 구조 생성 (스타일 포함)
    const fullHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>안전보건관리계획서</title>
    <style>
        body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; line-height: 1.6; color: #333; padding: 40px; background-color: #f5f5f5; }
        .document-container { max-width: 800px; margin: 0 auto; background: white; padding: 50px; shadow: 0 0 20px rgba(0,0,0,0.1); border-radius: 8px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        h1, h2, h3 { color: #1a202c; }
        section { margin-bottom: 40px; }
        img { max-width: 100%; height: auto; display: block; margin: 20px 0; }
        @media print {
            body { background-color: white; padding: 0; }
            .document-container { box-shadow: none; border: none; width: 100%; max-width: none; }
        }
    </style>
</head>
<body>
    <div class="document-container">
        ${planHtml}
    </div>
</body>
</html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '안전보건관리계획서.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (planHtml) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <TopBar />
        <div className="max-w-4xl mx-auto pt-10 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">생성된 안전보건계획서</h1>
            <div className="space-x-2 flex items-center">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-bold"
              >
                다시 만들기
              </button>
              <button
                onClick={downloadHtml}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-bold"
              >
                HTML 다운로드
              </button>
            </div>
          </div>
          <div ref={reportRef} className="bg-white p-10 shadow-xl rounded-lg border border-gray-200 min-h-[1000px] overflow-auto" dangerouslySetInnerHTML={{ __html: planHtml }} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <TopBar />
      <div className="max-w-2xl mx-auto pt-20 px-4 text-center">
        {!isGenerating ? (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            {subStep === 'disclaimer' && (
              <div className="text-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">서비스 이용 전 유의사항</h2>
                </div>
                
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-6 mb-8 text-amber-900 leading-relaxed text-sm md:text-base">
                  <p className="mb-4 font-bold text-lg">⚠️ 필독: 인공지능(AI) 생성물 이용 관련 안내</p>
                  <p className="mb-3">
                    본 서비스는 인공지능(AI) 기술을 활용하여 <strong>안전보건관리계획서 작성을 보조하는 참고 자료</strong>를 생성하는 도구입니다. 
                  </p>
                  <p className="mb-3">
                    AI가 생성한 결과물은 사용자가 입력한 데이터를 바탕으로 한 일반적인 가이드라인이며, <strong>현장의 실제 상황이나 법적 요구사항을 완벽하게 반영하지 못할 수 있습니다.</strong>
                  </p>
                  <p className="mb-3">
                    따라서, 본 서비스로 생성된 결과물을 실제 업무에 활용하거나 외부 기관에 제출함에 있어 발생하는 <strong>모든 책임은 사용자 본인에게 있음</strong>을 알려드립니다.
                  </p>
                  <p className="font-semibold text-amber-700">
                    반드시 전문가의 검토를 거쳐 실제 현장 상황에 맞게 수정 및 보완하여 사용하시기 바랍니다.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setSubStep('main')}
                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-lg"
                  >
                    위 내용을 확인했으며, 이에 동의합니다
                  </button>
                  <button 
                    onClick={() => router.push('/')}
                    className="w-full py-4 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    동의하지 않음 (메인으로 이동)
                  </button>
                </div>
              </div>
            )}

            {subStep === 'main' && (
              <>
                <div className="mb-8">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>기본 정보 수집 ({currentStep + 1} / {QUESTIONS.length})</span>
                    <span>{Math.round(((currentStep + 1) / (QUESTIONS.length + 2)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${((currentStep + 1) / (QUESTIONS.length + 2)) * 100}%` }} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{QUESTIONS[currentStep].text}</h2>
                <textarea className="w-full h-32 p-4 border border-gray-300 rounded-xl mb-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder={QUESTIONS[currentStep].placeholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <p className="text-sm text-amber-600 font-medium mb-4 text-left px-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  작성하지 않고 건너뛰면 AI가 관련 법령에 따른 임의의 데이터로 샘플을 만듭니다.
                </p>
                {QUESTIONS[currentStep].options && (
                  <div className="flex flex-wrap gap-2 mb-6 justify-center">
                    {QUESTIONS[currentStep].options.map((option) => (
                      <button key={option} onClick={() => handleOptionClick(option)} className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full hover:bg-blue-100 border border-blue-100">+ {option}</button>
                    ))}
                  </div>
                )}
              </>
            )}

            {subStep === 'work-select' && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">해당되는 세부 공종을 선택해주세요</h2>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {WORK_TYPES.map(work => (
                    <button
                      key={work}
                      onClick={() => setSelectedWorks(prev => prev.includes(work) ? prev.filter(w => w !== work) : [...prev, work])}
                      className={`p-4 rounded-xl border-2 transition-all font-bold ${selectedWorks.includes(work) ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-blue-200'}`}
                    >
                      {work}
                    </button>
                  ))}
                </div>
              </>
            )}

            {subStep === 'work-detail' && (
              <>
                <div className="mb-4 inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-bold">{selectedWorks[currentWorkIndex]}</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">해당 공종의 세부 안전계획을 작성해주세요</h2>
                <textarea className="w-full h-32 p-4 border border-gray-300 rounded-xl mb-6 outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="예: 굴착 깊이 2m 이상 시 흙막이 지보공 설치, 상하 동시작업 금지..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <div className="mb-8 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                  <p className="text-sm font-bold text-gray-600 mb-3">파일 도면 첨부 (필요 시)</p>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, selectedWorks[currentWorkIndex])} className="hidden" id="fileInput" />
                  <label htmlFor="fileInput" className="cursor-pointer px-6 py-3 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 shadow-sm transition-all inline-block">
                    {workDetails[selectedWorks[currentWorkIndex]]?.drawing ? '파일 변경하기' : '이미지 선택하기'}
                  </label>
                  {workDetails[selectedWorks[currentWorkIndex]]?.drawing && (
                    <div className="mt-4 flex justify-center">
                      <img src={workDetails[selectedWorks[currentWorkIndex]].drawing} alt="Preview" className="max-h-40 rounded-lg shadow-md border border-gray-200" />
                    </div>
                  )}
                </div>
              </>
            )}

            {subStep !== 'disclaimer' && (
              <div className="flex space-x-3">
                <button 
                  onClick={handlePrev}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-all"
                >
                  이전 단계
                </button>
                <button 
                  onClick={handleNext} 
                  className="flex-[2] py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex flex-col items-center justify-center leading-tight"
                >
                  {subStep === 'main' ? '다음 질문' : 
                   subStep === 'work-select' ? (
                     selectedWorks.length > 0 ? (
                       `세부 계획 작성 (1/${selectedWorks.length})`
                     ) : (
                       <>
                         <span>계획서 바로 생성</span>
                         <span className="text-[10px] font-normal opacity-80 mt-0.5">세부공종 없이</span>
                       </>
                     )
                   ) : 
                   (currentWorkIndex === selectedWorks.length - 1 ? '계획서 최종 생성' : `다음 공종 (${currentWorkIndex + 2}/${selectedWorks.length})`)}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-6"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">세부 안전계획을 통합 중입니다...</h2>
            <p className="text-gray-500">도면과 안전 수칙을 결합하여 최적의 계획서를 구성하고 있습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}
