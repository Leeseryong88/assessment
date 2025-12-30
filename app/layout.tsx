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
  title: '스마트 위험성 평가 시스템 | AI Riska',
  description: 'AI 기술을 활용한 실시간 현장 위험 요소 분석 및 스마트 위험성 평가 솔루션',
  keywords: '위험성평가, AI 안전, 건설현장 안전, 산업안전, 이미지 분석, Gemini AI',
  authors: [{ name: 'AI Riska' }],
  openGraph: {
    title: '스마트 위험성 평가 시스템',
    description: 'AI가 실시간으로 현장의 위험 요소를 분석하고 최적의 안전 대책을 제안합니다.',
    url: 'https://www.ai-riska.com',
    siteName: 'AI Riska',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '스마트 위험성 평가 시스템 대표 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '스마트 위험성 평가 시스템',
    description: 'AI 기반 실시간 현장 위험 요소 분석 솔루션',
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