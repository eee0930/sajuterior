import { Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'form' | 'profiles';
  onTabChange: (tab: 'form' | 'profiles') => void;
  currentView: string;
}

export default function Header({ activeTab, onTabChange, currentView }: HeaderProps) {
  const showTabs = currentView !== 'result' && currentView !== 'couple-result';
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onTabChange('form')}
          className="flex items-center gap-1.5 group"
        >
          <Sparkles size={18} className="text-violet-500 group-hover:text-pink-500 transition-colors" />
          <span className="font-black text-base bg-gradient-to-r from-violet-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent tracking-tight">
            Sajuterior
          </span>
        </button>

        {showTabs && (
          <nav className="flex gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => onTabChange('form')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              사주 분석
            </button>
            <button
              onClick={() => onTabChange('profiles')}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'profiles'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              내 정보
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
