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
  title: 'AI-riska | 사진분석 하루 1회 무료',
  description:
    'AI-riska에서 사진분석은 하루 1회 무료로 이용할 수 있습니다. 위험성평가 무료 이용은 26/10/16일부로 종료되었고, 「모두의 안전」(modu-safe.com)에서 이용할 수 있습니다.',
  keywords:
    '위험성평가, 사진분석, AI 안전, 건설현장 안전, 산업안전, 이미지 분석, Gemini AI, 안전관리, 모두의 안전, modu-safe, AI-riska',
  authors: [{ name: 'AI Riska' }],
  icons: {
    icon: '/brand-icon.png',
    shortcut: '/brand-icon.png',
    apple: '/brand-icon.png',
  },
  openGraph: {
    title: 'AI-riska | 사진분석 하루 1회 무료',
    description:
      '사진분석은 하루 1회 무료로 이용할 수 있습니다. 위험성평가 무료 이용은 26/10/16일부로 종료되었습니다.',
    url: 'https://www.ai-riska.com',
    siteName: 'AI Riska',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI-riska 사진분석',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-riska | 사진분석 하루 1회 무료',
    description:
      '사진분석은 하루 1회 무료. 위험성평가 무료 이용은 26/10/16일부로 종료.',
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
