import { useState } from 'react';
import { Venus, Mars, Heart, Calendar, Clock, User, ChevronDown } from 'lucide-react';
import type { Gender, UserProfile, CoupleProfile } from '../types';
import { calculateSaju, HOUR_OPTIONS } from '../utils/saju';
import { analyzeCoupleElements } from '../utils/coupleAnalysis';
import { saveCoupleProfile } from '../utils/storage';

interface PartnerFields {
  name: string;
  year: string;
  month: string;
  day: string;
  hourValue: string;
  gender: Gender;
}

const defaultPartner = (g: Gender): PartnerFields => ({
  name: '', year: '', month: '', day: '', hourValue: 'null', gender: g,
});

interface CoupleInputFormProps {
  onResult: (couple: CoupleProfile) => void;
}

function validatePartner(f: PartnerFields, label: string) {
  const errs: Record<string, string> = {};
  if (!f.name.trim()) errs.name = '이름을 입력해주세요';
  const y = parseInt(f.year);
  if (!f.year || isNaN(y) || y < 1900 || y > 2025) errs.year = '연도 오류';
  const m = parseInt(f.month);
  if (!f.month || isNaN(m) || m < 1 || m > 12) errs.month = '월 오류';
  const d = parseInt(f.day);
  if (!f.day || isNaN(d) || d < 1 || d > 31) errs.day = '일 오류';
  return Object.keys(errs).length > 0 ? { [`${label}_${Object.keys(errs)[0]}`]: Object.values(errs)[0], ...Object.fromEntries(Object.entries(errs).map(([k, v]) => [`${label}_${k}`, v])) } : {};
}

function buildProfile(f: PartnerFields): UserProfile {
  const hour = f.hourValue === 'null' ? null : parseInt(f.hourValue);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: f.name.trim(),
    birthYear: parseInt(f.year),
    birthMonth: parseInt(f.month),
    birthDay: parseInt(f.day),
    birthHour: hour,
    gender: f.gender,
    createdAt: new Date().toISOString(),
    saju: calculateSaju(parseInt(f.year), parseInt(f.month), parseInt(f.day), hour),
  };
}

function PartnerFormSection({
  label, color, icon, fields, errors, onChange,
}: {
  label: string;
  color: 'violet' | 'pink';
  icon: string;
  fields: PartnerFields;
  errors: Record<string, string>;
  onChange: (f: PartnerFields) => void;
}) {
  const accent = color === 'violet'
    ? { ring: 'focus:ring-violet-100 focus:border-violet-400', badge: 'bg-violet-50 border-violet-100 text-violet-700', genderActive: (g: Gender) => fields.gender === g ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-gray-200 text-gray-500 hover:border-gray-300' }
    : { ring: 'focus:ring-pink-100 focus:border-pink-400', badge: 'bg-pink-50 border-pink-100 text-pink-700', genderActive: (g: Gender) => fields.gender === g ? 'border-pink-400 bg-pink-50 text-pink-600' : 'border-gray-200 text-gray-500 hover:border-gray-300' };

  const inputBase = `w-full rounded-xl border bg-white px-3 py-2.5 text-sm font-medium text-gray-800 placeholder-gray-400 outline-none transition-all ${accent.ring}`;

  function err(key: string) {
    const k = `${label}_${key}`;
    return errors[k] ? <p className="mt-1 text-xs text-rose-500">{errors[k]}</p> : null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      {/* Partner label */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold ${accent.badge}`}>
        <span>{icon}</span> {label}
      </div>

      {/* Name */}
      <div>
        <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          <User size={11} /> 이름
        </label>
        <input
          type="text"
          value={fields.name}
          onChange={e => onChange({ ...fields, name: e.target.value })}
          placeholder="홍길동"
          className={`${inputBase} ${errors[`${label}_name`] ? 'border-rose-300' : 'border-gray-200'}`}
        />
        {err('name')}
      </div>

      {/* Birthday */}
      <div>
        <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          <Calendar size={11} /> 생년월일
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <input type="number" value={fields.year} onChange={e => onChange({ ...fields, year: e.target.value })} placeholder="1995" min="1900" max="2025"
              className={`${inputBase} ${errors[`${label}_year`] ? 'border-rose-300' : 'border-gray-200'}`} />
            {err('year')}
          </div>
          <div>
            <input type="number" value={fields.month} onChange={e => onChange({ ...fields, month: e.target.value })} placeholder="월" min="1" max="12"
              className={`${inputBase} ${errors[`${label}_month`] ? 'border-rose-300' : 'border-gray-200'}`} />
            {err('month')}
          </div>
          <div>
            <input type="number" value={fields.day} onChange={e => onChange({ ...fields, day: e.target.value })} placeholder="일" min="1" max="31"
              className={`${inputBase} ${errors[`${label}_day`] ? 'border-rose-300' : 'border-gray-200'}`} />
            {err('day')}
          </div>
        </div>
      </div>

      {/* Hour */}
      <div>
        <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          <Clock size={11} /> 태어난 시간
        </label>
        <div className="relative">
          <select value={fields.hourValue} onChange={e => onChange({ ...fields, hourValue: e.target.value })}
            className={`${inputBase} border-gray-200 cursor-pointer appearance-none pr-10`}>
            {HOUR_OPTIONS.map(opt => (
              <option key={String(opt.value)} value={String(opt.value)}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Gender */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">성별</label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => onChange({ ...fields, gender: 'female' })}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${accent.genderActive('female')}`}>
            <Venus size={14} /> 여성
          </button>
          <button type="button" onClick={() => onChange({ ...fields, gender: 'male' })}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${accent.genderActive('male')}`}>
            <Mars size={14} /> 남성
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CoupleInputForm({ onResult }: CoupleInputFormProps) {
  const [p1, setP1] = useState<PartnerFields>(defaultPartner('female'));
  const [p2, setP2] = useState<PartnerFields>(defaultPartner('male'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = { ...validatePartner(p1, 'p1'), ...validatePartner(p2, 'p2') };
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const partner1 = buildProfile(p1);
    const partner2 = buildProfile(p2);
    const analysis = analyzeCoupleElements(partner1, partner2);

    const couple: CoupleProfile = {
      id: `couple-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      partner1, partner2, analysis,
      createdAt: new Date().toISOString(),
    };

    saveCoupleProfile(couple);
    onResult(couple);
  }

  return (
    <div className="animate-slide-up max-w-lg mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-100 rounded-full px-4 py-1.5 mb-4">
          <Heart size={13} className="text-pink-500 fill-pink-500" />
          <span className="text-xs font-semibold text-pink-600">커플 사주 · 오행 궁합</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">
          함께하는{' '}
          <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            우리 방 꾸미기
          </span>
        </h1>
        <p className="text-sm text-gray-500">
          두 분의 사주를 합쳐 서로 보완되는 오행과<br />
          함께 채워야 할 오행을 분석해드려요 💕
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PartnerFormSection label="p1" color="violet" icon="💜" fields={p1} errors={errors} onChange={setP1} />

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-pink-200 to-pink-300" />
          <div className="flex items-center gap-1">
            <Heart size={16} className="text-pink-400 fill-pink-400" />
            <span className="text-xs font-bold text-pink-400">VS</span>
            <Heart size={16} className="text-violet-400 fill-violet-400" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-violet-200 to-violet-300" />
        </div>

        <PartnerFormSection label="p2" color="pink" icon="🩷" fields={p2} errors={errors} onChange={setP2} />

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-pink-500 to-rose-500 text-white font-bold text-sm shadow-md shadow-pink-200 hover:shadow-pink-300 hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Heart size={15} className="fill-white" />
          커플 사주 분석하기
        </button>
      </form>
    </div>
  );
}
