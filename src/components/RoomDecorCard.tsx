import { useState } from 'react';
import { Image, Palette, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import type { Element5 } from '../types';
import { ELEMENT_DECOR } from '../utils/decor';

interface RoomDecorCardProps {
  element: Element5;
}

const FALLBACK_GRADIENTS: Record<Element5, string> = {
  목: 'linear-gradient(135deg, #22c55e, #10b981, #6ee7b7)',
  화: 'linear-gradient(135deg, #f97316, #ef4444, #fbbf24)',
  토: 'linear-gradient(135deg, #eab308, #d97706, #92400e)',
  금: 'linear-gradient(135deg, #94a3b8, #64748b, #e2e8f0)',
  수: 'linear-gradient(135deg, #3b82f6, #6366f1, #1e3a8a)',
};

function WallPhotoCard({ url, title, fallback }: { url: string; title: string; fallback: string }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative flex-1 min-w-0 rounded-xl overflow-hidden group cursor-pointer" style={{ aspectRatio: '4/3' }}>
      <div className="absolute inset-0" style={{ background: fallback }} />

      {!error && (
        <img
          src={url}
          alt={title}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {!loaded && !error && (
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2.5">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{title}</p>
      </div>

      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl group-hover:ring-white/30 group-hover:scale-[1.02] transition-all duration-200" />
    </div>
  );
}

export default function RoomDecorCard({ element }: RoomDecorCardProps) {
  const [expanded, setExpanded] = useState(false);
  const info = ELEMENT_DECOR[element];
  const fallback = FALLBACK_GRADIENTS[element];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div
        className="h-1.5"
        style={{ background: `linear-gradient(to right, ${info.colorCodes[0]}, ${info.colorCodes[1]}, ${info.colorCodes[2]})` }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{info.symbol}</span>
            <div>
              <h3 className="font-black text-gray-900 text-base">{info.name} 보충하기</h3>
              <p className="text-xs text-gray-500">{info.meaning} · 방향: {info.direction}</p>
            </div>
          </div>
          <div className="flex gap-1 mt-1">
            {info.colorCodes.map(c => (
              <div key={c} className="w-4 h-4 rounded-full border border-white shadow-sm" style={{ background: c }} />
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">{info.description}</p>

        {/* 🖼️ Wall photo examples */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-sm">🖼️</span>
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">벽에 걸면 예쁜 사진 예시</span>
          </div>
          <div className="flex gap-2 h-28">
            {info.wallPhotos.map((photo, i) => (
              <WallPhotoCard
                key={i}
                url={photo.url}
                title={photo.title}
                fallback={fallback}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Unsplash · Pinterest 에서 비슷한 분위기로 검색해 프린트해보세요 ✨
          </p>
        </div>

        {/* Photo ideas */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Image size={14} className="text-violet-500" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">추천 사진 키워드</span>
          </div>
          <ul className="space-y-1.5">
            {info.photoIdeas.slice(0, expanded ? undefined : 3).map((idea, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-violet-400 mt-0.5 shrink-0">•</span>
                {idea}
              </li>
            ))}
          </ul>
        </div>

        {/* Poster ideas */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Palette size={14} className="text-pink-500" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">추천 포스터</span>
          </div>
          <ul className="space-y-1.5">
            {info.posterIdeas.slice(0, expanded ? undefined : 3).map((idea, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-pink-400 mt-0.5 shrink-0">•</span>
                {idea}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        {expanded && (
          <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb size={14} className="text-amber-500" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">인테리어 팁</span>
            </div>
            <ul className="space-y-1.5">
              {info.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="mt-0.5 shrink-0">💡</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors pt-1"
        >
          {expanded ? <><ChevronUp size={14} /> 접기</> : <><ChevronDown size={14} /> 더 보기</>}
        </button>
      </div>
    </div>
  );
}
