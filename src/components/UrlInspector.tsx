import React, { useState, useEffect } from 'react';
import {
  Search,
  AlertTriangle,
  ShieldCheck,
  Info,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { inspectUrlSecurity } from '../utils/security';

interface PresetUrl {
  name: string;
  url: string;
  type: 'phishing' | 'legitimate';
  trickDescription: string;
}

const PRESET_URLS: PresetUrl[] = [
  {
    name: 'Amazon サブドメイン偽装',
    url: 'https://amazon.co.jp.acc-security-auth.top/ap/signin',
    type: 'phishing',
    trickDescription: '先頭に「amazon.co.jp」を配置していますが、本物の親ドメインは末尾の「acc-security-auth.top」です。',
  },
  {
    name: '国税庁 ハイフン連結偽装',
    url: 'https://nta.go.jp-tax-payment-portal.xyz/pay/urgent',
    type: 'phishing',
    trickDescription: '「nta.go.jp」の後ろにハイフンをつなぎ、末尾は格安ドメイン「.xyz」になっています。正規の公的機関は必ず「.go.jp」単独で終わります。',
  },
  {
    name: 'タイポスクワッティング（類似文字の罠）',
    url: 'https://www.arnazon.co.jp/orders',
    type: 'phishing',
    trickDescription: '「amazon」ではなく「arnazon」（rとnの組み合わせでmに見せかける）という巧妙な文字の錯視を利用したドメインです。',
  },
  {
    name: '三井住友カード ハイフン偽装',
    url: 'https://vpass-ne-jp.com/auth/login.html',
    type: 'phishing',
    trickDescription: '公式の「vpass.ne.jp」のドットをハイフンに置き換え、「.com」を取得して本物と誤認させています。',
  },
  {
    name: '正規のAmazon公式サイト',
    url: 'https://www.amazon.co.jp/gp/your-account/order-history',
    type: 'legitimate',
    trickDescription: 'メインドメインが間違いなく「amazon.co.jp」であり、サブドメイン「www」も正規の構成です。',
  },
  {
    name: '正規の国税庁公式サイト',
    url: 'https://www.nta.go.jp/taxes/nozei/annai.htm',
    type: 'legitimate',
    trickDescription: '日本国の公的機関専用の「.go.jp」ドメインが正しく使用されています。',
  },
  {
    name: 'LINE アカウント偽装（.shop）',
    url: 'https://access.line.me.account-verify-step.shop/login',
    type: 'phishing',
    trickDescription: '本物の「access.line.me」をサブドメインに置き、末尾の「.shop」ドメインでアカウント乗っ取りを狙っています。',
  },
];


export const UrlInspector: React.FC<{ initialUrl?: string }> = ({ initialUrl }) => {
  const [inputUrl, setInputUrl] = useState(
    initialUrl || 'https://amazon.co.jp.acc-security-auth.top/ap/signin'
  );

  useEffect(() => {
    if (initialUrl) {
      setInputUrl(initialUrl);
    }
  }, [initialUrl]);

  const parsed = inspectUrlSecurity(inputUrl);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title & Concept Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <span>URL解剖ラボ（構造見破りシミュレーター）</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              詐欺グループがURLを偽装する「3大テクニック（サブドメイン偽装・類似文字・ハイフン連結）」を視覚的に分解して学びます。
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-700 block mb-2">
            代表的な詐欺手口のプリセットを選択:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PRESET_URLS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setInputUrl(preset.url)}
                className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  inputUrl === preset.url
                    ? 'border-blue-500 bg-blue-50/80 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-slate-900 truncate">{preset.name}</span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded shrink-0 ${
                      preset.type === 'phishing'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {preset.type === 'phishing' ? '偽装 ⚠️' : '正規 🛡️'}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 truncate">{preset.url}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* URL Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-700">
          検査するURLを入力または貼り付け:
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              maxLength={2048}
              spellCheck={false}
              autoComplete="off"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://example.com/..."
              className="w-full px-4 py-3 text-xs sm:text-sm font-mono border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Visual Anatomy Breakdown Box */}
        <div className="p-5 bg-slate-950 text-white rounded-xl space-y-4 font-mono shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs text-slate-400 font-sans font-bold">
              URLの要素別カラー分解図
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-sans font-bold ${
                parsed.isSafe
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {parsed.isSafe ? '安全な正規URL' : '危険な不審URL'}
            </span>
          </div>

          {/* Interactive Colored Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm py-2">
            <div className="flex flex-col items-center">
              <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {parsed.protocol || 'https://'}
              </span>
              <span className="text-[10px] text-slate-400 font-sans mt-1">プロトコル</span>
            </div>

            {parsed.subdomain && (
              <>
                <span className="text-slate-600">/</span>
                <div className="flex flex-col items-center">
                  <span className="px-2 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    {parsed.subdomain}
                  </span>
                  <span className="text-[10px] text-amber-400 font-sans mt-1">サブドメイン (看板)</span>
                </div>
              </>
            )}

            <span className="text-slate-600">.</span>

            <div className="flex flex-col items-center">
              <span
                className={`px-3 py-1 rounded font-bold border ${
                  parsed.isSafe
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                }`}
              >
                {parsed.domain}
              </span>
              <span className="text-[10px] text-rose-400 font-sans font-bold mt-1">
                ★ 実際の通信先ドメイン
              </span>
            </div>

            {parsed.path && (
              <>
                <span className="text-slate-600">/</span>
                <div className="flex flex-col items-center">
                  <span className="px-2 py-1 rounded bg-slate-800/80 text-slate-400 border border-slate-700 truncate max-w-[200px]">
                    {parsed.path}
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans mt-1">パス・引数</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Suspicious Factors or Safe Indicators */}
        <div className="space-y-3 pt-2">
          {parsed.suspiciousFactors.length > 0 ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>検出された危険な特徴 ({parsed.suspiciousFactors.length}件):</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-800 list-disc list-inside">
                {parsed.suspiciousFactors.map((factor, i) => (
                  <li key={i} className="leading-relaxed font-medium">
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold block text-sm">怪しい偽装パターンは見つかりませんでした</span>
                メインドメインが正当な形式であり、不審なサブドメインや悪質なTLDも検出されていません。
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guide Cards: 3 Common URL Tricks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-blue-600 font-mono">01. サブドメインの罠</div>
          <h4 className="font-bold text-slate-900 text-sm">看板に騙されるな</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            <code>amazon.co.jp.attacker.com</code> の場合、本物のサイトは「attacker.com」です。
            URLの左側ではなく、<strong>「最初のスラッシュ(/)の直前にある2〜3個の英単語」</strong>が本当のドメインです。
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-blue-600 font-mono">02. 類似文字（タイポ）</div>
          <h4 className="font-bold text-slate-900 text-sm">一見同じに見えるスペル</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            <code>arnazon.co.jp</code> (rn = m), <code>amaz0n.com</code> (0 = o), <code>app1e.com</code> (1 = l) など、
            人間の脳の思い込みを利用したドメインです。目を凝らして1文字ずつ確認しましょう。
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold text-blue-600 font-mono">03. 危険なTLD</div>
          <h4 className="font-bold text-slate-900 text-sm">格安ドメインに警戒</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            日本の大企業や公的機関が <code>.xyz</code>, <code>.top</code>, <code>.cc</code>, <code>.club</code> などの
            数十円〜数百円で使い捨て購入できる海外TLDを使用することはまずありません。
          </p>
        </div>
      </div>
    </div>
  );
};
