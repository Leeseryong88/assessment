'use client';

import React, { useRef, useState } from 'react';
import TopBar from '../components/TopBar';
import OpenKakaoCta from '../components/OpenKakaoCta';
import {
  CheckIcon,
  DocumentDownloadIcon,
  PencilIcon,
  RefreshIcon,
  XIcon,
} from '../components/Icons';

type BasicInfo = {
  date: string;
  weather: string;
  site: string;
  workTime: string;
  workName: string;
  workerCount: string;
  leader: string;
  workContent: string;
};

type Risk = {
  hazard: string;
  measure: string;
};

type TbmData = {
  risks: Risk[];
  educationContent: string;
  ppe: string[];
  notes: string;
  warning?: string;
};

type TbmSettings = {
  signatureCount: number;
  riskCount: number;
  riskHint: string;
  approvalEnabled: boolean;
  approvalCount: number;
  approvalNames: string[];
};

const WEATHER_OPTIONS = ['맑음', '흐림', '비', '눈', '폭염', '한파', '바람'];
const APPROVAL_DEFAULT_NAMES = ['담당', '검토', '승인', '확인'];
const EMPTY_TBM: TbmData = {
  risks: [],
  educationContent: '',
  ppe: [],
  notes: '',
};

const SHEET_CSS = `
@page { size: A4 portrait; margin: 8mm; }
:root {
  --tbm-print-scale: 1;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #f3f4f6;
  color: #111827;
  font-family: "Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif;
}
.tbm-print-root {
  width: 194mm;
  margin: 0 auto;
  transform: scale(var(--tbm-print-scale));
  transform-origin: top center;
}
.tbm-sheet {
  width: 194mm;
  min-height: 281mm;
  padding: 0;
  background: #ffffff;
  color: #111827;
  font-family: "Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif;
  font-size: 10.4px;
  line-height: 1.28;
  letter-spacing: 0;
}
.tbm-sheet table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.tbm-sheet th,
.tbm-sheet td {
  border: 1px solid #111827;
  padding: 3.2px 4px;
  vertical-align: middle;
  word-break: keep-all;
  overflow-wrap: anywhere;
}
.tbm-sheet th {
  background: #e5e7eb;
  font-weight: 700;
  text-align: center;
}
.tbm-top {
  min-height: 23mm;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}
.tbm-approval {
  display: grid;
  grid-template-columns: 8mm auto;
  width: max-content;
}
.tbm-approval-label {
  border: 1px solid #111827;
  border-right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  line-height: 1.1;
  background: #f3f4f6;
}
.tbm-approval table {
  width: auto;
  table-layout: fixed;
}
.tbm-approval th {
  width: 14mm;
  height: 7mm;
  padding: 2px;
  text-align: center;
}
.tbm-approval td {
  width: 14mm;
  height: 14mm;
  padding: 2px;
  text-align: center;
}
.tbm-title-block {
  text-align: center;
  margin-bottom: 3.5mm;
}
.tbm-title-block h1 {
  margin: 0;
  font-size: 21px;
  line-height: 1.1;
  font-weight: 800;
}
.tbm-title-block p {
  margin: 2px 0 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0;
}
.tbm-info-table th {
  width: 23mm;
}
.tbm-info-table td {
  height: 8mm;
}
.tbm-section {
  margin-top: 2.6mm;
}
.tbm-section-title {
  border: 1px solid #111827;
  border-bottom: 0;
  background: #d1d5db;
  padding: 3px 5px;
  font-weight: 800;
}
.tbm-box {
  border: 1px solid #111827;
  min-height: 17mm;
  padding: 5px 6px;
  white-space: pre-wrap;
}
.tbm-risk-table .tbm-risk-no {
  width: 8mm;
  text-align: center;
}
.tbm-risk-table td {
  height: 12mm;
}
.tbm-education {
  min-height: 27mm;
}
.tbm-ppe-notes th {
  width: 24mm;
}
.tbm-ppe-notes td {
  height: 19mm;
}
.tbm-sign-table th {
  height: 7mm;
}
.tbm-sign-table td {
  height: 10mm;
  padding: 2px 3px;
}
.tbm-sign-name {
  width: 15%;
}
.tbm-sign-box {
  width: 18.33%;
}
.tbm-placeholder {
  color: #6b7280;
  text-align: center;
  font-weight: 700;
}
.tbm-warning {
  margin-top: 2mm;
  padding: 3px 4px;
  border: 1px solid #f59e0b;
  background: #fffbeb;
  color: #92400e;
  font-size: 9.5px;
}
html.tbm-sign-compact-1 .tbm-sign-table td {
  height: 8mm;
}
html.tbm-sign-compact-2 .tbm-sign-table td {
  height: 6.5mm;
  padding-top: 1px;
  padding-bottom: 1px;
}
html.tbm-print-compact .tbm-sheet {
  font-size: 9.6px;
  line-height: 1.22;
}
html.tbm-print-compact .tbm-sheet th,
html.tbm-print-compact .tbm-sheet td {
  padding: 2px 3px;
}
html.tbm-print-compact .tbm-box {
  min-height: 14mm;
  padding: 3px 4px;
}
@media print {
  html, body {
    width: 194mm;
    height: 281mm;
    margin: 0;
    overflow: hidden;
    background: #ffffff;
  }
  body {
    display: block;
  }
  .tbm-print-root {
    width: 194mm;
    height: 281mm;
    margin: 0 auto;
    overflow: hidden;
    break-after: avoid-page;
    page-break-after: avoid;
  }
  .tbm-sheet {
    height: 281mm;
    min-height: 0;
    overflow: hidden;
    box-shadow: none;
    break-after: avoid-page;
    page-break-after: avoid;
  }
}
`;

function todayString() {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function clampNumber(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function emptyRisks(count: number) {
  return Array.from({ length: count }, () => ({ hazard: '', measure: '' }));
}

function escapeHtml(value: string | number | undefined | null) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toMultilineHtml(value: string | undefined | null) {
  return escapeHtml(value || '').replace(/\r?\n/g, '<br />');
}

function formatPpe(ppe: string[]) {
  return ppe.length > 0 ? ppe.join(', ') : '';
}

function buildSignatureRows(count: number) {
  const rows = Math.ceil(count / 3);
  let current = 0;
  let html = '';

  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    html += '<tr class="tbm-sign-row">';
    for (let colIndex = 0; colIndex < 3; colIndex += 1) {
      current += 1;
      if (current <= count) {
        const nameLabel = rowIndex === 0 ? '성명' : '&nbsp;';
        const signLabel = rowIndex === 0 ? '서명' : '&nbsp;';
        html += `<td class="tbm-sign-name">${nameLabel}</td><td class="tbm-sign-box">${signLabel}</td>`;
      } else {
        html += `<td class="tbm-sign-name">&nbsp;</td><td class="tbm-sign-box">&nbsp;</td>`;
      }
    }
    html += '</tr>';
  }

  return html;
}

function buildApprovalHtml(settings: TbmSettings) {
  if (!settings.approvalEnabled) return '';

  const names = settings.approvalNames
    .slice(0, settings.approvalCount)
    .map((name, index) => escapeHtml(name.trim() || APPROVAL_DEFAULT_NAMES[index]))
    .join('</th><th>');

  const boxes = Array.from({ length: settings.approvalCount }, () => '<td>&nbsp;</td>').join('');

  return `
    <div class="tbm-approval">
      <div class="tbm-approval-label">결<br />재</div>
      <table aria-label="결재란">
        <thead><tr><th>${names}</th></tr></thead>
        <tbody><tr>${boxes}</tr></tbody>
      </table>
    </div>
  `;
}

function buildTbmSheetHtml(basic: BasicInfo, data: TbmData, settings: TbmSettings) {
  const risksHtml = data.risks.length > 0
    ? data.risks.map((risk, index) => `
      <tr>
        <td class="tbm-risk-no">${index + 1}</td>
        <td>${toMultilineHtml(risk.hazard)}</td>
        <td>${toMultilineHtml(risk.measure)}</td>
      </tr>
    `).join('')
    : `<tr><td colspan="3" class="tbm-placeholder">금일 작업내용 입력 후 TBM을 생성하거나 수기로 작성하세요.</td></tr>`;

  const ppeText = formatPpe(data.ppe);

  return `
    <section class="tbm-sheet" aria-label="작업 전 안전점검회의 TBM 일지">
      <div class="tbm-top">${buildApprovalHtml(settings)}</div>

      <div class="tbm-title-block">
        <h1>작업 전 안전점검회의 (TBM) 일지</h1>
        <p>TOOL BOX MEETING</p>
      </div>

      <table class="tbm-info-table" aria-label="기본 정보">
        <tbody>
          <tr>
            <th>작성일자</th>
            <td>${escapeHtml(basic.date)}</td>
            <th>날씨</th>
            <td>${escapeHtml(basic.weather)}</td>
          </tr>
          <tr>
            <th>현장/장소</th>
            <td colspan="3">${escapeHtml(basic.site)}</td>
          </tr>
          <tr>
            <th>작업시간</th>
            <td>${escapeHtml(basic.workTime)}</td>
            <th>작업인원</th>
            <td>${escapeHtml(basic.workerCount)}</td>
          </tr>
          <tr>
            <th>공종/작업명</th>
            <td>${escapeHtml(basic.workName)}</td>
            <th>진행자</th>
            <td>${escapeHtml(basic.leader)}</td>
          </tr>
        </tbody>
      </table>

      <div class="tbm-section">
        <div class="tbm-section-title">금일 작업내용</div>
        <div class="tbm-box">${toMultilineHtml(basic.workContent)}</div>
      </div>

      <div class="tbm-section">
        <div class="tbm-section-title">주요 위험요인 및 안전대책</div>
        <table class="tbm-risk-table" aria-label="주요 위험요인 및 안전대책">
          <thead>
            <tr>
              <th class="tbm-risk-no">No</th>
              <th>위험요인</th>
              <th>안전대책</th>
            </tr>
          </thead>
          <tbody>${risksHtml}</tbody>
        </table>
      </div>

      <div class="tbm-section">
        <div class="tbm-section-title">교육내용</div>
        <div class="tbm-box tbm-education">${toMultilineHtml(data.educationContent)}</div>
      </div>

      <div class="tbm-section">
        <table class="tbm-ppe-notes" aria-label="개인보호구 및 특이사항">
          <tbody>
            <tr>
              <th>개인보호구</th>
              <td>${escapeHtml(ppeText)}</td>
              <th>특이사항<br />건의사항</th>
              <td>${toMultilineHtml(data.notes)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="tbm-section">
        <div class="tbm-section-title">참석자 확인</div>
        <table class="tbm-sign-table" aria-label="참석자 확인">
          <tbody>${buildSignatureRows(settings.signatureCount)}</tbody>
        </table>
      </div>

      ${data.warning ? `<div class="tbm-warning">${escapeHtml(data.warning)}</div>` : ''}
    </section>
  `;
}

function buildPrintHtml(sheetHtml: string) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <title>작업 전 안전점검회의 TBM 일지</title>
  <style>${SHEET_CSS}</style>
</head>
<body>
  <div class="tbm-print-root">${sheetHtml}</div>
  <script>
    (function () {
      function compactSignRows() {
        var rows = document.querySelectorAll('.tbm-sign-row').length;
        if (rows >= 7) document.documentElement.classList.add('tbm-sign-compact-1');
        if (rows >= 9) document.documentElement.classList.add('tbm-sign-compact-2');
      }

      function fitToA4() {
        var sheet = document.querySelector('.tbm-sheet');
        if (!sheet) return;
        var pxPerMm = 96 / 25.4;
        var maxWidth = 194 * pxPerMm;
        var maxHeight = 281 * pxPerMm;
        var scale = Math.min(1, maxWidth / sheet.scrollWidth, maxHeight / sheet.scrollHeight);

        if (scale < 0.985) {
          document.documentElement.classList.add('tbm-print-compact');
          scale = Math.min(1, maxWidth / sheet.scrollWidth, maxHeight / sheet.scrollHeight);
        }

        document.documentElement.style.setProperty('--tbm-print-scale', String(Math.max(0.62, scale)));
      }

      window.addEventListener('load', function () {
        compactSignRows();
        fitToA4();
        setTimeout(function () {
          window.focus();
          window.print();
        }, 250);
      });

      window.onafterprint = function () {
        setTimeout(function () {
          window.close();
        }, 100);
      };
    })();
  <\/script>
</body>
</html>`;
}

export default function TbmPage() {
  const [basic, setBasic] = useState<BasicInfo>({
    date: todayString(),
    weather: '맑음',
    site: '',
    workTime: '08:00 ~ 17:00',
    workName: '',
    workerCount: '',
    leader: '',
    workContent: '',
  });
  const [settings, setSettings] = useState<TbmSettings>({
    signatureCount: 12,
    riskCount: 5,
    riskHint: '',
    approvalEnabled: true,
    approvalCount: 3,
    approvalNames: APPROVAL_DEFAULT_NAMES,
  });
  const [tbm, setTbm] = useState<TbmData>(EMPTY_TBM);
  const [documentReady, setDocumentReady] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [renderedSheetHtml, setRenderedSheetHtml] = useState('');
  const [isPreviewEditing, setIsPreviewEditing] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const sheetHtml = buildTbmSheetHtml(basic, tbm, settings);
  const activeSheetHtml = renderedSheetHtml || sheetHtml;

  const updateBasic = (key: keyof BasicInfo, value: string) => {
    setBasic((prev) => ({ ...prev, [key]: value }));
  };

  const updateSettings = <K extends keyof TbmSettings>(key: K, value: TbmSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateApprovalName = (index: number, value: string) => {
    setSettings((prev) => {
      const next = [...prev.approvalNames];
      next[index] = value;
      return { ...prev, approvalNames: next };
    });
  };

  const handleManualStart = () => {
    const nextTbm = {
      risks: emptyRisks(settings.riskCount),
      educationContent: '',
      ppe: [],
      notes: '',
    };
    setTbm(nextTbm);
    setRenderedSheetHtml(buildTbmSheetHtml(basic, nextTbm, settings));
    setDocumentReady(true);
    setIsPreviewEditing(false);
  };

  const handleOpenGenerate = () => {
    if (!basic.workContent.trim()) {
      alert('금일 작업내용을 입력하세요.');
      return;
    }
    setIsGenerateModalOpen(true);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/tbm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...basic,
          riskCount: settings.riskCount,
          riskHint: settings.riskHint,
        }),
      });

      const data = await response.json();
      const nextTbm = {
        risks: Array.isArray(data.risks) ? data.risks : emptyRisks(settings.riskCount),
        educationContent: data.educationContent || '',
        ppe: Array.isArray(data.ppe) ? data.ppe : [],
        notes: data.notes || '',
        warning: data.warning,
      };
      setTbm(nextTbm);
      setRenderedSheetHtml(buildTbmSheetHtml(basic, nextTbm, settings));
      setDocumentReady(true);
      setIsPreviewEditing(false);
      setIsGenerateModalOpen(false);
    } catch (error) {
      console.error('TBM generation failed:', error);
      alert('TBM 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCurrentSheetHtml = () => {
    return previewRef.current?.innerHTML || activeSheetHtml;
  };

  const handlePrint = () => {
    const currentSheetHtml = getCurrentSheetHtml();
    setRenderedSheetHtml(currentSheetHtml);
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) {
      alert('팝업 차단을 해제한 뒤 다시 시도하세요.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPrintHtml(currentSheetHtml));
    printWindow.document.close();
  };

  const handleTogglePreviewEditing = () => {
    if (isPreviewEditing) {
      setRenderedSheetHtml(getCurrentSheetHtml());
    }
    setIsPreviewEditing((prev) => !prev);
  };

  return (
    <main className="min-h-screen bg-slate-100 pb-12">
      <TopBar />
      {documentReady && <style jsx global>{SHEET_CSS}</style>}

      <div className={`mx-auto px-4 py-6 ${documentReady ? 'flex max-w-7xl flex-col gap-5 lg:flex-row lg:items-start' : 'max-w-3xl'}`}>
        <section className={documentReady ? 'w-full shrink-0 lg:w-[430px]' : 'w-full'}>
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h1 className="text-xl font-black text-slate-900">TBM 일지 관리</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">작업 전 안전점검회의</p>
            </div>

            <div className="space-y-5 px-5 py-5">
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  작성일자
                  <input
                    type="date"
                    value={basic.date}
                    onChange={(event) => updateBasic('date', event.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  날씨
                  <select
                    value={basic.weather}
                    onChange={(event) => updateBasic('weather', event.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {WEATHER_OPTIONS.map((weather) => (
                      <option key={weather} value={weather}>{weather}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="space-y-1 text-sm font-bold text-slate-700">
                현장/장소
                <input
                  type="text"
                  value={basic.site}
                  onChange={(event) => updateBasic('site', event.target.value)}
                  placeholder="예: 00현장 지하 1층"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  작업시간
                  <input
                    type="text"
                    value={basic.workTime}
                    onChange={(event) => updateBasic('workTime', event.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  작업인원
                  <input
                    type="text"
                    value={basic.workerCount}
                    onChange={(event) => updateBasic('workerCount', event.target.value)}
                    placeholder="예: 12명"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  공종/작업명
                  <input
                    type="text"
                    value={basic.workName}
                    onChange={(event) => updateBasic('workName', event.target.value)}
                    placeholder="예: 철근 배근"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  진행자
                  <input
                    type="text"
                    value={basic.leader}
                    onChange={(event) => updateBasic('leader', event.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <label className="space-y-1 text-sm font-bold text-slate-700">
                금일 작업내용
                <textarea
                  value={basic.workContent}
                  onChange={(event) => updateBasic('workContent', event.target.value)}
                  placeholder="작업 위치, 장비, 작업 순서, 동시 작업, 주변 위험요인을 함께 입력"
                  className="h-28 w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleOpenGenerate}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <RefreshIcon className="h-4 w-4" />
                  TBM 생성
                </button>
                <button
                  type="button"
                  onClick={handleManualStart}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <PencilIcon className="h-4 w-4" />
                  수기 작성
                </button>
              </div>
            </div>
          </div>

        </section>

        {documentReady && (
          <section className="min-w-0 flex-1">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-base font-black text-slate-900">A4 미리보기</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-700"
                  >
                    <DocumentDownloadIcon className="h-4 w-4" />
                    인쇄/PDF
                  </button>
                  <button
                    type="button"
                    onClick={handleTogglePreviewEditing}
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-black transition ${
                      isPreviewEditing
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <PencilIcon className="h-4 w-4" />
                    {isPreviewEditing ? '수정 완료' : '수정하기'}
                  </button>
                </div>
              </div>

              <OpenKakaoCta variant="result" className="mb-4" />

              {isPreviewEditing && (
                <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
                  미리보기 문서 안의 텍스트를 직접 수정할 수 있습니다. 수정 완료 후 인쇄하면 현재 내용이 반영됩니다.
                </div>
              )}

              <div className="overflow-x-auto rounded-md border border-slate-200 bg-slate-200 p-4">
                <div
                  ref={previewRef}
                  contentEditable={isPreviewEditing}
                  suppressContentEditableWarning={true}
                  className={`mx-auto bg-white shadow-xl outline-none ${isPreviewEditing ? 'ring-2 ring-emerald-400' : ''}`}
                  style={{ width: '194mm' }}
                  dangerouslySetInnerHTML={{ __html: activeSheetHtml }}
                />
              </div>
            </div>
          </section>
        )}
      </div>

      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-black text-slate-900">TBM 생성 설정</h2>
              <button
                type="button"
                title="닫기"
                onClick={() => setIsGenerateModalOpen(false)}
                className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  서명란 개수
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={settings.signatureCount}
                    onChange={(event) => updateSettings('signatureCount', clampNumber(Number(event.target.value), 1, 30))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
                <label className="space-y-1 text-sm font-bold text-slate-700">
                  위험요인 개수
                  <select
                    value={settings.riskCount}
                    onChange={(event) => updateSettings('riskCount', clampNumber(Number(event.target.value), 3, 8))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {[3, 4, 5, 6, 7, 8].map((count) => (
                      <option key={count} value={count}>{count}개</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-md border border-slate-200 p-4">
                <label className="flex items-center gap-2 text-sm font-black text-slate-800">
                  <input
                    type="checkbox"
                    checked={settings.approvalEnabled}
                    onChange={(event) => updateSettings('approvalEnabled', event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  결재란 표시
                </label>

                {settings.approvalEnabled && (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => updateSettings('approvalCount', count)}
                          className={`rounded-md border px-3 py-2 text-sm font-black transition ${
                            settings.approvalCount === count
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                              : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {count}칸
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {Array.from({ length: settings.approvalCount }).map((_, index) => (
                        <input
                          key={index}
                          type="text"
                          value={settings.approvalNames[index] || ''}
                          onChange={(event) => updateApprovalName(index, event.target.value)}
                          placeholder={APPROVAL_DEFAULT_NAMES[index]}
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <label className="space-y-1 text-sm font-bold text-slate-700">
                추가 위험요인 힌트
                <textarea
                  value={settings.riskHint}
                  onChange={(event) => updateSettings('riskHint', event.target.value)}
                  placeholder="예: 타워크레인 양중, 야간작업, 협소공간, 동시작업"
                  className="h-20 w-full resize-none rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>
            </div>

            <div className="flex gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex-[2] rounded-md bg-emerald-600 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
              >
                {isGenerating ? '생성 중...' : (
                  <span className="inline-flex items-center justify-center gap-2">
                    <CheckIcon className="h-4 w-4" />
                    이 내용으로 TBM 생성
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
