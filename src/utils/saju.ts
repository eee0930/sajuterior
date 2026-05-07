import type { Element5, ElementCount, Pillar, SajuData } from '../types';

const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;
const STEMS_HANJA = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;
const BRANCHES_HANJA = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

const STEM_ELEMENTS: Element5[] = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'];
const BRANCH_ELEMENTS: Element5[] = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];

export const ELEMENT_INFO: Record<Element5, { label: string; hanja: string; color: string; bg: string; border: string; gradient: string; lightBg: string }> = {
  목: { label: '목(木)', hanja: '木', color: 'text-emerald-700', bg: 'bg-emerald-500', border: 'border-emerald-200', gradient: 'from-emerald-400 to-green-500', lightBg: 'bg-emerald-50' },
  화: { label: '화(火)', hanja: '火', color: 'text-rose-700', bg: 'bg-rose-500', border: 'border-rose-200', gradient: 'from-rose-400 to-orange-500', lightBg: 'bg-rose-50' },
  토: { label: '토(土)', hanja: '土', color: 'text-amber-700', bg: 'bg-amber-500', border: 'border-amber-200', gradient: 'from-amber-400 to-yellow-500', lightBg: 'bg-amber-50' },
  금: { label: '금(金)', hanja: '金', color: 'text-slate-700', bg: 'bg-slate-500', border: 'border-slate-200', gradient: 'from-slate-400 to-zinc-500', lightBg: 'bg-slate-50' },
  수: { label: '수(水)', hanja: '水', color: 'text-blue-700', bg: 'bg-blue-500', border: 'border-blue-200', gradient: 'from-blue-400 to-indigo-500', lightBg: 'bg-blue-50' },
};

// Reference: Jan 1, 2000 = 무진일 (cycle index 4), offset = 20
const DAY_CYCLE_OFFSET = 20;

function createFullDate(year: number, month: number, day: number): Date {
  const d = new Date(0);
  d.setFullYear(year, month - 1, day);
  return d;
}

function daysSince1900(year: number, month: number, day: number): number {
  const epoch = createFullDate(1900, 1, 1);
  const target = createFullDate(year, month, day);
  return Math.floor((target.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));
}

function makePillar(stemIdx: number, branchIdx: number, label: string): Pillar {
  const s = ((stemIdx % 10) + 10) % 10;
  const b = ((branchIdx % 12) + 12) % 12;
  return {
    stem: STEMS[s],
    branch: BRANCHES[b],
    stemHanja: STEMS_HANJA[s],
    branchHanja: BRANCHES_HANJA[b],
    stemElement: STEM_ELEMENTS[s],
    branchElement: BRANCH_ELEMENTS[b],
    label,
  };
}

function getYearPillar(year: number, month: number, day: number): Pillar {
  // Year changes at 입춘 (~Feb 4)
  const adjYear = (month < 2 || (month === 2 && day < 4)) ? year - 1 : year;
  return makePillar((adjYear - 4) % 10, (adjYear - 4) % 12, '년주');
}

function getMonthBranch(month: number, day: number): number {
  // Approximate solar term start days
  const termDays = [6, 4, 6, 5, 6, 6, 7, 7, 8, 8, 7, 7];
  // Branch when past the solar term (indexed by calendar month 1-12)
  const monthBranches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
  const prevBranches = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const idx = month - 1;
  return day >= termDays[idx] ? monthBranches[idx] : prevBranches[idx];
}

function getMonthPillar(yearStemIdx: number, month: number, day: number): Pillar {
  const branch = getMonthBranch(month, day);
  // Base stem for 인월(branch=2): 갑/기→병(2), 을/경→무(4), 병/신→경(6), 정/임→임(8), 무/계→갑(0)
  const baseStemsForIn = [2, 4, 6, 8, 0];
  const base = baseStemsForIn[yearStemIdx % 5];
  const offset = (branch - 2 + 12) % 12;
  return makePillar(base + offset, branch, '월주');
}

function getDayPillar(year: number, month: number, day: number): Pillar {
  const days = daysSince1900(year, month, day);
  const cycleIndex = ((days + DAY_CYCLE_OFFSET) % 60 + 60) % 60;
  return makePillar(cycleIndex % 10, cycleIndex % 12, '일주');
}

function getHourBranch(hour: number): number {
  if (hour === 23) return 0; // 자시
  return Math.floor((hour + 1) / 2);
}

function getHourPillar(dayStemIdx: number, hour: number): Pillar {
  const branch = getHourBranch(hour);
  // Base stem for 자시 based on day stem
  const baseStemsForZi = [0, 2, 4, 6, 8];
  const base = baseStemsForZi[dayStemIdx % 5];
  return makePillar(base + branch, branch, '시주');
}

function countElements(pillars: (Pillar | null)[]): ElementCount {
  const count: ElementCount = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const p of pillars) {
    if (!p) continue;
    count[p.stemElement]++;
    count[p.branchElement]++;
  }
  return count;
}

export function calculateSaju(
  year: number,
  month: number,
  day: number,
  hour: number | null
): SajuData {
  const yearPillar = getYearPillar(year, month, day);
  const monthPillar = getMonthPillar(STEMS.indexOf(yearPillar.stem as typeof STEMS[number]), month, day);
  const dayPillar = getDayPillar(year, month, day);
  const dayStemIdx = STEMS.indexOf(dayPillar.stem as typeof STEMS[number]);
  const hourPillar = hour !== null ? getHourPillar(dayStemIdx, hour) : null;

  const elementCount = countElements([yearPillar, monthPillar, dayPillar, hourPillar]);
  const total = hourPillar ? 8 : 6;
  const avg = total / 5;

  const lackingElements = (Object.keys(elementCount) as Element5[]).filter(e => elementCount[e] < avg * 0.6);
  const abundantElements = (Object.keys(elementCount) as Element5[]).filter(e => elementCount[e] >= avg * 1.4);

  return { yearPillar, monthPillar, dayPillar, hourPillar, elementCount, lackingElements, abundantElements };
}

export const HOUR_OPTIONS = [
  { value: null, label: '모름 (시간 미상)' },
  { value: 0,  label: '자시 (子時) · 밤 11시 ~ 새벽 1시' },
  { value: 1,  label: '축시 (丑時) · 새벽 1시 ~ 3시' },
  { value: 3,  label: '인시 (寅時) · 새벽 3시 ~ 5시' },
  { value: 5,  label: '묘시 (卯時) · 새벽 5시 ~ 7시' },
  { value: 7,  label: '진시 (辰時) · 오전 7시 ~ 9시' },
  { value: 9,  label: '사시 (巳時) · 오전 9시 ~ 11시' },
  { value: 11, label: '오시 (午時) · 낮 11시 ~ 오후 1시' },
  { value: 13, label: '미시 (未時) · 오후 1시 ~ 3시' },
  { value: 15, label: '신시 (申時) · 오후 3시 ~ 5시' },
  { value: 17, label: '유시 (酉時) · 오후 5시 ~ 7시' },
  { value: 19, label: '술시 (戌時) · 오후 7시 ~ 9시' },
  { value: 21, label: '해시 (亥時) · 오후 9시 ~ 11시' },
];
