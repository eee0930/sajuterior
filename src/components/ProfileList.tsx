import { useEffect, useState } from 'react';
import { PlusCircle, ChevronRight, Sparkles, Heart } from 'lucide-react';
import type { UserProfile, CoupleProfile, Element5 } from '../types';
import { ELEMENT_INFO } from '../utils/saju';
import { getProfiles, getCoupleProfiles } from '../utils/storage';

interface ProfileListProps {
  onSelectIndividual: (profile: UserProfile) => void;
  onSelectCouple: (couple: CoupleProfile) => void;
  onNew: () => void;
  refreshKey: number;
}

function ElementDot({ el }: { el: Element5 }) {
  const info = ELEMENT_INFO[el];
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${info.lightBg} ${info.color}`}>
      {info.hanja}
    </span>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

export default function ProfileList({ onSelectIndividual, onSelectCouple, onNew, refreshKey }: ProfileListProps) {
  const [individuals, setIndividuals] = useState<UserProfile[]>([]);
  const [couples, setCouples] = useState<CoupleProfile[]>([]);

  useEffect(() => {
    setIndividuals(getProfiles());
    setCouples(getCoupleProfiles());
  }, [refreshKey]);

  const total = individuals.length + couples.length;

  if (total === 0) {
    return (
      <div className="animate-slide-up max-w-lg mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔮</div>
          <h2 className="text-lg font-black text-gray-800 mb-2">저장된 분석이 없어요</h2>
          <p className="text-sm text-gray-500 mb-6">사주 분석을 하면 여기에 저장돼요</p>
          <button onClick={onNew}
            className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold text-sm shadow-md">
            <Sparkles size={16} /> 첫 번째 분석하기
          </button>
        </div>
      </div>
    );
  }

  // Merge and sort by createdAt (newest first)
  type Entry =
    | { type: 'individual'; data: UserProfile }
    | { type: 'couple'; data: CoupleProfile };

  const entries: Entry[] = [
    ...individuals.map(d => ({ type: 'individual' as const, data: d })),
    ...couples.map(d => ({ type: 'couple' as const, data: d })),
  ].sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());

  return (
    <div className="animate-slide-up max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-black text-gray-900">내 정보</h2>
          <p className="text-xs text-gray-500">
            개인 {individuals.length}개 · 커플 {couples.length}개
          </p>
        </div>
        <button onClick={onNew}
          className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold text-xs shadow-sm">
          <PlusCircle size={14} /> 새 분석
        </button>
      </div>

      <div className="space-y-3">
        {entries.map(entry => {
          if (entry.type === 'individual') {
            const p = entry.data;
            return (
              <button key={p.id} onClick={() => onSelectIndividual(p)}
                className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-violet-200 hover:shadow-sm transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-gray-900">{p.name}</span>
                      <span className="text-xs text-gray-400">{p.gender === 'female' ? '♀' : '♂'}</span>
                      <span className="text-xs bg-violet-100 text-violet-600 font-semibold px-2 py-0.5 rounded-full">개인</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {p.birthYear}.{String(p.birthMonth).padStart(2,'0')}.{String(p.birthDay).padStart(2,'0')}
                    </p>
                    <div className="flex flex-wrap gap-1 items-center">
                      {p.saju.lackingElements.length > 0 ? (
                        <>
                          <span className="text-xs text-gray-400">부족:</span>
                          {p.saju.lackingElements.map(el => <ElementDot key={el} el={el} />)}
                        </>
                      ) : (
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">오행 균형 ✓</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-violet-400 transition-colors ml-3 shrink-0" />
                </div>
                <p className="text-xs text-gray-400 mt-2">분석일: {formatDate(p.createdAt)}</p>
              </button>
            );
          }

          // Couple entry
          const c = entry.data;
          const { lackingElements, complementaryElements } = c.analysis;
          return (
            <button key={c.id} onClick={() => onSelectCouple(c)}
              className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-pink-200 hover:shadow-sm transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-black text-gray-900">
                      {c.partner1.name}
                      <Heart size={12} className="inline mx-1 fill-pink-400 text-pink-400" />
                      {c.partner2.name}
                    </span>
                    <span className="text-xs bg-pink-100 text-pink-600 font-semibold px-2 py-0.5 rounded-full">커플</span>
                  </div>
                  <div className="flex flex-wrap gap-1 items-center mt-1">
                    {lackingElements.length > 0 ? (
                      <>
                        <span className="text-xs text-gray-400">함께 부족:</span>
                        {lackingElements.map(el => <ElementDot key={el} el={el} />)}
                      </>
                    ) : complementaryElements.length > 0 ? (
                      <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                        오행 균형 ✓
                      </span>
                    ) : (
                      <span className="text-xs text-violet-600 font-semibold bg-violet-50 px-2 py-0.5 rounded-full">
                        균형 잡힌 커플 ✓
                      </span>
                    )}
                    {complementaryElements.length > 0 && (
                      <span className="text-xs text-gray-400 ml-1">
                        보완: {complementaryElements.length}개
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-pink-400 transition-colors ml-3 shrink-0" />
              </div>
              <p className="text-xs text-gray-400 mt-2">분석일: {formatDate(c.createdAt)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
