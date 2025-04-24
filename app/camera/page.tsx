'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Analysis {
  risk_factors: string[];
  engineering_improvements: string[]; // 공학적 개선방안
  management_improvements: string[]; // 관리적 개선방안
  regulations: string[];
  date?: string; // 저장 날짜
  title?: string; // 저장 제목
}

interface RiskAssessmentData {
  processName: string;
  riskFactor: string;
  severity: string;
  probability: string;
  riskLevel: string;
  countermeasure: string;
}

export default function CameraPage() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const [isLawLoading, setIsLawLoading] = useState<{[key: string]: boolean}>({});
  const [showReanalyzeDialog, setShowReanalyzeDialog] = useState(false);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = event.target?.result as string;
          const compressedImage = await compressImage(base64);
          setCapturedImage(compressedImage);
          
          const response = await fetch(compressedImage);
          const blob = await response.blob();
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          
          setImageFile(compressedFile);
          await analyzeImage(compressedFile);
        } catch (error) {
          console.error('이미지 압축/처리 중 오류:', error);
          const errorMessage = error instanceof Error ? error.message : '이미지 처리 중 오류가 발생했습니다.';
          setAnalysisError(`${errorMessage} 새로운 사진으로 다시 시작해주세요.`);
          setCapturedImage(null);
          setImageFile(null);
          setAnalysis(null);
          alert(`이미지 처리 중 오류가 발생했습니다. 새로운 사진으로 다시 시작해주세요.`);
        }
      };
      reader.onerror = () => {
        setAnalysisError('이미지 파일을 읽을 수 없습니다. 새로운 사진으로 다시 시작해주세요.');
        setCapturedImage(null);
        setImageFile(null);
        setAnalysis(null);
        alert('이미지 파일을 읽을 수 없습니다. 새로운 사진으로 다시 시작해주세요.');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('파일 리더 설정 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '파일 처리 중 오류가 발생했습니다.';
      setAnalysisError(`${errorMessage} 새로운 사진으로 다시 시작해주세요.`);
      alert(`파일 처리 중 오류가 발생했습니다. 새로운 사진으로 다시 시작해주세요.`);
    }
  };

  const analyzeImage = async (file: File) => {
    setIsLoading(true);
    setAnalysisError(null);
    try {
      let processedFile = file;
      if (file.type.includes('image/')) {
        try {
          processedFile = await extractStaticImageFromFile(file);
        } catch (conversionError) {
          console.warn('모션포토 변환 시도 중 오류, 원본 파일 사용:', conversionError);
          processedFile = file;
        }
      }

      const formData = new FormData();
      formData.append('image', processedFile);
      formData.append('processName', '현장 사진');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '이미지 분석 중 오류가 발생했습니다.');
      }

      const data = await response.json();
      if (!data.analysis) {
        throw new Error('분석 결과를 받지 못했습니다.');
      }

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.analysis;
      const tables = tempDiv.querySelectorAll('table');
      const analysisData: Analysis = {
        risk_factors: [],
        engineering_improvements: [],
        management_improvements: [],
        regulations: []
      };

      if (tables.length > 0) {
        const rows = tables[0].querySelectorAll('tbody tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 6) {
            const riskFactor = cells[0]?.textContent?.trim();
            const engineeringImprovement = cells[4]?.textContent?.trim();
            const managementImprovement = cells[5]?.textContent?.trim();
            if (riskFactor && !riskFactor.includes('사진에서 발견된 위험성은 없습니다')) 
              analysisData.risk_factors.push(riskFactor);
            if (engineeringImprovement && !engineeringImprovement.includes('추가적인 공학적 안전 조치가 필요하지 않습니다')) 
              analysisData.engineering_improvements.push(engineeringImprovement);
            if (managementImprovement && !managementImprovement.includes('추가적인 관리적 안전 조치가 필요하지 않습니다')) 
              analysisData.management_improvements.push(managementImprovement);
          }
        });

        if (tables.length > 1) {
          const regulationRows = tables[1].querySelectorAll('tbody tr');
          regulationRows.forEach(row => {
            const cell = row.querySelector('td');
            const fullText = cell?.textContent?.trim();
            if (fullText) {
              const lawPattern = /^(.+?(?:법|규칙|규정|고시|지침))\s+(제\d+조(?:\s*제\d+항)?(?:\s*제\d+호)?(?:\([^)]+\))?)/;
              const match = fullText.match(lawPattern);
              if (match) {
                analysisData.regulations.push(`${match[1]} ${match[2]}`);
              } else {
                const firstSentence = fullText.split(/[.。]/)[0].trim();
                const shortenedText = firstSentence.length > 80 ? firstSentence.substring(0, 80) + '...' : firstSentence;
                analysisData.regulations.push(shortenedText);
              }
            }
          });
        }
      }
      setAnalysis(analysisData);
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage = error.message || '이미지 분석 중 오류가 발생했습니다.';
      setAnalysisError(`${errorMessage} 새로운 사진으로 다시 시작해주세요.`);
      setAnalysis(null);
      alert(`${errorMessage} 새로운 사진으로 다시 시작해주세요.`);
    } finally {
      setIsLoading(false);
    }
  };

  const extractStaticImageFromFile = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      try {
        const url = URL.createObjectURL(file);
        const img: HTMLImageElement = document.createElement('img');
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              URL.revokeObjectURL(url);
              return reject(new Error('Canvas 컨텍스트를 생성할 수 없습니다. 일반 사진으로 다시 시도해주세요.'));
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (!blob) {
                URL.revokeObjectURL(url);
                return reject(new Error('이미지 변환에 실패했습니다. 다른 형식의 사진을 시도해주세요.'));
              }
              const convertedFile = new File([blob], file.name, { 
                type: 'image/jpeg',
                lastModified: file.lastModified 
              });
              URL.revokeObjectURL(url);
              resolve(convertedFile);
            }, 'image/jpeg', 0.95);
          } catch (error) {
            URL.revokeObjectURL(url);
            const errorMessage = error instanceof Error ? `이미지 변환 중 오류: ${error.message}` : '이미지 변환 중 알 수 없는 오류가 발생했습니다.';
            reject(new Error(`${errorMessage} 다른 사진으로 다시 시도해주세요.`));
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('이미지를 로드할 수 없습니다. 유효한 이미지 파일인지 확인하고 다시 시도해주세요.'));
        };
        img.src = url;
      } catch (error) {
        const errorMessage = error instanceof Error ? `이미지 처리 중 오류: ${error.message}` : '이미지 처리 중 알 수 없는 오류가 발생했습니다.';
        reject(new Error(`${errorMessage} 다른 사진으로 다시 시도해주세요.`));
      }
    });
  };

  const handleReanalyzeClick = () => {
    setShowReanalyzeDialog(true);
  };
  
  const reanalyzeCurrentImage = async () => {
    setShowReanalyzeDialog(false);
    if (!imageFile && !capturedImage) {
      alert('분석할 이미지가 없습니다. 먼저 사진을 촬영해주세요.');
      return;
    }
    if (imageFile) {
      await analyzeImage(imageFile);
    } else if (capturedImage) {
      try {
        const response = await fetch(capturedImage);
        const blob = await response.blob();
        const file = new File([blob], "recaptured-image.jpg", { type: 'image/jpeg' });
        setImageFile(file);
        await analyzeImage(file);
      } catch (error) {
        console.error("이미지 변환 중 오류 발생:", error);
        setAnalysisError("이미지를 다시 분석할 수 없습니다. 새 이미지를 촬영해주세요.");
      }
    }
  };
  
  const reanalyzeWithNewImage = () => {
    setShowReanalyzeDialog(false);
    setCapturedImage(null);
    setImageFile(null);
    setAnalysis(null);
    setAnalysisError(null);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }, 100);
  };
  
  const renderReanalyzeDialog = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800">분석 방법 선택</h3>
          <p className="text-gray-600 mb-6">현재 사진으로 다시 분석하시겠습니까, 아니면 새로운 사진을 선택하시겠습니까?</p>
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={reanalyzeCurrentImage}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              현재 사진으로 다시 분석
            </button>
            <button
              onClick={reanalyzeWithNewImage}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              새로운 사진으로 분석
            </button>
            <button
              onClick={() => setShowReanalyzeDialog(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  };

  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const convertToRiskAssessmentData = (analysis: Analysis, processName: string = '현장 작업'): RiskAssessmentData[] => {
    const result: RiskAssessmentData[] = [];
    if (!analysis.risk_factors || analysis.risk_factors.length === 0) {
      return result;
    }
    analysis.risk_factors.forEach((riskFactor, index) => {
      const engineeringImprovement = analysis.engineering_improvements[index] || '';
      const managementImprovement = analysis.management_improvements[index] || '';
      let countermeasure = '';
      if (engineeringImprovement && managementImprovement) {
        countermeasure = `[공학적] ${engineeringImprovement} [관리적] ${managementImprovement}`;
      } else if (engineeringImprovement) {
        countermeasure = `[공학적] ${engineeringImprovement}`;
      } else if (managementImprovement) {
        countermeasure = `[관리적] ${managementImprovement}`;
      }
      result.push({
        processName,
        riskFactor,
        severity: '3', 
        probability: '3', 
        riskLevel: '중간', 
        countermeasure
      });
    });
    return result;
  };

  const openLawInfo = async (regulation: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLawLoading[regulation]) return;
    setIsLawLoading(prev => ({...prev, [regulation]: true}));
    try {
      const lawPattern = /^(.+?(?:법|규칙|규정|고시|지침))\s+제(\d+)조(?:제(\d+)항)?(?:제(\d+)호)?(?:\([^)]+\))?/;
      const match = regulation.match(lawPattern);
      if (match) {
        const lawName = match[1];
        const articleNumber = match[2];
        let url = `https://law.go.kr/법령/${encodeURIComponent(lawName)}`;
        if (articleNumber) {
          const fullArticle = `제${articleNumber}조`;
          url += `/${encodeURIComponent(fullArticle)}`;
          if (match[3]) url += `#${match[3]}`;
        }
        window.open(url, '_blank');
      } else {
        const response = await fetch(`/api/law?text=${encodeURIComponent(regulation)}`);
        if (!response.ok) throw new Error('API 호출 실패');
        const data = await response.json();
        if (data && data.url) {
          window.open(data.url, '_blank');
        } else {
          const lawNameMatch = regulation.match(/^(.+?(?:법|규칙|규정|고시|지침))/);
          const lawName = lawNameMatch ? lawNameMatch[1] : regulation.split(' ')[0];
          const simpleSearchUrl = `https://law.go.kr/법령/${encodeURIComponent(lawName)}`;
          window.open(simpleSearchUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('법령정보 조회 중 오류:', error);
      alert('법령정보를 조회할 수 없습니다. 국가법령정보센터로 이동합니다.');
      const lawNameMatch = regulation.match(/^(.+?(?:법|규칙|규정|고시|지침))/);
      const lawName = lawNameMatch ? lawNameMatch[1] : (regulation.split(' ')[0] || '산업안전보건법');
      window.open(`https://law.go.kr/법령/${encodeURIComponent(lawName)}`, '_blank');
    } finally {
      setIsLawLoading(prev => ({...prev, [regulation]: false}));
    }
  };

  const renderAnalysisTable = (analysis: Analysis) => {
    if (!analysis) return null;
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            위험 요인
          </h3>
          <div className="pl-4">
            <ul className="list-disc list-inside space-y-3">
              {analysis.risk_factors && analysis.risk_factors.length > 0 ? (
                analysis.risk_factors.map((factor, index) => (
                  <li key={index} className="text-gray-700">{factor}</li>
                ))
              ) : (
                <li className="text-gray-500">식별된 위험 요인이 없습니다.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            공학적 개선방안
          </h3>
          <div className="pl-4">
            <ul className="list-disc list-inside space-y-3">
              {analysis.engineering_improvements && analysis.engineering_improvements.length > 0 ? (
                analysis.engineering_improvements.map((improvement, index) => (
                  <li key={index} className="text-gray-700">{improvement}</li>
                ))
              ) : (
                <li className="text-gray-500">제안된 공학적 개선 방안이 없습니다.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            관리적 개선방안
          </h3>
          <div className="pl-4">
            <ul className="list-disc list-inside space-y-3">
              {analysis.management_improvements && analysis.management_improvements.length > 0 ? (
                analysis.management_improvements.map((improvement, index) => (
                  <li key={index} className="text-gray-700">{improvement}</li>
                ))
              ) : (
                <li className="text-gray-500">제안된 관리적 개선 방안이 없습니다.</li>
              )}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">관련 규정 <span className="text-sm font-normal text-gray-500">(최신 법령과 다를 수 있습니다.)</span></h3>
          <div className="bg-white rounded-lg shadow-md p-5">
            <ul className="space-y-3 pl-4">
              {analysis.regulations && analysis.regulations.length > 0 ? (
                analysis.regulations.map((regulation: string, index: number) => (
                  <li key={index} className="text-gray-700 relative pl-2">
                    <a href="#" onClick={(e) => openLawInfo(regulation, e)} className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline">
                      <span>{regulation}</span>
                      {isLawLoading[regulation] && (
                        <span className="ml-2 inline-block"><svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></span>
                      )}
                    </a>
                    <div className="absolute left-[-20px] top-0 opacity-50 pointer-events-none">•</div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 relative pl-2">
                  <span>관련 규정이 없습니다.</span>
                  <div className="absolute left-[-20px] top-0 opacity-50 pointer-events-none">•</div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const compressImage = async (
    imageDataUrl: string, 
    options: { maxWidth?: number; quality?: number; maxSize?: number } = {}
  ): Promise<string> => {
    const { 
      maxWidth = 600,
      quality = 0.3,
      maxSize = 4 * 1024 * 1024 // 4MB
    } = options;

    return new Promise<string>((resolve, reject) => {
      try {
        const img: HTMLImageElement = document.createElement('img');
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              return reject(new Error('이미지 압축을 위한 Canvas 컨텍스트를 생성할 수 없습니다. 다른 사진으로 다시 시도해주세요.'));
            }
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            const base64Size = Math.ceil((compressedDataUrl.length * 3) / 4);
            if (base64Size > maxSize) {
              return resolve(compressImage(imageDataUrl, { 
                maxWidth: maxWidth - 100,
                quality: quality - 0.1,
                maxSize 
              }));
            }
            resolve(compressedDataUrl);
          } catch (error) {
            const errorMessage = error instanceof Error ? `이미지 압축 중 오류: ${error.message}` : '이미지 압축 중 알 수 없는 오류가 발생했습니다.';
            reject(new Error(`${errorMessage} 다른 사진으로 다시 시도해주세요.`));
          }
        };
        img.onerror = () => {
          reject(new Error('이미지 압축을 위한 이미지 로드에 실패했습니다. 유효한 이미지 파일인지 확인하고 다시 시도해주세요.'));
        };
        img.src = imageDataUrl;
      } catch (error) {
        const errorMessage = error instanceof Error ? `이미지 압축 과정 중 오류: ${error.message}` : '이미지 압축 과정 중 알 수 없는 오류가 발생했습니다.';
        reject(new Error(`${errorMessage} 다른 사진으로 다시 시도해주세요.`));
      }
    });
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = event.target?.result as string;
          const compressedImage = await compressImage(base64);
          setCapturedImage(compressedImage);
          const response = await fetch(compressedImage);
          const blob = await response.blob();
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          setImageFile(compressedFile);
          await analyzeImage(compressedFile);
        } catch (error) {
          console.error('드롭된 이미지 압축/처리 중 오류:', error);
          const errorMessage = error instanceof Error ? error.message : '이미지 처리 중 오류가 발생했습니다.';
          setAnalysisError(`${errorMessage} 새로운 사진으로 다시 시작해주세요.`);
          setCapturedImage(null);
          setImageFile(null);
          setAnalysis(null);
          alert(`이미지 처리 중 오류가 발생했습니다. 새로운 사진으로 다시 시작해주세요.`);
        }
      };
      reader.onerror = () => {
        setAnalysisError('이미지 파일을 읽을 수 없습니다. 새로운 사진으로 다시 시작해주세요.');
        setCapturedImage(null);
        setImageFile(null);
        setAnalysis(null);
        alert('이미지 파일을 읽을 수 없습니다. 새로운 사진으로 다시 시작해주세요.');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('드롭된 파일 리더 설정 중 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '파일 처리 중 오류가 발생했습니다.';
      setAnalysisError(`${errorMessage} 새로운 사진으로 다시 시작해주세요.`);
      alert(`파일 처리 중 오류가 발생했습니다. 새로운 사진으로 다시 시작해주세요.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
              AI SAFETY 서비스
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push('/assessment')}
                className="px-4 py-2 rounded-md font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                위험성평가 생성기
              </button>
              <button
                onClick={() => router.push('/camera')}
                className="px-4 py-2 rounded-md font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-colors"
              >
                사진 위험점 분석
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">사진 위험점 분석</h1>
          <p className="mt-2 text-lg text-gray-600">작업 현장 사진을 업로드하면 AI가 위험 요소를 분석해줍니다</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="w-full mb-8">
              <div 
                className={`rounded-lg p-5 border-2 ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50 border-dashed animate-pulse' 
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                } transition-colors cursor-pointer shadow-sm`}
                onClick={openCamera}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCapture}
                  ref={fileInputRef}
                  className="hidden"
                />
                {capturedImage ? (
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={capturedImage}
                      alt="Captured"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className={`aspect-[4/3] ${isDragging ? 'bg-blue-100' : 'bg-gray-200'} rounded-lg flex flex-col items-center justify-center transition-colors`}>
                    {isDragging ? (
                      <>
                        <svg className="w-20 h-20 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <p className="text-blue-600 text-center font-medium">이미지를 여기에 놓으세요</p>
                      </>
                    ) : (
                      <>
                        <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <p className="text-gray-500 text-center text-sm">클릭하여 사진을 첨부하거나 파일을 여기에 끌어다 놓으세요</p>
                      </>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">지원 형식: JPG, PNG, GIF 등 주요 이미지 파일 (최대 10MB)</p>
            </div>

            <div className="w-full">
              {isLoading ? (
                <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[200px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-base text-gray-700">이미지 분석 중...</p>
                </div>
              ) : analysis ? (
                <div id="current-analysis-content" className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6">
                  {renderAnalysisTable(analysis)}
                  <div className="mt-6 flex justify-center space-x-4">
                    <button
                      onClick={handleReanalyzeClick}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-green-800 transition-colors flex items-center justify-center shadow-md"
                      disabled={isLoading}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      다시 분석하기
                    </button>
                  </div>
                </div>
              ) : analysisError ? (
                <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <svg className="w-12 h-12 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-red-600 text-sm mb-4">{analysisError}</p>
                  <button onClick={reanalyzeWithNewImage} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    새 사진으로 다시 시작
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-gray-600 text-sm">사진을 첨부하면 AI가 자동으로 위험 요소를 분석하여 표시합니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showReanalyzeDialog && renderReanalyzeDialog()}
    </div>
  );
} 