'use client';

import { isVoucherOfferActive } from './migration';

/** 이용권 쿠폰 안내 표시 여부 (2026-09-30 23:59:59 KST까지) */
export function useVoucherOfferActive() {
  return isVoucherOfferActive();
}
