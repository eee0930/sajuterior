export type Element5 = '목' | '화' | '토' | '금' | '수';
export type Gender = 'male' | 'female';

export interface Pillar {
  stem: string;
  branch: string;
  stemHanja: string;
  branchHanja: string;
  stemElement: Element5;
  branchElement: Element5;
  label: string;
}

export interface ElementCount {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

export interface SajuData {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;
  elementCount: ElementCount;
  lackingElements: Element5[];
  abundantElements: Element5[];
}

export interface UserProfile {
  id: string;
  name: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number | null;
  gender: Gender;
  createdAt: string;
  saju: SajuData;
}

export type ElementStatus = 'complementary' | 'both-lacking' | 'abundant' | 'balanced';

export interface CoupleElementAnalysis {
  element: Element5;
  p1Count: number;
  p2Count: number;
  combinedCount: number;
  status: ElementStatus;
}

export interface CoupleAnalysis {
  combinedElementCount: ElementCount;
  elementDetails: CoupleElementAnalysis[];
  complementaryElements: Element5[];
  lackingElements: Element5[];
  abundantElements: Element5[];
  compatibilityLevel: 'great' | 'good' | 'neutral';
  totalChars: number;
}

export interface CoupleProfile {
  id: string;
  partner1: UserProfile;
  partner2: UserProfile;
  analysis: CoupleAnalysis;
  createdAt: string;
}

export interface WallPhoto {
  url: string;
  title: string;
}

export interface DecorInfo {
  name: string;
  symbol: string;
  direction: string;
  colors: string[];
  colorCodes: string[];
  meaning: string;
  description: string;
  wallPhotos: WallPhoto[];
  photoIdeas: string[];
  posterIdeas: string[];
  tips: string[];
}
