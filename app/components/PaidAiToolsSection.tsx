import { PAID_AI_TOOLS, VOUCHER_DURATION } from '../lib/migration';

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

type PaidAiToolsSectionProps = {
  voucherActive?: boolean;
  heading?: 'h2' | 'h3';
};

export default function PaidAiToolsSection({
  voucherActive = false,
  heading = 'h3',
}: PaidAiToolsSectionProps) {
  const HeadingTag = heading;

  return (
    <section className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
      <div className="mb-3">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          {voucherActive ? (
            <span className="inline-flex rounded-full bg-sky-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
              이용권 적용
            </span>
          ) : null}
          <HeadingTag className="text-base font-black text-slate-950">
            {voucherActive ? '이용권으로 사용할 수 있는 기능' : '모두의 안전에서 이어서 이용하세요'}
          </HeadingTag>
        </div>
        <p className="text-[12px] font-semibold leading-5 text-slate-600">
          {voucherActive
            ? `모두의 안전 유료 AI 기능입니다. 이용권 등록 후 ${VOUCHER_DURATION}간 이용할 수 있습니다.`
            : '이전된 기능과 AI 서비스를 한곳에서 이용할 수 있습니다.'}
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {PAID_AI_TOOLS.map((item) => (
          <li key={item.title} className="flex items-start gap-2 text-[13px] font-semibold text-slate-700">
            <CheckIcon />
            <span>
              <span className="font-black text-slate-900">{item.title}</span>
              {item.desc ? <span className="text-slate-500"> · {item.desc}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
