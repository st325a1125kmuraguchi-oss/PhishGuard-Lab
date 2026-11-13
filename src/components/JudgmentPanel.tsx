import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, XCircle, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { Scenario } from '../types';

interface JudgmentPanelProps {
  scenario: Scenario;
  isJudged: boolean;
  userSaidPhishing: boolean | null;
  onJudge: (isPhishing: boolean, identifiedClues: string[]) => void;
  onOpenExplanation: () => void;
  onNextScenario: () => void;
  isLastScenario: boolean;
  onToggleClueHighlight: () => void;
  isClueHighlightActive: boolean;
}

export const JudgmentPanel: React.FC<JudgmentPanelProps> = ({
  scenario,
  isJudged,
  userSaidPhishing,
  onJudge,
  onOpenExplanation,
  onNextScenario,
  isLastScenario,
  onToggleClueHighlight,
  isClueHighlightActive,
}) => {
  const isCorrect = isJudged && userSaidPhishing === scenario.isPhishing;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      {!isJudged ? (
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              このメッセージとサイトを判定してください
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              送信元のアドレス、本文の言葉遣いや緊急性、リンク先URLを観察して判断してください。
            </p>
          </div>

          {/* Judgment Choice Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => onJudge(false, [])}
              className="py-4 px-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/40 hover:bg-emerald-100/60 active:bg-emerald-200/60 text-emerald-900 font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs hover:shadow"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>「安全（正規の通信）」と判定</span>
            </button>

            <button
              onClick={() => onJudge(true, [])}
              className="py-4 px-4 rounded-xl border-2 border-rose-500/40 bg-rose-50/40 hover:bg-rose-100/60 active:bg-rose-200/60 text-rose-900 font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs hover:shadow"
            >
              <AlertOctagon className="w-5 h-5 text-rose-600" />
              <span>「詐欺（フィッシング）」と判定</span>
            </button>
          </div>
        </div>
      ) : (
        /* Judged Result Display */
        <div className="space-y-4">
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isCorrect
                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                : 'bg-rose-50/80 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base sm:text-lg">
                    {isCorrect ? '正解です！見事に見破りました' : '不正解！騙されてしまいました'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm mt-1 text-slate-700">
                  正解は「
                  <strong className={scenario.isPhishing ? 'text-rose-700' : 'text-emerald-700'}>
                    {scenario.isPhishing ? 'フィッシング詐欺' : '安全な正規通信'}
                  </strong>
                  」です。{scenario.analysis.verdictTitle}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onOpenExplanation}
                className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>詳しい解説を見る</span>
              </button>

              <button
                onClick={onNextScenario}
                className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{isLastScenario ? '最終結果を見る' : '次の問題へ'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Toggle clue highlight inline */}
          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span>画面上の怪しいポイントをハイライト表示:</span>
            <button
              onClick={onToggleClueHighlight}
              className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                isClueHighlightActive
                  ? 'bg-amber-500 text-white font-semibold'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isClueHighlightActive ? 'ハイライト中（ON）' : 'ハイライトを表示（OFF）'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
