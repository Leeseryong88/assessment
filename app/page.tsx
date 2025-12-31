'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 모바일 기기 감지 함수
    const isMobileDevice = () => {
      if (typeof window === 'undefined') return false;
      
      // 화면 너비로 모바일 감지 (768px 미만은 모바일로 간주)
      const isMobileWidth = window.innerWidth < 768;
      
      // UserAgent로 모바일 기기 감지 (추가적인 확인)
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isMobileAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|mobi/i.test(userAgent);
      
      // 터치 지원 여부 확인
      const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // 화면 너비가 작거나, 모바일 에이전트이면서 터치를 지원하면 모바일로 판단
      return isMobileWidth || (isMobileAgent && hasTouchSupport);
    };

    // 기기 타입에 따라 리디렉션
    if (isMobileDevice()) {
      router.replace('/camera');
    } else {
      router.replace('/assessment');
    }
    
    // 리디렉션 후 로딩 상태 업데이트
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [router]);

  // 간단한 로딩 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }
  return null;
} 
