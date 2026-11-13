import React from 'react';
import {
  Trophy,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { Scenario, UserJudgment } from '../types';

interface ResultsReportProps {
  scenarios: Scenario[];
  judgments: Record<string, UserJudgment>;
  onRestart: () => void;
  onReviewScenario: (scenarioIndex: number) => void;
  onOpenHandbook: () => void;
}

export const ResultsReport: React.FC<ResultsReportProps> = ({
  scenarios,
  judgments,
  onRestart,
  onReviewScenario,
  onOpenHandbook,
}) => {
  const total = scenarios.length;
  const correctCount = scenarios.filter((s) => {
    const j = judgments[s.id];
    return j && j.isCorrect;
  }).length;

  const percentage = Math.round((correctCount / total) * 100);

  // Determine Rank
  let rank: { title: string; desc: string; color: string; badge: string };
  if (percentage === 100) {
    rank = {
      title: 'Sランク: サイバーディフェンス・マスター',
      desc: '驚異的な洞察力です！巧妙なサブドメイン偽装や心理誘導を完璧に見破ることができました。',
      color: 'text-amber-500',
      badge: 'bg-amber-50 border-amber-300 text-amber-900',
    };
  } else if (percentage >= 75) {
    rank = {
      title: 'Aランク: セキュリティ上級者',
      desc: '高い警戒力をお持ちです。わずかなミスポイントを確認すれば、現実の詐欺にもほぼ引っかかりません。',
      color: 'text-emerald-600',
      badge: 'bg-emerald-50 border-emerald-300 text-emerald-900',
    };
  } else if (percentage >= 50) {
    rank = {
      title: 'Bランク: 要注意（一般的な警戒レベル）',
      desc: '基礎的な特徴は見抜けていますが、巧妙なサブドメイン偽装や正規メールとの判別で騙されやすい傾向があります。',
      color: 'text-blue-600',
      badge: 'bg-blue-50 border-blue-300 text-blue-900',
    };
  } else {
    rank = {
      title: 'Cランク: 危険（即時トレーニング推奨）',
      desc: '実社会でフィッシング詐欺に遭う危険性が高い状態です。怪しいURLの構造とメール内リンクを踏まない鉄則を必ず復習しましょう。',
      color: 'text-rose-600',
      badge: 'bg-rose-50 border-rose-300 text-rose-900',
    };
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-4">
        <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-800 mb-1">
          <Trophy className="w-8 h-8 text-amber-500" />
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            フィッシング詐欺判定トレーニング完了
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            あなたの総合防御スコア
          </h2>
        </div>

        <div className="flex items-center justify-center gap-2 font-mono">
          <span className="text-4xl sm:text-5xl font-black text-slate-900 tabular-nums">
            {correctCount}
          </span>
          <span className="text-2xl text-slate-400 font-normal">/ {total} 問正解</span>
          <span className="text-xl font-bold text-blue-600 ml-2">({percentage}%)</span>
        </div>

        <div className={`inline-block p-4 rounded-xl border max-w-lg ${rank.badge} text-left`}>
          <div className="font-bold text-sm sm:text-base mb-1">{rank.title}</div>
          <p className="text-xs sm:text-sm leading-relaxed">{rank.desc}</p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRestart}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>もう一度挑戦する</span>
          </button>
          <button
            onClick={onOpenHandbook}
            className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>防犯ハンドブックを読む</span>
          </button>
        </div>
      </div>

      {/* Case by Case Breakdown List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">各問題の判定結果と復習</h3>
        <p className="text-xs text-slate-500">
          間違えたケースをクリックして、怪しいURLの構造や見落としたポイントを確認できます。
        </p>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {scenarios.map((scenario, index) => {
            const judgment = judgments[scenario.id];
            const isCorrect = judgment?.isCorrect;

            return (
              <div
                key={scenario.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">問 {index + 1}</span>
                      <span className="font-bold text-slate-900 text-sm">{scenario.title}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-2">
                      <span>ブランド: {scenario.brand.name}</span>
                      <span>·</span>
                      <span>
                        正解:{' '}
                        <strong className={scenario.isPhishing ? 'text-rose-600' : 'text-emerald-600'}>
                          {scenario.isPhishing ? 'フィッシング詐欺' : '安全な正規通信'}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onReviewScenario(index)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>解説と証跡を見る</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
