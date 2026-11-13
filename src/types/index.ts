export type ScenarioCategory =
  | 'EC・通販'
  | '公的機関・税務'
  | '金融・ネット銀行'
  | '配送・物流'
  | '交通・インフラ'
  | 'IT・アカウント'
  | '通信・キャリア'
  | 'エンタメ・サブスク';

export type DifficultyLevel = '初級' | '中級' | '上級' | '巧妙';

export type ClueType = 'sender' | 'url' | 'content' | 'psychology' | 'request';

export interface Clue {
  id: string;
  type: ClueType;
  title: string;
  location: 'email_sender' | 'email_body' | 'email_cta' | 'site_url' | 'site_content';
  targetSnippet: string;
  explanation: string;
  isScamIndicator: boolean; // true = scam clue, false = legitimate security indicator
  severity: 'danger' | 'warning' | 'safe';
}

export interface Scenario {
  id: string;
  title: string;
  category: ScenarioCategory;
  difficulty: DifficultyLevel;
  isPhishing: boolean;
  brand: {
    name: string;
    officialDomain: string;
    logoText: string;
    brandColor: string;
  };
  emailData: {
    senderDisplayName: string;
    senderEmailAddress: string;
    replyToAddress?: string;
    returnPath?: string;
    spfStatus?: 'pass' | 'fail' | 'softfail' | 'none';
    receivedDate: string;
    recipientName: string;
    recipientEmail: string;
    subject: string;
    bodyHtml: string;
    ctaButtonText: string;
    targetUrl: string;
    hasAttachment?: {
      filename: string;
      filesize: string;
      isSuspicious: boolean;
    };
  };
  websiteData?: {
    pageTitle: string;
    simulatedUrl: string;
    browserDomainParsed: {
      protocol: string;
      subdomain: string;
      domain: string;
      path: string;
      isDeceptive: boolean;
    };
    siteHeadline: string;
    siteSubtext: string;
    urgencyTimerSeconds?: number;
    requiredFields: Array<{
      id: string;
      label: string;
      type: 'text' | 'password' | 'creditCard' | 'cvv' | 'expiry' | 'otp';
      placeholder: string;
      attackerBenefit: string;
    }>;
    fakeSecurityBadgeText?: string;
  };
  clues: Clue[];
  analysis: {
    verdictTitle: string;
    summary: string;
    dangerLevel: '極めて危険' | '危険' | '中程度' | '安全（正規通信）';
    scamTypeClassification?: string;
    attackerGoal: string;
    damageScenario: string;
    safeAlternativeAction: string;
  };
}

export interface UserJudgment {
  scenarioId: string;
  userSaidPhishing: boolean;
  isCorrect: boolean;
  timeSpentSeconds: number;
  identifiedClueIds: string[];
}
