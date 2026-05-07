import { useState } from 'react';
import { Sparkles, User, Calendar, Clock, Venus, Mars, ChevronDown } from 'lucide-react';
import type { Gender, UserProfile } from '../types';
import { calculateSaju, HOUR_OPTIONS } from '../utils/saju';
import { saveProfile } from '../utils/storage';

interface InputFormProps {
  onResult: (profile: UserProfile) => void;
}

export default function InputForm({ onResult }: InputFormProps) {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hourValue, setHourValue] = useState<string>('null');
  const [gender, setGender] = useState<Gender>('female');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = '이름을 입력해주세요';
    const y = parseInt(year);
    if (!year || isNaN(y) || y < 1900 || y > 2025) errs.year = '1900~2025 사이 연도를 입력하세요';
    const m = parseInt(month);
    if (!month || isNaN(m) || m < 1 || m > 12) errs.month = '1~12월을 입력하세요';
    const d = parseInt(day);
    if (!day || isNaN(d) || d < 1 || d > 31) errs.day = '올바른 일자를 입력하세요';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const hour = hourValue === 'null' ? null : parseInt(hourValue);
    const saju = calculateSaju(parseInt(year), parseInt(month), parseInt(day), hour);

    const profile: UserProfile = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      birthYear: parseInt(year),
      birthMonth: parseInt(month),
      birthDay: parseInt(day),
      birthHour: hour,
      gender,
      createdAt: new Date().toISOString(),
      saju,
    };

    saveProfile(profile);
    onResult(profile);
  }

  const inputBase = 'w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-violet-400 focus:ring-3 focus:ring-violet-100';
  const errorInput = 'border-rose-300 focus:border-rose-400 focus:ring-rose-100';
  const normalInput = 'border-gray-200';

  return (
    <div className="animate-slide-up max-w-lg mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-full px-4 py-1.5 mb-4">
          <Sparkles size={14} className="text-violet-500" />
          <span className="text-xs font-semibold text-violet-600">사주 · 오행 분석</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">
          나의 사주로{' '}
          <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
            방을 꾸며봐
          </span>
        </h1>
        <p className="text-sm text-gray-500">
          생년월일을 입력하면 사주팔자와 오행을 분석해<br />
          내게 맞는 방 꾸미기를 추천해줄게요 ✨
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

        {/* Name */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
            <User size={13} /> 이름
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="홍길동"
            className={`${inputBase} ${errors.name ? errorInput : normalInput}`}
          />
          {errors.name && <p className="mt-1.5 text-xs text-rose-500">{errors.name}</p>}
        </div>

        {/* Birthday */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
            <Calendar size={13} /> 생년월일
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input
                type="number"
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="1995"
                min="1900" max="2025"
                className={`${inputBase} ${errors.year ? errorInput : normalInput}`}
              />
              {errors.year && <p className="mt-1 text-xs text-rose-500">{errors.year}</p>}
            </div>
            <div>
              <input
                type="number"
                value={month}
                onChange={e => setMonth(e.target.value)}
                placeholder="월"
                min="1" max="12"
                className={`${inputBase} ${errors.month ? errorInput : normalInput}`}
              />
              {errors.month && <p className="mt-1 text-xs text-rose-500">{errors.month}</p>}
            </div>
            <div>
              <input
                type="number"
                value={day}
                onChange={e => setDay(e.target.value)}
                placeholder="일"
                min="1" max="31"
                className={`${inputBase} ${errors.day ? errorInput : normalInput}`}
              />
              {errors.day && <p className="mt-1 text-xs text-rose-500">{errors.day}</p>}
            </div>
          </div>
        </div>

        {/* Hour */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
            <Clock size={13} /> 태어난 시간
          </label>
          <div className="relative">
            <select
              value={hourValue}
              onChange={e => setHourValue(e.target.value)}
              className={`${inputBase} ${normalInput} cursor-pointer appearance-none pr-10`}
            >
              {HOUR_OPTIONS.map(opt => (
                <option key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
            성별
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                gender === 'female'
                  ? 'border-pink-400 bg-pink-50 text-pink-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <Venus size={16} /> 여성
            </button>
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                gender === 'male'
                  ? 'border-blue-400 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <Mars size={16} /> 남성
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold text-sm shadow-md shadow-violet-200 hover:shadow-violet-300 hover:from-violet-700 hover:to-pink-600 transition-all active:scale-[0.98]"
        >
          사주 분석하기 ✨
        </button>
      </form>
    </div>
  );
}
