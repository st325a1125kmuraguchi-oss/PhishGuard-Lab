import React from 'react';
import { ShieldAlert, BookOpen, Search, CheckCircle } from 'lucide-react';

interface HeaderProps {
  currentTab: 'training' | 'inspector' | 'handbook';
  onSelectTab: (tab: 'training' | 'inspector' | 'handbook') => void;
  completedCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  completedCount,
  totalCount,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onSelectTab('training')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm">
            PG
          </span>
          <span>PhishGuard Lab</span>
        </button>

        {/* Zone 2: Navigation Links (4-5 single-line clean text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onSelectTab('training')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentTab === 'training'
                ? 'text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            判定トレーニング
          </button>
          <button
            onClick={() => onSelectTab('inspector')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentTab === 'inspector'
                ? 'text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            URL解剖ラボ
          </button>
          <button
            onClick={() => onSelectTab('handbook')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentTab === 'handbook'
                ? 'text-slate-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            防犯ハンドブック
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>進捗</span>
            <span className="font-semibold text-slate-900 font-mono tabular-nums">
              {completedCount}/{totalCount}
            </span>
          </div>
          <button
            onClick={() => onSelectTab('training')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            模擬演習を体験
          </button>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="md:hidden flex border-t border-slate-100 px-4 py-2 bg-slate-50 gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => onSelectTab('training')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            currentTab === 'training'
              ? 'bg-white text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600'
          }`}
        >
          判定トレーニング
        </button>
        <button
          onClick={() => onSelectTab('inspector')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            currentTab === 'inspector'
              ? 'bg-white text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600'
          }`}
        >
          URL解剖ラボ
        </button>
        <button
          onClick={() => onSelectTab('handbook')}
          className={`px-3 py-1.5 rounded-md whitespace-nowrap ${
            currentTab === 'handbook'
              ? 'bg-white text-slate-900 font-semibold shadow-xs'
              : 'text-slate-600'
          }`}
        >
          防犯ハンドブック
        </button>
      </div>
    </header>
  );
};
