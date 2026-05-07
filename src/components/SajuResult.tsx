import { ArrowLeft, Trash2 } from 'lucide-react';
import type { UserProfile } from '../types';
import { ELEMENT_INFO } from '../utils/saju';
import ElementChart from './ElementChart';
import RoomDecorCard from './RoomDecorCard';
import { deleteProfile } from '../utils/storage';

interface SajuResultProps {
  profile: UserProfile;
  onBack: () => void;
  onDelete?: () => void;
}

const ELEMENT_LACK_MEANING: Record<string, string> = {
  목: '창의력과 새로운 시작의 기운이 부족해요. 변화에 적응하거나 새로운 일을 시작하는 것이 어렵게 느껴질 수 있어요.',
  화: '열정과 활력의 기운이 부족해요. 무기력하거나 소극적으로 느껴지는 경우가 많을 수 있어요.',
  토: '안정감과 중심 잡는 기운이 부족해요. 불안감을 느끼거나 결정을 내리기 어려울 수 있어요.',
  금: '결단력과 집중력의 기운이 부족해요. 목표를 향해 나아가는 추진력이 약해질 수 있어요.',
  수: '지혜와 유연한 사고의 기운이 부족해요. 직관력이 떨어지거나 소통에 어려움을 느낄 수 있어요.',
};

function PillarCard({ pillar }: { pillar: NonNullable<UserProfile['saju']['yearPillar']> }) {
  const se = ELEMENT_INFO[pillar.stemElement];
  const be = ELEMENT_INFO[pillar.branchElement];
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{pillar.label}</span>
      <div className="bg-white border border-gray-100 rounded-xl w-full py-3 px-2 text-center shadow-sm">
        <div className="flex justify-center gap-0.5 mb-1">
          <span className="text-xl font-black text-gray-800">{pillar.stemHanja}</span>
          <span className="text-xl font-black text-gray-800">{pillar.branchHanja}</span>
        </div>
        <div className="flex justify-center gap-0.5">
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${se.lightBg} ${se.color}`}>
            {pillar.stem}
          </span>
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${be.lightBg} ${be.color}`}>
            {pillar.branch}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatBirthday(profile: UserProfile): string {
  const { birthYear, birthMonth, birthDay, birthHour } = profile;
  const hourLabel = birthHour !== null
    ? ` · ${birthHour === 0 || birthHour === 23 ? '자시' : birthHour === 1 ? '축시' : birthHour === 3 ? '인시' : birthHour === 5 ? '묘시' : birthHour === 7 ? '진시' : birthHour === 9 ? '사시' : birthHour === 11 ? '오시' : birthHour === 13 ? '미시' : birthHour === 15 ? '신시' : birthHour === 17 ? '유시' : birthHour === 19 ? '술시' : '해시'}`
    : '';
  return `${birthYear}년 ${birthMonth}월 ${birthDay}일${hourLabel}`;
}

export default function SajuResult({ profile, onBack, onDelete }: SajuResultProps) {
  const { saju, name, gender } = profile;
  const total = saju.hourPillar ? 8 : 6;
  const hasIssues = saju.lackingElements.length > 0;

  function handleDelete() {
    if (confirm(`${name}님의 정보를 삭제할까요?`)) {
      deleteProfile(profile.id);
      onDelete?.();
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 animate-slide-up">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> 뒤로가기
      </button>

      {/* Profile header */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 rounded-2xl p-6 mb-5 text-white relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-violet-200 text-xs font-semibold uppercase tracking-wide mb-1">
                {gender === 'female' ? '♀ 여성' : '♂ 남성'}
              </p>
              <h2 className="text-2xl font-black mb-1">{name}님의 사주</h2>
              <p className="text-violet-200 text-sm">{formatBirthday(profile)}</p>
            </div>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 사주팔자 */}
      <section className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">사주팔자 (四柱八字)</h3>
        <div className="flex gap-2">
          <PillarCard pillar={saju.yearPillar} />
          <PillarCard pillar={saju.monthPillar} />
          <PillarCard pillar={saju.dayPillar} />
          {saju.hourPillar
            ? <PillarCard pillar={saju.hourPillar} />
            : (
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">시주</span>
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl w-full py-3 px-2 text-center">
                  <p className="text-2xl text-gray-300 mb-1">?</p>
                  <p className="text-xs text-gray-400">미상</p>
                </div>
              </div>
            )
          }
        </div>
      </section>

      {/* 오행 분포 */}
      <section className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">오행 분포 (五行)</h3>
        <ElementChart
          elementCount={saju.elementCount}
          total={total}
          lackingElements={saju.lackingElements}
          abundantElements={saju.abundantElements}
        />
      </section>

      {/* Analysis */}
      {hasIssues ? (
        <section className="mb-5">
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 mb-4">
            <h3 className="text-sm font-black text-rose-700 mb-3">
              ⚠️ 부족한 오행 분석
            </h3>
            <div className="space-y-3">
              {saju.lackingElements.map(el => (
                <div key={el} className="flex gap-3">
                  <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 ${ELEMENT_INFO[el].bg} text-white font-bold`}>
                    {ELEMENT_INFO[el].hanja}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 mb-0.5">{ELEMENT_INFO[el].label} 부족</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{ELEMENT_LACK_MEANING[el]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Room decor section */}
          <div className="mb-3">
            <h3 className="text-base font-black text-gray-900 mb-1">방 꾸미기 추천 🏠</h3>
            <p className="text-xs text-gray-500 mb-4">
              부족한 오행을 보완할 수 있는 사진과 포스터 아이디어예요
            </p>
            <div className="space-y-4">
              {saju.lackingElements.map(el => (
                <RoomDecorCard key={el} element={el} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-5">
          <p className="text-emerald-700 font-bold text-sm">🎉 오행이 균형 잡혀 있어요!</p>
          <p className="text-emerald-600 text-xs mt-1 leading-relaxed">
            사주에서 다섯 가지 오행이 고루 분포되어 있어요. 좋아하는 스타일로 방을 꾸며보세요!
          </p>
        </section>
      )}

      {/* Abundant elements note */}
      {saju.abundantElements.length > 0 && (
        <section className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mb-5">
          <p className="text-violet-700 font-bold text-sm mb-1">
            💜 과다한 오행 — {saju.abundantElements.map(e => ELEMENT_INFO[e].label).join(', ')}
          </p>
          <p className="text-violet-600 text-xs leading-relaxed">
            해당 오행이 강하게 작용해요. 과도하게 넘치지 않도록 반대 오행의 색상이나 소품으로 균형을 맞춰보세요.
          </p>
        </section>
      )}

      {/* Share / new analysis */}
      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border-2 border-violet-200 text-violet-600 font-bold text-sm hover:bg-violet-50 transition-colors"
        >
          새 분석하기
        </button>
      </div>
    </div>
  );
}
