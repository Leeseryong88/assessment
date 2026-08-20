export type DailyUsageFeature = 'camera' | 'assessment';

const STORAGE_KEY = 'airiska-daily-usage';

export function getKstDateString() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function readUsage(): Partial<Record<DailyUsageFeature, string>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Partial<Record<DailyUsageFeature, string>>;
  } catch {
    return {};
  }
}

export function hasUsedToday(feature: DailyUsageFeature) {
  return readUsage()[feature] === getKstDateString();
}

export function markUsedToday(feature: DailyUsageFeature) {
  if (typeof window === 'undefined') return;
  try {
    const next = { ...readUsage(), [feature]: getKstDateString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage may be unavailable
  }
}
