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
  title: 'AI-riska | 사진분석·위험성평가 무료 이용',
  description:
    'AI-riska에서 사진분석과 위험성평가를 계속 이용하세요. 안전보건계획서·TBM 등 일부 기능은 「모두의 안전」(modu-safe.com)으로 이전되었습니다.',
  keywords:
    '위험성평가, 사진분석, AI 안전, 건설현장 안전, 산업안전, 이미지 분석, Gemini AI, 안전관리, 모두의 안전, modu-safe, AI-riska',
  authors: [{ name: 'AI Riska' }],
  icons: {
    icon: '/brand-icon.png',
    shortcut: '/brand-icon.png',
    apple: '/brand-icon.png',
  },
  openGraph: {
    title: 'AI-riska | 사진분석·위험성평가 무료 이용',
    description:
      '사진분석과 위험성평가는 계속 이용 가능합니다. 일부 기능은 모두의 안전(modu-safe.com)으로 이전되었습니다.',
    url: 'https://www.ai-riska.com',
    siteName: 'AI Riska',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI-riska 사진분석·위험성평가',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-riska | 사진분석·위험성평가 무료 이용',
    description:
      '사진분석·위험성평가는 계속 이용 가능. 일부 기능은 modu-safe.com으로 이전.',
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
