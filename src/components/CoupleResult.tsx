import { ArrowLeft, Trash2, Heart } from 'lucide-react';
import type { CoupleProfile, Element5, UserProfile } from '../types';
import { ELEMENT_INFO } from '../utils/saju';
import { deleteCoupleProfile } from '../utils/storage';
import RoomDecorCard from './RoomDecorCard';

interface CoupleResultProps {
  couple: CoupleProfile;
  onBack: () => void;
  onDelete?: () => void;
}

const ELEMENT_EMOJIS: Record<Element5, string> = { 목: '🌿', 화: '🔥', 토: '🌍', 금: '✨', 수: '💧' };

const COMPAT_TEXT = {
  great: { emoji: '💞', label: '천생연분', desc: '두 분의 오행이 놀랍도록 잘 맞아요! 서로가 부족한 부분을 채워주는 이상적인 궁합이에요.' },
  good:  { emoji: '💕', label: '좋은 궁합', desc: '서로의 오행이 잘 보완돼요. 함께하면 더욱 균형 잡힌 에너지가 생겨요.' },
  neutral: { emoji: '🌟', label: '닮은 두 사람', desc: '비슷한 오행 성향을 가진 두 분! 함께 부족한 기운을 인테리어로 채워보세요.' },
};

const STATUS_DETAIL: Record<string, { bg: string; text: string; label: string }> = {
  complementary: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: '서로 보완 ✓' },
  'both-lacking': { bg: 'bg-rose-50', text: 'text-rose-700', label: '함께 부족 ⚠️' },
  abundant: { bg: 'bg-violet-50', text: 'text-violet-700', label: '과다' },
  balanced: { bg: 'bg-gray-50', text: 'text-gray-500', label: '균형' },
};

function MiniProfile({ profile, color }: { profile: UserProfile; color: 'violet' | 'pink' }) {
  const grad = color === 'violet'
    ? 'from-violet-500 to-purple-600'
    : 'from-pink-500 to-rose-500';
  const saju = profile.saju;
  return (
    <div className="flex-1 bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm">
      <div className={`inline-flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r ${grad} px-2.5 py-1 rounded-full mb-2`}>
        {profile.gender === 'female' ? '♀' : '♂'} {profile.name}
      </div>
      {/* Day pillar (일주) as the main identifier */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xl font-black text-gray-700">{saju.dayPillar.stemHanja}{saju.dayPillar.branchHanja}</span>
        <span className="text-xs text-gray-400">일주</span>
      </div>
      <p className="text-xs text-gray-500">
        {profile.birthYear}.{String(profile.birthMonth).padStart(2,'0')}.{String(profile.birthDay).padStart(2,'0')}
      </p>
      {/* Mini element dots */}
      <div className="flex gap-0.5 mt-2 flex-wrap">
        {(['목','화','토','금','수'] as Element5[]).map(el => {
          const cnt = saju.elementCount[el];
          const info = ELEMENT_INFO[el];
          return (
            <span key={el} className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${info.lightBg} ${info.color}`}>
              {info.hanja}{cnt > 0 ? cnt : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function CoupleResult({ couple, onBack, onDelete }: CoupleResultProps) {
  const { partner1, partner2, analysis } = couple;
  const compat = COMPAT_TEXT[analysis.compatibilityLevel];

  function handleDelete() {
    if (confirm(`${partner1.name} ♥ ${partner2.name} 커플 정보를 삭제할까요?`)) {
      deleteCoupleProfile(couple.id);
      onDelete?.();
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium mb-6 transition-colors">
        <ArrowLeft size={16} /> 뒤로가기
      </button>

      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 via-pink-500 to-rose-500 rounded-2xl p-6 mb-5 text-white relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-black">{partner1.name}</span>
                <Heart size={16} className="fill-white" />
                <span className="text-lg font-black">{partner2.name}</span>
              </div>
              <div className={`inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm font-bold mb-1`}>
                <span>{compat.emoji}</span> {compat.label}
              </div>
              <p className="text-pink-100 text-xs leading-relaxed mt-2">{compat.desc}</p>
            </div>
            {onDelete && (
              <button onClick={handleDelete} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mini profiles */}
      <section className="mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5">각각의 사주</p>
        <div className="flex gap-3">
          <MiniProfile profile={partner1} color="violet" />
          <MiniProfile profile={partner2} color="pink" />
        </div>
      </section>

      {/* Combined element chart */}
      <section className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">합산 오행 분포</h3>
        <div className="space-y-2.5">
          {analysis.elementDetails.map(detail => {
            const info = ELEMENT_INFO[detail.element];
            const statusInfo = STATUS_DETAIL[detail.status];
            const barPct = Math.round((detail.combinedCount / analysis.totalChars) * 100 * 5);

            return (
              <div key={detail.element} className="flex items-center gap-3">
                <div className="w-6 text-center text-base">{ELEMENT_EMOJIS[detail.element]}</div>

                <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${info.gradient} transition-all duration-1000`}
                    style={{ width: `${Math.min(barPct, 100)}%` }} />
                </div>

                {/* Mini bars: p1 vs p2 */}
                <div className="flex items-center gap-1 text-xs text-gray-500 w-14 shrink-0">
                  <span className="text-violet-400 font-bold">{detail.p1Count}</span>
                  <span className="text-gray-300">+</span>
                  <span className="text-pink-400 font-bold">{detail.p2Count}</span>
                  <span className="text-gray-400">={detail.combinedCount}</span>
                </div>

                <div className="w-20 shrink-0">
                  <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          <span className="text-violet-500 font-bold">{partner1.name}</span> + <span className="text-pink-500 font-bold">{partner2.name}</span> 합산 기준
        </p>
      </section>

      {/* Complementary elements */}
      {analysis.complementaryElements.length > 0 && (
        <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-4">
          <h3 className="text-sm font-black text-emerald-700 mb-3">
            💚 서로 보완해주는 오행
          </h3>
          <p className="text-xs text-emerald-600 mb-3 leading-relaxed">
            한 분이 부족하지만 다른 분이 채워줘요. 함께 있을 때 더욱 균형 잡혀요!
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.complementaryElements.map(el => {
              const info = ELEMENT_INFO[el];
              const d = analysis.elementDetails.find(x => x.element === el)!;
              const p1Has = d.p1Count >= d.p2Count;
              return (
                <div key={el} className="bg-white rounded-xl px-3 py-2 border border-emerald-200 text-xs">
                  <span className="text-base mr-1">{ELEMENT_EMOJIS[el]}</span>
                  <span className={`font-bold ${info.color}`}>{info.label}</span>
                  <span className="text-gray-500 ml-1">
                    — {p1Has ? partner1.name : partner2.name}이 채워줘요
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Together lacking → room decor */}
      {analysis.lackingElements.length > 0 ? (
        <section className="mb-5">
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-black text-rose-700 mb-2">
              ⚠️ 두 분 모두 부족한 오행
            </h3>
            <p className="text-xs text-rose-600 leading-relaxed">
              아래 오행은 합산해도 부족해요. 함께 사는 공간에 이 기운을 채워주면 두 분 모두에게 좋아요!
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {analysis.lackingElements.map(el => {
                const info = ELEMENT_INFO[el];
                return (
                  <span key={el} className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${info.lightBg} ${info.color} border ${info.border}`}>
                    {ELEMENT_EMOJIS[el]} {info.label}
                  </span>
                );
              })}
            </div>
          </div>

          <h3 className="text-base font-black text-gray-900 mb-1">함께 꾸미는 우리 방 🏠💕</h3>
          <p className="text-xs text-gray-500 mb-4">
            두 분 모두 부족한 오행을 보완해주는 인테리어 아이디어예요
          </p>
          <div className="space-y-4">
            {analysis.lackingElements.map(el => (
              <RoomDecorCard key={el} element={el} />
            ))}
          </div>
        </section>
      ) : (
        <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-5">
          <p className="text-emerald-700 font-bold text-sm">🎉 두 분의 오행이 완벽하게 균형을 이뤄요!</p>
          <p className="text-emerald-600 text-xs mt-1 leading-relaxed">
            합산 오행이 고루 분포되어 있어요. 두 분이 좋아하는 스타일로 방을 꾸며보세요!
          </p>
        </section>
      )}

      {/* Abundant note */}
      {analysis.abundantElements.length > 0 && (
        <section className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mb-5">
          <p className="text-violet-700 font-bold text-sm mb-1">
            💜 과다한 오행 — {analysis.abundantElements.map(e => ELEMENT_INFO[e].label).join(', ')}
          </p>
          <p className="text-violet-600 text-xs leading-relaxed">
            이 오행이 두 분 모두에게 강하게 작용해요. 반대 오행의 색상이나 소품으로 균형을 맞춰보세요.
          </p>
        </section>
      )}

      <button onClick={onBack} className="w-full py-3 rounded-xl border-2 border-pink-200 text-pink-600 font-bold text-sm hover:bg-pink-50 transition-colors">
        새 분석하기
      </button>
    </div>
  );
}
