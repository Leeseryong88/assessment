'use client';

import { isVoucherOfferActive } from './migration';

/** 이용권 쿠폰 안내 표시 여부 (2026-09-01 00:00:00 KST 이전까지) */
export function useVoucherOfferActive() {
  return isVoucherOfferActive();
}
