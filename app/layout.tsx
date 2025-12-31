import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ai-riska.com'),
  title: '스마트 AI 위험성평가 | 중대재해처벌법 완벽 대응 솔루션',
  description: '번거로운 위험성평가, 이제 AI로 자동화하세요. 현장 사진 한 장으로 위험요소 발굴부터 개선대책 수립까지 10초 만에 완료합니다. PDF/엑셀 보고서 즉시 생성.',
  keywords: '위험성평가, AI 안전, 건설현장 안전, 산업안전, 이미지 분석, Gemini AI, 중대재해처벌법, 안전진단',
  authors: [{ name: 'AI Riska' }],
  openGraph: {
    title: '스마트 AI 위험성평가 | 중대재해처벌법 완벽 대응 솔루션',
    description: '현장 사진 한 장으로 위험요소 발굴부터 개선대책 수립까지 10초 만에 완료! AI로 스마트한 안전 관리를 시작하세요.',
    url: 'https://www.ai-riska.com',
    siteName: 'AI Riska',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '스마트 AI 위험성평가 시스템 대표 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '스마트 AI 위험성평가 | 중대재해처벌법 완벽 대응 솔루션',
    description: 'AI가 실시간으로 현장의 위험 요소를 분석하고 최적의 안전 대책을 제안합니다.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1617599022667185" />
      </head>
      <body className={inter.className}>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1617599022667185"
          crossOrigin="anonymous"
        />
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
} 