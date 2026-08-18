'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MigrationBanner from './MigrationBanner';

export default function TopBar() {
  const pathname = usePathname();
  const showCompactBanner = pathname === '/camera' || pathname === '/assessment';

  return (
    <>
      {showCompactBanner && <MigrationBanner compact />}
      <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex h-16 items-center md:h-20">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-1 transition hover:opacity-80 md:gap-2"
              aria-label="홈으로 이동"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-200 md:h-8 md:w-8">
                <svg className="h-3.5 w-3.5 text-white md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="whitespace-nowrap text-base font-black tracking-tighter text-gray-900 md:text-2xl">
                AI <span className="uppercase text-blue-600">Safety</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
