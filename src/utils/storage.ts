import type { UserProfile, CoupleProfile } from '../types';

const PROFILES_KEY = 'sajuterior_profiles';
const COUPLES_KEY = 'sajuterior_couples';

// ── Individual ──────────────────────────────────────────────
export function getProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveProfile(profile: UserProfile): void {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) profiles[idx] = profile; else profiles.unshift(profile);
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function deleteProfile(id: string): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(getProfiles().filter(p => p.id !== id)));
}

// ── Couple ───────────────────────────────────────────────────
export function getCoupleProfiles(): CoupleProfile[] {
  try {
    const raw = localStorage.getItem(COUPLES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCoupleProfile(couple: CoupleProfile): void {
  const couples = getCoupleProfiles();
  const idx = couples.findIndex(c => c.id === couple.id);
  if (idx >= 0) couples[idx] = couple; else couples.unshift(couple);
  localStorage.setItem(COUPLES_KEY, JSON.stringify(couples));
}

export function deleteCoupleProfile(id: string): void {
  localStorage.setItem(COUPLES_KEY, JSON.stringify(getCoupleProfiles().filter(c => c.id !== id)));
}
