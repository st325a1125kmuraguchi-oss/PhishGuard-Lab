import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  PhoneCall,
  CheckCircle2,
  Clock,
  KeyRound,
  ExternalLink,
  Smartphone,
  Lock,
  BookmarkCheck,
  CreditCard,
  Building2,
} from 'lucide-react';

export const Handbook: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'rules' | 'emergency' | 'trends'>('rules');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Handbook Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <span>フィッシング詐欺 防犯ハンドブック & 緊急対応マニュアル</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          被害を未然に防ぐ日常の心得から、万が一入力してしまった際の初動対処法までを網羅しています。
        </p>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-4 mt-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveCategory('rules')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeCategory === 'rules'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            日常の4大防犯鉄則
          </button>
          <button
            onClick={() => setActiveCategory('emergency')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeCategory === 'emergency'
                ? 'border-rose-600 text-rose-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            もし入力してしまった時の緊急対応
          </button>
          <button
            onClick={() => setActiveCategory('trends')}
            className={`pb-3 border-b-2 transition-all cursor-pointer ${
              activeCategory === 'trends'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            最新の巧妙な手口トレンド
          </button>
        </div>
      </div>

      {/* Category 1: 4 Golden Rules */}
      {activeCategory === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm font-mono">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              メール・SMS内のリンクは絶対に押さない
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              「アカウント停止」「カード更新」「不正アクセス」といった連絡が来たら、メール内のボタンやURLは無視してください。
              <strong>スマホの公式アプリアイコンや、事前に登録した正規ブックマーク</strong>からのみアクセスする習慣を徹底しましょう。
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm font-mono">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              「SSL鍵マーク＝本物」と思い込まない
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              アドレスバーの鍵マーク（https://）は「通信が暗号化されている」だけであり、「通信相手が本物である」保証にはなりません。
              現在の詐欺グループの9割以上は無料SSL証明書を導入して鍵マークを表示させています。
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm font-mono">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              「暗証番号（4桁）」と「ワンタイムパスワード」は絶対厳守
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              金融機関やカード会社が、メールやSMSからWEBフォームに誘導して「ATM暗証番号（4桁）」を入力させることは絶対にありません。
              また、スマホに届いたSMS認証コード（OTP）を他人の指示で入力すると、即座に不正送金が実行されます。
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm font-mono">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              「24時間以内」「本日送電停止」の脅迫に焦らない
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              詐欺メールは「今すぐ行動しないと大変なことになる」というパニックを起こさせ、冷静な確認を妨害するのが最大の武器です。
              緊急を要する通告ほど、一度深呼吸して家族や公式窓口に確認してください。
            </p>
          </div>
        </div>
      )}

      {/* Category 2: Emergency Response */}
      {activeCategory === 'emergency' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block">
                詐欺サイトに情報を入力してしまった！どうすればいい？
              </span>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                スピードが被害の拡大を防ぎます。以下の順序で直ちに対処してください。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  クレジットカード会社へ直ちに電話（カード利用停止）
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  カード番号や有効期限、セキュリティコードを入力してしまった場合、カード裏面に記載された緊急紛失・盗難デスク（24時間対応）へ電話し、カードの利用停止と再発行手続きを依頼してください。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  パスワードの変更と全端末サインアウト
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  公式サイトの正規ページから即座にパスワードを変更してください。同じパスワードを他サービスでも使い回している場合は、被害が連鎖するためそれらも全て変更します。「全セッションからログアウト」を実行して攻撃者を追い出します。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  不正アプリ（apk）をインストールしてしまった場合
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  直ちにスマートフォンを<strong>「機内モード」</strong>にして通信を遮断してください。その後、端末の「設定」→「アプリ一覧」から見慣れない不審なアプリを探してアンインストールします。初期化（工場出荷状態）が最も安全です。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                4
              </span>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">公的相談窓口への通報・相談</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-800 block">警察相談専用電話</span>
                    <span className="text-blue-600 font-mono font-bold text-base block mt-0.5">#9110</span>
                    <span className="text-slate-500 text-[11px]">全国共通・最寄りの警察相談窓口につながります</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-800 block">消費者ホットライン</span>
                    <span className="text-blue-600 font-mono font-bold text-base block mt-0.5">188 (いやや！)</span>
                    <span className="text-slate-500 text-[11px]">地方自治体の消費生活センターへ案内されます</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category 3: Trends */}
      {activeCategory === 'trends' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-purple-600">最新手口 01</span>
            <h4 className="font-bold text-slate-900 text-sm">リアルタイム中継（AiTM攻撃）</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              従来の「偽フォームに保存して後で使う」のではなく、攻撃者サーバーが本物のサイトとの間に立ち、被害者が入力した二要素認証OTPコードを数秒以内に自動中継して即座にログインを突破する手口です。
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-purple-600">最新手口 02</span>
            <h4 className="font-bold text-slate-900 text-sm">生成AIによる自然な日本語フィッシング</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              従来の「怪しい不自然なフォントや日本語」は通用しなくなっています。最新の生成AIを活用して完璧なビジネス敬語や、実在する公的プレスリリースをそのまま複製した見分けのつかないメールが急増しています。
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
            <span className="text-xs font-bold text-purple-600">最新手口 03</span>
            <h4 className="font-bold text-slate-900 text-sm">クラウドサービス偽装 (DocuSign/Teams)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              企業や個人向けに「電子契約の署名依頼」「社内Teams通話の不在着信」を騙り、Microsoft 365やGoogleアカウントの認証情報を奪い取る手口です。業務のメールボックスが直接乗っ取られます。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
