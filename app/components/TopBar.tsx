'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ContactModal from './ContactModal';

export default function TopBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAiDropdownOpen, setIsAiDropdownOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const aiDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target as Node)) {
        setIsAiDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAssessmentActive = pathname === '/assessment';
  const isCameraActive = pathname === '/camera';
  const isPlanActive = pathname === '/health-safety-plan';
  const isBoardActive = pathname === '/board';

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div 
            className="flex items-center gap-1 md:gap-2 cursor-pointer shrink-0" 
            onClick={() => router.push('/assessment')}
          >
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-base md:text-2xl font-black tracking-tighter text-gray-900 whitespace-nowrap">
              AI <span className="text-blue-600 uppercase">Safety</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-0.5 md:gap-3 bg-gray-100/50 p-1 md:p-1.5 rounded-2xl ml-auto">
            {/* AI 분석 드롭다운 */}
            <div className="relative shrink-0" ref={aiDropdownRef}>
              <button
                onClick={() => setIsAiDropdownOpen(!isAiDropdownOpen)}
                className={`px-2 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-sm font-black transition-all duration-300 flex items-center gap-0.5 md:gap-2 whitespace-nowrap ${
                  isAssessmentActive || isCameraActive || isPlanActive 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                AI 분석
                <svg className={`w-2 h-2 md:w-3 md:h-3 transition-transform duration-300 ${isAiDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isAiDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 md:w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-[70] animate-fadeIn overflow-hidden">
                  <button
                    onClick={() => {
                      router.push('/camera');
                      setIsAiDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-xs md:text-sm font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 ${isCameraActive ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    사진분석
                  </button>
                  <button
                    onClick={() => {
                      router.push('/assessment');
                      setIsAiDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-xs md:text-sm font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 ${isAssessmentActive ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    위험성평가
                  </button>
                  <button
                    onClick={() => {
                      router.push('/health-safety-plan');
                      setIsAiDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-xs md:text-sm font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 ${isPlanActive ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600'}`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="whitespace-nowrap">안전보건계획서</span>
                    <span className="ml-auto px-1 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black rounded uppercase leading-none shrink-0">beta</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push('/safety-management-fee');
                      setIsAiDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-xs md:text-sm font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 ${pathname === '/safety-management-fee' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-600'}`}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] md:text-[13px] whitespace-nowrap leading-tight">안전보건관리비 계획서</span>
                      <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-600 text-[8px] font-black rounded uppercase leading-none shrink-0">beta</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 게시판 버튼 */}
            <button
              onClick={() => router.push('/board')}
              className={`px-2 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-sm font-black transition-all duration-300 whitespace-nowrap shrink-0 ${
                isBoardActive 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              게시판
            </button>

            {/* 문의하기 버튼 */}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-2 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-sm font-black text-gray-400 hover:text-gray-600 transition-all duration-300 whitespace-nowrap shrink-0"
            >
              문의하기
            </button>
          </div>
        </div>
      </div>

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
}

