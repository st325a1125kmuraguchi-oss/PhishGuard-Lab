import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Shield, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Info, Paperclip, MousePointerClick } from 'lucide-react';
import { Scenario, Clue } from '../types';
import { sanitizeEmailHtml, getSafeHexColor } from '../utils/security';

interface MailViewerProps {
  scenario: Scenario;
  onOpenWebsite: () => void;
  showClues: boolean;
  selectedClueId?: string | null;
  onSelectClue?: (clue: Clue) => void;
}

export const MailViewer: React.FC<MailViewerProps> = ({
  scenario,
  onOpenWebsite,
  showClues,
  selectedClueId,
  onSelectClue,
}) => {
  const [showFullHeaders, setShowFullHeaders] = useState(false);
  const [hoveringLink, setHoveringLink] = useState(false);

  useEffect(() => {
    setShowFullHeaders(false);
    setHoveringLink(false);
  }, [scenario.id]);

  const sanitizedBodyHtml = useMemo(
    () => sanitizeEmailHtml(scenario.emailData.bodyHtml),
    [scenario.emailData.bodyHtml]
  );

  const safeBrandColor = getSafeHexColor(scenario.brand.brandColor, '#334155');

  const senderClues = scenario.clues.filter((c) => c.location === 'email_sender');
  const bodyClues = scenario.clues.filter((c) => c.location === 'email_body' || c.location === 'email_cta');

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-full relative">
      {/* Mail Client App Header Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 items-center mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
          </div>
          <Mail className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-700">受信用メールボックス</span>
          <span className="text-slate-400">/</span>
          <span className="truncate max-w-[200px] sm:max-w-xs">{scenario.brand.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFullHeaders(!showFullHeaders)}
            className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{showFullHeaders ? 'ヘッダーを閉じる' : '詳細ヘッダー'}</span>
            {showFullHeaders ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Message Info Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {scenario.emailData.subject}
          </h2>
          <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 font-mono">
            {scenario.emailData.receivedDate}
          </span>
        </div>

        {/* Sender details */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0"
            style={{ backgroundColor: safeBrandColor }}
          >
            {scenario.brand.name.slice(0, 1)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-slate-900 text-sm">
                {scenario.emailData.senderDisplayName}
              </span>
              <span
                className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                  showClues && senderClues.length > 0
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                    : 'text-slate-500 bg-slate-100'
                }`}
              >
                &lt;{scenario.emailData.senderEmailAddress}&gt;
              </span>
            </div>

            <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
              <span>宛先: {scenario.emailData.recipientName} &lt;{scenario.emailData.recipientEmail}&gt;</span>
            </div>

            {/* Suspicious Sender Alert if in clue mode */}
            {showClues && senderClues.length > 0 && (
              <div className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">送信元の不審点:</span> {senderClues[0].explanation}
                </div>
              </div>
            )}

            {/* Collapsible Full Headers */}
            {showFullHeaders && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono space-y-1 text-slate-600 shadow-xs">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-700">From:</span>
                  <span className="text-right truncate">{scenario.emailData.senderDisplayName} &lt;{scenario.emailData.senderEmailAddress}&gt;</span>
                </div>
                {scenario.emailData.replyToAddress && (
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-bold text-slate-700">Reply-To:</span>
                    <span className="text-right truncate">{scenario.emailData.replyToAddress}</span>
                  </div>
                )}
                {scenario.emailData.spfStatus && (
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                    <span className="font-bold text-slate-700">SPF送信元認証:</span>
                    <span
                      className={`font-bold uppercase ${
                        scenario.emailData.spfStatus === 'pass'
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {scenario.emailData.spfStatus}
                      {scenario.emailData.spfStatus !== 'pass' && ' (送信元なりすましの疑いあり)'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-bold text-slate-700">公式ドメイン:</span>
                  <span className="text-slate-900 font-semibold">{scenario.brand.officialDomain}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Body Content */}
      <div className="p-5 sm:p-6 flex-1 overflow-y-auto custom-scrollbar text-slate-800 text-sm leading-relaxed space-y-4">
        {/* Attachment preview if exists */}
        {scenario.emailData.hasAttachment && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs mb-4">
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-700">{scenario.emailData.hasAttachment.filename}</span>
              <span className="text-slate-400 font-mono">({scenario.emailData.hasAttachment.filesize})</span>
            </div>
            {scenario.emailData.hasAttachment.isSuspicious && (
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                危険な拡張子（実行ファイル等の疑い）
              </span>
            )}
          </div>
        )}

        {/* Rich Email Content (DOMPurify Sanitized) */}
        <div
          className="prose prose-sm max-w-none text-slate-800 leading-relaxed [&_*]:text-slate-800 [&_strong]:text-slate-900 [&_strong]:font-bold"
          dangerouslySetInnerHTML={{ __html: sanitizedBodyHtml }}
        />

        {/* CTA Button & Realistic Hover Target */}
        <div className="pt-4 pb-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700 block mb-0.5">メール内の誘導先リンク:</span>
              <span className="text-slate-400 text-[11px]">
                ボタンにマウスを乗せると（ホバー）、左下に本当のリンク先URLが表示されます
              </span>
            </div>
            <button
              onClick={onOpenWebsite}
              onMouseEnter={() => setHoveringLink(true)}
              onMouseLeave={() => setHoveringLink(false)}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-lg shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
            >
              <span>{scenario.emailData.ctaButtonText}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clue callouts in explanation mode */}
        {showClues && bodyClues.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              本文中の注目ポイント:
            </h4>
            {bodyClues.map((clue) => (
              <div
                key={clue.id}
                onClick={() => onSelectClue?.(clue)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedClueId === clue.id
                    ? 'border-blue-500 bg-blue-50 shadow-xs'
                    : clue.isScamIndicator
                    ? 'border-amber-200 bg-amber-50/70 hover:bg-amber-100/60'
                    : 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-slate-900">{clue.title}</span>
                  <span
                    className={`font-semibold ${
                      clue.isScamIndicator ? 'text-amber-700' : 'text-emerald-700'
                    }`}
                  >
                    {clue.isScamIndicator ? '詐欺の兆候 ⚠️' : '正規の特徴 🛡️'}
                  </span>
                </div>
                <div className="text-slate-600">{clue.explanation}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Realistic Browser/Mail Status Bar Link Preview on Hover */}
      <div
        className={`bg-slate-900 text-slate-200 px-3 py-1.5 text-[11px] font-mono border-t border-slate-800 flex items-center gap-2 transition-all ${
          hoveringLink ? 'opacity-100' : 'opacity-80'
        }`}
      >
        <span className="text-slate-400">リンク先URLプレビュー:</span>
        <span className="text-amber-300 font-semibold truncate">
          {scenario.emailData.targetUrl}
        </span>
        {scenario.isPhishing && (
          <span className="ml-auto text-[10px] text-rose-300 font-sans hidden sm:inline">
            ※ 実際のURLを必ず確認！
          </span>
        )}
      </div>
    </div>
  );
};
