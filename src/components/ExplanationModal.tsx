import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Flame,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Scenario, Clue } from '../types';

interface ExplanationModalProps {
  scenario: Scenario;
  isCorrect: boolean;
  onClose: () => void;
  onNext: () => void;
  isLastScenario: boolean;
  onOpenUrlInspectorWithUrl?: (url: string) => void;
}

export const ExplanationModal: React.FC<ExplanationModalProps> = ({
  scenario,
  isCorrect,
  onClose,
  onNext,
  isLastScenario,
  onOpenUrlInspectorWithUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'clues' | 'url' | 'damage' | 'safeAction'>('clues');

  const domain = scenario.websiteData?.browserDomainParsed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isCorrect ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg">
                  {isCorrect ? '正解！' : '不正解！'} {scenario.analysis.verdictTitle}
                </span>
              </div>
              <span className="text-xs text-slate-600 block">
                危険度判定: <strong className="font-semibold">{scenario.analysis.dangerLevel}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('clues')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'clues'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            見破りポイント ({scenario.clues.length}箇所)
          </button>
          {scenario.websiteData && (
            <button
              onClick={() => setActiveTab('url')}
              className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'url'
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              URLの罠と解剖
            </button>
          )}
          <button
            onClick={() => setActiveTab('damage')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'damage'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            もし入力してしまったら？
          </button>
          <button
            onClick={() => setActiveTab('safeAction')}
            className={`pb-2.5 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'safeAction'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            安全な正規の確認方法
          </button>
        </div>

        {/* Modal Body with Custom Scroll */}
        <div className="p-6 overflow-y-auto flex-1 text-sm space-y-4 custom-scrollbar">
          {/* Tab 1: Clues list */}
          {activeTab === 'clues' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                このケースで詐欺を見破るための決定的なチェックポイントです。実際のメールやサイトでも同様の特徴が現れます。
              </p>

              <div className="space-y-3">
                {scenario.clues.map((clue, index) => (
                  <div
                    key={clue.id}
                    className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                      clue.isScamIndicator
                        ? 'border-amber-200 bg-amber-50/50'
                        : 'border-emerald-200 bg-emerald-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">
                          {index + 1}
                        </span>
                        <span>{clue.title}</span>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          clue.isScamIndicator
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {clue.isScamIndicator ? '怪しい特徴 ⚠️' : '安全な特徴 🛡️'}
                      </span>
                    </div>

                    <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/80 font-mono text-xs text-slate-800 break-all">
                      <span className="text-slate-400 font-sans mr-2">該当箇所:</span>
                      <span className="font-semibold text-rose-700">{clue.targetSnippet}</span>
                    </div>

                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                      {clue.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: URL Anatomy */}
          {activeTab === 'url' && domain && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  URLの構造を見抜く（ドメインのカラクリ）
                </h4>
                <p className="text-xs text-slate-600">
                  詐欺グループはサブドメインに本物の会社名を配置して、スマートフォンの狭い画面で末尾を隠そうとします。
                </p>
              </div>

              {/* Visual Breakdown Diagram */}
              <div className="p-4 bg-slate-900 rounded-xl text-white space-y-3">
                <span className="text-xs text-slate-400 font-mono block">
                  今回のリンク先URLの解剖:
                </span>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs sm:text-sm overflow-x-auto flex flex-wrap items-center gap-1.5 custom-scrollbar">
                  <span className="text-slate-400">{domain.protocol}</span>
                  {domain.subdomain && (
                    <span className="bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">
                      {domain.subdomain}.
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded font-bold border ${
                      domain.isDeceptive
                        ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    }`}
                  >
                    {domain.domain}
                  </span>
                  <span className="text-slate-500">{domain.path}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                    <span className="text-amber-300 font-semibold block mb-0.5">
                      サブドメイン（騙しの罠）:
                    </span>
                    <span className="text-slate-300">
                      {domain.subdomain
                        ? `「${domain.subdomain}」と公式ブランド名が書かれていても、これは誰でも自由に名付けられる単なる看板です。`
                        : '（サブドメインなし）'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                    <span className="text-rose-400 font-semibold block mb-0.5">
                      本当の接続先ドメイン（★最重要）:
                    </span>
                    <span className="text-slate-300">
                      「<strong className="text-white font-bold">{domain.domain}</strong>」
                      {domain.isDeceptive ? ' が真の接続先です。公式ではありません！' : ' は正規の公式ドメインです。'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Official vs Phishing comparison */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-800 block">公式ドメインとの比較:</span>
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div className="flex-1 p-2 bg-emerald-50 border border-emerald-200 rounded">
                    <span className="text-emerald-800 font-bold block mb-0.5">本物の公式ドメイン</span>
                    <span className="font-mono text-emerald-900 font-semibold">
                      https://{scenario.brand.officialDomain}
                    </span>
                  </div>
                  <div className="flex-1 p-2 bg-rose-50 border border-rose-200 rounded">
                    <span className="text-rose-800 font-bold block mb-0.5">今回の偽装ドメイン</span>
                    <span className="font-mono text-rose-900 font-semibold">
                      {scenario.emailData.targetUrl}
                    </span>
                  </div>
                </div>
              </div>

              {onOpenUrlInspectorWithUrl && (
                <button
                  onClick={() => onOpenUrlInspectorWithUrl(scenario.emailData.targetUrl)}
                  className="w-full py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>このURLを「URL解剖ラボ」で詳細分析する</span>
                </button>
              )}
            </div>
          )}

          {/* Tab 3: Damage Scenario */}
          {activeTab === 'damage' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-950">
                <div className="flex items-center gap-2 font-bold text-base text-rose-900">
                  <Flame className="w-5 h-5 text-rose-600" />
                  <span>入力した場合の被害シナリオ</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  {scenario.analysis.damageScenario}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs sm:text-sm">
                <span className="font-bold text-slate-900 block">攻撃者の目的と裏側のビジネス:</span>
                <p className="text-slate-700 leading-relaxed">
                  {scenario.analysis.attackerGoal}
                </p>
                <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800">攻撃の手順:</div>
                  <div>1. 偽サイトの入力データをボットがリアルタイム監視</div>
                  <div>2. 盗んだカードやIDで即座にECサイトやギフト券購入APIを実行</div>
                  <div>3. 失敗した場合は被害者のSMSに認証コードを送らせて突破（リアルタイム中継攻撃）</div>
                  <div>4. 盗んだアカウント情報はダークウェブの名簿としてさらに転売</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Safe Alternative Action */}
          {activeTab === 'safeAction' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-base text-emerald-900">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>安全な正しい対処法</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed text-emerald-900">
                  {scenario.analysis.safeAlternativeAction}
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-slate-900 block">日常で守るべき3つの鉄則:</span>
                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5">
                  <span className="font-bold text-blue-600 font-mono">1.</span>
                  <div>
                    <strong>メールやSMS内のリンクをタップしない</strong>
                    <p className="text-xs text-slate-500 mt-0.5">
                      警告や督促が届いても、必ずホーム画面の公式アプリアイコンや、事前に登録した正規ブックマークから確認する。
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5">
                  <span className="font-bold text-blue-600 font-mono">2.</span>
                  <div>
                    <strong>暗証番号4桁・ワンタイムパスワードは絶対に入力しない</strong>
                    <p className="text-xs text-slate-500 mt-0.5">
                      銀行やカード会社が「セキュリティ更新」等の理由でメール経由で暗証番号を入力させることは絶対にありません。
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-start gap-2.5">
                  <span className="font-bold text-blue-600 font-mono">3.</span>
                  <div>
                    <strong>「24時間以内」「本日中」という脅迫文に焦らない</strong>
                    <p className="text-xs text-slate-500 mt-0.5">
                      焦りを生む言葉は詐欺の最大の武器です。一度深呼吸し、公式窓口に問い合わせる余裕を持ちましょう。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            画面に戻って確認する
          </button>
          <button
            onClick={() => {
              onClose();
              onNext();
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>{isLastScenario ? '最終結果を見る' : '次の問題へ進む'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
