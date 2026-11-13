/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SCENARIOS, getRandomScenarios } from './data/scenarios';
import { Scenario, UserJudgment } from './types';
import { Header } from './components/Header';
import { MailViewer } from './components/MailViewer';
import { BrowserViewer } from './components/BrowserViewer';
import { JudgmentPanel } from './components/JudgmentPanel';
import { ExplanationModal } from './components/ExplanationModal';
import { UrlInspector } from './components/UrlInspector';
import { Handbook } from './components/Handbook';
import { ResultsReport } from './components/ResultsReport';
import {
  Mail,
  Globe,
  AlertTriangle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Shuffle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'training' | 'inspector' | 'handbook'>('training');
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [activeScenarios, setActiveScenarios] = useState<Scenario[]>(() => getRandomScenarios(15));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'mail' | 'browser'>('mail');
  const [judgments, setJudgments] = useState<Record<string, UserJudgment>>({});
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isClueHighlightActive, setIsClueHighlightActive] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [inspectorCustomUrl, setInspectorCustomUrl] = useState<string | undefined>(undefined);
  const [isFinished, setIsFinished] = useState(false);

  const currentScenario = activeScenarios[currentIndex] || activeScenarios[0];
  const currentJudgment = judgments[currentScenario.id];
  const isJudged = !!currentJudgment;

  const completedCount = Object.keys(judgments).length;
  const totalCount = activeScenarios.length;

  const handleJudge = (userSaidPhishing: boolean, identifiedClues: string[]) => {
    const isCorrect = userSaidPhishing === currentScenario.isPhishing;
    const newJudgment: UserJudgment = {
      scenarioId: currentScenario.id,
      userSaidPhishing,
      isCorrect,
      timeSpentSeconds: 15,
      identifiedClueIds: identifiedClues,
    };

    setJudgments((prev) => ({
      ...prev,
      [currentScenario.id]: newJudgment,
    }));

    // If incorrect, automatically open the deep explanation modal so the user immediately learns!
    // If correct, they can also open it via the "詳しい解説を見る" button or let them choose.
    setIsExplanationOpen(true);
    setIsClueHighlightActive(true);
  };

  const handleNext = () => {
    setIsExplanationOpen(false);
    setIsHintOpen(false);
    if (currentIndex < activeScenarios.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setViewMode('mail');
      setIsClueHighlightActive(false);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setViewMode('mail');
      setIsClueHighlightActive(false);
      setIsExplanationOpen(false);
      setIsHintOpen(false);
    }
  };

  const handleChangeQuestionCount = (count: number) => {
    setQuestionCount(count);
    const fresh = getRandomScenarios(count);
    setActiveScenarios(fresh);
    setJudgments({});
    setCurrentIndex(0);
    setViewMode('mail');
    setIsExplanationOpen(false);
    setIsClueHighlightActive(false);
    setIsHintOpen(false);
    setIsFinished(false);
  };

  const handleRestart = () => {
    const fresh = getRandomScenarios(questionCount);
    setActiveScenarios(fresh);
    setJudgments({});
    setCurrentIndex(0);
    setViewMode('mail');
    setIsExplanationOpen(false);
    setIsClueHighlightActive(false);
    setIsHintOpen(false);
    setIsFinished(false);
    setActiveTab('training');
  };

  const handleShuffle = () => {
    const fresh = getRandomScenarios(questionCount);
    setActiveScenarios(fresh);
    setJudgments({});
    setCurrentIndex(0);
    setViewMode('mail');
    setIsExplanationOpen(false);
    setIsClueHighlightActive(false);
    setIsHintOpen(false);
    setIsFinished(false);
  };

  const handleOpenInspectorWithUrl = (url: string) => {
    setInspectorCustomUrl(url);
    setIsExplanationOpen(false);
    setActiveTab('inspector');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar Header */}
      <Header
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'training' && isFinished) {
            // Keep finished state or allow viewing
          }
        }}
        completedCount={completedCount}
        totalCount={totalCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'inspector' && (
          <UrlInspector initialUrl={inspectorCustomUrl} />
        )}

        {activeTab === 'handbook' && <Handbook />}

        {activeTab === 'training' && (
          <>
            {isFinished ? (
              <ResultsReport
                scenarios={activeScenarios}
                judgments={judgments}
                onRestart={handleRestart}
                onReviewScenario={(idx) => {
                  setCurrentIndex(idx);
                  setIsFinished(false);
                  setViewMode('mail');
                  setIsExplanationOpen(true);
                }}
                onOpenHandbook={() => setActiveTab('handbook')}
              />
            ) : (
              <div className="space-y-4">
                {/* Scenario Navigation & Status Strip */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Case Info */}
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-xs font-mono">
                      CASE {currentIndex + 1} / {totalCount}
                    </span>
                    <div>
                      <h1 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <span>{currentScenario.title}</span>
                      </h1>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>分類: {currentScenario.category}</span>
                        <span>·</span>
                        <span>難易度: {currentScenario.difficulty}</span>
                        <span>·</span>
                        <span>対象企業: {currentScenario.brand.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Switcher & Case navigation dots */}
                  <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                    {/* View Switcher: Mail vs Browser */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                      <button
                        onClick={() => setViewMode('mail')}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                          viewMode === 'mail'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>メール画面</span>
                      </button>
                      {currentScenario.websiteData && (
                        <button
                          onClick={() => setViewMode('browser')}
                          className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                            viewMode === 'browser'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Webサイト画面</span>
                        </button>
                      )}
                    </div>

                    {/* Step Prev / Next Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded-md border border-slate-200 cursor-pointer"
                        title="前の問題"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md border border-slate-200 cursor-pointer"
                        title="次の問題"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scenario Navigation Dots Bar & Controls */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                    {activeScenarios.map((s, idx) => {
                      const j = judgments[s.id];
                      let dotColor = 'bg-slate-200 text-slate-600 hover:bg-slate-300';
                      if (j) {
                        dotColor = j.isCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white';
                      } else if (idx === currentIndex) {
                        dotColor = 'ring-2 ring-blue-600 bg-white text-blue-600 font-bold border border-blue-400';
                      }

                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setCurrentIndex(idx);
                            setViewMode('mail');
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer whitespace-nowrap shrink-0 ${dotColor}`}
                        >
                          問{idx + 1}
                          {j && (j.isCorrect ? ' ✓' : ' ✕')}
                        </button>
                      );
                    })}
                  </div>

                  {/* Question count selector and shuffle re-roll */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">演習問題数:</span>
                      <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
                        {[10, 15, 20, SCENARIOS.length].map((cnt) => {
                          const isSelected = questionCount === cnt;
                          const label = cnt === SCENARIOS.length ? `全問 (${cnt})` : `${cnt}問`;
                          return (
                            <button
                              key={cnt}
                              type="button"
                              onClick={() => handleChangeQuestionCount(cnt)}
                              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={handleShuffle}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-md transition-colors cursor-pointer shrink-0"
                      title={`全${SCENARIOS.length}問のプールからランダムに${questionCount}問を再選出します`}
                    >
                      <Shuffle className="w-3.5 h-3.5 text-slate-500" />
                      <span>問題をシャッフル (全{SCENARIOS.length}問から{questionCount}問)</span>
                    </button>
                  </div>
                </div>

                {/* Split Sandbox Layout: Simulation Stage on Left, Judgment Panel on Bottom/Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left / Primary Sandbox Stage (7-8 cols on desktop) */}
                  <div className="lg:col-span-8 min-h-[580px] flex flex-col">
                    {viewMode === 'mail' ? (
                      <MailViewer
                        scenario={currentScenario}
                        onOpenWebsite={() => setViewMode('browser')}
                        showClues={isClueHighlightActive}
                      />
                    ) : (
                      <BrowserViewer
                        scenario={currentScenario}
                        onBackToEmail={() => setViewMode('mail')}
                        showClues={isClueHighlightActive}
                      />
                    )}
                  </div>

                  {/* Right / Secondary Control & Judgment Deck (4-5 cols on desktop) */}
                  <div className="lg:col-span-4 space-y-4">
                    <JudgmentPanel
                      scenario={currentScenario}
                      isJudged={isJudged}
                      userSaidPhishing={currentJudgment ? currentJudgment.userSaidPhishing : null}
                      onJudge={handleJudge}
                      onOpenExplanation={() => setIsExplanationOpen(true)}
                      onNextScenario={handleNext}
                      isLastScenario={currentIndex === activeScenarios.length - 1}
                      onToggleClueHighlight={() => setIsClueHighlightActive(!isClueHighlightActive)}
                      isClueHighlightActive={isClueHighlightActive}
                    />

                    {/* Quick Guidance Box (Click to toggle hint) */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all">
                      <button
                        type="button"
                        onClick={() => setIsHintOpen(!isHintOpen)}
                        className="w-full p-3.5 text-xs font-bold text-slate-800 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer select-none"
                        aria-expanded={isHintOpen}
                      >
                        <span className="flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>観察のヒント</span>
                          <span className="text-[11px] font-normal text-slate-500 ml-1">
                            {isHintOpen ? '（クリックで閉じる）' : '（クリックで表示）'}
                          </span>
                        </span>
                        {isHintOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isHintOpen && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs space-y-2 border-t border-slate-100 bg-slate-50/50">
                          <p className="text-slate-600 leading-relaxed">
                            メール内のボタンをクリックすると偽サイトのシミュレータに移動できます。
                            また、メール内のボタンにマウスを重ねると左下に実際のリンク先URLが表示されます。
                          </p>
                          <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-600">
                            <span className="font-semibold text-slate-700 block">観察の着眼点:</span>
                            <div className="flex flex-col gap-1 pl-1">
                              <span>・ 送信元アドレスのドメイン（公式ドメインと完全一致しているか）</span>
                              <span>・ 本文の不自然な日本語や過度な緊急性（24時間以内、アカウント停止など）</span>
                              <span>・ リンク先URLのドメイン構造（偽装サブドメインや無関係なドメイン）</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Explanation Modal (Shows deep breakdown of URL, text, psychology when answered or requested) */}
      {isExplanationOpen && (
        <ExplanationModal
          scenario={currentScenario}
          isCorrect={currentJudgment ? currentJudgment.isCorrect : false}
          onClose={() => setIsExplanationOpen(false)}
          onNext={handleNext}
          isLastScenario={currentIndex === activeScenarios.length - 1}
          onOpenUrlInspectorWithUrl={handleOpenInspectorWithUrl}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>PhishGuard Lab — フィッシング詐欺体験・防犯教育シミュレーター</span>
          <span className="text-slate-400">
            ※ 本アプリ内で表示される偽サイト・メールは教育目的の安全な模擬環境です
          </span>
        </div>
      </footer>
    </div>
  );
}
