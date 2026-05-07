import type { Element5, ElementCount } from '../types';
import { ELEMENT_INFO } from '../utils/saju';

const ELEMENT_ORDER: Element5[] = ['목', '화', '토', '금', '수'];
const ELEMENT_EMOJIS: Record<Element5, string> = { 목: '🌿', 화: '🔥', 토: '🌍', 금: '✨', 수: '💧' };

interface ElementChartProps {
  elementCount: ElementCount;
  total: number;
  lackingElements: Element5[];
  abundantElements: Element5[];
}

export default function ElementChart({ elementCount, total, lackingElements, abundantElements }: ElementChartProps) {
  const max = Math.max(...Object.values(elementCount), 1);

  return (
    <div className="space-y-3">
      {ELEMENT_ORDER.map(el => {
        const count = elementCount[el];
        const pct = Math.round((count / total) * 100);
        const barPct = Math.round((count / max) * 100);
        const info = ELEMENT_INFO[el];
        const isLacking = lackingElements.includes(el);
        const isAbundant = abundantElements.includes(el);

        return (
          <div key={el} className="flex items-center gap-3">
            <div className="w-16 flex items-center gap-1.5 shrink-0">
              <span className="text-base">{ELEMENT_EMOJIS[el]}</span>
              <span className={`text-xs font-bold ${info.color}`}>{el}({info.hanja})</span>
            </div>

            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${info.gradient} transition-all duration-1000`}
                style={{ width: `${barPct}%` }}
              />
            </div>

            <div className="w-8 text-right shrink-0">
              <span className="text-sm font-bold text-gray-700">{count}</span>
            </div>

            <div className="w-16 shrink-0">
              {isLacking && (
                <span className="inline-flex items-center gap-0.5 bg-rose-100 text-rose-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  부족 ⚠️
                </span>
              )}
              {isAbundant && (
                <span className="inline-flex items-center gap-0.5 bg-violet-100 text-violet-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                  과다
                </span>
              )}
              {!isLacking && !isAbundant && (
                <span className="text-xs text-gray-400 font-medium">{pct}%</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
