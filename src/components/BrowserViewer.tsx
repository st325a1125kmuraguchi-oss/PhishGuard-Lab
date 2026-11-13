import React, { useState, useEffect } from 'react';
import {
  Lock,
  RotateCw,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Smartphone,
  Monitor,
  Terminal,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { Scenario } from '../types';
import { getSafeHexColor, maskSensitiveValue } from '../utils/security';

interface BrowserViewerProps {
  scenario: Scenario;
  onBackToEmail: () => void;
  showClues: boolean;
}

export const BrowserViewer: React.FC<BrowserViewerProps> = ({
  scenario,
  onBackToEmail,
  showClues,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showSslExplanation, setShowSslExplanation] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showAttackerTerminal, setShowAttackerTerminal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Prevent cross-scenario sensitive data leakage in browser memory
  useEffect(() => {
    setFormData({});
    setIsSubmitted(false);
    setShowAttackerTerminal(false);
    setShowSslExplanation(false);
  }, [scenario.id]);

  const website = scenario.websiteData;
  if (!website) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        このケースにはウェブサイトのシミュレーションはありません。メール本文から判断してください。
      </div>
    );
  }

  const handleInputChange = (fieldId: string, val: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setShowAttackerTerminal(true);
  };

  const handleClearSensitiveData = () => {
    setFormData({});
    setIsSubmitted(false);
    setShowAttackerTerminal(false);
  };

  const domainData = website.browserDomainParsed;
  const safeBrandColor = getSafeHexColor(scenario.brand.brandColor, '#0f172a');

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-full">
      {/* Browser Chrome Window Controls & Address Bar */}
      <div className="bg-slate-100 border-b border-slate-200 p-2 sm:p-3">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-3 mb-2">
          {/* Back to mail button & window dots */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToEmail}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>メール画面に戻る</span>
            </button>
            <div className="hidden sm:flex gap-1.5 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            </div>
          </div>

          {/* Viewport switch: Desktop / Mobile */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-2 py-1 rounded-md flex items-center gap-1 font-medium transition-colors ${
                deviceMode === 'desktop'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PC表示</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-2 py-1 rounded-md flex items-center gap-1 font-medium transition-colors ${
                deviceMode === 'mobile'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">スマホ表示</span>
            </button>
          </div>
        </div>

        {/* Realistic Omnibar (Address Bar) */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono shadow-inner">
            {/* SSL Padlock Icon */}
            <button
              type="button"
              onClick={() => setShowSslExplanation(!showSslExplanation)}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer shrink-0"
              title="SSL証明書ステータス（クリックして詳細解説）"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded hidden sm:inline">
                保護された通信
              </span>
            </button>

            {/* URL Breakdown inside Address Bar */}
            <div className="flex-1 overflow-x-auto whitespace-nowrap text-xs flex items-center gap-0.5 custom-scrollbar">
              <span className="text-slate-400">{domainData.protocol}</span>
              {domainData.subdomain && (
                <span className="text-slate-600 bg-slate-100 px-1 rounded">
                  {domainData.subdomain}.
                </span>
              )}
              {/* Highlight main domain */}
              <span
                className={`font-bold px-1 rounded ${
                  domainData.isDeceptive
                    ? 'text-rose-700 bg-rose-50 border border-rose-200'
                    : 'text-emerald-700 bg-emerald-50'
                }`}
              >
                {domainData.domain}
              </span>
              <span className="text-slate-400">{domainData.path}</span>
            </div>

            <RotateCw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          {/* SSL Myth explanation popup */}
          {showSslExplanation && (
            <div className="absolute top-full left-0 mt-1 w-full sm:max-w-md z-30 bg-white border border-amber-200 shadow-lg rounded-lg p-3 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block mb-1">
                    注意: 「鍵マーク＝安全」ではありません！
                  </span>
                  <p className="leading-relaxed">
                    「https://」や鍵マークは通信が暗号化されていること（盗聴防止）を示すだけで、<strong>アクセス先の相手が本物かどうかは保証しません</strong>。
                    現在では詐欺グループも無料SSL証明書（Let's Encrypt等）を取得して鍵マークを表示させるのが常識です。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* URL Warning banner if deceptive */}
        {domainData.isDeceptive && showClues && (
          <div className="mt-2 text-xs bg-rose-50 border border-rose-200 text-rose-800 p-2 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>URLの罠:</strong> 実際の接続先は「
                <span className="font-mono font-bold text-rose-900">{domainData.domain}</span>
                」です（公式の {scenario.brand.officialDomain} ではありません）
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Browser Viewport Area (Responsive Desktop / Mobile simulated frame) */}
      <div
        className={`flex-1 bg-slate-200/50 p-4 overflow-y-auto flex justify-center custom-scrollbar ${
          deviceMode === 'mobile' ? 'items-start' : 'items-stretch'
        }`}
      >
        <div
          className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 ${
            deviceMode === 'mobile' ? 'w-full max-w-sm my-2' : 'w-full'
          }`}
        >
          {/* Site Mock Header */}
          <div
            className="p-4 border-b border-slate-100 flex items-center justify-between"
            style={{ borderTop: `4px solid ${safeBrandColor}` }}
          >
            <div className="font-bold text-lg tracking-tight text-slate-900">
              {scenario.brand.name}
            </div>
            {website.fakeSecurityBadgeText && (
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                {website.fakeSecurityBadgeText}
              </span>
            )}
          </div>

          {/* Site Headline & Urgency Countdown */}
          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                {website.siteHeadline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">{website.siteSubtext}</p>
            </div>

            {/* Urgency Alert Box */}
            {website.urgencyTimerSeconds && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-center justify-between text-xs text-rose-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
                  <span className="font-semibold">セッション有効期限（残り時間）</span>
                </div>
                <span className="font-mono font-bold text-sm text-rose-900 tabular-nums">
                  23分48秒
                </span>
              </div>
            )}

            {/* Interactive Form Simulation (Protected against autofill & external submission) */}
            <form onSubmit={handleSimulateSubmit} autoComplete="off" className="space-y-4 pt-2">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>入力フォーム（体験用）</span>
                  <span className="text-[11px] text-slate-400">※ 本物のパスワードやカード番号は絶対に入力しないでください</span>
                </div>

                {website.requiredFields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label className="block text-xs font-medium text-slate-700 flex items-center justify-between">
                      <span>{field.label}</span>
                      {showClues && (
                        <span className="text-[10px] text-rose-600 font-normal">
                          狙い: {field.attackerBenefit}
                        </span>
                      )}
                    </label>
                    <input
                      type={field.type === 'password' ? 'password' : 'text'}
                      name={`sim_${scenario.id}_${field.id}`}
                      autoComplete="off"
                      spellCheck={false}
                      maxLength={128}
                      data-lpignore="true"
                      data-1p-ignore="true"
                      placeholder={field.placeholder}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>ダミー送信して「攻撃者の裏画面」を見る</span>
                </button>
                {Object.keys(formData).length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSensitiveData}
                    className="py-2.5 px-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    入力値を消去
                  </button>
                )}
              </div>
            </form>

            {/* Attacker Terminal Simulation Modal / Panel */}
            {showAttackerTerminal && (
              <div className="mt-4 bg-slate-950 text-slate-100 rounded-xl p-4 border border-slate-800 text-xs font-mono shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Terminal className="w-4 h-4" />
                    <span className="font-bold">攻撃者C2サーバーの受信ログ (実演シミュレーション)</span>
                  </div>
                  <button
                    onClick={() => setShowAttackerTerminal(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    閉じる
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                  <div className="text-amber-400">
                    [INFO] 2026-10-28 15:43:02 UTC - New victim connected from Tokyo, JP
                  </div>
                  <div className="text-emerald-400 font-semibold">
                    [EXFILTRATED DATA CAPTURED]:
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-300 space-y-1">
                    {website.requiredFields.map((field) => (
                      <div key={field.id} className="flex justify-between gap-2">
                        <span className="text-slate-400">{field.label}:</span>
                        <span className="text-amber-300 font-bold truncate max-w-[60%]">
                          {maskSensitiveValue(formData[field.id] || '', field.id, field.type)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-rose-400">
                    [AUTOMATED BOT]: Stolen credentials verified. Initiating immediate API login...
                  </div>
                  <div className="text-slate-400 text-[10px] pt-1">
                    💡 解説: フィッシングサイトで「送信」を押した瞬間、攻撃者の管理画面にデータが平文で保存され、自動化ボットにより数秒〜数分で不正送金やギフト券購入が試みられます。
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
