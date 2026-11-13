import DOMPurify from 'dompurify';

const ALLOWED_EMAIL_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  'ul',
  'ol',
  'li',
  'span',
  'div',
];

const SAFE_HEX_COLOR_RE = /^#[0-9a-fA-F]{3,8}$/;

/**
 * Validate brand color hex codes to prevent CSS injection via inline styles.
 */
export function getSafeHexColor(color: string | undefined, fallback = '#334155'): string {
  if (!color) return fallback;
  return SAFE_HEX_COLOR_RE.test(color.trim()) ? color.trim() : fallback;
}

/**
 * Strictly sanitize HTML email bodies before rendering via dangerouslySetInnerHTML.
 * Blocks scripts, event handlers, iframes, SVGs, external resource requests, and CSS expressions.
 */
export function sanitizeEmailHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return '';

  // Register a one-time style sanitization hook via DOMPurify's sanitize options / post-hook
  const sanitized = DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ALLOWED_EMAIL_TAGS,
    ALLOWED_ATTR: ['style'],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'svg', 'a', 'img', 'form', 'input', 'link', 'meta', 'base'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'href', 'src', 'action', 'formaction'],
  });

  // Strip potentially dangerous CSS values (e.g., url(), expression(), javascript:) from inline style attributes
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitized, 'text/html');
    const elements = doc.body.querySelectorAll('[style]');
    elements.forEach((el) => {
      const styleVal = el.getAttribute('style') || '';
      if (/url\s*\(|expression\s*\(|javascript:|@import|behavior\s*:/i.test(styleVal)) {
        el.removeAttribute('style');
      }
    });
    return doc.body.innerHTML;
  }

  return sanitized;
}

/**
 * Mask sensitive credentials (passwords, card numbers, PINs, CVVs, OTPs)
 * before echoing them in the educational C2 terminal simulation so real user input
 * is never exposed in plaintext.
 */
export function maskSensitiveValue(
  rawValue: string,
  fieldId: string,
  fieldType: string
): string {
  const val = rawValue.trim();
  if (!val) {
    return '(ダミー値自動生成: demo_safe_token)';
  }

  const lowerId = fieldId.toLowerCase();
  const isSecretField =
    fieldType === 'password' ||
    lowerId.includes('password') ||
    lowerId.includes('pw') ||
    lowerId.includes('pin') ||
    lowerId.includes('cvv') ||
    lowerId.includes('security') ||
    lowerId.includes('otp') ||
    lowerId.includes('mynumber');

  if (isSecretField) {
    return '•••••••• (メモリ上で保護・マスク済み)';
  }

  if (fieldType === 'creditCard' || lowerId.includes('card')) {
    const digits = val.replace(/\D/g, '');
    if (digits.length >= 4) {
      return `****-****-****-${digits.slice(-4)} (マスク済み)`;
    }
    return '****-****-****-**** (マスク済み)';
  }

  if (val.length > 4) {
    return `${val.slice(0, 2)}${'*'.repeat(Math.min(8, val.length - 2))}`;
  }

  return '****';
}

export interface ParsedUrlSecurityReport {
  protocol: string;
  subdomain: string;
  sld: string;
  tld: string;
  domain: string;
  path: string;
  suspiciousFactors: string[];
  isSafe: boolean;
}

const SUSPICIOUS_TLDS = [
  '.top',
  '.xyz',
  '.cc',
  '.info',
  '.club',
  '.buzz',
  '.vip',
  '.work',
  '.rest',
  '.shop',
  '.click',
  '.tokyo',
  '.icu',
];

const IMPERSONATED_BRANDS = [
  'amazon',
  'rakuten',
  'apple',
  'smbc',
  'vpass',
  'kuroneko',
  'yamato',
  'tepco',
  'nta',
  'go.jp',
  'google',
  'eki-net',
  'line',
  'mercari',
  'etc-meisai',
  'paypay',
  'netflix',
  'docomo',
  'daccount',
  'mufg',
  'microsoft',
  'openai',
  'nintendo',
  'japanpost',
  'myna',
];

const KNOWN_JAPAN_SLD_SUFFIXES = ['co.jp', 'ne.jp', 'go.jp', 'ac.jp', 'or.jp', 'gr.jp', 'ed.jp', 'lg.jp'];

/**
 * Analyze a URL for phishing indicators and dangerous protocols.
 * Handles edge cases such as dangerous URI schemes (javascript:/data:),
 * @ userinfo credential obfuscation, IDN Punycode homographs, and .go.jp/.ne.jp TLDs.
 */
export function inspectUrlSecurity(rawUrl: string): ParsedUrlSecurityReport {
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return {
      protocol: '',
      subdomain: '',
      sld: '',
      tld: '',
      domain: '',
      path: '',
      suspiciousFactors: ['URLが入力されていません'],
      isSafe: false,
    };
  }

  if (trimmed.length > 2048) {
    return {
      protocol: '',
      subdomain: '',
      sld: '',
      tld: '',
      domain: trimmed.slice(0, 64) + '...',
      path: '',
      suspiciousFactors: ['URLが極端に長すぎます（2048文字超：難読化・バッファ悪用の疑い）'],
      isSafe: false,
    };
  }

  // Reject control characters
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) {
    return {
      protocol: '',
      subdomain: '',
      sld: '',
      tld: '',
      domain: '(制御文字を含む不正なURL)',
      path: '',
      suspiciousFactors: ['URL内に不正な制御文字が含まれています'],
      isSafe: false,
    };
  }

  // Check dangerous protocols BEFORE prepending https://
  const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme !== 'http' && scheme !== 'https') {
      return {
        protocol: `${scheme}:`,
        subdomain: '',
        sld: '',
        tld: '',
        domain: '(危険なURIスキーム)',
        path: '',
        suspiciousFactors: [
          `危険なURIスキーム「${scheme}:」が検出されました（XSSやローカルファイル悪用の恐れがありWebリンクとして不正です）`,
        ],
        isSafe: false,
      };
    }
  }

  try {
    let urlToParse = trimmed;
    if (!/^https?:\/\//i.test(urlToParse)) {
      urlToParse = 'https://' + urlToParse;
    }

    const parsed = new URL(urlToParse);
    const host = parsed.hostname.toLowerCase();
    const protocol = parsed.protocol + '//';
    const path = parsed.pathname + (parsed.search || '');
    const suspiciousFactors: string[] = [];

    // 1. Check @ userinfo credential obfuscation trick (e.g., https://amazon.co.jp@evil.com)
    if (parsed.username || parsed.password) {
      suspiciousFactors.push(
        `URLに「@」を含むユーザー情報偽装（${parsed.username}@...）が使われています。ブラウザが実際に接続するのは「@」より右側の「${host}」です`
      );
    }

    // 2. Check non-standard port
    if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
      suspiciousFactors.push(`標準以外のポート番号（:${parsed.port}）が指定されています`);
    }

    // 3. Check Punycode / IDN Homograph attack (xn--) or non-ASCII homoglyphs
    if (host.includes('xn--') || /[^\x00-\x7F]/.test(trimmed)) {
      suspiciousFactors.push(
        '国際化ドメイン名（Punycode「xn--」または非ASCII文字）が含まれており、類似文字によるホモグラフ偽装攻撃の危険があります'
      );
    }

    // 4. Check suspicious TLDs
    if (SUSPICIOUS_TLDS.some((tld) => host.endsWith(tld))) {
      suspiciousFactors.push('詐欺サイトで多用される格安・使い捨てTLD（トップレベルドメイン）が使用されています');
    }

    // 5. IP address check (IPv4 or IPv6)
    const isIpv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
    const isIpv6 = host.startsWith('[') && host.endsWith(']');
    if (isIpv4 || isIpv6) {
      suspiciousFactors.push('ドメイン名ではなく数字のIPアドレスが直接使われています');
    }

    // 6. Subdomain & parent domain decomposition (properly preserves .go.jp / .ne.jp / .co.jp etc.)
    const parts = host.split('.').filter(Boolean);
    let subdomain = '';
    let domain = host;
    let sld = '';
    let tld = '';

    if (parts.length >= 2) {
      const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
      if (KNOWN_JAPAN_SLD_SUFFIXES.includes(lastTwo) && parts.length >= 3) {
        tld = lastTwo;
        sld = parts[parts.length - 3];
        subdomain = parts.slice(0, parts.length - 3).join('.');
        domain = `${sld}.${tld}`;
      } else {
        tld = parts[parts.length - 1];
        sld = parts[parts.length - 2];
        subdomain = parts.slice(0, parts.length - 2).join('.');
        domain = `${sld}.${tld}`;
      }
    }

    // 7. Brand impersonation inside subdomain
    if (subdomain) {
      for (const brand of IMPERSONATED_BRANDS) {
        if (subdomain.includes(brand)) {
          suspiciousFactors.push(
            `サブドメインに「${brand}」が含まれていますが、実際の親ドメインは「${domain}」です（サブドメイン偽装の疑い）`
          );
          break;
        }
      }
    }

    // 8. Typosquatting checks
    if (/(arnazon|amaz0n|app1e|paypa1|micros0ft|g00gle|rakuen|mercrai)/i.test(host)) {
      suspiciousFactors.push('有名企業名に酷似させたタイポスクワッティング（類似文字）が含まれています');
    }

    // 9. Hyphen tricks in SLD
    if (
      sld.includes('-') &&
      /(japan|security|login|update|portal|verify|support|account|auth|service|payment)/i.test(sld)
    ) {
      suspiciousFactors.push(
        'ドメイン名に「-security」「-portal」「-verify」等のハイフン連結語が含まれ、本物に見せかけています'
      );
    }

    // 10. Unencrypted HTTP check
    if (/^http:\/\//i.test(trimmed)) {
      suspiciousFactors.push('通信が暗号化されていない「http://」です');
    }

    return {
      protocol,
      subdomain,
      sld,
      tld,
      domain,
      path,
      suspiciousFactors,
      isSafe: suspiciousFactors.length === 0,
    };
  } catch {
    return {
      protocol: '',
      subdomain: '',
      sld: '',
      tld: '',
      domain: trimmed.slice(0, 120),
      path: '',
      suspiciousFactors: ['URLの構文が無効です'],
      isSafe: false,
    };
  }
}
