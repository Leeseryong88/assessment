'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ImageAnalysis from '@/components/ImageAnalysis';
import * as XLSX from 'xlsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Script from 'next/script'; // Next.js Script 컴포넌트 추가
import { usePathname, useSearchParams } from 'next/navigation';

// 쿠팡 파트너스 타입 정의
declare global {
  interface Window {
    PartnersCoupang?: {
      G: new (config: {
        id: number;
        template: string;
        trackingCode: string;
        width: string;
        height: string;
        container?: HTMLElement;
        tsource?: string;
      }) => void;
    };
    PartnersCpg?: {
      initWithBanner: () => void;
    };
  }
}

// 분석 항목 인터페이스 정의
interface AnalysisItem {
  id: number;
  image: File | null;
  imageUrl: string | null;
  analysis: string | null;
  loading: boolean;
  selectedRows: string[];
  processName: string;
}

// 저장된 위험성평가 인터페이스 정의
interface SavedAssessment {
  id: string;
  title: string;
  createdAt: string;
  tableData: {
    processName: string;
    riskFactor: string;
    severity: string;
    probability: string;
    riskLevel: string;
    countermeasure: string;
  }[];
  tableHTML: string;
  userId: string;
}

export default function Home() {
  // 상태 변수들
  const [analysisItems, setAnalysisItems] = useState<AnalysisItem[]>([
    { id: 1, image: null, imageUrl: null, analysis: null, loading: false, selectedRows: [], processName: '' }
  ]);
  const [finalAnalysis, setFinalAnalysis] = useState<string | null>(null);
  const [isGeneratingFinal, setIsGeneratingFinal] = useState(false);
  const [isEditingFinal, setIsEditingFinal] = useState(false);
  const [editableTableData, setEditableTableData] = useState<any[]>([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isRequestingAdditional, setIsRequestingAdditional] = useState(false);
  const [additionalAnalysisIndex, setAdditionalAnalysisIndex] = useState<number | null>(null);
  const [showProcessNameModal, setShowProcessNameModal] = useState(false);
  const [tempImageFile, setTempImageFile] = useState<File | null>(null);
  const [tempItemId, setTempItemId] = useState<number | null>(null);
  const [processNameInput, setProcessNameInput] = useState('');
  
  // 저장된 위험성평가를 위한 상태
  const [currentView, setCurrentView] = useState<'main' | 'saved' | 'detail'>('main');
  const [previousView, setPreviousView] = useState<'main' | 'saved' | 'detail'>('main'); // 이전 화면 상태 추적
  const [savedAssessments, setSavedAssessments] = useState<SavedAssessment[]>([]);
  const [selectedAssessment, setSelectedAssessment] = useState<SavedAssessment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isEditingSaved, setIsEditingSaved] = useState(false); // 저장된 위험성평가 수정 모드
  const [isUpdating, setIsUpdating] = useState(false); // 업데이트 중 상태
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 저장된 위험성평가 불러오기
  useEffect(() => {
    // 기존 코드 삭제 - 인증 관련 코드
  }, []);
  
  // Firestore에서 저장된 위험성평가 불러오기
  const loadSavedAssessments = async () => {
    // 기존 코드 삭제 - 인증 관련 코드
  };
  
  // 저장 다이얼로그 열기
  const openSaveDialog = () => {
    alert('기능 미구현: 인증 연결이 필요합니다.');
    return;
    
    // 기존 코드 주석 처리
    /*
    if (!finalAnalysis || editableTableData.length === 0) {
      alert('저장할 위험성평가 결과가 없습니다.');
      return;
    }
    
    setSaveTitle(`위험성평가 ${new Date().toLocaleDateString()}`);
    setShowSaveDialog(true);
    */
  };
  
  // 위험성평가 저장 (Firebase)
  const saveAssessment = async () => {
    alert('기능 미구현: 인증 연결이 필요합니다.');
    return;
    
    // 기존 코드 주석 처리
    /*
    if (!finalAnalysis || !editableTableData.length) {
      alert('저장에 필요한 데이터가 없습니다. 위험성평가 생성 후 다시 시도해주세요.');
      return;
    }
    */
    
    // ... 나머지 파이어베이스 관련 코드 삭제
  };
  
  // 위험성평가 생성 페이지 초기화 함수
  const resetAssessmentPage = () => {
    // 분석 항목 초기화 (첫 번째 항목만 남기고 비움)
    setAnalysisItems([
      { id: 1, image: null, imageUrl: null, analysis: null, loading: false, selectedRows: [], processName: '' }
    ]);
    
    // 최종 분석 결과 초기화
    setFinalAnalysis(null);
    
    // 테이블 데이터 초기화
    setEditableTableData([]);
    
    // 편집 모드 초기화
    setIsEditingFinal(false);
    
    // 각종 상태 초기화
    setIsGeneratingFinal(false);
    setIsGeneratingPdf(false);
    setIsRequestingAdditional(false);
    setAdditionalAnalysisIndex(null);
    
    // 메인 화면 전환은 호출하는 측에서 처리하도록 수정
    // setCurrentView('main');
    
    console.log('위험성평가 생성 페이지가 초기화되었습니다.');
  };
  
  // 저장된 위험성평가 삭제
  const deleteAssessment = async (id: string) => {
    alert('기능 미구현: 인증 연결이 필요합니다.');
    return;
    
    // 기존 코드 주석 처리
    /*
    if (confirm('정말로 이 위험성평가 결과를 삭제하시겠습니까?')) {
      try {
        setIsLoading(true);
        
        console.log('삭제 시도 - 문서 ID:', id);
        
        try {
          // assessments 컬렉션에서만 삭제
          await deleteDoc(doc(db, 'assessments', id));
          console.log('삭제 성공');
          
          // 로컬 상태 업데이트
          const updatedAssessments = savedAssessments.filter(item => item.id !== id);
          setSavedAssessments(updatedAssessments);
          
          // 상세 보기 화면에서 삭제한 경우 목록 화면으로 돌아가기
          if (selectedAssessment && selectedAssessment.id === id) {
            changeView('saved');
            setSelectedAssessment(null);
          }
          
          alert('위험성평가 결과가 삭제되었습니다.');
        } catch (error) {
          console.error('삭제 중 오류 발생:', error);
          alert('위험성평가 결과 삭제에 실패했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('삭제 처리 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }
    */
  };
  
  // 저장된 위험성평가 상세 보기
  const viewAssessment = (assessment: SavedAssessment) => {
    setSelectedAssessment(assessment);
    changeView('detail');
    
    // 편집 가능한 테이블 데이터 설정
    setEditableTableData(assessment.tableData);
    setFinalAnalysis(assessment.tableHTML);
  };
  
  // 위험성평가 화면으로 돌아가기
  const goBackToMain = () => {
    // 상세 화면(detail)에서 메인 화면으로 가는 경우만 초기화
    // 저장된 위험성평가 보기(saved)에서 메인 화면으로 가는 경우는 초기화하지 않음
    if (currentView === 'detail') {
      resetAssessmentPage();
    }
    changeView('main');
    setSelectedAssessment(null);
  };
  
  // 저장된 위험성평가 목록으로 돌아가기
  const goBackToSaved = () => {
    changeView('saved');
    setSelectedAssessment(null);
  };
  
  // html2pdf 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // 쿠팡 파트너스 스크립트 로드
  useEffect(() => {
    // 이전에 생성된 모든 배너 요소와 관련 컨테이너 정리
    const cleanupPreviousBanners = () => {
      // 쿠팡 관련 모든 요소 제거 (고정 배너 제외)
      document.querySelectorAll('[id*="coupang-partners"]:not(#coupang-partners-banner)').forEach(el => {
        el.remove();
      });
      
      // iframes 확인 및 제거 (쿠팡 스크립트가 생성한 것일 수 있음)
      document.querySelectorAll('iframe').forEach(iframe => {
        if (iframe.src && iframe.src.includes('coupang.com')) {
          iframe.remove();
        }
      });
    };

    // 실행 전 초기 정리
    cleanupPreviousBanners();
    
    // useEffect에서 수동으로 스크립트를 로드하지 않고, Next.js Script 컴포넌트에서 처리합니다.
    
    return () => {
      // 컴포넌트 언마운트 시 배너만 제거하고 스크립트는 유지
      cleanupPreviousBanners();
      // 스크립트 요소 제거 코드 삭제 - 페이지 간 전환시 문제 해결을 위해
    };
  }, []);
  
  // 쿠팡 파트너스 배너 초기화 함수
  const initCoupangBanner = () => {
    try {
      setTimeout(() => {
        // 미리 정의된 배너 컨테이너 확인
        const bannerContainer = document.getElementById('coupang-partners-banner');
        
        // 배너 엘리먼트가 없으면 중단
        if (!bannerContainer) {
          console.error('쿠팡 파트너스 배너 컨테이너를 찾을 수 없습니다.');
          return;
        }
        
        // 배너 초기화 전 CSP 이슈를 우회하기 위한 처리
        try {
          // 컨테이너를 한번 비우고 시작
          while (bannerContainer.firstChild) {
            bannerContainer.removeChild(bannerContainer.firstChild);
          }
          
          // TypeScript 오류 방지를 위한 타입 가드
          if (window.PartnersCoupang && bannerContainer) {
            new window.PartnersCoupang.G({
              id: 859876,
              template: "carousel",
              trackingCode: "AF4903034",
              width: "680",
              height: "140",
              container: bannerContainer
            });
            console.log('쿠팡 파트너스 배너 초기화 완료');
          }
        } catch (initError) {
          console.error('쿠팡 파트너스 배너 초기화 중 오류 발생:', initError);
        }
      }, 1000); // 타이밍 증가
    } catch (e) {
      console.error('쿠팡 파트너스 배너 초기화 오류:', e);
    }
  };
  
  const handleImageUpload = async (file: File, itemId: number) => {
    // 새로운 이미지 파일이 없으면 함수 종료
    if (!file) return;

    // 임시 파일과 아이템 ID 저장 후 모달 표시
    setTempImageFile(file);
    setTempItemId(itemId);
    setProcessNameInput(''); // 입력 필드 초기화
    
    // 모달 표시
    setShowProcessNameModal(true);
  };
  
  // 공정/장비 명칭 입력 후 이미지 분석 처리
  const handleProcessNameSubmit = async () => {
    if (!tempImageFile || tempItemId === null || !processNameInput.trim()) {
      alert('공정 또는 장비의 명칭을 입력해주세요.');
      return;
    }
    
    // 모달 닫기
    setShowProcessNameModal(false);
    
    const file = tempImageFile;
    const itemId = tempItemId;
    const processName = processNameInput.trim();
    
    // 해당 항목의 상태 업데이트
    setAnalysisItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, image: file, imageUrl: URL.createObjectURL(file), loading: true, analysis: null, selectedRows: [], processName: processName } 
          : item
      )
    );

    try {
      // 요청 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000); // 50초 타임아웃
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('processName', processName);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      // 타이머 해제
      clearTimeout(timeoutId);

      // 응답 확인
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '이미지 분석 중 오류가 발생했습니다.');
      }

      // 응답 데이터 파싱
      const data = await response.json();
      
      // 분석 결과가 없으면 에러 처리
      if (!data.analysis) {
        throw new Error('분석 결과를 받지 못했습니다.');
      }
      
      // 분석 결과 업데이트
      setAnalysisItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, analysis: data.analysis, loading: false } 
            : item
        )
      );
    } catch (error: any) {
      console.error('이미지 분석 오류:', error);
      
      // 타임아웃 오류 특별 처리
      if (error.name === 'AbortError') {
        alert('이미지 분석 시간이 초과되었습니다. 이미지 크기를 줄이거나 다른 이미지를 시도해 보세요.');
      } else {
        alert(`이미지 분석 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
      }
      
      // 오류 상태 업데이트
      setAnalysisItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, analysis: null, loading: false } 
            : item
        )
      );
    }
  };

  // 새 분석 항목 추가
  const addNewAnalysisItem = () => {
    const newId = Math.max(...analysisItems.map(item => item.id), 0) + 1;
    setAnalysisItems([...analysisItems, { id: newId, image: null, imageUrl: null, analysis: null, loading: false, selectedRows: [], processName: '' }]);
  };
  
  // 분석 항목 삭제
  const removeAnalysisItem = (itemId: number) => {
    // 항목이 하나만 있으면 삭제하지 않음
    if (analysisItems.length <= 1) {
      alert('최소 하나의 이미지 분석 항목이 필요합니다.');
      return;
    }
    
    // 사용자 확인
    if (window.confirm('이 분석 항목을 삭제하시겠습니까?')) {
      // 해당 ID의 항목을 제외한 새 배열 생성
      setAnalysisItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };
  
  // 선택된 행 업데이트 처리
  const handleSelectionChange = (itemId: number, selectedRows: string[]) => {
    setAnalysisItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, selectedRows } 
          : item
      )
    );
  };
  
  // 선택된 항목들을 모아서 테이블로 표시 (API 호출 없이 직접 생성)
  const generateFinalAnalysis = () => {
    // 선택된 모든 행 수집
    const allSelectedRows = analysisItems.flatMap((item, index) => 
      item.selectedRows.map(row => ({
        row,
        processName: item.processName,
        itemIndex: index
      }))
    );
    
    if (allSelectedRows.length === 0) {
      alert('선택된 위험 요소가 없습니다. 하나 이상의 항목을 선택해주세요.');
      return;
    }
    
    setIsGeneratingFinal(true);
    
    try {
      // 선택된 행 데이터를 파싱하여 테이블 데이터로 변환
      const tableData = allSelectedRows.map(({row, processName}) => {
        const [riskFactor, severity, probability, riskLevel, countermeasure] = row.split('|');
        return {
          processName: processName || '',
          riskFactor: riskFactor || '',
          severity: severity || '',
          probability: probability || '',
          riskLevel: riskLevel || '',
          countermeasure: countermeasure || ''
        };
      });
      
      // 테이블 데이터를 HTML로 변환
      const tableHTML = `
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; border: 1px solid #E5E7EB;">
          <thead style="background-color: #F3F4F6;">
            <tr>
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">공정/장비</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">위험 요소</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">중대성</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">가능성</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">위험도</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">대책</th>
            </tr>
          </thead>
          <tbody>
            ${tableData.map((row, index) => `
              <tr style="background-color: ${index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'};">
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.processName}</td>
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.riskFactor}</td>
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.severity}</td>
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.probability}</td>
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.riskLevel}</td>
                <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.countermeasure}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      // 최종 테이블 설정
      setFinalAnalysis(tableHTML);
      
      // 편집 가능한 테이블 데이터 설정
      setEditableTableData(tableData);
      
    } catch (error) {
      console.error('최종 위험성평가표 생성 오류:', error);
      alert('최종 위험성평가표 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGeneratingFinal(false);
    }
  };

  // 최종 위험성평가표 수정 모드 전환
  const toggleEditMode = () => {
    if (!isEditingFinal) {
      // 수정 모드로 전환할 때 HTML에서 테이블 데이터 추출
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = finalAnalysis || '';
      
      const table = tempDiv.querySelector('table');
      if (!table) return;
      
      const tbody = table.querySelector('tbody');
      if (!tbody) return;
      
      const rows = tbody.querySelectorAll('tr');
      const extractedData = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        
        return {
          processName: cells[0]?.textContent?.trim() || '',
          riskFactor: cells[1]?.textContent?.trim() || '',
          severity: cells[2]?.textContent?.trim() || '',
          probability: cells[3]?.textContent?.trim() || '',
          riskLevel: cells[4]?.textContent?.trim() || '',
          countermeasure: cells[5]?.textContent?.trim() || ''
        };
      });
      
      setEditableTableData(extractedData);
    } else {
      // 수정 모드에서 나갈 때 변경사항 적용
      applyTableChanges();
    }
    
    setIsEditingFinal(!isEditingFinal);
  };
  
  // 테이블 데이터 수정 처리
  const handleTableDataChange = (index: number, field: string, value: string) => {
    setEditableTableData(prevData => {
      const newData = [...prevData];
      newData[index] = {
        ...newData[index],
        [field]: value
      };
      return newData;
    });
  };
  
  // 테이블 행 추가
  const addTableRow = () => {
    setEditableTableData(prevData => [
      ...prevData, 
      {
        processName: '',
        riskFactor: '',
        severity: '',
        probability: '',
        riskLevel: '',
        countermeasure: ''
      }
    ]);
  };
  
  // 테이블 행 삭제
  const removeTableRow = (index: number) => {
    setEditableTableData(prevData => 
      prevData.filter((_, i) => i !== index)
    );
  };
  
  // 수정된 테이블 변경사항 적용
  const applyTableChanges = () => {
    // 수정된 데이터로 HTML 테이블 생성
    const tableHTML = `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; border: 1px solid #E5E7EB;">
        <thead style="background-color: #F3F4F6;">
          <tr>
            <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">공정/장비</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">위험 요소</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">중대성</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">가능성</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">위험도</th>
            <th style="padding: 12px; text-align: left; border: 1px solid #E5E7EB; color: #1F2937;">대책</th>
          </tr>
        </thead>
        <tbody>
          ${editableTableData.map((row, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#FFFFFF' : '#F9FAFB'};">
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.processName}</td>
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.riskFactor}</td>
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.severity}</td>
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.probability}</td>
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.riskLevel}</td>
              <td style="padding: 12px; border: 1px solid #E5E7EB; color: #374151;">${row.countermeasure}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    setFinalAnalysis(tableHTML);
  };

  // PDF 저장 기능 구현
  const saveToPdf = () => {
    setIsGeneratingPdf(true);
    
    try {
      // html2pdf가 로드되었는지 확인
      if (typeof window.html2pdf === 'undefined') {
        alert('PDF 생성 라이브러리가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
        setIsGeneratingPdf(false);
        return;
      }

      // 최종 분석 내용이 있는지 확인
      const finalAnalysisContent = document.querySelector('.final-analysis-content');
      if (!finalAnalysisContent) {
        alert('변환할 내용을 찾을 수 없습니다.');
        setIsGeneratingPdf(false);
        return;
      }

      // PDF 생성을 위한 임시 컨테이너 생성
      const container = document.createElement('div');
      container.innerHTML = `
        <div style="padding: 15px; font-family: 'Malgun Gothic', sans-serif; width: 100%;">
          <h1 style="text-align: center; color: #1F2937; margin-bottom: 15px; font-size: 22px;">위험성평가표</h1>
          <div style="text-align: right; margin-bottom: 15px; font-size: 12px; color: #4B5563;">
            작성일: ${new Date().toLocaleDateString('ko-KR')}
          </div>
          ${finalAnalysisContent.innerHTML}
          <div style="margin-top: 15px; text-align: center; font-size: 11px; color: #6B7280;">
            <p>본 위험성평가표는 AI 분석을 통해 생성되었습니다.</p>
          </div>
        </div>
      `;

      // 테이블 스타일 직접 적용
      const table = container.querySelector('table') as HTMLTableElement;
      if (table) {
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '15px';
        table.style.border = '1px solid #E5E7EB';
        table.style.fontSize = '11px';  // 글자 크기 조정

        // 테이블 헤더 스타일 적용
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
          (header as HTMLTableCellElement).style.backgroundColor = '#F3F4F6';
          (header as HTMLTableCellElement).style.padding = '8px';
          (header as HTMLTableCellElement).style.textAlign = 'left';
          (header as HTMLTableCellElement).style.border = '1px solid #E5E7EB';
          (header as HTMLTableCellElement).style.color = '#1F2937';
        });

        // 테이블 셀 스타일 적용
        const cells = table.querySelectorAll('td');
        cells.forEach(cell => {
          (cell as HTMLTableCellElement).style.padding = '8px';
          (cell as HTMLTableCellElement).style.border = '1px solid #E5E7EB';
          (cell as HTMLTableCellElement).style.color = '#374151';
        });

        // 행 배경색 번갈아가며 적용
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
          if (index % 2 === 1) {
            (row as HTMLTableRowElement).style.backgroundColor = '#F9FAFB';
          }
        });
      }

      // PDF 생성 옵션
      const options = {
        margin: [10, 10, 10, 10], // 여백 축소
        filename: '위험성평가표.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollY: 0,
          width: 1200 // 가로 모드에 맞게 너비 조정
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'landscape', // 가로 모드로 변경
          compress: true
        }
      };

      // PDF 생성
      window.html2pdf()
        .from(container)
        .set(options)
        .save()
        .then(() => {
          setIsGeneratingPdf(false);
        })
        .catch((error: Error) => {
          console.error('PDF 생성 오류:', error);
          alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
          setIsGeneratingPdf(false);
        });

    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsGeneratingPdf(false);
    }
  };

  // Excel 다운로드 함수 수정
  const downloadExcel = (fromSaved = false) => {
    // 저장된 위험성평가 또는 최종 위험성평가에서 데이터 가져오기
    const dataToUse = fromSaved && selectedAssessment ? selectedAssessment.tableData : editableTableData;
    
    if ((!finalAnalysis && !fromSaved) || dataToUse.length === 0) {
      alert('다운로드할 데이터가 없습니다. 먼저 위험성 평가를 생성하세요.');
      return;
    }
    
    try {
      // 제목 설정 (저장된 위험성평가인 경우 해당 제목 사용)
      const title = fromSaved && selectedAssessment ? selectedAssessment.title : '위험성 평가 보고서';
      
      // 데이터 구조화
      const data = [
        [title],
        [''],
        ['날짜', new Date().toLocaleDateString()],
        [''],
        ['공정/장비', '위험요인', '심각도', '발생가능성', '위험도', '개선대책']
      ];
      
      // 위험성 평가 데이터 추가
      dataToUse.forEach((item: {
        processName: string;
        riskFactor: string;
        severity: string;
        probability: string;
        riskLevel: string;
        countermeasure: string;
      }) => {
        data.push([
          item.processName || '',
          item.riskFactor || '',
          item.severity || '',
          item.probability || '',
          item.riskLevel || '',
          item.countermeasure || ''
        ]);
      });
      
      // 워크북 생성
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);
      
      // 셀 병합
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }, // 제목 행 병합
      ];
      
      // 워크시트 추가
      XLSX.utils.book_append_sheet(wb, ws, "위험성평가");
      
      // 파일명 생성 (저장된 위험성평가인 경우 해당 제목 사용)
      const fileName = fromSaved && selectedAssessment 
        ? `${selectedAssessment.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx` 
        : `위험성평가_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // 파일 다운로드
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Excel 파일 생성 오류:', error);
      alert('Excel 파일 생성 중 오류가 발생했습니다.');
    }
  };

  // 위험성평가 추가 요청 함수 수정
  const requestAdditionalAssessment = async () => {
    // 이미 요청 중이면 중복 실행 방지
    if (isRequestingAdditional) {
      return;
    }
    
    setIsRequestingAdditional(true);
    
    // 기존 항목이 없는 경우 확인
    if (!analysisItems.some(item => item.analysis && !item.loading)) {
      alert('기존 분석 결과가 없습니다. 이미지를 먼저 분석해주세요.');
      setIsRequestingAdditional(false);
      return;
    }
    
    // 마지막 분석 항목 찾기
    const lastItemIndex = analysisItems.length - 1;
    const lastItem = analysisItems[lastItemIndex];
    
    // 추가 분석 중인 항목 인덱스 설정
    setAdditionalAnalysisIndex(lastItemIndex);
    
    try {
      console.log('추가 위험성평가 요청 시작...');
      
      // 분석 항목 중 실제 데이터가 있는 항목만 필터링
      const validItems = analysisItems.filter(item => 
        item.analysis && typeof item.analysis === 'string' && !item.loading
      );
      
      // 요청 타임아웃 설정
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60초 타임아웃 (서버 타임아웃보다 길게)
      
      try {
        const response = await fetch('/api/additional-assessment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            analysisItems: validItems,
          }),
          signal: controller.signal
        });
        
        // 타이머 해제
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          // 응답 파싱 시도
          const errorData = await response.json().catch(() => ({ error: `HTTP 오류: ${response.status}` }));
          throw new Error(errorData.error || `HTTP 오류: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 응답 데이터 유효성 검사
        if (!data.additionalItems || !data.additionalItems.length) {
          throw new Error('유효한 응답 데이터가 없습니다');
        }
        
        if (!data.additionalItems[0].analysis) {
          throw new Error('분석 결과가 비어있습니다');
        }
      
        console.log('추가 위험성평가 응답 수신 완료');
        
        // 마지막 항목의 분석 결과에 새로운 위험성평가 결과 추가
        setAnalysisItems(prevItems => {
          const updatedItems = [...prevItems];
          const lastItemIndex = updatedItems.length - 1;
          const additionalAnalysis = data.additionalItems[0].analysis;
          
          // 기존 테이블에 추가 분석 결과를 병합
          if (updatedItems[lastItemIndex].analysis && additionalAnalysis) {
            try {
              // HTML 파싱을 위한 임시 div 생성
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = updatedItems[lastItemIndex].analysis;
              const existingTable = tempDiv.querySelector('table');
              
              // 추가 분석 결과에서 테이블 행 추출
              const additionalDiv = document.createElement('div');
              additionalDiv.innerHTML = additionalAnalysis;
              const additionalTable = additionalDiv.querySelector('table');
              
              if (existingTable && additionalTable) {
                const additionalRows = additionalTable.querySelectorAll('tbody tr');
                
                // 기존 테이블의 tbody에 추가 행 삽입
                const existingTbody = existingTable.querySelector('tbody');
                if (existingTbody && additionalRows.length > 0) {
                  additionalRows.forEach(row => {
                    existingTbody.appendChild(row.cloneNode(true));
                  });
                  
                  // 업데이트된 테이블로 HTML 업데이트
                  updatedItems[lastItemIndex].analysis = tempDiv.innerHTML;
                  console.log(`${additionalRows.length}개의 행이 기존 테이블에 추가됨`);
                } else {
                  console.warn('테이블 요소를 찾을 수 없거나 추가 행이 없습니다. 결과를 추가합니다.');
                  updatedItems[lastItemIndex].analysis += `<hr class="my-4" /><h3 class="text-lg font-semibold mb-2">추가 위험성평가:</h3>${additionalAnalysis}`;
                }
              } else {
                // 테이블이 없는 경우 분석 결과 연결
                updatedItems[lastItemIndex].analysis += `<hr class="my-4" /><h3 class="text-lg font-semibold mb-2">추가 위험성평가:</h3>${additionalAnalysis}`;
              }
            } catch (parseError) {
              console.error('HTML 파싱 오류:', parseError);
              updatedItems[lastItemIndex].analysis += `<hr class="my-4" /><h3 class="text-lg font-semibold mb-2">추가 위험성평가:</h3>${additionalAnalysis}`;
            }
          } else if (additionalAnalysis) {
            // 기존 분석이 없는 경우 새 분석으로 설정
            updatedItems[lastItemIndex].analysis = additionalAnalysis;
          }
          
          // processName 전달
          if (data.additionalItems[0].processName) {
            updatedItems[lastItemIndex].processName = data.additionalItems[0].processName;
          }
          
          return updatedItems;
        });
      } catch (fetchError: any) {
        console.error('네트워크 오류:', fetchError);
        throw new Error(fetchError.name === 'AbortError' 
          ? '요청 시간이 초과되었습니다. 서버 응답이 지연되고 있습니다.' 
          : fetchError.message);
      }
      
      // 추가 분석 완료 후 상태 업데이트
      setIsRequestingAdditional(false);
      setAdditionalAnalysisIndex(null);
      
    } catch (error: any) {
      console.error('추가 위험성평가 오류:', error);
      
      // 오류 메시지 처리
      let errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
      
      // 특정 오류 패턴 확인 및 처리
      if (errorMessage.includes('timeout') || errorMessage.includes('시간 초과')) {
        errorMessage = '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
      } else if (errorMessage.includes('network') || errorMessage.includes('네트워크')) {
        errorMessage = '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.';
      }
      
      // 사용자에게 알림
      alert(`추가 위험성평가 중 오류가 발생했습니다: ${errorMessage}`);
      
      // 오류 상태를 분석 결과에 표시
      setAnalysisItems(prevItems => {
        const updatedItems = [...prevItems];
        const lastIndex = prevItems.findIndex(item => item.id === (additionalAnalysisIndex !== null 
          ? prevItems[additionalAnalysisIndex].id 
          : Math.max(...prevItems.map(i => i.id))));
        
        if (lastIndex >= 0 && updatedItems[lastIndex].analysis) {
          updatedItems[lastIndex].analysis += `
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4" role="alert">
            <p class="font-medium">추가 위험성평가 오류</p>
            <p class="text-sm">${errorMessage}</p>
            <p class="text-sm mt-1">다시 시도하려면 '위험성평가 추가요청' 버튼을 클릭하세요.</p>
          </div>`;
        }
        
        return updatedItems;
      });
      
      // 오류 발생 시에도 상태 초기화
      setIsRequestingAdditional(false);
      setAdditionalAnalysisIndex(null);
    }
  };

  // 현재 화면 변경 함수 - 이전 화면 상태 추적 추가
  const changeView = (newView: 'main' | 'saved' | 'detail') => {
    setPreviousView(currentView);
    setCurrentView(newView);
  };

  // 저장된 위험성평가 편집 모드 토글
  const toggleSavedEditMode = () => {
    if (!isEditingSaved) {
      // 수정 모드로 전환할 때 HTML에서 테이블 데이터 추출
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = selectedAssessment?.tableHTML || '';
      
      const table = tempDiv.querySelector('table');
      if (!table) return;
      
      const tbody = table.querySelector('tbody');
      if (!tbody) return;
      
      const rows = tbody.querySelectorAll('tr');
      const extractedData = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        
        return {
          processName: cells[0]?.textContent?.trim() || '',
          riskFactor: cells[1]?.textContent?.trim() || '',
          severity: cells[2]?.textContent?.trim() || '',
          probability: cells[3]?.textContent?.trim() || '',
          riskLevel: cells[4]?.textContent?.trim() || '',
          countermeasure: cells[5]?.textContent?.trim() || ''
        };
      });
      
      setEditableTableData(extractedData);
    } else {
      // 수정 모드에서 나갈 때 변경사항 적용
      applyTableChanges();
    }
    
    setIsEditingSaved(!isEditingSaved);
  };

  // 수정된 위험성평가 업데이트
  const updateAssessment = async () => {
    alert('기능 미구현: 인증 연결이 필요합니다.');
    return;
    
    // 기존 코드 주석 처리
    /*
    if (!selectedAssessment || !editableTableData.length) {
      console.error('업데이트에 필요한 데이터 미비:', {
        selectedAssessment: !!selectedAssessment,
        editableTableData: editableTableData.length
      });
      alert('업데이트에 필요한 데이터가 없습니다.');
      return;
    }
    
    // ... 나머지 파이어베이스 관련 코드 삭제
    */
  };

  // 위험성추정 기준 모달 상태 추가
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  
  // 위험성추정 기준 모달 열기/닫기 함수
  const toggleCriteriaModal = () => {
    setShowCriteriaModal(!showCriteriaModal);
  };

  // 공정/장비 명칭 입력 모달 취소 처리
  const handleProcessNameCancel = () => {
    // 모달 닫기
    setShowProcessNameModal(false);
    
    // 임시 파일 초기화
    setTempImageFile(null);
    
    // 해당 항목의 image 상태 초기화
    if (tempItemId !== null) {
      setAnalysisItems(prevItems => 
        prevItems.map(item => 
          item.id === tempItemId 
            ? { ...item, image: null, imageUrl: null }
            : item
        )
      );
    }
    
    // 기타 임시 상태 초기화
    setTempItemId(null);
    setProcessNameInput('');
  };

  // 쿠팡 파트너스 배너 관리
  const bannerContainerRef = useRef<HTMLDivElement>(null);
  const [bannerInitialized, setBannerInitialized] = useState(false);
  
  // 배너 초기화 함수 - 정적 이미지를 사용하므로 사용하지 않음
  const initializeBanner = useCallback(() => {
    console.log('정적 배너를 사용하므로 동적 초기화는 실행되지 않음');
  }, []);
  
  // 컴포넌트 마운트 시 배너 초기화 - 정적 이미지를 사용하므로 불필요
  useEffect(() => {
    if (typeof window === 'undefined') return;
    console.log('정적 배너 사용 중');
    
    // 애드센스 광고 초기화 - 애드센스 승인 후 활성화될 것입니다
    try {
      // @ts-ignore
      if (window.adsbygoogle) {
        console.log('애드센스 초기화 시도');
        // 애드센스가 로드된 경우 애드센스 광고 표시 (쿠팡 배너는 그대로 유지)
        const adsElement = document.getElementById('assessment-banner-ad');
        if (adsElement) {
          (adsElement as HTMLElement).style.display = 'block';
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('애드센스 광고 초기화 완료');
        }
      }
    } catch (error) {
      console.error('애드센스 초기화 실패:', error);
    }
  }, []);
  
  // 화면 전환 시 배너 재초기화
  useEffect(() => {
    if (typeof window === 'undefined') return;
    console.log('정적 배너 유지됨');
    
    // 화면 전환 시 애드센스 광고 재초기화 시도
    try {
      // @ts-ignore
      if (window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('화면 전환 시 애드센스 초기화 실패:', error);
    }
  }, [currentView]);
  
  // 라우터 이벤트 감지 - 정적 이미지를 사용하므로 불필요
  useEffect(() => {
    if (typeof window === 'undefined') return;
    console.log('정적 배너는 라우터 이벤트에 영향 없음');
  }, []);

  useEffect(() => {
    // cleanup previous banners and scripts
    const cleanup = () => {
      // 기존 배너만 제거하고 스크립트는 유지
      document.querySelectorAll('iframe[id^="coupang-partners"]').forEach((iframe) => {
        iframe.remove();
      });
      
      // 배너 컨테이너 비우기
      const bannerContainer = document.getElementById('coupang-partners-banner');
      if (bannerContainer && bannerContainer.firstChild) {
        while (bannerContainer.firstChild) {
          bannerContainer.removeChild(bannerContainer.firstChild);
        }
      }
    };

    cleanup();

    return () => {
      cleanup();
      // 스크립트 요소는 제거하지 않음 (페이지 전환 시 배너 유지를 위해)
    };
  }, []);

  useEffect(() => {
    // 쿠팡 파트너스 배너 관련 이벤트 핸들러
    const initBanner = () => {
      // 페이지 전환 시 쿠팡 파트너스 배너 유지를 위한 처리
      setTimeout(() => {
        try {
          // 이미 배너가 있는지 확인
          const bannerContainer = document.getElementById('coupang-partners-banner');
          const hasBannerContent = bannerContainer && bannerContainer.innerHTML.trim() !== '' && 
                                  (bannerContainer.childElementCount > 0 || bannerContainer.querySelector('iframe'));
          
          // 이미 배너가 있으면 초기화하지 않음
          if (hasBannerContent) {
            console.log('쿠팡 파트너스 배너가 이미 존재함');
            return;
          }
          
          // window.PartnersCpg 방식 시도
          if (window.hasOwnProperty('PartnersCpg') && window.PartnersCpg) {
            window.PartnersCpg.initWithBanner();
            console.log('PartnersCpg.initWithBanner 방식으로 초기화 완료');
            return;
          }
          
          // window.PartnersCoupang 방식 시도
          if (window.hasOwnProperty('PartnersCoupang') && window.PartnersCoupang && bannerContainer) {
            new window.PartnersCoupang.G({
              id: 859876,
              template: "carousel",
              trackingCode: "AF4903034",
              width: "680",
              height: "140",
              container: bannerContainer
            });
            console.log('PartnersCoupang.G 방식으로 초기화 완료');
            return;
          }
          
          console.log('쿠팡 파트너스 스크립트를 찾을 수 없음, 스크립트 로드 중...');
          
          // 스크립트가 없는 경우 동적으로 추가
          const script = document.createElement('script');
          script.src = 'https://ads-partners.coupang.com/g.js';
          script.onload = () => {
            console.log('쿠팡 파트너스 스크립트 동적 로드 완료');
            setTimeout(() => {
              if (window.hasOwnProperty('PartnersCpg') && window.PartnersCpg) {
                window.PartnersCpg.initWithBanner();
                console.log('동적 로드 후 PartnersCpg 초기화 완료');
              } else if (window.hasOwnProperty('PartnersCoupang') && window.PartnersCoupang && bannerContainer) {
                new window.PartnersCoupang.G({
                  id: 859876,
                  template: "carousel",
                  trackingCode: "AF4903034",
                  width: "680",
                  height: "140",
                  container: bannerContainer
                });
                console.log('동적 로드 후 PartnersCoupang 초기화 완료');
              }
            }, 500);
          };
          document.head.appendChild(script);
        } catch (error) {
          console.error('쿠팡 배너 초기화 오류:', error);
        }
      }, 700); // 페이지 전환 후 약간의 지연을 두고 실행
    };

    // URL이 변경될 때마다 실행
    initBanner();

    return () => {
      // 클린업 함수 (필요한 경우 추가 로직)
    };
  }, [pathname, searchParams]); // pathname, searchParams가 변경될 때마다 useEffect 실행

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* 탭바 네비게이션 추가 */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
              AI SAFETY 서비스
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/assessment')}
                className="px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors"
              >
                위험성평가 생성기
              </button>
              <button
                onClick={() => router.push('/camera')}
                className="px-4 py-2 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                사진 위험점 분석
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-6">위험성평가 생성기</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              이미지를 업로드하면 AI가 분석하여 위험성평가표를 생성합니다. 빠르고 정확한 위험 요소 식별을 통해 안전한 작업 환경을 구축하세요.
            </p>
            
            {/* 탭 버튼 개선 */}
            <div className="flex justify-center gap-4 mt-8 flex-wrap">
              <button
                onClick={() => {
                  if (currentView === 'detail') {
                    resetAssessmentPage();
                  }
                  changeView('main');
                }}
                className={`px-8 py-3.5 rounded-full font-medium text-base transition-all duration-300 ${
                  currentView === 'main'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md'
                }`}
              >
                위험성평가 생성
              </button>
              {/* 위험성추정 기준 버튼 추가 */}
              <button
                onClick={toggleCriteriaModal}
                className="px-8 py-3.5 rounded-full font-medium text-base transition-all duration-300 bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:shadow-md flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                위험성추정 기준
              </button>
            </div>
          </div>
          
          {/* 위험성평가 생성 화면 */}
          {currentView === 'main' && (
            <>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16 border border-gray-100">
                {analysisItems.map((item, index) => (
                  <div key={item.id} className={`${index > 0 ? 'border-t border-gray-100' : ''}`}>
                    <div className="p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                          <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 text-sm">
                            {item.id}
                          </span>
                          이미지 분석
                          {item.processName && (
                            <span className="ml-3 text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full text-sm">
                              {item.processName}
                            </span>
                          )}
                        </h2>
                        
                        {/* 항목이 비어있거나 여러 개 있는 경우에만 삭제 버튼 표시 */}
                        {(!item.analysis || analysisItems.length > 1) && (
                          <button
                            onClick={() => removeAnalysisItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 focus:outline-none"
                            title="이 분석 항목 삭제"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      <div className="flex flex-col lg:flex-row gap-8">
                        {/* 왼쪽: 이미지 업로더 */}
                        <div className="lg:w-1/3">
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <ImageUploader onImageUpload={(file) => handleImageUpload(file, item.id)} />
                          </div>
                        </div>
                        
                        {/* 오른쪽: 분석 결과 */}
                        <div className="lg:w-2/3">
                          {item.loading ? (
                            <div className="p-12 bg-gray-50 rounded-xl border border-gray-100 text-center h-full flex flex-col justify-center items-center">
                              <p className="text-lg mb-6 text-gray-700 font-medium">위험성평가표 생성 중...</p>
                              <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
                            </div>
                          ) : item.analysis ? (
                            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden relative">
                              <ImageAnalysis 
                                analysis={item.analysis} 
                                itemId={item.id}
                                onSelectionChange={handleSelectionChange}
                              />
                              
                              {/* 추가 분석 중인 경우 오버레이 표시 */}
                              {isRequestingAdditional && additionalAnalysisIndex === index && (
                                <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex flex-col justify-center items-center z-10">
                                  <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin mb-6"></div>
                                  <p className="text-lg font-semibold text-gray-800 mb-2">추가 위험성평가 생성 중...</p>
                                  <p className="text-gray-600">기존 분석 결과는 유지됩니다</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div 
                              className="p-12 bg-gray-50 rounded-xl border border-gray-100 text-center h-full flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => analysisItems.length > 1 ? removeAnalysisItem(item.id) : null}
                              title={analysisItems.length > 1 ? "클릭하여 이 항목 삭제" : ""}
                            >
                              {analysisItems.length > 1 && (
                                <div className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                </div>
                              )}
                              <svg className="w-20 h-20 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p className="text-gray-500 font-medium">{analysisItems.length > 1 
                                ? "이미지를 업로드하거나 클릭하여 이 항목을 삭제하세요." 
                                : "이미지를 업로드하면 위험성평가표가 여기에 표시됩니다."}</p>
                              {analysisItems.length > 1 && (
                                <p className="mt-3 text-xs text-red-500">실수로 추가된 항목이면 클릭하여 삭제하세요</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* 마지막 항목이고, 분석 결과가 있을 때만 버튼들 표시 */}
                      {index === analysisItems.length - 1 && item.analysis && (
                        <div className="mt-8 flex justify-center gap-4">
                          <button
                            onClick={addNewAnalysisItem}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 flex items-center shadow-md"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            이미지 추가하기
                          </button>
                          
                          {/* 위험성평가 추가요청 버튼 수정 */}
                          <button 
                            onClick={requestAdditionalAssessment}
                            disabled={isRequestingAdditional}
                            className={`px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-all duration-300 flex items-center shadow-md ${isRequestingAdditional ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            {isRequestingAdditional ? (
                              <>
                                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-3"></div>
                                요청 중...
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                                위험성평가 추가요청
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 선택된 항목이 있을 때만 최종 위험성평가표 생성 버튼 표시 */}
              {analysisItems.some(item => item.selectedRows.length > 0) && (
                <div className="mb-16 flex justify-center">
                  <button
                    onClick={generateFinalAnalysis}
                    disabled={isGeneratingFinal}
                    className={`px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 flex items-center shadow-lg ${isGeneratingFinal ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isGeneratingFinal ? (
                      <>
                        <div className="w-6 h-6 border-t-2 border-white border-solid rounded-full animate-spin mr-3"></div>
                        <span className="font-medium">처리 중...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        <span className="font-medium">선택한 항목으로 최종 위험성평가표 생성</span>
                      </>
                    )}
                  </button>
                </div>
              )}
              
              {/* 최종 위험성평가표 표시 */}
              {finalAnalysis && (
                <div className="mb-16">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-800">위험성평가표 (최종)</h2>
                      <div className="flex space-x-3">
                        <button
                          onClick={toggleEditMode}
                          className={`px-5 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 flex items-center shadow-sm ${isEditingFinal 
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-500' 
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500'}`}
                        >
                          {isEditingFinal ? (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              완료
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                              </svg>
                              수정하기
                            </>
                          )}
                        </button>
                        
                        {/* PDF 다운로드 버튼 */}
                        {!isEditingFinal && (
                          <button 
                            onClick={saveToPdf}
                            disabled={isGeneratingPdf}
                            className={`px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 flex items-center shadow-sm ml-2 ${isGeneratingPdf ? 'opacity-70 cursor-not-allowed' : ''}`}
                          >
                            {isGeneratingPdf ? (
                              <>
                                <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                                생성 중...
                              </>
                            ) : (
                              <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                PDF 다운로드
                              </>
                            )}
                          </button>
                        )}
                        
                        {/* Excel 다운로드 버튼 */}
                        {!isEditingFinal && (
                          <button 
                            onClick={() => downloadExcel(false)}
                            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300 flex items-center shadow-sm ml-2"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Excel 다운로드
                          </button>
                        )}
                        
                        {/* 저장하기 버튼 제거 */}
                        
                        {/* PDF 및 Excel 버튼 제거 */}
                      </div>
                    </div>
                    <div className="p-8">
                      {isEditingFinal ? (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">공정/장비</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">위험 요소</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">중대성</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">가능성</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">위험도</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">대책</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50 w-20">작업</th>
                              </tr>
                            </thead>
                            <tbody>
                              {editableTableData.map((row, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-5 py-4 border border-gray-200">
                                    <input
                                      type="text"
                                      value={row.processName}
                                      onChange={(e) => handleTableDataChange(index, 'processName', e.target.value)}
                                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                    />
                                  </td>
                                  <td className="px-5 py-4 border border-gray-200">
                                    <input
                                      type="text"
                                      value={row.riskFactor}
                                      onChange={(e) => handleTableDataChange(index, 'riskFactor', e.target.value)}
                                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                    />
                                  </td>
                                  <td className="px-5 py-4 border border-gray-200">
                                    <input
                                      type="number"
                                      min="1"
                                      max="5"
                                      value={row.severity}
                                      onChange={(e) => handleTableDataChange(index, 'severity', e.target.value)}
                                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                      placeholder="1-5"
                                    />
                                  </td>
                                  <td className="px-5 py-4 border border-gray-200">
                                    <input
                                      type="number"
                                      min="1"
                                      max="5"
                                      value={row.probability}
                                      onChange={(e) => handleTableDataChange(index, 'probability', e.target.value)}
                                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                      placeholder="1-5"
                                    />
                                  </td>
                                  <td className="px-5 py-4 border border-gray-200">
                                    <select
                                      value={row.riskLevel}
                                      onChange={(e) => handleTableDataChange(index, 'riskLevel', e.target.value)}
                                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                    >
                                      <option value="">선택</option>
                                      <option value="높음">높음</option>
                                      <option value="중간">중간</option>
                                      <option value="낮음">낮음</option>
                                    </select>
                                  </td>
                                  <td className="px-5 py-4 border border-gray-200">
                                    <textarea
                                      value={row.countermeasure}
                                      onChange={(e) => handleTableDataChange(index, 'countermeasure', e.target.value)}
                                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                      rows={2}
                                    />
                                  </td>
                                  <td className="px-5 py-4 border border-gray-200">
                                    <button
                                      onClick={() => removeTableRow(index)}
                                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-all duration-200 w-full flex items-center justify-center"
                                      title="행 삭제"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                      </svg>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          
                          <div className="mt-8 flex justify-center">
                            <button
                              onClick={addTableRow}
                              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-all duration-300 flex items-center shadow-md"
                            >
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                              </svg>
                              행 추가하기
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="final-analysis-content" dangerouslySetInnerHTML={{ __html: finalAnalysis }}></div>
                      )}
                    </div>
                    <div className="border-t border-gray-100 bg-gray-50 px-8 py-4">
                      <p className="text-sm text-gray-600">
                        {isEditingFinal 
                          ? "테이블을 직접 수정하고 완료 버튼을 클릭하세요." 
                          : "선택한 위험 요소들로 최종 위험성평가표가 생성되었습니다. 수정하기 버튼을 눌러 내용을 편집할 수 있습니다."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* 저장된 위험성평가 목록 화면 */}
          {currentView === 'saved' && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">저장된 위험성평가 결과</h2>
              </div>
              
              <div className="p-8">
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
                  </div>
                ) : (savedAssessments || []).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedAssessments.map((savedAssessment) => (
                      <div 
                        key={savedAssessment.id} 
                        className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => viewAssessment(savedAssessment)}
                      >
                        <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                        <div className="p-6">
                          <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{savedAssessment.title}</h3>
                          <div className="flex items-center mb-4 text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            {new Date(savedAssessment.createdAt).toLocaleDateString()}
                            
                            <span className="mx-2">•</span>
                            
                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            위험요소 {savedAssessment.tableData.length}개
                          </div>
                          <div className="flex justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewAssessment(savedAssessment);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300"
                            >
                              자세히 보기
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAssessment(savedAssessment.id);
                              }}
                              className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                    <svg className="w-20 h-20 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m4-6v6m-4 6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    <p className="text-xl font-medium text-gray-600 mb-4">저장된 위험성평가 결과가 없습니다.</p>
                    <button 
                      onClick={() => changeView('main')}
                      className="mt-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
                    >
                      위험성평가 생성하기
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* 상세 보기 화면 */}
          {currentView === 'detail' && selectedAssessment && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex justify-between items-center">
                <div className="flex items-center">
                  <button 
                    onClick={goBackToSaved}
                    className="mr-4 p-2.5 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors flex items-center justify-center"
                    aria-label="뒤로 가기"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedAssessment.title}</h2>
                    <div className="text-sm text-blue-100">
                      저장일: {new Date(selectedAssessment.createdAt).toLocaleDateString()} · 위험요소 {selectedAssessment.tableData.length}개
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  {/* 수정 버튼 추가 */}
                  <button
                    onClick={toggleSavedEditMode}
                    className={`px-5 py-2.5 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-300 flex items-center ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={isUpdating}
                  >
                    {isEditingSaved ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                        </svg>
                        완료
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                        수정하기
                      </>
                    )}
                  </button>
                  
                  {/* 수정 모드일 때 저장 버튼 표시 */}
                  {isEditingSaved && (
                    <button
                      onClick={updateAssessment}
                      disabled={isUpdating}
                      className={`px-5 py-2.5 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-300 flex items-center ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isUpdating ? (
                        <>
                          <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                          저장 중...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                          </svg>
                          저장하기
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* 수정 모드가 아닐 때만 PDF 버튼 표시 */}
                  {!isEditingSaved && (
                    <button 
                      onClick={saveToPdf}
                      disabled={isGeneratingPdf}
                      className={`px-5 py-2.5 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-300 flex items-center ${isGeneratingPdf ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isGeneratingPdf ? (
                        <>
                          <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                          생성 중...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          PDF로 저장
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Excel 다운로드 버튼 추가 */}
                  {!isEditingSaved && (
                    <button 
                      onClick={() => downloadExcel(true)}
                      className="px-5 py-2.5 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-300 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m-8-8h16" />
                      </svg>
                      Excel로 저장
                    </button>
                  )}
                  
                  {/* 수정 모드가 아닐 때만 삭제 버튼 표시 */}
                  {!isEditingSaved && (
                    <button 
                      onClick={() => deleteAssessment(selectedAssessment.id)}
                      className="p-2.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors flex items-center justify-center"
                      aria-label="삭제"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-8">
                {isEditingSaved ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">공정/장비</th>
                          <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">위험 요소</th>
                          <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">중대성</th>
                          <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">가능성</th>
                          <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">위험도</th>
                          <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50">대책</th>
                          <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 border border-gray-200 bg-gray-50 w-20">작업</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editableTableData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-5 py-4 border border-gray-200">
                              <input
                                type="text"
                                value={row.processName}
                                onChange={(e) => handleTableDataChange(index, 'processName', e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-5 py-4 border border-gray-200">
                              <input
                                type="text"
                                value={row.riskFactor}
                                onChange={(e) => handleTableDataChange(index, 'riskFactor', e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-5 py-4 border border-gray-200">
                              <input
                                type="number"
                                min="1"
                                max="5"
                                value={row.severity}
                                onChange={(e) => handleTableDataChange(index, 'severity', e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                placeholder="1-5"
                              />
                            </td>
                            <td className="px-5 py-4 border border-gray-200">
                              <input
                                type="number"
                                min="1"
                                max="5"
                                value={row.probability}
                                onChange={(e) => handleTableDataChange(index, 'probability', e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                placeholder="1-5"
                              />
                            </td>
                            <td className="px-5 py-4 border border-gray-200">
                              <select
                                value={row.riskLevel}
                                onChange={(e) => handleTableDataChange(index, 'riskLevel', e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                              >
                                <option value="">선택</option>
                                <option value="높음">높음</option>
                                <option value="중간">중간</option>
                                <option value="낮음">낮음</option>
                              </select>
                            </td>
                            <td className="px-5 py-4 border border-gray-200">
                              <textarea
                                value={row.countermeasure}
                                onChange={(e) => handleTableDataChange(index, 'countermeasure', e.target.value)}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                                rows={2}
                              />
                            </td>
                            <td className="px-5 py-4 border border-gray-200">
                              <button
                                onClick={() => removeTableRow(index)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-all duration-200 w-full flex items-center justify-center"
                                title="행 삭제"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={addTableRow}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 transition-all duration-300 flex items-center shadow-md"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        행 추가하기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="final-analysis-content" dangerouslySetInnerHTML={{ __html: selectedAssessment.tableHTML }}></div>
                )}
              </div>
              
              {isEditingSaved && (
                <div className="border-t border-gray-100 bg-gray-50 px-8 py-4">
                  <p className="text-sm text-gray-600">
                    테이블을 직접 수정하고 저장하기 버튼을 클릭하세요. 취소하려면 '완료' 버튼을 클릭한 후 뒤로 가기를 눌러주세요.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* 광고 및 배너 영역 */}
          <div className="w-full bg-gray-50 py-5 my-4 border-t border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex flex-col items-center justify-center">
                <div id="coupang-partners-banner" 
                     data-id="coupang-banner"
                     className="w-full max-w-[680px] h-[140px] mb-2 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                     style={{minHeight: '140px', background: '#f5f5f5'}}
                ></div>
                <p className="text-xs text-gray-400 mt-1">
                  이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
                </p>
              </div>
            </div>
          </div>
          
          {/* 푸터 영역 */}
          <footer className="w-full py-4 text-center text-gray-500 text-sm">
            © 2025 위험성평가 생성기. 모든 권리 보유.
          </footer>
          
          {/* Next.js Script를 사용하여 쿠팡 파트너스 스크립트 로드 */}
          <Script
            strategy="lazyOnload"
            id="coupang-partners-script"
            src="https://ads-partners.coupang.com/g.js"
            onLoad={() => {
              try {
                // 배너 요소가 존재하면 초기화
                setTimeout(() => {
                  // 이미 배너가 있는지 확인
                  const bannerContainer = document.getElementById('coupang-partners-banner');
                  const hasBannerContent = bannerContainer && bannerContainer.innerHTML.trim() !== '' && 
                                         (bannerContainer.childElementCount > 0 || bannerContainer.querySelector('iframe'));
                
                  // 이미 배너가 있으면 초기화하지 않음
                  if (hasBannerContent) {
                    console.log('쿠팡 파트너스 배너가 이미 존재함 (Script onLoad)');
                    return;
                  }
                
                  // window.PartnersCpg 방식 시도
                  if (window.hasOwnProperty('PartnersCpg') && window.PartnersCpg) {
                    window.PartnersCpg.initWithBanner();
                    console.log('PartnersCpg.initWithBanner 방식으로 초기화 완료 (Script onLoad)');
                    return;
                  }
                  
                  // window.PartnersCoupang 방식 시도
                  if (window.hasOwnProperty('PartnersCoupang') && window.PartnersCoupang && bannerContainer) {
                    new window.PartnersCoupang.G({
                      id: 859876,
                      template: "carousel",
                      trackingCode: "AF4903034",
                      width: "680",
                      height: "140",
                      container: bannerContainer
                    });
                    console.log('PartnersCoupang.G 방식으로 초기화 완료 (Script onLoad)');
                    return;
                  }
                  
                  console.log('쿠팡 파트너스 스크립트 로드되었으나 배너 초기화 실패 (Script onLoad)');
                }, 500);
              } catch (error) {
                console.error('쿠팡 파트너스 배너 초기화 중 오류:', error);
              }
            }}
          />
          
          {/* 린터 오류 수정을 위한 타입 정의 */}
          {(() => {
            // 타입 가드 함수 추가
            const isCurrentViewMain = (view: 'main' | 'saved' | 'detail'): view is 'main' => view === 'main';
            const isCurrentViewSaved = (view: 'main' | 'saved' | 'detail'): view is 'saved' => view === 'saved';
            const isCurrentViewDetail = (view: 'main' | 'saved' | 'detail'): view is 'detail' => view === 'detail';
            
            return null;
          })()}
          
          {/* 공정/장비 명칭 입력 모달 */}
          {showProcessNameModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100 animate-scaleIn">
                <h3 className="text-2xl font-bold text-gray-800 mb-5">공정 또는 장비의 명칭을 입력하세요</h3>
                <input
                  type="text"
                  value={processNameInput}
                  onChange={(e) => setProcessNameInput(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none mb-6 text-gray-700 placeholder-gray-400 transition-all duration-300"
                  placeholder="예: 용접 작업, 지게차 운반, 높이 작업 등"
                  autoFocus
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleProcessNameCancel}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-300"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleProcessNameSubmit}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 shadow-md"
                    disabled={!processNameInput.trim()}
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 저장 대화상자 */}
          {showSaveDialog && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100 animate-scaleIn">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-2xl font-bold text-gray-800">위험성평가 저장</h3>
                  <button 
                    onClick={() => setShowSaveDialog(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  이 위험성평가를 저장하면 나중에 다시 확인하고 PDF로 출력할 수 있습니다.
                </p>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">위험성평가 제목</label>
                  <input
                    type="text"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none text-gray-700 placeholder-gray-400 transition-all duration-300"
                    placeholder="예: 용접 작업 위험성평가 (2023년 9월)"
                    autoFocus
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-all duration-300"
                  >
                    취소
                  </button>
                  <button
                    onClick={saveAssessment}
                    disabled={!saveTitle.trim() || isSaving}
                    className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 shadow-md flex items-center ${!saveTitle.trim() || isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                        저장 중...
                      </>
                    ) : '저장하기'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* 애니메이션용 CSS */}
          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes scaleIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-out forwards;
            }
            
            .animate-scaleIn {
              animation: scaleIn 0.3s ease-out forwards;
            }
            
            .final-analysis-content table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1.5rem;
              font-size: 0.95rem;
            }
            
            .final-analysis-content th,
            .final-analysis-content td {
              border: 1px solid #e2e8f0;
              padding: 0.75rem;
              text-align: left;
            }
            
            .final-analysis-content th {
              background-color: #f8fafc;
              font-weight: 600;
              color: #334155;
            }
            
            .final-analysis-content tr:nth-child(even) {
              background-color: #f8fafc;
            }
            
            .final-analysis-content tr:hover {
              background-color: #f1f5f9;
            }
          `}</style>
          
          {/* 위험성추정 기준 모달 */}
          {showCriteriaModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-auto animate-scaleIn">
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex justify-between items-center z-10">
                  <h2 className="text-2xl font-bold">위험성추정 기준</h2>
                  <button 
                    onClick={toggleCriteriaModal}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    aria-label="닫기"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-6 md:p-8 space-y-8">
                  {/* 위험성 추정(가능성) 구분표 */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">위험성 추정(가능성) 구분표</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-blue-700 text-white">
                            <th className="px-4 py-3 border border-blue-800 text-left">구분</th>
                            <th className="px-4 py-3 border border-blue-800 text-left">가능성</th>
                            <th className="px-4 py-3 border border-blue-800 text-left">내용</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-blue-50">
                            <td className="px-4 py-3 border border-blue-200 font-medium">최상</td>
                            <td className="px-4 py-3 border border-blue-200 text-center">5</td>
                            <td className="px-4 py-3 border border-blue-200">
                              피해가 발생할 가능성이 매우 높음<br />
                              (해당 안전대책이 없거나 미흡하여 피해 발생이 거의 확실함)
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-4 py-3 border border-blue-200 font-medium">상</td>
                            <td className="px-4 py-3 border border-blue-200 text-center">4</td>
                            <td className="px-4 py-3 border border-blue-200">
                              피해가 발생할 가능성이 높음<br />
                              (기존 방호장치 또는 안전장치가 미흡하고, 작업환경이 위험함)
                            </td>
                          </tr>
                          <tr className="bg-blue-50">
                            <td className="px-4 py-3 border border-blue-200 font-medium">중</td>
                            <td className="px-4 py-3 border border-blue-200 text-center">3</td>
                            <td className="px-4 py-3 border border-blue-200">
                              보통 이상의 피해가 발생할 가능성이 있음<br />
                              (기존 방호장치가 있으나 기능이 완전하지 않음)
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-4 py-3 border border-blue-200 font-medium">하</td>
                            <td className="px-4 py-3 border border-blue-200 text-center">2</td>
                            <td className="px-4 py-3 border border-blue-200">
                              피해가 발생할 가능성이 보통<br />
                              (기존 방호장치가 설치되어 있으나 미흡한 부분이 있음)
                            </td>
                          </tr>
                          <tr className="bg-blue-50">
                            <td className="px-4 py-3 border border-blue-200 font-medium">최하</td>
                            <td className="px-4 py-3 border border-blue-200 text-center">1</td>
                            <td className="px-4 py-3 border border-blue-200">
                              피해가 발생할 가능성이 낮음<br />
                              (안전장치가 완벽하게 설치되어 있음)
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* 위험성 추정(중대성) 구분표 */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">위험성 추정(중대성) 구분표</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-blue-700 text-white">
                            <th className="px-4 py-3 border border-blue-800 text-left">구분</th>
                            <th className="px-4 py-3 border border-blue-800 text-left">중대성</th>
                            <th className="px-4 py-3 border border-blue-800 text-left">내용</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-blue-50">
                            <td className="px-4 py-3 border border-blue-200 font-medium">최대</td>
                            <td className="px-4 py-3 border border-blue-200 text-center">4</td>
                            <td className="px-4 py-3 border border-blue-200">사망재해</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-4 py-3 border border-blue-200 font-medium">대</td>
                            <td className="px-4 py-3 border border-blue-200 text-center">3</td>
                            <td className="px-4 py-3 border border-blue-200">휴업 1일 이상의 재해</td>
                          </tr>
                          <tr className="bg-blue-50">
                            <td className="px-4 py-3 border border-blue-200 font-medium">중</td>
                            <td className="px-4 py-3 border border-blue-200 text-center">2</td>
                            <td className="px-4 py-3 border border-blue-200">휴업 1일 미만의 재해</td>
                          </tr>
                          <tr className="bg-white">
                            <td className="px-4 py-3 border border-blue-200 font-medium">소</td>
                            <td className="px-4 py-3 border border-blue-200 text-center">1</td>
                            <td className="px-4 py-3 border border-blue-200">휴업 수반되지 않은 재해</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* 위험성 추정 계산표 (매트릭스) */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">위험성 추정 계산표</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th rowSpan={2} className="px-4 py-3 border border-gray-300 bg-green-100 text-center">구분</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">중대성</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">최대</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">대</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">중</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">소</th>
                          </tr>
                          <tr>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">단계</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">4</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">3</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">2</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">1</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td rowSpan={5} className="px-4 py-3 border border-gray-300 bg-green-100 text-center">가능성</td>
                            <td className="px-4 py-3 border border-gray-300 bg-green-100 text-center">최상<br/>5</td>
                            <td className="px-4 py-3 border border-gray-300 bg-red-600 text-white font-bold text-center">20</td>
                            <td className="px-4 py-3 border border-gray-300 bg-red-300 text-center">15</td>
                            <td className="px-4 py-3 border border-gray-300 bg-orange-300 text-center">10</td>
                            <td className="px-4 py-3 border border-gray-300 bg-green-200 text-center">5</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 border border-gray-300 bg-green-100 text-center">상<br/>4</td>
                            <td className="px-4 py-3 border border-gray-300 bg-red-600 text-white font-bold text-center">16</td>
                            <td className="px-4 py-3 border border-gray-300 bg-orange-300 text-center">12</td>
                            <td className="px-4 py-3 border border-gray-300 bg-yellow-300 text-center">8</td>
                            <td className="px-4 py-3 border border-gray-300 bg-blue-200 text-center">4</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 border border-gray-300 bg-green-100 text-center">중<br/>3</td>
                            <td className="px-4 py-3 border border-gray-300 bg-orange-300 text-center">12</td>
                            <td className="px-4 py-3 border border-gray-300 bg-orange-200 text-center">9</td>
                            <td className="px-4 py-3 border border-gray-300 bg-blue-200 text-center">6</td>
                            <td className="px-4 py-3 border border-gray-300 bg-blue-200 text-center">3</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 border border-gray-300 bg-green-100 text-center">하<br/>2</td>
                            <td className="px-4 py-3 border border-gray-300 bg-yellow-300 text-center">8</td>
                            <td className="px-4 py-3 border border-gray-300 bg-blue-200 text-center">6</td>
                            <td className="px-4 py-3 border border-gray-300 bg-blue-200 text-center">4</td>
                            <td className="px-4 py-3 border border-gray-300 bg-blue-200 text-center">2</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 border border-gray-300 bg-green-100 text-center">최하<br/>1</td>
                            <td className="px-4 py-3 border border-gray-300 bg-blue-200 text-center">4</td>
                            <td className="px-4 py-3 border border-gray-300 bg-blue-200 text-center">3</td>
                            <td className="px-4 py-3 border border-gray-300 bg-blue-200 text-center">2</td>
                            <td className="px-4 py-3 border border-gray-300 bg-blue-200 text-center">1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* 위험성 결정 표 */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">위험성 결정</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                          <tr>
                            <th colSpan={2} className="px-4 py-3 border border-gray-300 bg-green-100 text-center">위험성 크기</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">관리 기준</th>
                            <th className="px-4 py-3 border border-gray-300 bg-green-100 text-center">개선방법</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-3 border border-gray-300 text-center">16~20</td>
                            <td className="px-4 py-3 border border-gray-300 text-center">매우 높음</td>
                            <td className="px-4 py-3 border border-gray-300 text-center" rowSpan={3}>
                              <span className="text-red-600 font-bold">허용 불가능</span>
                            </td>
                            <td className="px-4 py-3 border border-gray-300 text-center">즉시 개선</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 border border-gray-300 text-center">15</td>
                            <td className="px-4 py-3 border border-gray-300 text-center">높음</td>
                            <td className="px-4 py-3 border border-gray-300 text-center">신속하게 개선</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 border border-gray-300 text-center">9~12</td>
                            <td className="px-4 py-3 border border-gray-300 text-center">약간 높음</td>
                            <td className="px-4 py-3 border border-gray-300 text-center">
                              <span className="text-center">가급적 빨리 개선</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 border border-gray-300 text-center">8</td>
                            <td className="px-4 py-3 border border-gray-300 text-center">보통</td>
                            <td className="px-4 py-3 border border-gray-300 text-center">
                              <span className="text-green-600">허용 가능</span>
                            </td>
                            <td className="px-4 py-3 border border-gray-300 text-center">계획적으로 개선</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 border border-gray-300 text-center">4~6</td>
                            <td className="px-4 py-3 border border-gray-300 text-center">낮음</td>
                            <td className="px-4 py-3 border border-gray-300 text-center" rowSpan={2}>
                              <span className="text-green-600">허용 가능</span>
                            </td>
                            <td className="px-4 py-3 border border-gray-300 text-center">필요에 따라 개선</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 border border-gray-300 text-center">1~3</td>
                            <td className="px-4 py-3 border border-gray-300 text-center">매우 낮음</td>
                            <td className="px-4 py-3 border border-gray-300 text-center">현상 유지</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end sticky bottom-0 z-10">
                  <button
                    onClick={toggleCriteriaModal}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 