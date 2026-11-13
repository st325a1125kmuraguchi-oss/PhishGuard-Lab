import { Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'amazon_prime_spoof',
    title: 'Amazon プライム会員更新の警告',
    category: 'EC・通販',
    difficulty: '初級',
    isPhishing: true,
    brand: {
      name: 'Amazon',
      officialDomain: 'amazon.co.jp',
      logoText: 'amazon.co.jp',
      brandColor: '#FF9900',
    },
    emailData: {
      senderDisplayName: 'Amazon.co.jp カスタマーサービス',
      senderEmailAddress: 'account-update@amaz0n-security-notice.net',
      replyToAddress: 'no-reply@amaz0n-security-notice.net',
      returnPath: 'bounce@amaz0n-security-notice.net',
      spfStatus: 'fail',
      receivedDate: '2026/10/28 09:14',
      recipientName: 'お客様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【重要】Amazonプライム会費のお支払い方法に問題があります。24時間以内に更新してください',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>Amazon.co.jp をご利用いただき、ありがとうございます。</strong></p>
        <p style="margin-bottom: 14px;">平素はAmazonプライムをご利用いただき、誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">お客様のAmazonプライム会員情報の請求処理において、ご登録のクレジットカードへの請求が完了できませんでした。現在、プライム会員の特典（配送料無料、Prime Video等）が一時停止されています。</p>
        <p style="margin-bottom: 16px;"><strong>※ 24時間以内にカード情報を更新されない場合、アカウントは永久に停止され、注文履歴やギフト残高も失効します。</strong></p>
        <p style="margin-bottom: 14px;">大変お手数ですが、下記リンクより至急お支払い方法を再確認・ご登録いただけますようお願い申し上げます。</p>
      `,
      ctaButtonText: '今すぐ支払情報を更新する',
      targetUrl: 'https://amazon.co.jp.acc-security-auth.top/ap/signin',
    },
    websiteData: {
      pageTitle: 'Amazon ログイン / お支払い方法の再確認',
      simulatedUrl: 'https://amazon.co.jp.acc-security-auth.top/ap/signin?openid.pape.max_auth_age=0',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'amazon.co.jp',
        domain: 'acc-security-auth.top',
        path: '/ap/signin',
        isDeceptive: true,
      },
      siteHeadline: 'お客様のAmazonアカウント情報を更新してください',
      siteSubtext: '不正利用防止のため、本人確認とクレジットカード情報の再入力が必要です。',
      urgencyTimerSeconds: 1438,
      fakeSecurityBadgeText: '256-bit SSL Secure Verification Passed',
      requiredFields: [
        {
          id: 'email',
          label: 'Eメールまたは携帯電話番号',
          type: 'text',
          placeholder: 'example@email.com',
          attackerBenefit: 'アカウントのログインIDを収集',
        },
        {
          id: 'password',
          label: 'Amazonのパスワード',
          type: 'password',
          placeholder: 'パスワードを入力',
          attackerBenefit: 'アカウントの完全乗っ取りが可能に',
        },
        {
          id: 'cardNumber',
          label: 'クレジットカード番号',
          type: 'creditCard',
          placeholder: '4111 2222 3333 4444',
          attackerBenefit: '他サイトでの不正ネットショッピング・転売',
        },
        {
          id: 'cvv',
          label: 'セキュリティコード (CVV)',
          type: 'cvv',
          placeholder: 'カード裏面3桁',
          attackerBenefit: '本人認証を突破して即時決済を実行',
        },
      ],
    },
    clues: [
      {
        id: 'amazon_sender_domain',
        type: 'sender',
        title: '送信元メールアドレスに数字の「0」が混入',
        location: 'email_sender',
        targetSnippet: 'account-update@amaz0n-security-notice.net',
        explanation: '表示名は「Amazon.co.jp」ですが、メールアドレスのドメインが「amazon」ではなく数字のゼロ「amaz0n」になっており、末尾も「.net」です。正規のAmazonは「@amazon.co.jp」等から送信されます。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'amazon_subdomain_trick',
        type: 'url',
        title: 'サブドメイン偽装の罠（本物のドメインは .top）',
        location: 'site_url',
        targetSnippet: 'https://amazon.co.jp.acc-security-auth.top',
        explanation: 'URLの先頭に「amazon.co.jp」と書かれていますが、これは単なるサブドメインです。実際に接続しているメインドメインは「acc-security-auth.top」であり、中国やロシア等の安価なドメイン(.top)が使われています。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '典型的なECサイトなりすましフィッシング詐欺',
      summary: 'Amazonのブランドを装い、アカウント停止の恐怖を煽ってログイン情報とクレジットカード全情報を窃取する攻撃です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: 'EC決済・クレカ情報窃盗型',
      attackerGoal: 'Amazonアカウントの乗っ取り、ギフトカードの無断購入、カード情報のダークウェブ売買や不正利用。',
      damageScenario: '入力した瞬間、攻撃者のC2サーバーへ送信され、数分以内に高額商品やデジタルコードが不正決済されます。またアカウントのパスワードと登録メールアドレスを変更され、自身のアカウントに二度とログインできなくなります。',
      safeAlternativeAction: 'メールのリンクは絶対に開かず、普段使っている公式アプリまたは自分で登録した正規ブックマークからAmazonにログインし、「アカウントサービス」→「お客様の支払い方法」で実際のステータスを確認してください。',
    },
  },
  {
    id: 'nta_tax_warning',
    title: '国税庁 e-Tax 差押え最終警告',
    category: '公的機関・税務',
    difficulty: '中級',
    isPhishing: true,
    brand: {
      name: '国税庁 (e-Tax)',
      officialDomain: 'nta.go.jp',
      logoText: '国税庁 e-Tax',
      brandColor: '#1d4ed8',
    },
    emailData: {
      senderDisplayName: '国税庁差押え対策課',
      senderEmailAddress: 'nta-tax-notice@outlook-tokyo.org',
      replyToAddress: 'nta-tax-notice@outlook-tokyo.org',
      spfStatus: 'none',
      receivedDate: '2026/10/28 15:42',
      recipientName: '納税義務者 殿',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【国税庁】重要なお知らせ：令和7年度 所得税未納に伴う財産差押え執行の最終通告',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>国税庁より最終納税告知書の発行について</strong></p>
        <p style="margin-bottom: 14px;">貴殿の令和7年度所得税について、度重なる督促にもかかわらず現時点で金 48,500 円の未納が確認されております。</p>
        <p style="margin-bottom: 14px;">つきましては、国税通則法第37条の規定に基づき、<strong>本日 23:59 までにお支払いがない場合、指定銀行口座および給与の差押え手続き（公売処分）</strong>に移行いたします。</p>
        <p style="margin-bottom: 16px;"><strong>※ 納付期限経過後は延滞税（年14.6%）が加算され、職場への通知が行われます。</strong></p>
        <p style="margin-bottom: 14px;">下記リンクよりe-Tax特設納付ポータルにアクセスし、電子納付（クレジットカードまたは電子マネー）にて至急完納してください。</p>
      `,
      ctaButtonText: '国税庁 電子納税特設ページへ進む',
      targetUrl: 'https://nta.go.jp-tax-payment-portal.xyz/pay/urgent',
    },
    websiteData: {
      pageTitle: '国税庁 電子納税システム（e-Tax）特設窓口',
      simulatedUrl: 'https://nta.go.jp-tax-payment-portal.xyz/pay/urgent?id=TAX-98214',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: '',
        domain: 'nta.go.jp-tax-payment-portal.xyz',
        path: '/pay/urgent',
        isDeceptive: true,
      },
      siteHeadline: '滞納税金 即時電子納付受付',
      siteSubtext: '差押え執行停止のため、48,500円の納付手続きを完了してください。',
      urgencyTimerSeconds: 600,
      fakeSecurityBadgeText: '日本国 政府認証暗号化通信適用済',
      requiredFields: [
        {
          id: 'taxId',
          label: '氏名・生年月日',
          type: 'text',
          placeholder: '山田 太郎 / 1985-05-12',
          attackerBenefit: '個人情報の収集・名簿化',
        },
        {
          id: 'cardNumber',
          label: '納付用クレジットカード番号',
          type: 'creditCard',
          placeholder: '4900 1234 5678 9012',
          attackerBenefit: 'クレジットカード番号の詐取',
        },
        {
          id: 'cvv',
          label: 'セキュリティコード (3桁または4桁)',
          type: 'cvv',
          placeholder: 'CVV/CVC',
          attackerBenefit: '不正引き落としの実行',
        },
        {
          id: 'otp',
          label: 'SMS認証コード (ワンタイムパスワード)',
          type: 'otp',
          placeholder: 'スマホに届いた6桁の数字',
          attackerBenefit: '銀行・カード会社のリアルタイム3Dセキュア認証突破',
        },
      ],
    },
    clues: [
      {
        id: 'nta_gov_domain',
        type: 'sender',
        title: '政府機関ドメイン「.go.jp」ではなく外部民間ドメイン',
        location: 'email_sender',
        targetSnippet: 'nta-tax-notice@outlook-tokyo.org',
        explanation: '日本国の公的機関（省庁・国税庁など）の正規メールアドレスやサイトドメインは必ず「.go.jp」で終わります。一般企業や個人でも取得できる「.org」や無料Webメールサービスが使われることは絶対にありません。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'nta_xyz_domain',
        type: 'url',
        title: 'リンク先が「.xyz」でハイフン連結された怪しいドメイン',
        location: 'site_url',
        targetSnippet: 'https://nta.go.jp-tax-payment-portal.xyz',
        explanation: 'ドメイン名の中に「nta.go.jp」という文字列をハイフンで繋げて騙そうとしていますが、実際のドメインは「nta.go.jp-tax-payment-portal.xyz」です。末尾が「.xyz」という海外の格安ドメインです。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '国税庁を名乗る悪質な公的機関なりすまし詐欺',
      summary: '税金の未納や差押えという法的な恐怖心を突いて、即座にクレジットカード情報やSMSワンタイムコードを入力させる悪質な手口です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: '公的機関詐称・リアルタイムOTP窃取型',
      attackerGoal: 'クレジットカード情報の窃取と、3Dセキュア認証のリアルタイム突破による不正送金・決済。',
      damageScenario: 'カード情報とワンタイムパスワードを入力すると、即座に海外決済代行や暗号資産取引所で数万円〜数十万円の決済が完了してしまいます。',
      safeAlternativeAction: '国税庁や自治体の税務課はメールで差押え予告を送ることはありません。真偽が不安な場合は、メールのURLは無視し、国税庁の代表番号や管轄の税務署へ直接電話でお問い合わせください。',
    },
  },
  {
    id: 'smbc_vpass_security',
    title: '三井住友カード 本人認証システム更新',
    category: '金融・ネット銀行',
    difficulty: '上級',
    isPhishing: true,
    brand: {
      name: '三井住友カード (Vpass)',
      officialDomain: 'smbc-card.com',
      logoText: '三井住友カード',
      brandColor: '#005f3e',
    },
    emailData: {
      senderDisplayName: '三井住友カード (Vpass)',
      senderEmailAddress: 'security-vpass@smbc-card.co-jp-security.com',
      replyToAddress: 'support@smbc-card.co-jp-security.com',
      spfStatus: 'softfail',
      receivedDate: '2026/10/28 11:20',
      recipientName: 'Vpass会員 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【重要】セキュリティ強化に伴うVpass本人認証サービス（3Dセキュア2.0）再設定のお願い',
      bodyHtml: `
        <p style="margin-bottom: 14px;">平素は三井住友カードをご利用いただき、誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">当行ではお客様の安全なオンライン決済のため、セキュリティシステムの大規模なアップデート（3Dセキュア2.0仕様への完全移行）を実施いたしました。</p>
        <p style="margin-bottom: 14px;">これに伴い、<strong>すべてのカード会員様にログイン情報および電話番号認証の再確認</strong>をお願いしております。確認がお済みでない会員様は、一時的にインターネット上でのカード決済機能が制限されます。</p>
        <p style="margin-bottom: 16px;">お手数をお掛けしますが、以下のVpass専用ページよりお手続きをお願い申し上げます。</p>
      `,
      ctaButtonText: 'Vpass本人確認のお手続きへ',
      targetUrl: 'https://www.smbc-card-vpass-online.net/login',
    },
    websiteData: {
      pageTitle: 'Vpassログイン｜三井住友カード',
      simulatedUrl: 'https://www.smbc-card-vpass-online.net/login?sec_id=9831',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'www',
        domain: 'smbc-card-vpass-online.net',
        path: '/login',
        isDeceptive: true,
      },
      siteHeadline: 'Vpassログイン・セキュリティ設定',
      siteSubtext: 'Vpass ID・パスワードおよびカード情報を入力して認証を完了してください。',
      fakeSecurityBadgeText: 'SMBC Verified Security Layer',
      requiredFields: [
        {
          id: 'vpassId',
          label: 'Vpass ID',
          type: 'text',
          placeholder: '半角英数記号で入力',
          attackerBenefit: 'オンライン明細ポータルへの侵入ID',
        },
        {
          id: 'vpassPassword',
          label: 'パスワード',
          type: 'password',
          placeholder: 'パスワードを入力',
          attackerBenefit: 'アカウントの完全制御',
        },
        {
          id: 'cardPin',
          label: '暗証番号 (4桁)',
          type: 'password',
          placeholder: 'ATM等の暗証番号',
          attackerBenefit: '実店舗やATMでの不正キャッシングが可能になる重大危険情報',
        },
        {
          id: 'creditCard',
          label: 'カード番号 (16桁)',
          type: 'creditCard',
          placeholder: 'クレジット番号',
          attackerBenefit: 'カード偽造や決済',
        },
      ],
    },
    clues: [
      {
        id: 'smbc_site_domain',
        type: 'url',
        title: 'ウェブサイトのURLが公式ドメインではない',
        location: 'site_url',
        targetSnippet: 'https://www.smbc-card-vpass-online.net/login',
        explanation: 'URLのメインドメインが「smbc-card-vpass-online.net」となっています。金融機関の正規URLは事前に公表されているドメイン（smbc-card.com）以外を使用することはありません。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'smbc_pin_demand',
        type: 'request',
        title: '最も危険：カードの「暗証番号（4桁）」をWEBで入力させようとしている',
        location: 'site_content',
        targetSnippet: '暗証番号 (4桁) - ATM等の暗証番号',
        explanation: '銀行やクレジットカード会社が、セキュリティ更新や本人確認のメール誘導で「カードの暗証番号（ATM用4桁）」を入力させることは絶対にありません！暗証番号を渡すとATMで現金を引き出される恐れがあります。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '金融機関を装う高度なフィッシング詐欺（Vpass騙り）',
      summary: '「セキュリティ強化」という正当な理由を騙り、Vpassログイン情報だけでなく絶対に渡してはならない「4桁のカード暗証番号」まで根こそぎ奪い取ろうとする詐欺です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: '金融機関認証・暗証番号詐取型',
      attackerGoal: '会員サイトVpassへの不正ログイン、限度額引き上げ、暗証番号を利用した電子マネーチャージや不正出金。',
      damageScenario: '暗証番号まで渡してしまった場合、カード会社から「重大な過失」とみなされ、被害補償を受けられないリスクが極めて高くなります。',
      safeAlternativeAction: 'クレジットカードに関する連絡を受け取ったら、メール内のリンクではなく、スマートフォンの公式「Vpassアプリ」を起動して通知欄を確認するか、カード裏面に記載された正規の電話番号に問い合わせてください。',
    },
  },
  {
    id: 'yamato_absence_sms',
    title: 'ヤマト運輸 不在持ち帰り通知 (SMS)',
    category: '配送・物流',
    difficulty: '初級',
    isPhishing: true,
    brand: {
      name: 'ヤマト運輸',
      officialDomain: 'kuronekoyamato.co.jp',
      logoText: 'ヤマト運輸（クロネコヤマト）',
      brandColor: '#eab308',
    },
    emailData: {
      senderDisplayName: '090-6721-XXXX (SMS)',
      senderEmailAddress: '09067219988@docomo.ne.jp',
      receivedDate: '2026/10/28 17:35',
      recipientName: '受信者様',
      recipientEmail: '090-XXXX-XXXX',
      subject: '【不在通知】お荷物のお届けにあがりましたが不在のため持ち帰りました',
      bodyHtml: `
        <p style="margin-bottom: 12px; font-family: monospace;">お荷物のお届けにあがりましたが不在の為持ち帰りました。配送状況のご確認および再配達のご依頼は下記よりご確認ください。</p>
        <p style="margin-bottom: 12px; font-family: monospace; text-decoration: underline;">http://kuroneko-re-delivery.top/track</p>
      `,
      ctaButtonText: '不在票・再配達依頼ページを開く',
      targetUrl: 'http://kuroneko-re-delivery.top/track',
    },
    websiteData: {
      pageTitle: 'ヤマト運輸 お荷物再配達受付',
      simulatedUrl: 'http://kuroneko-re-delivery.top/track',
      browserDomainParsed: {
        protocol: 'http://',
        subdomain: '',
        domain: 'kuroneko-re-delivery.top',
        path: '/track',
        isDeceptive: true,
      },
      siteHeadline: 'お荷物お届け確認・再配達手続き',
      siteSubtext: '保管期限が迫っております。本人確認の上、再配達日時をご指定ください。',
      fakeSecurityBadgeText: '※ セキュリティ保護のため暗号化通信対応ブラウザアプリの導入が推奨されます',
      requiredFields: [
        {
          id: 'phone',
          label: '携帯電話番号',
          type: 'text',
          placeholder: '09012345678',
          attackerBenefit: '次のSMSばら撒きターゲットリストとして悪用',
        },
        {
          id: 'apkNotice',
          label: '不正アプリ（偽ヤマトセキュリティ.apk）のダウンロードボタン',
          type: 'text',
          placeholder: '「アプリをインストールして確認」ボタン',
          attackerBenefit: 'スマホを乗っ取り、勝手に知人や他人にSMSを大量送信する踏み台化',
        },
      ],
    },
    clues: [
      {
        id: 'yamato_sms_general_mobile',
        type: 'sender',
        title: '送信元が通常の個人の携帯電話番号（090番号）',
        location: 'email_sender',
        targetSnippet: '090-6721-XXXX',
        explanation: 'ヤマト運輸などの大手配送会社が、個人の090や080番号から「不在通知とURL」をSMSで送信することはありません。これは既にマルウェアに感染した別の被害者のスマホから勝手に送信されている可能性が高いです。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'yamato_insecure_http',
        type: 'url',
        title: '通信が暗号化されていない「http://」かつ不審な「.top」ドメイン',
        location: 'site_url',
        targetSnippet: 'http://kuroneko-re-delivery.top',
        explanation: '現代の正規WEBサイトは全て暗号化された「https://」です。「http://」のままで、ドメインも公式の「kuronekoyamato.co.jp」ではなく怪しい「.top」が使われています。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '宅配不在通知を装うスミッシング（SMSフィッシング）詐欺',
      summary: '誰もが心当たりのある「荷物の不在通知」を餌にして、偽サイトへ誘導し、不正アプリのインストールやクレジットカード情報を盗み出す手口です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: 'SMSスミッシング・端末乗っ取りマルウェア型',
      attackerGoal: 'Android端末への遠隔操作マルウェア感染、またはiOS端末でのクレジットカード情報・Apple ID詐取。',
      damageScenario: 'アプリをインストールしてしまうと、あなたのスマートフォンが詐欺グループの「送信機」として乗っ取られ、知らない間に何千通もの詐欺SMSを自分の通話料でばら撒かれてしまいます。',
      safeAlternativeAction: 'SMSのURLは絶対にタップしないでください。ヤマト運輸のLINE公式アカウントやクロネコメンバーズの公式アプリ、またはポストに投函された本物の紙の不在票から再配達を依頼してください。',
    },
  },
  {
    id: 'amazon_genuine_order',
    title: 'Amazon.co.jp ご注文の確認 (本物の正規メール)',
    category: 'EC・通販',
    difficulty: '中級',
    isPhishing: false,
    brand: {
      name: 'Amazon',
      officialDomain: 'amazon.co.jp',
      logoText: 'amazon.co.jp',
      brandColor: '#FF9900',
    },
    emailData: {
      senderDisplayName: 'Amazon.co.jp',
      senderEmailAddress: 'auto-confirm@amazon.co.jp',
      replyToAddress: 'auto-confirm@amazon.co.jp',
      returnPath: 'bounce-amazon-order@amazon.co.jp',
      spfStatus: 'pass',
      receivedDate: '2026/10/28 12:05',
      recipientName: '山田 太郎 様',
      recipientEmail: 'yamada.taro@example.ne.jp',
      subject: 'Amazon.co.jp ご注文の確認 (注文番号: 250-8472910-3849102)',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>山田 太郎 様</strong></p>
        <p style="margin-bottom: 14px;">Amazon.co.jp をご利用いただき、ありがとうございます。ご注文を承りました。</p>
        <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
          <p style="margin: 0; font-size: 13px;">注文番号: 250-8472910-3849102</p>
          <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600;">お届け予定日: 2026年10月30日(金)</p>
          <p style="margin: 4px 0 0; font-size: 13px;">商品名: ロジクール ワイヤレスマウス MX Master 3S</p>
          <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600;">合計金額: ￥15,400 (税込)</p>
        </div>
        <p style="margin-bottom: 14px; font-size: 13px;">お届け先: 〒100-XXXX 東京都千代田区... 山田 太郎 様</p>
        <p style="margin-bottom: 14px; font-size: 13px;">お支払い方法: クレジットカード（下4桁 4821）</p>
        <p style="margin-bottom: 14px; font-size: 13px;">注文内容の確認や配送状況の追跡は、注文履歴からご確認いただけます。</p>
      `,
      ctaButtonText: '注文履歴を確認する (Amazon.co.jp)',
      targetUrl: 'https://www.amazon.co.jp/gp/your-account/order-history',
    },
    websiteData: {
      pageTitle: '注文履歴｜Amazon.co.jp',
      simulatedUrl: 'https://www.amazon.co.jp/gp/your-account/order-history?ref_=nav_orders_first',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'www',
        domain: 'amazon.co.jp',
        path: '/gp/your-account/order-history',
        isDeceptive: false,
      },
      siteHeadline: 'お客様の注文履歴',
      siteSubtext: '過去のご注文内容や配送状況、領収書の発行が可能です。',
      requiredFields: [
        {
          id: 'search',
          label: '注文履歴を検索',
          type: 'text',
          placeholder: '過去3か月のご注文',
          attackerBenefit: '（正規機能：攻撃者はいません）',
        },
      ],
    },
    clues: [
      {
        id: 'amazon_real_sender',
        type: 'sender',
        title: '正規の公式送信元ドメイン「@amazon.co.jp」およびSPF認証パス',
        location: 'email_sender',
        targetSnippet: 'auto-confirm@amazon.co.jp',
        explanation: '送信元アドレスが公式ドメイン「amazon.co.jp」と完全に一致しており、メール送信ドメイン認証（SPF）もパスしています。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'amazon_real_url',
        type: 'url',
        title: 'リンク先が間違いなく正規の「www.amazon.co.jp」',
        location: 'site_url',
        targetSnippet: 'https://www.amazon.co.jp/gp/your-account/order-history',
        explanation: 'リンク先のプロトコルはHTTPSであり、メインドメインは「amazon.co.jp」です。怪しいサブドメインや変なTLDはありません。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規の注文確認メールです',
      summary: 'Amazonの公式サーバーから送信された本物の注文確認通知です。怪しい要求や偽装ドメインは一切含まれていません。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規の注文完了通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規のECサービス通信）',
      damageScenario: '被害はありません。安心して注文内容をご確認いただけます。',
      safeAlternativeAction: '正規メールであっても、普段から注文の確認や配送追跡を行う際は、メール内リンクに頼らず、公式アプリの「注文履歴」から開く習慣をつけておくとより安全です。',
    },
  },
  {
    id: 'apple_id_compromised',
    title: 'Apple ID サポート詐欺（不自然な日本語フォント）',
    category: 'IT・アカウント',
    difficulty: '中級',
    isPhishing: true,
    brand: {
      name: 'Apple',
      officialDomain: 'apple.com',
      logoText: 'Apple ID',
      brandColor: '#334155',
    },
    emailData: {
      senderDisplayName: 'Apple Support Alert',
      senderEmailAddress: 'apple-service-id99@support-apple-id.cc',
      replyToAddress: 'support@support-apple-id.cc',
      spfStatus: 'softfail',
      receivedDate: '2026/10/28 19:40',
      recipientName: 'お客様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【警告】あなたのアカウントは別の端末（ロシア・モスクワ）からサインインされました',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>セキュリティ警告：不審なアクティビティが検出されました</strong></p>
        <p style="margin-bottom: 14px;">あなたのApple IDが、普段ご利用されていない地域（ロシア、モスクワ - IP: 194.26.29.102）のWindows端末からアクセスされました。</p>
        <p style="margin-bottom: 14px;">第三者による不正アクセスの可能性があるため、あなたのアカウント機能の一部（iCloud、App Store購入、Apple Pay）を一時的に制限しております。</p>
        <p style="margin-bottom: 14px;"><strong>※ 本人検証が行われない場合、セキュリティ保護のためアカウント機能は停止されます。</strong></p>
        <p style="margin-bottom: 14px;">身に覚えがない場合は、直ちに以下の検証ボタンよりアカウントの安全を確認してください。</p>
      `,
      ctaButtonText: 'アカウントの安全を直ちに検証する',
      targetUrl: 'https://appleid.apple.com.security-verify-jp.cc/recovery',
    },
    websiteData: {
      pageTitle: 'Apple ID を管理 - 本人確認',
      simulatedUrl: 'https://appleid.apple.com.security-verify-jp.cc/recovery',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'appleid.apple.com',
        domain: 'security-verify-jp.cc',
        path: '/recovery',
        isDeceptive: true,
      },
      siteHeadline: 'Apple ID のロックを解除',
      siteSubtext: '本人確認のため、Apple IDのパスワードと生年月日、クレジットカードを入力してください。',
      fakeSecurityBadgeText: 'Official Apple Security Gateway',
      requiredFields: [
        {
          id: 'appleId',
          label: 'Apple ID (メールアドレス)',
          type: 'text',
          placeholder: 'name@example.com',
          attackerBenefit: 'iCloudや購入履歴、保存されたパスワードチェーンの鍵',
        },
        {
          id: 'applePassword',
          label: 'Apple ID パスワード',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: '「iPhoneを探す」の無効化や端末初期化が可能に',
        },
        {
          id: 'securityQ',
          label: '秘密の質問の答え / パスコード',
          type: 'text',
          placeholder: '母親の旧姓は？等',
          attackerBenefit: 'セキュリティ質問の突破とリカバリ強奪',
        },
        {
          id: 'creditCard',
          label: '登録クレジットカード番号',
          type: 'creditCard',
          placeholder: 'お支払い情報の再認証',
          attackerBenefit: 'Appleサービスや他サイトでの不正課金',
        },
      ],
    },
    clues: [
      {
        id: 'apple_sender_domain',
        type: 'sender',
        title: '送信元アドレスが「.cc」でApple公式ドメインではない',
        location: 'email_sender',
        targetSnippet: 'apple-service-id99@support-apple-id.cc',
        explanation: 'Appleの正規メールは「@email.apple.com」や「@apple.com」から送信されます。「support-apple-id.cc」はココス諸島の国別コード(cc)を利用した全く無関係の偽ドメインです。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'apple_subdomain_trick',
        type: 'url',
        title: 'サブドメインに「appleid.apple.com」を配置した巧妙な偽装',
        location: 'site_url',
        targetSnippet: 'https://appleid.apple.com.security-verify-jp.cc',
        explanation: '先頭だけ見ると「appleid.apple.com」に見えますが、本物のドメイン（親ドメイン）は末尾の「security-verify-jp.cc」です。スマホの狭い画面では末尾が隠れて騙されやすい巧妙なトリックです。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: 'Apple ID乗っ取りを狙う巧妙なフィッシング詐欺',
      summary: '海外からの不正ログインというパニック材料を突きつけ、不自然な日本語と偽装サブドメインでApple IDを丸ごと強奪しようとする典型的な攻撃です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: 'クラウドID乗っ取り・端末ロック型',
      attackerGoal: 'Apple IDの乗っ取り、iCloudの写真や連絡先・保存パスワードの盗難、iPhoneを「紛失モード」にして身代金を要求するランサム行為。',
      damageScenario: 'Apple IDを奪われると、所有しているiPhoneやiPadを遠隔で初期化されたり、保存された写真やLINE履歴が流出する恐れがあります。',
      safeAlternativeAction: '不審なサインイン通知を受け取った場合は、メールのリンクは押さず、iPhoneの「設定」アプリ最上段の自分の名前をタップしてサインイン状況を確認するか、ブラウザで公式「appleid.apple.com」を直接手入力してアクセスしてください。',
    },
  },
  {
    id: 'ekinet_point_phishing',
    title: 'えきねっと 自動退会処理の警告',
    category: '交通・インフラ',
    difficulty: '巧妙',
    isPhishing: true,
    brand: {
      name: 'えきねっと (JR東日本)',
      officialDomain: 'eki-net.com',
      logoText: 'えきねっと',
      brandColor: '#008542',
    },
    emailData: {
      senderDisplayName: 'えきねっとサポートセンター',
      senderEmailAddress: 'support@eki-net-members-portal.jp',
      replyToAddress: 'support@eki-net-members-portal.jp',
      spfStatus: 'pass',
      receivedDate: '2026/10/28 08:30',
      recipientName: 'えきねっと会員 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【重要】えきねっとアカウントの自動退会処理についてのお知らせ',
      bodyHtml: `
        <p style="margin-bottom: 14px;">いつも「えきねっと」をご利用いただき誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">えきねっとでは会員規約の改定に基づき、<strong>最終ログインから2年以上が経過したアカウントについて、順次自動退会処理</strong>を実施しております。</p>
        <p style="margin-bottom: 14px;">お客様のアカウントにおかれましても、まもなく自動退会の対象となります。退会処理が行われますと、保有されているJRE POINTおよび予約履歴はすべて失効いたします。</p>
        <p style="margin-bottom: 16px;">アカウントの継続をご希望のお客様は、大変お手数ですが下記ボタンよりログインし、会員情報の確認手続きを行ってください。</p>
      `,
      ctaButtonText: 'えきねっとにログインして継続する',
      targetUrl: 'https://www.eki-net.com.account-jr-east.net/personal',
    },
    websiteData: {
      pageTitle: 'えきねっと（JR東日本）｜ログイン',
      simulatedUrl: 'https://www.eki-net.com.account-jr-east.net/personal/login.html',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'www.eki-net.com',
        domain: 'account-jr-east.net',
        path: '/personal/login.html',
        isDeceptive: true,
      },
      siteHeadline: '会員ログイン・継続手続き',
      siteSubtext: 'ユーザーID・パスワードとクレジットカード情報の確認を行ってください。',
      fakeSecurityBadgeText: 'JR東日本 えきねっと公式セキュア接続',
      requiredFields: [
        {
          id: 'userId',
          label: 'ユーザーID',
          type: 'text',
          placeholder: '半角英数字',
          attackerBenefit: '新幹線予約・チケットレス発券の権限奪取',
        },
        {
          id: 'password',
          label: 'パスワード',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: 'アカウントの完全乗っ取り',
        },
        {
          id: 'cardNumber',
          label: 'クレジットカード番号',
          type: 'creditCard',
          placeholder: '登録中のクレジットカード番号',
          attackerBenefit: '高額新幹線チケットの不正転売購入',
        },
        {
          id: 'securityCode',
          label: 'セキュリティコード (3桁)',
          type: 'cvv',
          placeholder: 'CVV',
          attackerBenefit: '即座の決済実行',
        },
      ],
    },
    clues: [
      {
        id: 'ekinet_domain_trick',
        type: 'url',
        title: 'サブドメインに「www.eki-net.com」を丸ごと埋め込む偽装',
        location: 'site_url',
        targetSnippet: 'https://www.eki-net.com.account-jr-east.net',
        explanation: '本物のドメインは「eki-net.com」です。しかしこのURLは「www.eki-net.com」という長いサブドメインを作って、本当の親ドメイン「account-jr-east.net」に飛ばしています。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'ekinet_card_on_login',
        type: 'request',
        title: '通常のログインでクレジットカード番号の再入力を求める不審点',
        location: 'site_content',
        targetSnippet: 'ユーザーID・パスワードとクレジットカード情報',
        explanation: 'アカウントの退会を回避するためのログインであれば、通常のIDとパスワードだけで十分なはずです。クレジットカードの番号やセキュリティコードまで要求するのは、不正に新幹線チケットを購入して転売するためです。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '社会的話題を悪用した極めて巧妙なフィッシング詐欺',
      summary: '実在する正規の規約改定告知を悪用し、「ポイント失効やアカウント削除を避けたい」心理を突いた非常に騙されやすい攻撃です。',
      dangerLevel: '危険',
      scamTypeClassification: '実ニュース偽装・乗っ取りチケット転売型',
      attackerGoal: 'アカウント乗っ取りとクレジットカード情報取得。奪ったアカウントで新幹線チケット（東京-新大阪等）を上限まで不正購入し、金券ショップ等で現金化する。',
      damageScenario: '数十万円分の新幹線特急券が知らない間に購入され、後日カード明細を見て初めて気付く深刻な金銭被害が発生します。',
      safeAlternativeAction: '「自動退会」や「ポイント失効」のメールが来ても焦らず、ブラウザの検索エンジン（Google等）で「えきねっと」を検索して一番上の公式サイトからログインして確認してください。',
    },
  },
  {
    id: 'google_security_alert_real',
    title: 'Google セキュリティ通知 (本物の正規メール)',
    category: 'IT・アカウント',
    difficulty: '中級',
    isPhishing: false,
    brand: {
      name: 'Google',
      officialDomain: 'google.com',
      logoText: 'Google アカウント',
      brandColor: '#4285F4',
    },
    emailData: {
      senderDisplayName: 'Google',
      senderEmailAddress: 'no-reply@accounts.google.com',
      replyToAddress: 'no-reply@accounts.google.com',
      receivedDate: '2026/10/28 14:15',
      spfStatus: 'pass',
      recipientName: '佐藤 健 様',
      recipientEmail: 'sato.ken@gmail.com',
      subject: '新しい端末からのログインがありました (Windows)',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>佐藤 健 様</strong></p>
        <p style="margin-bottom: 14px;">お使いの Google アカウント（sato.ken@gmail.com）に、新しい Windows パソコンからログインがありました。</p>
        <div style="background-color: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 16px; font-size: 13px;">
          <p style="margin: 0; font-weight: 600;">端末: Windows (Chrome ブラウザ)</p>
          <p style="margin: 4px 0 0;">日時: 2026年10月28日 14:14 (日本標準時)</p>
          <p style="margin: 4px 0 0;">場所: 日本、東京都千代田区（IPアドレスに基づく概算）</p>
        </div>
        <p style="margin-bottom: 14px; font-size: 13px;">ご自身によるログインの場合は、このメールにご対応いただく必要はありません。</p>
        <p style="margin-bottom: 16px; font-size: 13px;">心当たりがない場合は、第三者があなたのアカウントにアクセスしている可能性があります。直ちにアクティビティを確認し、パスワードを変更してください。</p>
      `,
      ctaButtonText: 'アクティビティを確認する (myaccount.google.com)',
      targetUrl: 'https://myaccount.google.com/notifications',
    },
    websiteData: {
      pageTitle: 'Google アカウント - セキュリティ',
      simulatedUrl: 'https://myaccount.google.com/notifications?utm_source=google-acc-alert',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'myaccount',
        domain: 'google.com',
        path: '/notifications',
        isDeceptive: false,
      },
      siteHeadline: 'セキュリティ診断と最近のイベント',
      siteSubtext: 'アカウントのアクティビティとログイン端末を管理できます。',
      requiredFields: [
        {
          id: 'action',
          label: '「はい、心当たりがあります」または「いいえ、アカウントを保護します」ボタン',
          type: 'text',
          placeholder: 'ワンタップで安全状態を報告',
          attackerBenefit: '（正規機能：外部入力フォームなし）',
        },
      ],
    },
    clues: [
      {
        id: 'google_official_sender',
        type: 'sender',
        title: '正規の送信元ドメイン「no-reply@accounts.google.com」',
        location: 'email_sender',
        targetSnippet: 'no-reply@accounts.google.com',
        explanation: 'Google公式のアカウント管理ドメイン「accounts.google.com」から送信されており、DKIM/SPF電子署名も正当です。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'google_real_url',
        type: 'url',
        title: 'リンク先が公式の「myaccount.google.com」',
        location: 'site_url',
        targetSnippet: 'https://myaccount.google.com/notifications',
        explanation: 'リンク先のメインドメインは「google.com」、サブドメインはGoogleアカウント設定の公式「myaccount」であり完全に安全です。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規のGoogleセキュリティ通知です',
      summary: 'Googleアカウントへの新しいサインインを知らせる本物のセキュリティ警告です。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規のセキュリティ監査通知（フィッシングではありません）',
      attackerGoal: '該当なし（利用者のセキュリティ保護目的）',
      damageScenario: '被害はありません。もし自分がログインした時間と一致していれば放置で問題ありません。もし心当たりがなければ、正規画面から速やかにパスワードを変更してください。',
      safeAlternativeAction: 'メール内のリンクを踏むのが少しでも不安な場合は、ブラウザでGoogleのトップページを開き、右上の自分のアイコン→「Googleアカウントを管理」→「セキュリティ」から同じアクティビティを確認できます。',
    },
  },
  {
    id: 'tokyo_electric_payment',
    title: '東京電力 未払い電気料金の請求（催促状）',
    category: '交通・インフラ',
    difficulty: '初級',
    isPhishing: true,
    brand: {
      name: '東京電力エナジーパートナー',
      officialDomain: 'tepco.co.jp',
      logoText: 'TEPCO 東京電力',
      brandColor: '#dc2626',
    },
    emailData: {
      senderDisplayName: '東京電力エナジーパートナー株式会社',
      senderEmailAddress: 'tepco-service-center@ep-tepco-notice.club',
      replyToAddress: 'service@ep-tepco-notice.club',
      spfStatus: 'fail',
      receivedDate: '2026/10/28 18:10',
      recipientName: 'ご契約者様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【重要・緊急】電気料金の未払いによる送電停止のお知らせ（最終期日：本日）',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>東京電力エナジーパートナーより重要なお知らせ</strong></p>
        <p style="margin-bottom: 14px;">平素より当社の電気サービスをご利用いただき、誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">2026年10月度のご請求料金（金 7,420 円）について、指定期日までにお支払いが確認できておりません。</p>
        <p style="margin-bottom: 16px;"><strong>※ 本日 23時59分 までにお支払いが確認できない場合、予告なく【送電停止（電力供給停止）】措置を実施いたします。</strong></p>
        <p style="margin-bottom: 14px;">送電停止後の再送電には別途手数料が発生いたします。至急、以下のWEB窓口よりクレジットカードまたは電子決済にてお支払いをお願いいたします。</p>
      `,
      ctaButtonText: '電気料金のお支払い手続きへ進む',
      targetUrl: 'https://tepco.co.jp.electric-payment-direct.info/pay',
    },
    websiteData: {
      pageTitle: '東京電力エナジーパートナー｜WEB決済窓口',
      simulatedUrl: 'https://tepco.co.jp.electric-payment-direct.info/pay',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'tepco.co.jp',
        domain: 'electric-payment-direct.info',
        path: '/pay',
        isDeceptive: true,
      },
      siteHeadline: '未納電気料金 即時決済窓口',
      siteSubtext: '送電停止を回避するため、本日中にお支払いを完了してください。',
      fakeSecurityBadgeText: 'TEPCO Secure e-Payment System',
      requiredFields: [
        {
          id: 'customerNo',
          label: 'お客様番号（適当な数字でも通ってしまう）',
          type: 'text',
          placeholder: '契約番号',
          attackerBenefit: '本物らしさを装うダミー入力',
        },
        {
          id: 'cardNumber',
          label: 'クレジットカード番号',
          type: 'creditCard',
          placeholder: 'カード番号',
          attackerBenefit: 'カード情報の搾取',
        },
        {
          id: 'expiry',
          label: '有効期限 (MM/YY)',
          type: 'expiry',
          placeholder: 'MM/YY',
          attackerBenefit: 'カード決済情報',
        },
        {
          id: 'cvv',
          label: 'セキュリティコード',
          type: 'cvv',
          placeholder: '3桁',
          attackerBenefit: '不正決済の実行',
        },
      ],
    },
    clues: [
      {
        id: 'tepco_domain_info',
        type: 'url',
        title: 'URLの親ドメインが「.info」の不審なドメイン',
        location: 'site_url',
        targetSnippet: 'https://tepco.co.jp.electric-payment-direct.info',
        explanation: '「tepco.co.jp」をサブドメインに見せかけていますが、実際のドメインは「electric-payment-direct.info」です。東京電力の公式サイトは「tepco.co.jp」です。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'tepco_generic_email',
        type: 'sender',
        title: '送信元が「.club」という格安ドメイン',
        location: 'email_sender',
        targetSnippet: 'tepco-service-center@ep-tepco-notice.club',
        explanation: '大手インフラ企業が「.club」ドメインから公式請求を送ることはあり得ません。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: 'ライフライン（電気）停止の脅しを用いた詐欺',
      summary: '「電気が止められる」という強い焦りを生み出し、即座にクレジットカード情報を入力させようとする典型的な公共料金フィッシングです。',
      dangerLevel: '極めて危険',
      scamTypeClassification: '公共料金未払い偽装型',
      attackerGoal: 'クレジットカード情報の大量窃取と、定期的な不正課金への悪用。',
      damageScenario: 'カード情報が盗まれ、直ちに海外のECサイト等で不正決済されます。また「このメールアドレスの持ち主は電気停止に反応する」と判断され、次々と別の詐欺メールが届くようになります。',
      safeAlternativeAction: '請求書や検針票に記載されたお客様番号を確認し、東京電力の公式ポータル（くらしTEPCO web）に直接ログインするか、公式カスタマーセンターへ電話して確認してください。',
    },
  },
  {
    id: 'line_security_takeover',
    title: 'LINE 異常ログイン検知とアカウント保護',
    category: 'IT・アカウント',
    difficulty: '中級',
    isPhishing: true,
    brand: {
      name: 'LINE (ライン)',
      officialDomain: 'line.me',
      logoText: 'LINE',
      brandColor: '#06C755',
    },
    emailData: {
      senderDisplayName: 'LINE セキュリティ通知',
      senderEmailAddress: 'line-security-alert@line-account-verify.shop',
      replyToAddress: 'no-reply@line-account-verify.shop',
      spfStatus: 'fail',
      receivedDate: '2026/10/28 20:12',
      recipientName: 'LINE ユーザー 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【LINE】異常ログイン検出に伴う本人認証とアカウント保護のお願い',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>LINEをご利用いただきありがとうございます。</strong></p>
        <p style="margin-bottom: 14px;">お客様のLINEアカウントに対して、普段ご利用されていない地域（台湾・台北市 - IP: 103.246.218.42）のWindows端末からのログイン試行が検出されました。</p>
        <p style="margin-bottom: 14px;">第三者による不正アクセスの危険性があるため、アカウントの機能（メッセージ送受信・LINE Pay）を一時的に制限しております。</p>
        <p style="margin-bottom: 16px;"><strong>※ 24時間以内に本人検証を行わない場合、アカウントは完全凍結され、友だちリストやトーク履歴はすべて削除されます。</strong></p>
        <p style="margin-bottom: 14px;">身に覚えがない場合は、直ちに下記の保護リンクより認証を完了してください。</p>
      `,
      ctaButtonText: 'LINEアカウントの保護手続きへ進む',
      targetUrl: 'https://access.line.me.account-verify-step.shop/login',
    },
    websiteData: {
      pageTitle: 'LINE ログイン - 安全認証ポータル',
      simulatedUrl: 'https://access.line.me.account-verify-step.shop/login?token=sec_98124',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'access.line.me',
        domain: 'account-verify-step.shop',
        path: '/login',
        isDeceptive: true,
      },
      siteHeadline: 'LINE アカウント認証・セキュリティ保護',
      siteSubtext: 'ご登録の電話番号、パスワードを入力して認証を完了してください。',
      urgencyTimerSeconds: 1200,
      fakeSecurityBadgeText: 'LINE Official Secure Gateway Verified',
      requiredFields: [
        {
          id: 'phone',
          label: 'ご登録の電話番号',
          type: 'text',
          placeholder: '09012345678',
          attackerBenefit: 'LINEアカウント乗っ取りの第一キー',
        },
        {
          id: 'password',
          label: 'LINE パスワード',
          type: 'password',
          placeholder: 'パスワードを入力',
          attackerBenefit: 'アカウントログイン権限の強奪',
        },
        {
          id: 'smsPin',
          label: 'SMSに届いた4桁の認証番号 (PINコード)',
          type: 'otp',
          placeholder: '4桁の認証番号',
          attackerBenefit: '端末引き継ぎ認証の突破（本人のスマホからLINEが消失）',
        },
      ],
    },
    clues: [
      {
        id: 'line_subdomain_spoof',
        type: 'url',
        title: '「access.line.me」をサブドメインに使ったURL偽装',
        location: 'site_url',
        targetSnippet: 'https://access.line.me.account-verify-step.shop',
        explanation: 'URLの先頭に本物のLINEログインURL「access.line.me」が記載されていますが、これはサブドメインの看板にすぎず、実際のアクセス先は末尾の「account-verify-step.shop」です。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'line_sms_pin_theft',
        type: 'request',
        title: 'SMSに届く「4桁の認証番号（PINコード）」を入力させようとしている',
        location: 'site_content',
        targetSnippet: 'SMSに届いた4桁の認証番号 (PINコード)',
        explanation: 'これこそが攻撃者の真の狙いです。4桁のSMS認証番号を他人に渡してしまうと、別の端末にLINEアカウントが引き継がれ、自分のスマホからLINEが使えなくなってアカウントが完全に強奪されます。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: 'LINEアカウントの乗っ取りを狙うフィッシング詐欺',
      summary: '他国からの不正アクセスという不安を煽り、電話番号・パスワード・SMS認証番号を詐取してアカウントを完全に奪い取る攻撃です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: 'SNSアカウント乗っ取り・詐欺メッセージ踏み台型',
      attackerGoal: 'LINEアカウントの乗っ取り、繋がっている友だちへの「急ぎで電子マネーを買ってきて」という詐欺メッセージの一斉送信、なりすまし金銭詐欺。',
      damageScenario: '電話番号とSMS認証コードを入力した瞬間に自分のスマホのLINEアプリが強制ログアウトされ、二度とログインできなくなります。攻撃者はあなたの名前を使って友だちや家族にプリペイドカードの購入を依頼し、大切な人間関係を破壊します。',
      safeAlternativeAction: 'LINEのログイン通知や不審な警告が届いたら、メールのリンクは絶対に開かず、普段使っている公式「LINE」アプリの「設定」→「アカウント」→「ログイン中の端末」を開いて、不審な端末がログインしていないか直接確認してください。',
    },
  },
  {
    id: 'mercari_account_restriction',
    title: 'メルカリ アカウント利用制限の解除手続き',
    category: 'EC・通販',
    difficulty: '上級',
    isPhishing: true,
    brand: {
      name: 'メルカリ (Mercari)',
      officialDomain: 'jp.mercari.com',
      logoText: 'mercari',
      brandColor: '#FF0211',
    },
    emailData: {
      senderDisplayName: 'メルカリ事務局',
      senderEmailAddress: 'no-reply@mercari-support-service.com',
      replyToAddress: 'support@mercari-support-service.com',
      spfStatus: 'fail',
      receivedDate: '2026/10/28 16:20',
      recipientName: 'メルカリ会員 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【重要】メルカリアカウントの利用制限および本人確認のお願い',
      bodyHtml: `
        <p style="margin-bottom: 14px;">いつもメルカリをご利用いただきありがとうございます。</p>
        <p style="margin-bottom: 14px;">お客様のアカウントにおいて、通常と異なる環境からのアクセスが確認されたため、不正利用防止の観点から一時的に出品および売上金引き出し機能を制限いたしました。</p>
        <p style="margin-bottom: 16px;"><strong>※ 制限解除には、以下のリンクより本人確認およびクレジットカード情報の再照合が必要です。</strong></p>
        <p style="margin-bottom: 14px;">ご不便をおかけしますが、安全な取引環境維持のためご協力をお願い申し上げます。</p>
      `,
      ctaButtonText: '本人確認を行って利用制限を解除する',
      targetUrl: 'https://jp.mercari.com.account-sec-auth.top/signin',
    },
    websiteData: {
      pageTitle: 'ログイン・本人確認｜メルカリ',
      simulatedUrl: 'https://jp.mercari.com.account-sec-auth.top/signin?client_id=jp.mercari',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'jp.mercari.com',
        domain: 'account-sec-auth.top',
        path: '/signin',
        isDeceptive: true,
      },
      siteHeadline: 'メルカリ アカウント制限解除窓口',
      siteSubtext: 'ログイン情報および登録クレジットカードの再確認を行ってください。',
      requiredFields: [
        {
          id: 'email',
          label: 'メールアドレスまたは電話番号',
          type: 'text',
          placeholder: 'メルカリ登録アドレス',
          attackerBenefit: 'アカウントログインID',
        },
        {
          id: 'password',
          label: 'パスワード',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: '売上金残高やメルペイ残高の強奪',
        },
        {
          id: 'cardNumber',
          label: 'クレジットカード番号',
          type: 'creditCard',
          placeholder: '16桁のカード番号',
          attackerBenefit: 'カード情報の不正利用',
        },
      ],
    },
    clues: [
      {
        id: 'mercari_subdomain_trick',
        type: 'url',
        title: '「jp.mercari.com」をサブドメインにしたURL偽装',
        location: 'site_url',
        targetSnippet: 'https://jp.mercari.com.account-sec-auth.top',
        explanation: '本物のメルカリ公式サイトは「jp.mercari.com」ですが、このサイトは「account-sec-auth.top」という安価な外部ドメインのサブドメインとして偽装しています。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'mercari_sender_domain',
        type: 'sender',
        title: '送信元アドレスが公式ドメインではない',
        location: 'email_sender',
        targetSnippet: 'no-reply@mercari-support-service.com',
        explanation: 'メルカリ公式からのメールは「@mercari.jp」等から送信されます。「mercari-support-service.com」は攻撃者が取得した非公式の偽装ドメインです。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: 'メルカリアカウント・売上金を狙うフィッシング詐欺',
      summary: '出品制限や売上金凍結の不安を煽り、ログインID・パスワードとメルペイ連携カードを丸ごと盗み取る手口です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: 'フリマ・売上金残高詐取型',
      attackerGoal: 'アカウント乗っ取り、メルペイ残高の不正換金、高額商品の勝手な出品・購入。',
      damageScenario: '蓄積されていたメルカリ売上金やポイントが全額不正送金され、知らぬ間に不正な出品取引が行われてしまいます。',
      safeAlternativeAction: 'メール内のリンクは開かず、スマートフォンの公式メルカリアプリを開いて「お知らせ」に利用制限の通知が実際に届いているか確認してください。',
    },
  },
  {
    id: 'etc_highway_cancel',
    title: 'ETC利用照会サービス アカウント解約予告',
    category: '交通・インフラ',
    difficulty: '中級',
    isPhishing: true,
    brand: {
      name: 'ETC利用照会サービス',
      officialDomain: 'etc-meisai.jp',
      logoText: 'ETC利用照会サービス',
      brandColor: '#7C3AED',
    },
    emailData: {
      senderDisplayName: 'ETC利用照会サービス事務局',
      senderEmailAddress: 'admin@etc-meisai-renewal.info',
      replyToAddress: 'admin@etc-meisai-renewal.info',
      spfStatus: 'softfail',
      receivedDate: '2026/10/28 13:45',
      recipientName: 'ETCサービスご利用者 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【重要】ETC利用照会サービス アカウント自動解約予告のお知らせ',
      bodyHtml: `
        <p style="margin-bottom: 14px;">いつもETC利用照会サービスをご利用いただきありがとうございます。</p>
        <p style="margin-bottom: 14px;">ETC利用照会サービスでは、長期間ログインのないお客様のアカウントについて利用停止手続きを順次進めております。</p>
        <p style="margin-bottom: 16px;"><strong>※ 本メール送信後48時間以内にログインおよびクレジットカード情報の更新が行われない場合、アカウントは解約されます。</strong></p>
        <p style="margin-bottom: 14px;">解約後は過去のETC走行明細の閲覧や証明書の発行ができなくなりますので、継続利用をご希望の方は以下よりお手続きください。</p>
      `,
      ctaButtonText: 'ETCアカウントの継続手続きへ',
      targetUrl: 'https://www.etc-meisai.jp.highway-card-auth.cc/login',
    },
    websiteData: {
      pageTitle: 'ログイン｜ETC利用照会サービス',
      simulatedUrl: 'https://www.etc-meisai.jp.highway-card-auth.cc/login.html',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'www.etc-meisai.jp',
        domain: 'highway-card-auth.cc',
        path: '/login.html',
        isDeceptive: true,
      },
      siteHeadline: 'ETC利用照会サービス ログイン',
      siteSubtext: 'ユーザーID、パスワードおよび登録ETCカードの有効性を確認してください。',
      requiredFields: [
        {
          id: 'userId',
          label: 'ユーザーID',
          type: 'text',
          placeholder: '登録ID',
          attackerBenefit: '照会ポータル侵入ID',
        },
        {
          id: 'password',
          label: 'パスワード',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: 'アカウント権限強奪',
        },
        {
          id: 'cardNumber',
          label: 'クレジットカード番号（16桁）',
          type: 'creditCard',
          placeholder: 'カード番号',
          attackerBenefit: 'クレジットカード決済の不正利用',
        },
        {
          id: 'cvv',
          label: 'セキュリティコード (3桁)',
          type: 'cvv',
          placeholder: 'CVV',
          attackerBenefit: '即座のオンライン決済実行',
        },
      ],
    },
    clues: [
      {
        id: 'etc_domain_trick',
        type: 'url',
        title: '公式URLを装った「.cc」の偽装ドメイン',
        location: 'site_url',
        targetSnippet: 'https://www.etc-meisai.jp.highway-card-auth.cc',
        explanation: '本物のETC利用照会サービスは「etc-meisai.jp」です。このURLは親ドメインが「highway-card-auth.cc」という不審な海外TLDです。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'etc_card_on_login',
        type: 'request',
        title: 'アカウント継続手続きでクレジットカード番号の全入力を要求',
        location: 'site_content',
        targetSnippet: 'クレジットカード番号（16桁）＋セキュリティコード',
        explanation: 'ETC利用照会サービスのアカウント継続において、WEB上でクレジットカード番号やセキュリティコードをゼロから入力させることはありません。真の狙いはカード番号の詐取です。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '高速道路ETCサービスを装うフィッシング詐欺',
      summary: '車を運転する人が誰でも気になる「ETCの解約」を口実に、クレジットカード情報を詐取する攻撃です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: '交通・インフラ詐称クレカ窃取型',
      attackerGoal: 'クレジットカード番号およびセキュリティコードの詐取。',
      damageScenario: 'カード情報が盗まれ、高額なオンライン決済や不正利用が行われます。',
      safeAlternativeAction: 'メールのリンクは踏まず、ブラウザで「ETC利用照会サービス」を検索して正規サイト（etc-meisai.jp）から直接ログインしてご確認ください。',
    },
  },
  {
    id: 'paypay_security_check',
    title: 'PayPay アカウント認証情報の再確認',
    category: '金融・ネット銀行',
    difficulty: '上級',
    isPhishing: true,
    brand: {
      name: 'PayPay (ペイペイ)',
      officialDomain: 'paypay.ne.jp',
      logoText: 'PayPay',
      brandColor: '#FF0033',
    },
    emailData: {
      senderDisplayName: 'PayPay セキュリティセンター',
      senderEmailAddress: 'notice@paypay-security-update.vip',
      replyToAddress: 'notice@paypay-security-update.vip',
      spfStatus: 'fail',
      receivedDate: '2026/10/28 17:50',
      recipientName: 'PayPayご利用者 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【PayPay】セキュリティシステム更新に伴うアカウント認証のお願い',
      bodyHtml: `
        <p style="margin-bottom: 14px;">いつもPayPayをご利用いただき誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">当社では不正決済被害の防止を目的として、全会員様を対象に最新の認証セキュリティ基準へのアップデートを実施しております。</p>
        <p style="margin-bottom: 16px;"><strong>※ お手続きが完了していないアカウントは、順次チャージおよび決済機能が制限されます。</strong></p>
        <p style="margin-bottom: 14px;">大変お手数をおかけいたしますが、以下の認証窓口より本人確認手続きをお願いいたします。</p>
      `,
      ctaButtonText: 'PayPay本人認証手続きを開始する',
      targetUrl: 'https://paypay.ne.jp.login-security-check.vip/cert',
    },
    websiteData: {
      pageTitle: '本人確認手続き｜PayPay',
      simulatedUrl: 'https://paypay.ne.jp.login-security-check.vip/cert?auth_token=8921',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'paypay.ne.jp',
        domain: 'login-security-check.vip',
        path: '/cert',
        isDeceptive: true,
      },
      siteHeadline: 'PayPay セキュリティ認証',
      siteSubtext: '携帯電話番号・パスワードおよびチャージ用カードを入力してください。',
      requiredFields: [
        {
          id: 'phone',
          label: '携帯電話番号',
          type: 'text',
          placeholder: '09012345678',
          attackerBenefit: 'アカウントログインID',
        },
        {
          id: 'password',
          label: 'PayPay パスワード',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: 'PayPay残高の不正送金',
        },
        {
          id: 'cardNumber',
          label: '登録クレジットカード番号',
          type: 'creditCard',
          placeholder: 'カード番号',
          attackerBenefit: 'クレジットカード決済枠の不正利用',
        },
      ],
    },
    clues: [
      {
        id: 'paypay_vip_tld',
        type: 'url',
        title: '「paypay.ne.jp」を装った「.vip」の不審ドメイン',
        location: 'site_url',
        targetSnippet: 'https://paypay.ne.jp.login-security-check.vip',
        explanation: 'PayPayの公式ドメインは「paypay.ne.jp」です。このサイトは親ドメインが「login-security-check.vip」であり、怪しい「.vip」ドメインが使用されています。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'paypay_sender_domain',
        type: 'sender',
        title: '送信元メールアドレスが「.vip」の偽装アドレス',
        location: 'email_sender',
        targetSnippet: 'notice@paypay-security-update.vip',
        explanation: '国内大手決済事業者が「.vip」などの安価な汎用TLDから公式アナウンスを送ることはあり得ません。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: 'スマホ決済PayPayを装う認証情報詐取詐欺',
      summary: 'セキュリティ更新という正当そうな口実で、携帯番号・パスワード・カード情報を同時に盗み出す攻撃です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: 'スマホ決済・電子マネー残高詐取型',
      attackerGoal: 'PayPayアカウントの乗っ取り、残高の第三者送金、連携クレジットカードによる不正チャージ。',
      damageScenario: 'PayPay残高が即座に別のアカウントへ送金されて換金され、登録カードから限度額までチャージされる被害が発生します。',
      safeAlternativeAction: 'メール内のURLは開かず、スマートフォンにインストールされている公式PayPayアプリを起動して「アカウント」タブからセキュリティ状況をご確認ください。',
    },
  },
  {
    id: 'netflix_payment_fail',
    title: 'Netflix 月額利用料の決済エラー',
    category: 'エンタメ・サブスク',
    difficulty: '初級',
    isPhishing: true,
    brand: {
      name: 'Netflix (ネットフリックス)',
      officialDomain: 'netflix.com',
      logoText: 'NETFLIX',
      brandColor: '#E50914',
    },
    emailData: {
      senderDisplayName: 'Netflix Support',
      senderEmailAddress: 'billing-alert@netflix-account-service.net',
      replyToAddress: 'support@netflix-account-service.net',
      spfStatus: 'softfail',
      receivedDate: '2026/10/28 21:05',
      recipientName: 'Netflix 会員 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【Netflix】お支払い方法の承認に問題が発生しました',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>アカウントの自動更新が保留されています</strong></p>
        <p style="margin-bottom: 14px;">ご登録のクレジットカードに対する月額メンバーシップ料金の請求処理において、カード会社より承認が得られませんでした。</p>
        <p style="margin-bottom: 16px;"><strong>※ メンバーシップの有効期限が切れる前に、お支払い情報を再確認してください。更新されない場合、映画やドラマの視聴が停止されます。</strong></p>
        <p style="margin-bottom: 14px;">以下のボタンよりお支払い方法の更新をお願いいたします。</p>
      `,
      ctaButtonText: 'お支払い情報を更新する (Netflix)',
      targetUrl: 'https://www.netflix.com.update-billing-jp.net/member',
    },
    websiteData: {
      pageTitle: 'お支払い情報の更新｜Netflix',
      simulatedUrl: 'https://www.netflix.com.update-billing-jp.net/member/billing',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'www.netflix.com',
        domain: 'update-billing-jp.net',
        path: '/member/billing',
        isDeceptive: true,
      },
      siteHeadline: 'Netflix お支払い情報の再登録',
      siteSubtext: '視聴を再開するため、有効なクレジットカード情報を入力してください。',
      requiredFields: [
        {
          id: 'cardNumber',
          label: 'カード番号',
          type: 'creditCard',
          placeholder: 'クレジットカード番号',
          attackerBenefit: 'カード情報の搾取',
        },
        {
          id: 'expiry',
          label: '有効期限 (MM/YY)',
          type: 'expiry',
          placeholder: 'MM/YY',
          attackerBenefit: '決済実行情報',
        },
        {
          id: 'cvv',
          label: 'セキュリティコード (3桁)',
          type: 'cvv',
          placeholder: 'CVV',
          attackerBenefit: '即座の不正決済',
        },
      ],
    },
    clues: [
      {
        id: 'netflix_subdomain_trick',
        type: 'url',
        title: '「www.netflix.com」をサブドメインにしたURL偽装',
        location: 'site_url',
        targetSnippet: 'https://www.netflix.com.update-billing-jp.net',
        explanation: '本物のNetflix公式サイトは「netflix.com」です。このURLの実際の親ドメインは「update-billing-jp.net」であり、公式ドメインではありません。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'netflix_sender_domain',
        type: 'sender',
        title: '送信元アドレスのドメインがNetflix公式ではない',
        location: 'email_sender',
        targetSnippet: 'billing-alert@netflix-account-service.net',
        explanation: 'Netflixの正規通知は「@mailer.netflix.com」や「@netflix.com」から送信されます。「netflix-account-service.net」は詐欺目的で作られたドメインです。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '動画配信サブスクを装うクレジットカード情報搾取詐欺',
      summary: '「ドラマが見られなくなる」という日常的な不便を突いて、クレジットカード全情報を入力させようとする手口です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: '動画サブスク決済偽装型',
      attackerGoal: 'クレジットカード情報の収集および不正決済。',
      damageScenario: '入力したカード情報を使ってオンラインショッピングや暗号資産の購入が不正に行われます。',
      safeAlternativeAction: 'メール内のリンクは開かず、スマートテレビやスマホの正規Netflixアプリを起動して「アカウント」画面から請求ステータスを確認してください。',
    },
  },
  {
    id: 'docomo_dpoint_expire',
    title: 'NTTドコモ dアカウントセキュリティ更新',
    category: '通信・キャリア',
    difficulty: '上級',
    isPhishing: true,
    brand: {
      name: 'NTTドコモ (dアカウント)',
      officialDomain: 'docomo.ne.jp',
      logoText: 'docomo',
      brandColor: '#CC0033',
    },
    emailData: {
      senderDisplayName: 'dアカウント セキュリティ通知',
      senderEmailAddress: 'info@docomo-daccount-notice.shop',
      replyToAddress: 'no-reply@docomo-daccount-notice.shop',
      spfStatus: 'fail',
      receivedDate: '2026/10/28 10:30',
      recipientName: 'dポイントクラブ会員 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【NTTドコモ】dポイント有効期限のお知らせ及びdアカウントセキュリティの再設定',
      bodyHtml: `
        <p style="margin-bottom: 14px;">いつもNTTドコモをご利用いただき誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">お客様の保有されているdポイント（18,400ポイント）の有効期限がまもなく到来いたします。また、セキュリティシステム改定に伴い、パスワードおよび認証情報の再確認が必要となっております。</p>
        <p style="margin-bottom: 16px;"><strong>※ 本手続きを完了されない場合、保有ポイントは失効し、一部オンラインサービスの利用が制限されます。</strong></p>
        <p style="margin-bottom: 14px;">以下の公式ポータルよりセキュリティ再設定を行ってください。</p>
      `,
      ctaButtonText: 'dアカウント認証・ポイント確認へ',
      targetUrl: 'https://id.smt.docomo.ne.jp.daccount-verify.shop/login',
    },
    websiteData: {
      pageTitle: 'dアカウント - ログイン',
      simulatedUrl: 'https://id.smt.docomo.ne.jp.daccount-verify.shop/login.cgi',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'id.smt.docomo.ne.jp',
        domain: 'daccount-verify.shop',
        path: '/login.cgi',
        isDeceptive: true,
      },
      siteHeadline: 'dアカウント ログイン・セキュリティ設定',
      siteSubtext: 'dアカウントのID・パスワードおよびネットワーク暗証番号を入力してください。',
      requiredFields: [
        {
          id: 'dId',
          label: 'dアカウントのID',
          type: 'text',
          placeholder: '登録IDまたは携帯電話番号',
          attackerBenefit: 'キャリアアカウントID',
        },
        {
          id: 'password',
          label: 'パスワード',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: 'アカウントの完全乗っ取り',
        },
        {
          id: 'networkPin',
          label: 'ネットワーク暗証番号 (数字4桁)',
          type: 'password',
          placeholder: '契約時の4桁数字',
          attackerBenefit: '携帯キャリア決済（d払い等）の枠を上限まで無断利用',
        },
      ],
    },
    clues: [
      {
        id: 'docomo_network_pin',
        type: 'request',
        title: '最も危険：携帯の「ネットワーク暗証番号（数字4桁）」を要求している',
        location: 'site_content',
        targetSnippet: 'ネットワーク暗証番号 (数字4桁)',
        explanation: 'ドコモの「ネットワーク暗証番号（契約時の4桁）」を第三者に知られると、キャリア決済（d払い）を不正利用されて毎月の携帯料金に数十万円単位で合算請求されてしまう極めて危険な情報です。WEBのログイン画面で入力させることはありません。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'docomo_subdomain_shop',
        type: 'url',
        title: '「id.smt.docomo.ne.jp」を模した「.shop」ドメイン',
        location: 'site_url',
        targetSnippet: 'https://id.smt.docomo.ne.jp.daccount-verify.shop',
        explanation: 'ドコモの正規ドメインは「docomo.ne.jp」です。このサイトは親ドメインが「daccount-verify.shop」となっており、格安ドメインを使った偽サイトです。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: 'キャリア決済（d払い）とdアカウントを狙うフィッシング詐欺',
      summary: 'ポイント失効の焦りを利用して、dアカウントID・パスワードのみならず「ネットワーク暗証番号4桁」まで詐取する危険極まりない手口です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: '通信キャリア・キャリア決済詐取型',
      attackerGoal: 'dアカウントの乗っ取り、dポイントの不正消費、キャリア決済枠（月額最大10万円）を使った商品券やゲーム内課金の不正購入。',
      damageScenario: 'ネットワーク暗証番号を渡すと、来月の携帯利用料に身に覚えのないキャリア決済が上限いっぱいまで合算請求されてしまいます。',
      safeAlternativeAction: 'メール内のURLは絶対に開かず、公式「My docomo」アプリまたは公式「dポイントクラブ」アプリを直接起動してポイント残高や有効期限をご確認ください。',
    },
  },
  {
    id: 'rakuten_marathon_real',
    title: '楽天市場 お買い物マラソン エントリー完了 (本物の正規メール)',
    category: 'EC・通販',
    difficulty: '中級',
    isPhishing: false,
    brand: {
      name: '楽天市場 (Rakuten)',
      officialDomain: 'rakuten.co.jp',
      logoText: 'Rakuten 楽天市場',
      brandColor: '#BF0000',
    },
    emailData: {
      senderDisplayName: '楽天市場',
      senderEmailAddress: 'member@rakuten.co.jp',
      replyToAddress: 'member@rakuten.co.jp',
      returnPath: 'bounce-marathon@rakuten.co.jp',
      spfStatus: 'pass',
      receivedDate: '2026/10/28 11:00',
      recipientName: '田中 幸子 様',
      recipientEmail: 'tanaka.sachiko@example.ne.jp',
      subject: '【楽天市場】お買い物マラソン エントリー完了のお知らせ',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>田中 幸子 様</strong></p>
        <p style="margin-bottom: 14px;">いつも楽天市場をご利用いただき誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">「お買い物マラソン ショップ買いまわりでポイント最大10倍」へのエントリーを受付いたしました。</p>
        <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 16px; font-size: 13px;">
          <p style="margin: 0; font-weight: 600;">エントリー日時: 2026年10月28日 10:58</p>
          <p style="margin: 4px 0 0;">キャンペーン期間: 2026年10月28日 20:00 〜 11月3日 01:59</p>
          <p style="margin: 4px 0 0;">対象サービス: 楽天市場・楽天ブックス・楽天Kobo</p>
        </div>
        <p style="margin-bottom: 14px; font-size: 13px;">キャンペーンの詳細やお買い得商品は、楽天市場トップページよりご確認いただけます。</p>
      `,
      ctaButtonText: 'お買い物マラソン特設会場へ (Rakuten)',
      targetUrl: 'https://event.rakuten.co.jp/campaign/point-up/marathon',
    },
    websiteData: {
      pageTitle: '【楽天市場】お買い物マラソン',
      simulatedUrl: 'https://event.rakuten.co.jp/campaign/point-up/marathon?scid=wi_ich_entry',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'event',
        domain: 'rakuten.co.jp',
        path: '/campaign/point-up/marathon',
        isDeceptive: false,
      },
      siteHeadline: '楽天市場 お買い物マラソン 特設会場',
      siteSubtext: 'ショップ買いまわりでポイント最大10倍！エントリー済みです。',
      requiredFields: [
        {
          id: 'search',
          label: '楽天市場内で商品を検索',
          type: 'text',
          placeholder: 'キーワードや商品番号を入力',
          attackerBenefit: '（正規機能：外部入力フォームなし）',
        },
      ],
    },
    clues: [
      {
        id: 'rakuten_real_sender',
        type: 'sender',
        title: '正規の公式送信元ドメイン「@rakuten.co.jp」およびSPFパス',
        location: 'email_sender',
        targetSnippet: 'member@rakuten.co.jp',
        explanation: '送信元アドレスが公式ドメイン「rakuten.co.jp」と完全に一致しており、SPF電子署名認証もパスしています。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'rakuten_real_url',
        type: 'url',
        title: 'リンク先が間違いなく正規の「event.rakuten.co.jp」',
        location: 'site_url',
        targetSnippet: 'https://event.rakuten.co.jp/campaign/point-up/marathon',
        explanation: '親ドメインが「rakuten.co.jp」、公式のイベントサブドメイン「event」となっており正規のURLです。クレジットカードやパスワードの入力要求もありません。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規のキャンペーンエントリー確認メールです',
      summary: '楽天市場の公式システムから送信された本物のキャンペーン完了メールです。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規のキャンペーン受付通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規のECサービス通信）',
      damageScenario: '被害はありません。安心してお買い物をお楽しみいただけます。',
      safeAlternativeAction: 'キャンペーンやお買い物の確認は、普段お使いの公式「楽天市場」アプリから確認する習慣をつけておくと、より一層安全です。',
    },
  },
  {
    id: 'smbc_genuine_security',
    title: '三井住友カード 正規の利用制限確認通知',
    category: '金融・ネット銀行',
    difficulty: '中級',
    isPhishing: false,
    brand: {
      name: '三井住友カード',
      officialDomain: 'smbc-card.com',
      logoText: '三井住友カード',
      brandColor: '#004730',
    },
    emailData: {
      senderDisplayName: '三井住友カード株式会社',
      senderEmailAddress: 'information@smbc-card.com',
      replyToAddress: 'information@smbc-card.com',
      spfStatus: 'pass',
      receivedDate: '2026/11/04 15:20',
      recipientName: '山田 太郎 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【三井住友カード】重要なお知らせ：カードのご利用確認について',
      bodyHtml: `
        <p style="margin-bottom: 14px;">山田 太郎 様</p>
        <p style="margin-bottom: 14px;">いつも三井住友カードをご利用いただき、誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">弊社の不正検知システムにより、お客様のカードご利用内容について第三者による不正利用の可能性を検知いたしましたため、一部のお取引を保留とさせていただいております。</p>
        <p style="margin-bottom: 14px;">お手数をおかけいたしますが、会員専用サイト「Vpass」へログインの上、該当のお取引がご本人の利用であるかをご確認くださいますようお願い申し上げます。</p>
        <p style="margin-bottom: 14px;">※弊社から送信するメールで、クレジットカード番号や暗証番号、セキュリティコード等の直接入力を求めることはございません。</p>
      `,
      ctaButtonText: 'Vpassでご利用内容を確認する (smbc-card.com)',
      targetUrl: 'https://www.smbc-card.com/mem/index.jsp',
    },
    websiteData: {
      pageTitle: 'カード会員の方（Vpassログイン）｜三井住友カード',
      simulatedUrl: 'https://www.smbc-card.com/mem/index.jsp',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'www',
        domain: 'smbc-card.com',
        path: '/mem/index.jsp',
        isDeceptive: false,
      },
      siteHeadline: 'Vpass ログイン',
      siteSubtext: '三井住友カード会員専用のインターネットサービスです。',
      requiredFields: [
        {
          id: 'vpassId',
          label: 'Vpass ID',
          type: 'text',
          placeholder: '会員ID',
          attackerBenefit: '（正規機能：攻撃者はいません）',
        },
        {
          id: 'vpassPw',
          label: 'パスワード',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: '（正規機能：攻撃者はいません）',
        },
      ],
    },
    clues: [
      {
        id: 'smbc_real_sender',
        type: 'sender',
        title: '送信元「@smbc-card.com」が正規ドメインでSPF認証も合致',
        location: 'email_sender',
        targetSnippet: 'information@smbc-card.com',
        explanation: '三井住友カードの公式ドメイン「smbc-card.com」と完全に一致しており、SPF認証（送信元詐称防止機能）も正常に通っています。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'smbc_real_notice',
        type: 'content',
        title: '宛名に氏名が明記され、カード暗証番号等の入力を一切要求していない',
        location: 'email_body',
        targetSnippet: '※弊社から送信するメールで、クレジットカード番号や暗証番号、セキュリティコード等の直接入力を求めることはございません。',
        explanation: '正規のカード会社からの警告通知では、メール上でカード番号や暗証番号を直接入力させず、会員ページでの取引確認のみを案内します。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規のカード利用確認通知です',
      summary: '三井住友カードの不正利用検知システムから送られた本物の案内です。不審なURLや機密情報の窃取は行われていません。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規のカード不正利用防止通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規の金融サービス通信）',
      damageScenario: '被害はありません。ご自身のカード明細を安全に確認できます。',
      safeAlternativeAction: '不安な場合はメールのリンクを踏まず、ブックマーク済みの公式Vpassや三井住友カード公式アプリからログインして確認すると最も確実です。',
    },
  },
  {
    id: 'yamato_genuine_delivery',
    title: 'ヤマト運輸 正規のお荷物お届け予定通知',
    category: '配送・物流',
    difficulty: '初級',
    isPhishing: false,
    brand: {
      name: 'ヤマト運輸',
      officialDomain: 'kuronekoyamato.co.jp',
      logoText: 'ヤマト運輸',
      brandColor: '#107c41',
    },
    emailData: {
      senderDisplayName: 'ヤマト運輸株式会社',
      senderEmailAddress: 'mail@kuronekoyamato.co.jp',
      replyToAddress: 'mail@kuronekoyamato.co.jp',
      spfStatus: 'pass',
      receivedDate: '2026/11/05 08:30',
      recipientName: '山田 太郎 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【ヤマト運輸】お荷物お届けのお知らせ（11月6日(金)配達予定）',
      bodyHtml: `
        <p style="margin-bottom: 14px;">山田 太郎 様</p>
        <p style="margin-bottom: 14px;">いつもヤマト運輸をご利用いただきありがとうございます。</p>
        <p style="margin-bottom: 14px;">クロネコメンバーズにご登録のお客様へ、お荷物のお届け予定をお知らせいたします。</p>
        <p style="margin-bottom: 14px;">■伝票番号：4398-7210-9541<br>■商品名：書籍・日用品（Amazon.co.jp様より）<br>■お届け予定日時：11月6日(金) 時間帯指定なし</p>
        <p style="margin-bottom: 14px;">配達日時の変更や、コンビニ等の受取場所への変更をご希望の場合は、以下のクロネコメンバーズサイトよりお手続きください。</p>
        <p style="margin-bottom: 14px;">※弊社がSMS等でアプリ（APKファイル等）のダウンロードを求めることはございません。</p>
      `,
      ctaButtonText: '受取日時・場所を変更する (kuronekoyamato.co.jp)',
      targetUrl: 'https://cmypage.kuronekoyamato.co.jp/portal/entrance',
    },
    websiteData: {
      pageTitle: 'お届け予定の確認・変更｜クロネコメンバーズ',
      simulatedUrl: 'https://cmypage.kuronekoyamato.co.jp/portal/entrance',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'cmypage',
        domain: 'kuronekoyamato.co.jp',
        path: '/portal/entrance',
        isDeceptive: false,
      },
      siteHeadline: 'クロネコメンバーズ ログイン',
      siteSubtext: 'お荷物の受け取り日時や受け取り場所の変更が可能です。',
      requiredFields: [
        {
          id: 'memberId',
          label: 'クロネコID / メールアドレス',
          type: 'text',
          placeholder: 'メールアドレスまたはID',
          attackerBenefit: '（正規機能：攻撃者はいません）',
        },
        {
          id: 'memberPw',
          label: 'パスワード',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: '（正規機能：攻撃者はいません）',
        },
      ],
    },
    clues: [
      {
        id: 'yamato_real_sender',
        type: 'sender',
        title: '正規ドメイン「@kuronekoyamato.co.jp」および本物の伝票番号',
        location: 'email_sender',
        targetSnippet: 'mail@kuronekoyamato.co.jp',
        explanation: 'ヤマト運輸公式ドメイン「kuronekoyamato.co.jp」から送信されており、不審なフリーメールやモバイル番号ではありません。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'yamato_real_url',
        type: 'url',
        title: 'リンク先が公式の「kuronekoyamato.co.jp」ドメイン',
        location: 'site_url',
        targetSnippet: 'https://cmypage.kuronekoyamato.co.jp/portal/entrance',
        explanation: 'ヤマト運輸の正規ドメイン（kuronekoyamato.co.jp）配下の正規サブドメイン（cmypage）であり、不正なAPKファイルの配布もありません。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規のヤマト運輸配達通知です',
      summary: 'クロネコメンバーズの公式システムから送信された本物のお届け予定通知です。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規の配送予定通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規の物流サービス通信）',
      damageScenario: '被害はありません。安心して配達日時の変更等を行えます。',
      safeAlternativeAction: '公式アプリ「ヤマト運輸」をインストールしておくと、メールを開かずともプッシュ通知で自動連携されるためさらに安心です。',
    },
  },
  {
    id: 'apple_genuine_receipt',
    title: 'Apple 正規のiCloud+領収書メール',
    category: 'IT・アカウント',
    difficulty: '中級',
    isPhishing: false,
    brand: {
      name: 'Apple',
      officialDomain: 'apple.com',
      logoText: 'Apple',
      brandColor: '#334155',
    },
    emailData: {
      senderDisplayName: 'Apple',
      senderEmailAddress: 'no_reply@email.apple.com',
      replyToAddress: 'no_reply@email.apple.com',
      spfStatus: 'pass',
      receivedDate: '2026/11/02 04:12',
      recipientName: '山田 太郎 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: 'Apple からの領収書です (注文番号: MQL8291048)',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>Apple からの領収書です</strong></p>
        <p style="margin-bottom: 14px;">山田 太郎 様<br>ご注文番号：MQL8291048<br>日付：2026年11月2日</p>
        <p style="margin-bottom: 14px;">■請求内容：iCloud+ 50GB ストレージプラン（1か月）<br>■請求額：¥130<br>■お支払い方法：Apple Pay (Mastercard 末尾 4821)</p>
        <p style="margin-bottom: 14px;">この請求についてご質問がある場合や、問題を報告される場合は、公式ページ「reportaproblem.apple.com」をご確認ください。</p>
        <p style="margin-bottom: 14px;">※Appleが電子メールでお客様のパスワードや完全なクレジットカード番号をお尋ねすることは決してありません。</p>
      `,
      ctaButtonText: '購入履歴・問題の報告 (reportaproblem.apple.com)',
      targetUrl: 'https://reportaproblem.apple.com',
    },
    websiteData: {
      pageTitle: '問題を報告する - Apple',
      simulatedUrl: 'https://reportaproblem.apple.com',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'reportaproblem',
        domain: 'apple.com',
        path: '/',
        isDeceptive: false,
      },
      siteHeadline: '購入に関する問題を報告する',
      siteSubtext: '購入したアプリやサブスクリプションの確認、返金のリクエストが可能です。',
      requiredFields: [
        {
          id: 'appleId',
          label: 'Apple Account でサインイン',
          type: 'text',
          placeholder: 'メールアドレスまたは電話番号',
          attackerBenefit: '（正規機能：攻撃者はいません）',
        },
      ],
    },
    clues: [
      {
        id: 'apple_real_sender',
        type: 'sender',
        title: '正規ドメイン「@email.apple.com」とSPF/DKIM認証の一致',
        location: 'email_sender',
        targetSnippet: 'no_reply@email.apple.com',
        explanation: 'Apple公式の配信ドメイン「email.apple.com」から送信されており、偽装のない正真正銘の公式メールです。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'apple_real_domain',
        type: 'url',
        title: 'リンク先が公式の「reportaproblem.apple.com」',
        location: 'site_url',
        targetSnippet: 'https://reportaproblem.apple.com',
        explanation: '親ドメインは確実に「apple.com」であり、偽装用サブドメインや不審な海外TLD（.ccや.xyz等）は一切使われていません。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規のApple領収書メールです',
      summary: 'Apple公式から毎月自動送信されるストレージプランの正規明細通知です。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規の購入領収書通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規のアカウント課金通知）',
      damageScenario: '被害はありません。実際のサブスクリプション月額費用（¥130）の明細です。',
      safeAlternativeAction: '身に覚えのない請求の場合は、iPhoneの設定アプリの「[自分の名前]」→「サブスクリプション」からいつでも解約や履歴確認が可能です。',
    },
  },
  {
    id: 'mercari_genuine_login',
    title: 'メルカリ 正規の新規端末ログイン通知',
    category: 'EC・通販',
    difficulty: '中級',
    isPhishing: false,
    brand: {
      name: 'メルカリ',
      officialDomain: 'mercari.com',
      logoText: 'mercari',
      brandColor: '#ff0211',
    },
    emailData: {
      senderDisplayName: 'メルカリ',
      senderEmailAddress: 'no-reply@mercari.jp',
      replyToAddress: 'no-reply@mercari.jp',
      spfStatus: 'pass',
      receivedDate: '2026/11/05 18:40',
      recipientName: '山田 太郎 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【メルカリ】新しい端末からのログインがありました',
      bodyHtml: `
        <p style="margin-bottom: 14px;">山田 太郎 様</p>
        <p style="margin-bottom: 14px;">いつもメルカリをご利用いただきありがとうございます。</p>
        <p style="margin-bottom: 14px;">お客様のアカウントに新しい端末からログインがありました。</p>
        <p style="margin-bottom: 14px;">■日時：2026/11/05 18:39<br>■端末：Windows (Google Chrome)<br>■地域：東京都 港区 付近</p>
        <p style="margin-bottom: 14px;">※ご自身のログインである場合は、このメールにご対応いただく必要はございません。</p>
        <p style="margin-bottom: 14px;">心当たりがない場合は、第三者が不正にログインした可能性があるため、速やかにパスワードの再設定と2段階認証の確認を行ってください。</p>
      `,
      ctaButtonText: 'ログイン履歴の確認・パスワード変更 (mercari.com)',
      targetUrl: 'https://jp.mercari.com/mypage/login_history',
    },
    websiteData: {
      pageTitle: 'ログイン履歴｜メルカリ',
      simulatedUrl: 'https://jp.mercari.com/mypage/login_history',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'jp',
        domain: 'mercari.com',
        path: '/mypage/login_history',
        isDeceptive: false,
      },
      siteHeadline: 'ログイン履歴',
      siteSubtext: '最近ログインした端末や場所の一覧を確認できます。',
      requiredFields: [],
    },
    clues: [
      {
        id: 'mercari_real_sender',
        type: 'sender',
        title: '正規の公式配信ドメイン「@mercari.jp」',
        location: 'email_sender',
        targetSnippet: 'no-reply@mercari.jp',
        explanation: 'メルカリ公式の配信ドメイン「mercari.jp」から送信されており、偽装のない正規通知です。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'mercari_real_neutral_content',
        type: 'content',
        title: '心当たりがあれば対応不要と案内し、緊急で脅迫していない',
        location: 'email_body',
        targetSnippet: '※ご自身のログインである場合は、このメールにご対応いただく必要はございません。',
        explanation: '詐欺メールは「24時間以内に認証しないとアカウント削除」と脅迫してURLを踏ませようとしますが、正規のログイン通知は「心当たりがあれば対応不要」と冷静に案内します。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規のログイン通知メールです',
      summary: 'メルカリのセキュリティシステムから送信された本物のログイン通知です。不審な要求や詐欺サイト誘導はありません。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規のアカウントセキュリティ通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規のセキュリティ通知）',
      damageScenario: '被害はありません。ご自身がログインした直後であれば安全です。',
      safeAlternativeAction: '身に覚えがないログインの場合は、メールのリンクを使わず、普段のメルカリアプリから「マイページ」→「個人情報設定」→「ログイン履歴」を開いて強制ログアウトを行ってください。',
    },
  },
  {
    id: 'etax_genuine_notice',
    title: '国税庁（e-Tax） 正規のメッセージボックス受信通知',
    category: '公的機関・税務',
    difficulty: '上級',
    isPhishing: false,
    brand: {
      name: '国税庁 e-Tax',
      officialDomain: 'e-tax.nta.go.jp',
      logoText: 'e-Tax',
      brandColor: '#1d4ed8',
    },
    emailData: {
      senderDisplayName: '国税庁 e-Tax',
      senderEmailAddress: 'info@e-tax.nta.go.jp',
      replyToAddress: 'info@e-tax.nta.go.jp',
      spfStatus: 'pass',
      receivedDate: '2026/11/04 10:00',
      recipientName: '山田 太郎 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【e-Tax】税務署からのお知らせ（メッセージボックス等受信通知）',
      bodyHtml: `
        <p style="margin-bottom: 14px;">山田 太郎 様</p>
        <p style="margin-bottom: 14px;">e-Taxをご利用いただきありがとうございます。</p>
        <p style="margin-bottom: 14px;">税務署からのお知らせがメッセージボックスに届いていますので、ご確認ください。</p>
        <p style="margin-bottom: 14px;">■お知らせ件名：国税の還付金振込通知または手続き確認<br>■確認方法：e-Taxホームページにアクセスし、マイナポータルまたは利用者識別番号でログインの上、「メッセージボックス」より内容をご確認ください。</p>
        <p style="margin-bottom: 14px;"><strong>※国税庁や税務署が電子メールでクレジットカード番号や暗証番号、Vプリカの購入等を求めることは絶対にありません。</strong></p>
      `,
      ctaButtonText: '国税庁 e-Tax 公式ホームページへ (nta.go.jp)',
      targetUrl: 'https://www.e-tax.nta.go.jp',
    },
    websiteData: {
      pageTitle: '国税電子申告・納税システム（e-Tax）',
      simulatedUrl: 'https://www.e-tax.nta.go.jp',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'www',
        domain: 'e-tax.nta.go.jp',
        path: '/',
        isDeceptive: false,
      },
      siteHeadline: '国税電子申告・納税システム e-Tax',
      siteSubtext: 'マイナンバーカードまたは利用者識別番号でメッセージボックスをご確認ください。',
      requiredFields: [],
    },
    clues: [
      {
        id: 'etax_real_go_domain',
        type: 'url',
        title: '日本政府・公的機関専用の「.go.jp」ドメイン',
        location: 'site_url',
        targetSnippet: 'https://www.e-tax.nta.go.jp',
        explanation: '「.go.jp」は日本の政府機関のみが取得できる厳格なドメインです。詐欺グループが「.go.jp」を取得することは不可能です。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'etax_real_no_direct_card',
        type: 'content',
        title: '本文中でクレジットカードや支払いを直接求めていない',
        location: 'email_body',
        targetSnippet: '※国税庁や税務署が電子メールでクレジットカード番号や暗証番号、Vプリカの購入等を求めることは絶対にありません。',
        explanation: '詐欺メールは「未払い税金を今すぐカードで支払え」と脅しますが、本物のe-Taxはメール本文に金額や振込先を書かず、マイナポータル等で公式に確認させます。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規のe-Taxメッセージ通知です',
      summary: '国税庁e-Taxシステムからの正規の新着通知です。公的機関特有の「.go.jp」ドメインを使用し、金銭の直接要求もありません。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規の行政システム通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規の公的機関通信）',
      damageScenario: '被害はありません。安心してメッセージボックスをご確認いただけます。',
      safeAlternativeAction: '行政からの通知を確認する際は、検索エンジンで「国税庁 e-Tax」を検索するか、ブックマークやマイナポータルアプリから開く習慣をつけるとより安全です。',
    },
  },
  {
    id: 'japan_post_redelivery_sms',
    title: '日本郵便 不在配達スミ偽SMS詐欺',
    category: '配送・物流',
    difficulty: '初級',
    isPhishing: true,
    brand: {
      name: '日本郵便',
      officialDomain: 'post.japanpost.jp',
      logoText: '日本郵便',
      brandColor: '#cc0000',
    },
    emailData: {
      senderDisplayName: '090-4821-3991 (日本郵便)',
      senderEmailAddress: '090-4821-3991',
      replyToAddress: '090-4821-3991',
      spfStatus: 'none',
      receivedDate: '2026/11/05 14:10',
      recipientName: 'お客様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【日本郵便】お荷物のお届けにあがりましたが不在のため持ち帰りました',
      bodyHtml: `
        <p style="margin-bottom: 14px;">お客様宛のお荷物をお届けにあがりましたが、ご不在のため持ち帰りました。</p>
        <p style="margin-bottom: 14px;">保管期限は本日より3日間となります。</p>
        <p style="margin-bottom: 14px;">下記リンクより再配達のご希望日時をご指定いただくか、お荷物の配送状況をご確認ください。</p>
        <p style="margin-bottom: 14px;">http://japanpost-parcel-track.xyz/delivery</p>
      `,
      ctaButtonText: '再配達手続きへ進む (japanpost-parcel-track.xyz)',
      targetUrl: 'http://japanpost-parcel-track.xyz/delivery',
    },
    websiteData: {
      pageTitle: '日本郵便 再配達受付サービス',
      simulatedUrl: 'http://japanpost-parcel-track.xyz/delivery',
      browserDomainParsed: {
        protocol: 'http://',
        subdomain: '',
        domain: 'japanpost-parcel-track.xyz',
        path: '/delivery',
        isDeceptive: true,
      },
      siteHeadline: '再配達のお申し込み',
      siteSubtext: 'セキュリティ確認のため、お客様のお名前、電話番号、Apple IDまたはGoogleアカウントでログインしてください。',
      requiredFields: [
        {
          id: 'name',
          label: '氏名',
          type: 'text',
          placeholder: '山田 太郎',
          attackerBenefit: '個人情報の窃取',
        },
        {
          id: 'phone',
          label: '電話番号',
          type: 'text',
          placeholder: '090-XXXX-XXXX',
          attackerBenefit: '今後のスミッシング攻撃対象リスト化',
        },
        {
          id: 'appleOrGoogle',
          label: 'アカウント連携 (Apple ID / Google ID)',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: '主要アカウントの乗っ取り',
        },
      ],
    },
    clues: [
      {
        id: 'japanpost_sms_sender',
        type: 'sender',
        title: '送信元が一般の携帯電話番号（090）からのSMS',
        location: 'email_sender',
        targetSnippet: '090-4821-3991',
        explanation: '日本郵便が個人の携帯電話番号（090/080/070）から不在連絡SMSを送信することは絶対にありません。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'japanpost_xyz_url',
        type: 'url',
        title: '公式ドメイン「post.japanpost.jp」ではなく不審な「.xyz」ドメイン',
        location: 'site_url',
        targetSnippet: 'http://japanpost-parcel-track.xyz',
        explanation: '日本郵便の正規URLは「post.japanpost.jp」です。格安の「.xyz」ドメインを使用し、暗号化されていない「http://」で接続させています。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '危険な不在通知スミッシング（SMS詐欺）です',
      summary: '日本郵便を偽装して個人情報やクラウド認証情報を盗み取ろうとする典型的な宅配不在SMS詐欺です。',
      dangerLevel: '危険',
      scamTypeClassification: '宅配不在スミッシング詐欺',
      attackerGoal: 'アカウント認証情報および携帯電話番号の窃取',
      damageScenario: 'AppleやGoogleアカウントが乗っ取られ、写真や連絡先が流出したり、高額課金が発生します。',
      safeAlternativeAction: 'SMSのリンクは絶対に開かず、不在連絡票に記載の追跡番号を日本郵便公式アプリや公式サイトに入力して確認してください。',
    },
  },
  {
    id: 'japan_post_genuine_notice',
    title: '日本郵便 正規のゆうパックお届け予定通知',
    category: '配送・物流',
    difficulty: '初級',
    isPhishing: false,
    brand: {
      name: '日本郵便',
      officialDomain: 'post.japanpost.jp',
      logoText: '日本郵便',
      brandColor: '#cc0000',
    },
    emailData: {
      senderDisplayName: '日本郵便株式会社',
      senderEmailAddress: 'notice@post.japanpost.jp',
      replyToAddress: 'notice@post.japanpost.jp',
      spfStatus: 'pass',
      receivedDate: '2026/11/05 09:15',
      recipientName: '山田 太郎 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【日本郵便】ゆうパックのお届け予定のお知らせ（追跡番号：1948-2831-9024）',
      bodyHtml: `
        <p style="margin-bottom: 14px;">山田 太郎 様</p>
        <p style="margin-bottom: 14px;">いつも日本郵便をご利用いただきありがとうございます。</p>
        <p style="margin-bottom: 14px;">ゆうパックのお届け予定をご案内いたします。</p>
        <p style="margin-bottom: 14px;">■お問い合わせ番号：1948-2831-9024<br>■お届け予定日：2026年11月6日(金)<br>■ご依頼主：株式会社ABCオンライン</p>
        <p style="margin-bottom: 14px;">配達日時の変更や受取場所の変更は、郵便局の公式ホームページよりお手続きいただけます。</p>
        <p style="margin-bottom: 14px;">※日本郵便から電子メールで暗証番号やクレジットカード番号をお尋ねすることはございません。</p>
      `,
      ctaButtonText: 'お届け日時・受取方法を変更する (post.japanpost.jp)',
      targetUrl: 'https://tracking.post.japanpost.jp/m/delivery/',
    },
    websiteData: {
      pageTitle: '郵便追跡サービス - 日本郵便',
      simulatedUrl: 'https://tracking.post.japanpost.jp/m/delivery/',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'tracking',
        domain: 'post.japanpost.jp',
        path: '/m/delivery/',
        isDeceptive: false,
      },
      siteHeadline: 'ゆうパックお届け日時等の変更受付',
      siteSubtext: '配達予定のお荷物の受取日時や受取場所（コンビニ・はこぽす）の変更が可能です。',
      requiredFields: [],
    },
    clues: [
      {
        id: 'japanpost_real_sender',
        type: 'sender',
        title: '公式送信元「@post.japanpost.jp」とSPF認証合致',
        location: 'email_sender',
        targetSnippet: 'notice@post.japanpost.jp',
        explanation: '日本郵便の正式な企業ドメイン「post.japanpost.jp」から送信されており偽装はありません。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'japanpost_real_url',
        type: 'url',
        title: 'リンク先が公式の「tracking.post.japanpost.jp」',
        location: 'site_url',
        targetSnippet: 'https://tracking.post.japanpost.jp/m/delivery/',
        explanation: '正規ドメイン「post.japanpost.jp」の公式荷物追跡システムです。アカウント情報やカード情報の入力要求もありません。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規のゆうパック配達通知です',
      summary: '日本郵便の公式追跡通知システムから配信された安全な本物メールです。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規の配送通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規の物流サービス通信）',
      damageScenario: '被害はありません。安心して配達日時の調整を行えます。',
      safeAlternativeAction: '郵便局の公式LINEアカウントと連携しておくと、LINE上でお届け予定通知と日時変更がワンタップで行えてより安全です。',
    },
  },
  {
    id: 'mufg_bank_stop_phishing',
    title: '三菱UFJ銀行 取引目的確認の偽装フィッシング',
    category: '金融・ネット銀行',
    difficulty: '中級',
    isPhishing: true,
    brand: {
      name: '三菱UFJ銀行',
      officialDomain: 'bk.mufg.jp',
      logoText: '三菱UFJ銀行',
      brandColor: '#d6000f',
    },
    emailData: {
      senderDisplayName: '三菱UFJ銀行',
      senderEmailAddress: 'mufg-support@bk-mufg-portal.top',
      replyToAddress: 'mufg-support@bk-mufg-portal.top',
      spfStatus: 'softfail',
      receivedDate: '2026/11/04 18:00',
      recipientName: 'お客様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【三菱UFJ銀行】重要なお知らせ：お取引目的等のご確認のお願い（口座制限予告）',
      bodyHtml: `
        <p style="margin-bottom: 14px;">いつも三菱UFJ銀行をご利用いただき、誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">金融庁のマネー・ローンダリング等防止ガイドラインに基づき、すべてのお客様に定期的な「お取引目的等」の確認をお願いしております。</p>
        <p style="margin-bottom: 14px;">本メール受信後、48時間以内にご確認いただけない場合、お客様の口座取引（お引出し、振込）を一時的に制限させていただきます。</p>
        <p style="margin-bottom: 14px;">大変恐れ入りますが、下記の専用窓口より速やかにご回答をお願いいたします。</p>
      `,
      ctaButtonText: 'お取引目的の確認へ進む (bk-mufg-portal.top)',
      targetUrl: 'https://direct.bk.mufg.jp.bk-mufg-portal.top/ib/login',
    },
    websiteData: {
      pageTitle: '三菱UFJダイレクト ログイン',
      simulatedUrl: 'https://direct.bk.mufg.jp.bk-mufg-portal.top/ib/login',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'direct.bk.mufg.jp',
        domain: 'bk-mufg-portal.top',
        path: '/ib/login',
        isDeceptive: true,
      },
      siteHeadline: 'インターネットバンキング ログイン',
      siteSubtext: '契約番号（店番・口座番号）とログインパスワード、ワンタイムパスワードをご入力ください。',
      requiredFields: [
        {
          id: 'accountNo',
          label: '店番・口座番号',
          type: 'text',
          placeholder: '3桁 - 7桁',
          attackerBenefit: '銀行口座の特定',
        },
        {
          id: 'loginPw',
          label: 'ログインパスワード',
          type: 'password',
          placeholder: 'ダイレクトパスワード',
          attackerBenefit: '不正送金のための認証突破',
        },
        {
          id: 'otp',
          label: 'ワンタイムパスワード (カード乱数表)',
          type: 'text',
          placeholder: '生成された6桁の数字',
          attackerBenefit: '即座の不正送金実行',
        },
      ],
    },
    clues: [
      {
        id: 'mufg_fake_domain_trick',
        type: 'url',
        title: '「direct.bk.mufg.jp」を模したサブドメイン詐欺（実ドメインは.top）',
        location: 'site_url',
        targetSnippet: 'https://direct.bk.mufg.jp.bk-mufg-portal.top',
        explanation: '先頭に「direct.bk.mufg.jp」と書いてありますが、本物のドメインは末尾の「bk-mufg-portal.top」です。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'mufg_urgency_threat',
        type: 'psychology',
        title: '「48時間以内に口座停止」と焦らせて冷静な判断を奪う手口',
        location: 'email_body',
        targetSnippet: '本メール受信後、48時間以内にご確認いただけない場合、お客様の口座取引（お引出し、振込）を一時的に制限させていただきます。',
        explanation: '実在の銀行が「48時間未回答で即座に口座凍結」などの過度な脅迫を行うことはありません。詐欺の典型的な心理誘導です。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '危険な銀行フィッシング詐欺です',
      summary: 'マネーローンダリング対策を口実にして、口座情報とワンタイムパスワードを奪い取る典型的な銀行詐欺です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: '銀行口座不正送金フィッシング',
      attackerGoal: '銀行口座からの全額不正送金',
      damageScenario: '口座残高が第三者の暗号資産取引所や別口座へ不正送金され、全額失われます。',
      safeAlternativeAction: '銀行からのメールリンクは絶対にクリックせず、公式アプリ「三菱UFJ銀行」からログインしてご確認ください。',
    },
  },
  {
    id: 'mufg_genuine_security_alert',
    title: '三菱UFJ銀行 正規のパスワード変更完了通知',
    category: '金融・ネット銀行',
    difficulty: '中級',
    isPhishing: false,
    brand: {
      name: '三菱UFJ銀行',
      officialDomain: 'bk.mufg.jp',
      logoText: '三菱UFJ銀行',
      brandColor: '#d6000f',
    },
    emailData: {
      senderDisplayName: '三菱UFJ銀行',
      senderEmailAddress: 'ib-info@direct.bk.mufg.jp',
      replyToAddress: 'ib-info@direct.bk.mufg.jp',
      spfStatus: 'pass',
      receivedDate: '2026/11/05 21:05',
      recipientName: '山田 太郎 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【三菱UFJダイレクト】ログインパスワード変更完了のお知らせ',
      bodyHtml: `
        <p style="margin-bottom: 14px;">いつも三菱UFJダイレクトをご利用いただき、ありがとうございます。</p>
        <p style="margin-bottom: 14px;">お客様のログインパスワードの変更手続きが完了いたしました。</p>
        <p style="margin-bottom: 14px;">■お手続き日時：2026/11/05 21:05<br>■お手続き内容：ログインパスワード変更</p>
        <p style="margin-bottom: 14px;">本メールにお心当たりがない場合は、第三者によって不正に手続きが行われた可能性があります。直ちにお取引停止ダイヤル（0120-543-555）までご連絡ください。</p>
        <p style="margin-bottom: 14px;">※当行から送信するメールで、お客様のパスワードや暗証番号の入力を促すリンクを掲載することはございません。</p>
      `,
      ctaButtonText: '三菱UFJ銀行 公式ホームページへ (bk.mufg.jp)',
      targetUrl: 'https://www.bk.mufg.jp',
    },
    websiteData: {
      pageTitle: '三菱UFJ銀行 公式サイト',
      simulatedUrl: 'https://www.bk.mufg.jp',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'www',
        domain: 'bk.mufg.jp',
        path: '/',
        isDeceptive: false,
      },
      siteHeadline: '三菱UFJ銀行',
      siteSubtext: '個人のお客さま向け公式インターネットバンキングサービス',
      requiredFields: [],
    },
    clues: [
      {
        id: 'mufg_real_sender',
        type: 'sender',
        title: '公式ドメイン「direct.bk.mufg.jp」からの送信',
        location: 'email_sender',
        targetSnippet: 'ib-info@direct.bk.mufg.jp',
        explanation: '三菱UFJ銀行の公式ダイレクトメール配信ドメイン「direct.bk.mufg.jp」から送信されています。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'mufg_no_phishing_link',
        type: 'content',
        title: 'メール本文にログイン入力画面への直接リンクを貼っていない',
        location: 'email_body',
        targetSnippet: '※当行から送信するメールで、お客様のパスワードや暗証番号の入力を促すリンクを掲載することはございません。',
        explanation: 'セキュリティ対策として、銀行からの重要通知メールではログイン画面へのリンクを排除し、電話相談窓口やトップページのみを案内する正規仕様です。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規のセキュリティ通知です',
      summary: 'パスワード変更直後に自動発行される本物の確認メールです。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規のアカウント変更通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規の金融サービス通信）',
      damageScenario: '被害はありません。ご自身が変更された直後であれば安全です。',
      safeAlternativeAction: '身に覚えがない場合は記載の停止専用ダイヤルに速やかにお電話ください。',
    },
  },
  {
    id: 'my_number_card_renewal_spoof',
    title: 'マイナポータル 電子証明書更新の偽装詐欺',
    category: '公的機関・税務',
    difficulty: '巧妙',
    isPhishing: true,
    brand: {
      name: 'デジタル庁 マイナポータル',
      officialDomain: 'myna.go.jp',
      logoText: 'マイナポータル',
      brandColor: '#1e40af',
    },
    emailData: {
      senderDisplayName: 'マイナポータル運営事務局',
      senderEmailAddress: 'myna-info@myna-gov-portal.org',
      replyToAddress: 'myna-info@myna-gov-portal.org',
      spfStatus: 'softfail',
      receivedDate: '2026/11/04 11:20',
      recipientName: 'お客様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【重要・マイナポータル】マイナンバーカード電子証明書の有効期限更新について',
      bodyHtml: `
        <p style="margin-bottom: 14px;">マイナポータルをご利用の皆様へ</p>
        <p style="margin-bottom: 14px;">お客様のマイナンバーカードに搭載されている署名用電子証明書の有効期限が近づいております。</p>
        <p style="margin-bottom: 14px;">有効期限が切れますと、マイナ保険証やe-Tax、コンビニ交付サービス等の各種行政手続きがご利用いただけなくなります。</p>
        <p style="margin-bottom: 14px;">オンライン更新の本人確認手数料（330円）のお支払いおよび本人確認のため、下記リンクより更新手続きを完了させてください。</p>
      `,
      ctaButtonText: '電子証明書のオンライン更新手続き (myna-digital-gov.click)',
      targetUrl: 'https://myna-digital-gov.click/cert/renewal',
    },
    websiteData: {
      pageTitle: '電子証明書の更新手続き｜マイナポータル',
      simulatedUrl: 'https://myna-digital-gov.click/cert/renewal',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: '',
        domain: 'myna-digital-gov.click',
        path: '/cert/renewal',
        isDeceptive: true,
      },
      siteHeadline: '電子証明書 オンライン更新',
      siteSubtext: 'マイナンバー、暗証番号、更新手数料決済用のクレジットカード情報を入力してください。',
      requiredFields: [
        {
          id: 'myNumber',
          label: 'マイナンバー (12桁)',
          type: 'text',
          placeholder: '1234 5678 9012',
          attackerBenefit: '厳重管理されるマイナンバーの漏洩',
        },
        {
          id: 'pin',
          label: '署名用電子証明書 暗証番号 (6〜16桁)',
          type: 'password',
          placeholder: '暗証番号',
          attackerBenefit: '行政手続きや本人確認の不正代行',
        },
        {
          id: 'cardNo',
          label: 'クレジットカード番号',
          type: 'creditCard',
          placeholder: '更新手数料決済用',
          attackerBenefit: '金銭の不正引き出し',
        },
      ],
    },
    clues: [
      {
        id: 'myna_fee_lie',
        type: 'request',
        title: '本来無料のマイナンバー更新でクレカ決済手数料を要求',
        location: 'site_content',
        targetSnippet: '更新手数料決済用のクレジットカード情報を入力してください',
        explanation: 'マイナンバーカードや電子証明書の更新手数料は完全に無料です。クレジットカード決済を要求する時点で100%詐欺です。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'myna_non_go_domain',
        type: 'url',
        title: '日本政府公式の「.go.jp」ではなく「.click」ドメイン',
        location: 'site_url',
        targetSnippet: 'https://myna-digital-gov.click',
        explanation: 'マイナポータルの公式ドメインは「myna.go.jp」です。誰でも格安で取得できる「.click」ドメインを使用しています。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '極めて悪質な行政偽装フィッシング詐欺です',
      summary: 'マイナンバーの電子証明書更新に便乗し、マイナンバー、暗証番号、クレカ番号を一挙に奪おうとする偽装詐欺です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: '行政マイナポータル偽装詐欺',
      attackerGoal: 'マイナンバー・暗証番号・クレジットカードの複合奪取',
      damageScenario: '口座開設詐欺の踏み台にされたり、クレジットカードで限度額上限まで不正決済されます。',
      safeAlternativeAction: 'マイナンバーカードの更新は市役所窓口または自治体から送付される正式な通知書（郵便）に従ってください。',
    },
  },
  {
    id: 'microsoft_365_quarantine_phishing',
    title: 'Microsoft 365 メール隔離通知の偽装詐欺',
    category: 'IT・アカウント',
    difficulty: '巧妙',
    isPhishing: true,
    brand: {
      name: 'Microsoft 365',
      officialDomain: 'microsoft.com',
      logoText: 'Microsoft 365',
      brandColor: '#0078d4',
    },
    emailData: {
      senderDisplayName: 'Microsoft Security Center',
      senderEmailAddress: 'postmaster@security-quarantine-gateway.net',
      replyToAddress: 'postmaster@security-quarantine-gateway.net',
      spfStatus: 'softfail',
      receivedDate: '2026/11/05 10:20',
      recipientName: 'お客様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '[保留中] 3通の受信メールがスパム隔離されました。メッセージを確認して受信トレイに解放してください',
      bodyHtml: `
        <p style="margin-bottom: 14px;"><strong>Microsoft 365 Exchange Online 保護センター</strong></p>
        <p style="margin-bottom: 14px;">あなた宛ての受信メール3件がフィルタリングされ、現在隔離ボックスに保留されています。</p>
        <p style="margin-bottom: 14px;">■隔離されたメールの差出人：取引先・請求書関連<br>■自動削除までの期間：あと24時間</p>
        <p style="margin-bottom: 14px;">業務上の重要なメールである場合は、以下の「保留メッセージを確認して解放」ボタンよりアカウント認証の上、解放処理を行ってください。</p>
      `,
      ctaButtonText: '保留メッセージを確認して解放する',
      targetUrl: 'https://login.microsoftonline.com.secure-auth-node.cc/wa/quarantine',
    },
    websiteData: {
      pageTitle: 'サインイン - Microsoft アカウント',
      simulatedUrl: 'https://login.microsoftonline.com.secure-auth-node.cc/wa/quarantine',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'login.microsoftonline.com',
        domain: 'secure-auth-node.cc',
        path: '/wa/quarantine',
        isDeceptive: true,
      },
      siteHeadline: 'サインイン',
      siteSubtext: '職場または学校のアカウントパスワードを入力してメッセージの解放を承認してください。',
      requiredFields: [
        {
          id: 'corpEmail',
          label: 'メール、電話、または Skype',
          type: 'text',
          placeholder: 'target.user@company.co.jp',
          attackerBenefit: '企業アカウントの特定',
        },
        {
          id: 'corpPw',
          label: 'パスワード',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: '社内ネットワーク・SharePoint・機密メールへの不正侵入',
        },
      ],
    },
    clues: [
      {
        id: 'ms_subdomain_spoof',
        type: 'url',
        title: '「login.microsoftonline.com」をサブドメインに偽装（実ドメインは.cc）',
        location: 'site_url',
        targetSnippet: 'https://login.microsoftonline.com.secure-auth-node.cc',
        explanation: '本物の親ドメインは末尾の「secure-auth-node.cc」です。企業を狙う標的型フィッシングで最も使われる巧妙な手口です。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'ms_sender_fake',
        type: 'sender',
        title: '送信元がMicrosoft公式ではなく無関係な外部ドメイン',
        location: 'email_sender',
        targetSnippet: 'postmaster@security-quarantine-gateway.net',
        explanation: 'Microsoftの公式通知は「microsoft.com」または企業の独自ドメイン内部のExchangeサーバーから届きます。外部の怪しいドメイン（gateway.net）は詐欺です。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '危険な企業標的型（ビジネス）フィッシング詐欺です',
      summary: 'メール隔離通知を装い、Microsoft 365のクラウドアカウントを乗っ取ろうとするビジネス詐欺です。',
      dangerLevel: '極めて危険',
      scamTypeClassification: 'Microsoft 365認証奪取フィッシング',
      attackerGoal: '社内メール・OneDriveの乗っ取りと情報漏洩',
      damageScenario: '社内の機密情報や顧客リストが盗まれ、取引先へのなりすまし請求詐欺に悪用されます。',
      safeAlternativeAction: 'メール内のリンクは開かず、公式の「security.microsoft.com/quarantine」を直接ブックマークから開いて確認してください。',
    },
  },
  {
    id: 'google_genuine_workspace_receipt',
    title: 'Google Payments 正規の領収書通知',
    category: 'IT・アカウント',
    difficulty: '中級',
    isPhishing: false,
    brand: {
      name: 'Google',
      officialDomain: 'google.com',
      logoText: 'Google',
      brandColor: '#4285f4',
    },
    emailData: {
      senderDisplayName: 'Google Payments',
      senderEmailAddress: 'payments-noreply@google.com',
      replyToAddress: 'payments-noreply@google.com',
      spfStatus: 'pass',
      receivedDate: '2026/11/04 14:02',
      recipientName: '山田 太郎 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: 'Google: Google One (100 GB) の月額お支払い領収書',
      bodyHtml: `
        <p style="margin-bottom: 14px;">いつも Google をご利用いただきありがとうございます。</p>
        <p style="margin-bottom: 14px;">Google One メンバーシップ（100 GB ストレージプラン）のお支払いが完了いたしましたので、領収書をお送りします。</p>
        <p style="margin-bottom: 14px;">■請求番号：GP.8192-3011-8429<br>■請求日：2026年11月4日<br>■金額：¥250<br>■お支払い方法：Visa •••• 1234</p>
        <p style="margin-bottom: 14px;">明細やお支払い方法の管理は、いつでも Google お支払いセンター（pay.google.com）からご確認いただけます。</p>
      `,
      ctaButtonText: 'Google お支払いセンターで管理する (pay.google.com)',
      targetUrl: 'https://pay.google.com/payments/home',
    },
    websiteData: {
      pageTitle: 'Google お支払いセンター',
      simulatedUrl: 'https://pay.google.com/payments/home',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'pay',
        domain: 'google.com',
        path: '/payments/home',
        isDeceptive: false,
      },
      siteHeadline: 'Google お支払いセンター',
      siteSubtext: '定期購入とお支払いの管理',
      requiredFields: [],
    },
    clues: [
      {
        id: 'google_real_payments_sender',
        type: 'sender',
        title: '公式送信元「payments-noreply@google.com」およびSPF認証合致',
        location: 'email_sender',
        targetSnippet: 'payments-noreply@google.com',
        explanation: 'Google公式の決済システム用配信アドレスから正常に届いています。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'google_real_payments_url',
        type: 'url',
        title: 'リンク先が公式の「pay.google.com」',
        location: 'site_url',
        targetSnippet: 'https://pay.google.com/payments/home',
        explanation: 'Google公式の決済ポータル（pay.google.com）であり、不審な別サイトや再認証の強要はありません。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規のGoogle領収書通知です',
      summary: 'Google One月額ストレージ利用料の公式領収書メールです。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規の決済明細通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規のITサービス通信）',
      damageScenario: '被害はありません。月額課金（¥250）の正式な明細です。',
      safeAlternativeAction: '不要な定期購入の解約は、Google Playまたはpay.google.comからいつでも手続きできます。',
    },
  },
  {
    id: 'jr_west_jwest_point_phishing',
    title: 'JR西日本 WESTERポイント失効偽装詐欺',
    category: '交通・インフラ',
    difficulty: '中級',
    isPhishing: true,
    brand: {
      name: 'JR西日本 WESTER',
      officialDomain: 'jr-odekake.net',
      logoText: 'WESTER',
      brandColor: '#0072bc',
    },
    emailData: {
      senderDisplayName: 'JR西日本 WESTER事務局',
      senderEmailAddress: 'info@wester-jr-odekake.club',
      replyToAddress: 'info@wester-jr-odekake.club',
      spfStatus: 'softfail',
      receivedDate: '2026/11/04 16:45',
      recipientName: 'お客様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【JR西日本】WESTERポイント有効期限到来に伴うポイント交換・利用手続きのご案内',
      bodyHtml: `
        <p style="margin-bottom: 14px;">いつもJR西日本の鉄道およびWESTERサービスをご利用いただきありがとうございます。</p>
        <p style="margin-bottom: 14px;">現在お客様のアカウントに保有されている「WESTERポイント（12,850ポイント）」の有効期限が、今月末日をもって満了いたします。</p>
        <p style="margin-bottom: 14px;">失効したポイントの再付与はできません。新幹線特急券の交換または電子マネーへの還元をご希望の方は、下記リンクより交換手続きを行ってください。</p>
      `,
      ctaButtonText: 'ポイント交換・利用手続きへ進む (wester-jr-odekake.club)',
      targetUrl: 'https://wester.jr-odekake.club/point/exchange',
    },
    websiteData: {
      pageTitle: 'WESTERポイント交換手続き｜JRおでかけネット',
      simulatedUrl: 'https://wester.jr-odekake.club/point/exchange',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'wester',
        domain: 'jr-odekake.club',
        path: '/point/exchange',
        isDeceptive: true,
      },
      siteHeadline: 'WESTERポイント交換申し込み',
      siteSubtext: '本人確認およびポイント移行先クレジットカード情報をご入力ください。',
      requiredFields: [
        {
          id: 'jwestId',
          label: 'WESTER ID / 会員番号',
          type: 'text',
          placeholder: '会員番号',
          attackerBenefit: '鉄道サービス会員情報',
        },
        {
          id: 'cardNo',
          label: 'クレジットカード番号',
          type: 'creditCard',
          placeholder: 'カード番号',
          attackerBenefit: '金銭の不正利用',
        },
        {
          id: 'cvv',
          label: 'セキュリティコード (3桁)',
          type: 'text',
          placeholder: '裏面の3桁',
          attackerBenefit: 'カード決済の悪用',
        },
      ],
    },
    clues: [
      {
        id: 'wester_club_tld',
        type: 'url',
        title: '公式「jr-odekake.net」ではなく「.club」ドメイン',
        location: 'site_url',
        targetSnippet: 'https://wester.jr-odekake.club',
        explanation: 'JR西日本の公式ドメインは「jr-odekake.net」です。見知らぬ「.club」ドメインで偽装しています。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'wester_unrealistic_points',
        type: 'psychology',
        title: '身に覚えのない大量ポイント（12,850pt）で釣る手口',
        location: 'email_body',
        targetSnippet: '現在お客様のアカウントに保有されている「WESTERポイント（12,850ポイント）」の有効期限が、今月末日をもって満了いたします。',
        explanation: '「高額ポイントが失効する」と焦らせてURLをクリックさせる典型的なフィッシングの手口です。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '危険な交通ポイント失効フィッシング詐欺です',
      summary: 'JR西日本のWESTERポイント失効を偽り、クレジットカード情報を盗み取るフィッシングサイトです。',
      dangerLevel: '危険',
      scamTypeClassification: 'ポイント失効フィッシング詐欺',
      attackerGoal: 'クレジットカード情報の窃取',
      damageScenario: 'クレジットカード情報がダークウェブに売却され、ネットショッピングで不正使用されます。',
      safeAlternativeAction: 'ポイントの残高や失効期限は、スマートフォンの公式「WESTER」アプリから直接ご確認ください。',
    },
  },
  {
    id: 'rakuten_card_spoof_phishing',
    title: '楽天カード 不正利用検知偽装（不自然な日本語）',
    category: '金融・ネット銀行',
    difficulty: '巧妙',
    isPhishing: true,
    brand: {
      name: '楽天カード',
      officialDomain: 'rakuten-card.co.jp',
      logoText: '楽天カード',
      brandColor: '#bf0000',
    },
    emailData: {
      senderDisplayName: '楽天カード株式会社',
      senderEmailAddress: 'security-alert@rakuten-card-support-center.xyz',
      replyToAddress: 'security-alert@rakuten-card-support-center.xyz',
      spfStatus: 'softfail',
      receivedDate: '2026/11/05 13:40',
      recipientName: 'お客様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【重要】楽天カードご利用制限のお知らせとお手続きのお願い',
      bodyHtml: `
        <p style="margin-bottom: 14px;">楽天カードをご愛顧いただき、誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">このたび、お客様のカードにおいて異常な取引パターンが検知されましたため、カードのご利用を一時的に制限（お止め）させていただきました。</p>
        <p style="margin-bottom: 14px;">制限解除をご希望される場合は、下記の楽天e-NAVIお客様窓口より本人確認を完了させてください。</p>
        <p style="margin-bottom: 14px;">※24時間以内にご確認がない場合、カード契約は自動解約となります。</p>
      `,
      ctaButtonText: '楽天e-NAVIで利用制限を解除する',
      targetUrl: 'https://rakuten-card.co.jp.sec-service-center.xyz/e-navi',
    },
    websiteData: {
      pageTitle: '楽天e-NAVI ログイン｜楽天カード',
      simulatedUrl: 'https://rakuten-card.co.jp.sec-service-center.xyz/e-navi',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'rakuten-card.co.jp',
        domain: 'sec-service-center.xyz',
        path: '/e-navi',
        isDeceptive: true,
      },
      siteHeadline: '楽天e-NAVI ログイン',
      siteSubtext: '楽天ID、パスワード、クレジットカード番号と暗証番号をご入力ください。',
      requiredFields: [
        {
          id: 'rakutenId',
          label: 'ユーザーID',
          type: 'text',
          placeholder: 'メールアドレスまたはユーザーID',
          attackerBenefit: '楽天会員アカウントの掌握',
        },
        {
          id: 'password',
          label: 'パスワード',
          type: 'password',
          placeholder: 'パスワード',
          attackerBenefit: '楽天市場やカード情報への不正アクセス',
        },
        {
          id: 'cardPin',
          label: 'カード暗証番号 (4桁)',
          type: 'password',
          placeholder: '暗証番号',
          attackerBenefit: '実店舗やATMでのキャッシング・不正使用',
        },
      ],
    },
    clues: [
      {
        id: 'rakuten_card_subdomain_trick',
        type: 'url',
        title: '「rakuten-card.co.jp」を前方に配置した偽装ドメイン',
        location: 'site_url',
        targetSnippet: 'https://rakuten-card.co.jp.sec-service-center.xyz',
        explanation: '本物の親ドメインは末尾の「sec-service-center.xyz」です。公式ドメイン名を含めてスマホ利用者を騙そうとする手口です。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'rakuten_card_auto_cancel_threat',
        type: 'psychology',
        title: '「24時間で自動解約」というあり得ない脅迫文面',
        location: 'email_body',
        targetSnippet: '※24時間以内にご確認がない場合、カード契約は自動解約となります。',
        explanation: '本物のクレジットカード会社が24時間の連絡不通だけで契約を即時解約することは絶対にありません。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '危険なクレジットカード偽装フィッシングです',
      summary: '楽天カードの利用制限を騙り、楽天ID・パスワード・カード暗証番号をすべて詐取する偽装サイトです。',
      dangerLevel: '極めて危険',
      scamTypeClassification: 'クレジットカード暗証番号詐取フィッシング',
      attackerGoal: 'クレジットカードおよび楽天会員アカウントの全権強奪',
      damageScenario: '暗証番号を含む情報が奪われ、不正決済やキャッシング枠の不正引き出しが発生します。',
      safeAlternativeAction: 'メールのリンクは開かず、公式「楽天カード」アプリから利用明細や利用可能額をご確認ください。',
    },
  },
  {
    id: 'openai_chatgpt_subscription_phishing',
    title: 'OpenAI ChatGPT Plus 支払い失敗偽装詐欺',
    category: 'エンタメ・サブスク',
    difficulty: '中級',
    isPhishing: true,
    brand: {
      name: 'OpenAI ChatGPT',
      officialDomain: 'openai.com',
      logoText: 'ChatGPT',
      brandColor: '#10a37f',
    },
    emailData: {
      senderDisplayName: 'OpenAI Billing Support',
      senderEmailAddress: 'billing@openai-verify-account.com',
      replyToAddress: 'billing@openai-verify-account.com',
      spfStatus: 'softfail',
      receivedDate: '2026/11/05 06:30',
      recipientName: 'お客様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '[OpenAI] Your ChatGPT Plus subscription payment failed — update billing details',
      bodyHtml: `
        <p style="margin-bottom: 14px;">Dear OpenAI user,</p>
        <p style="margin-bottom: 14px;">We were unable to process your monthly payment ($20.00 USD) for your <strong>ChatGPT Plus</strong> subscription due to an issue with your payment method on file.</p>
        <p style="margin-bottom: 14px;">To avoid interruption of your access to GPT-4o, advanced data analysis, and custom GPTs, please update your billing information within 24 hours.</p>
        <p style="margin-bottom: 14px;">Please review and update your payment method using the link below:</p>
      `,
      ctaButtonText: 'Update Payment Method (auth0.openai.com.billing-update.io)',
      targetUrl: 'https://auth0.openai.com.billing-update.io/account/billing',
    },
    websiteData: {
      pageTitle: 'Update payment method | OpenAI',
      simulatedUrl: 'https://auth0.openai.com.billing-update.io/account/billing',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'auth0.openai.com',
        domain: 'billing-update.io',
        path: '/account/billing',
        isDeceptive: true,
      },
      siteHeadline: 'Update your payment details',
      siteSubtext: 'Enter your new credit card details to keep your ChatGPT Plus subscription active.',
      requiredFields: [
        {
          id: 'cardHolder',
          label: 'Cardholder Name',
          type: 'text',
          placeholder: 'TARO YAMADA',
          attackerBenefit: '名義人情報',
        },
        {
          id: 'cardNo',
          label: 'Card Number',
          type: 'creditCard',
          placeholder: '4532 •••• •••• ••••',
          attackerBenefit: 'クレジットカード番号',
        },
        {
          id: 'cvv',
          label: 'CVC / CVV',
          type: 'text',
          placeholder: '3 digits',
          attackerBenefit: 'オンライン決済の突破',
        },
      ],
    },
    clues: [
      {
        id: 'openai_sender_fake',
        type: 'sender',
        title: '送信元「@openai-verify-account.com」がOpenAI公式ではない',
        location: 'email_sender',
        targetSnippet: 'billing@openai-verify-account.com',
        explanation: 'OpenAIの公式ドメインは「openai.com」です。偽装した無関係な外部ドメインから届いています。',
        isScamIndicator: true,
        severity: 'danger',
      },
      {
        id: 'openai_url_subdomain',
        type: 'url',
        title: '「auth0.openai.com」を装った「billing-update.io」ドメイン',
        location: 'site_url',
        targetSnippet: 'https://auth0.openai.com.billing-update.io',
        explanation: '親ドメインは「billing-update.io」です。クレジットカード情報を直接盗み取るための偽サイトです。',
        isScamIndicator: true,
        severity: 'danger',
      },
    ],
    analysis: {
      verdictTitle: '危険な生成AIサービス課金フィッシングです',
      summary: '世界的に流行しているChatGPT課金停止を騙ったクレジットカード番号詐取フィッシングです。',
      dangerLevel: '危険',
      scamTypeClassification: 'SaaSサブスク課金フィッシング',
      attackerGoal: 'クレジットカード情報の窃取',
      damageScenario: '海外サイト等で高額な不正課金が行われます。',
      safeAlternativeAction: 'ChatGPTの利用状況やお支払い情報は、必ず公式サイト「chatgpt.com」の「設定」→「My Plan」から確認してください。',
    },
  },
  {
    id: 'nintendo_switch_genuine_receipt',
    title: '任天堂 Nintendo Switch Online 自動継続購入の正規明細',
    category: 'エンタメ・サブスク',
    difficulty: '初級',
    isPhishing: false,
    brand: {
      name: '任天堂',
      officialDomain: 'nintendo.com',
      logoText: 'Nintendo',
      brandColor: '#e60012',
    },
    emailData: {
      senderDisplayName: '任天堂株式会社',
      senderEmailAddress: 'no-reply@accounts.nintendo.com',
      replyToAddress: 'no-reply@accounts.nintendo.com',
      spfStatus: 'pass',
      receivedDate: '2026/11/04 12:00',
      recipientName: '山田 太郎 様',
      recipientEmail: 'target.user@example.ne.jp',
      subject: '【任天堂】ご利用明細：Nintendo Switch Online利用券 自動継続購入のお知らせ',
      bodyHtml: `
        <p style="margin-bottom: 14px;">山田 太郎 様</p>
        <p style="margin-bottom: 14px;">ニンテンドーアカウントをご利用いただき、誠にありがとうございます。</p>
        <p style="margin-bottom: 14px;">Nintendo Switch Online 利用券（個人プラン 12か月）の自動継続購入が完了いたしました。</p>
        <p style="margin-bottom: 14px;">■ご注文番号：NS-20261104-8912<br>■商品名：Nintendo Switch Online 個人プラン 12か月券<br>■ご購入金額：¥2,400<br>■お支払い方法：クレジットカード (VISA 末尾 1234)</p>
        <p style="margin-bottom: 14px;">購入内容の確認や自動継続の停止は、ニンテンドーアカウントの「設定」メニューより行っていただけます。</p>
        <p style="margin-bottom: 14px;">※任天堂からお客様のパスワードや暗証番号をメールでお尋ねすることはございません。</p>
      `,
      ctaButtonText: 'ニンテンドーアカウント設定を開く (accounts.nintendo.com)',
      targetUrl: 'https://accounts.nintendo.com/portal',
    },
    websiteData: {
      pageTitle: 'ニンテンドーアカウント',
      simulatedUrl: 'https://accounts.nintendo.com/portal',
      browserDomainParsed: {
        protocol: 'https://',
        subdomain: 'accounts',
        domain: 'nintendo.com',
        path: '/portal',
        isDeceptive: false,
      },
      siteHeadline: 'ニンテンドーアカウント',
      siteSubtext: 'ユーザー情報とお支払いの管理',
      requiredFields: [],
    },
    clues: [
      {
        id: 'nintendo_real_sender',
        type: 'sender',
        title: '正規ドメイン「@accounts.nintendo.com」とSPF認証合致',
        location: 'email_sender',
        targetSnippet: 'no-reply@accounts.nintendo.com',
        explanation: '任天堂の公式アカウントドメイン「accounts.nintendo.com」から送信された正規メールです。',
        isScamIndicator: false,
        severity: 'safe',
      },
      {
        id: 'nintendo_real_url',
        type: 'url',
        title: 'リンク先が公式の「accounts.nintendo.com」',
        location: 'site_url',
        targetSnippet: 'https://accounts.nintendo.com/portal',
        explanation: '任天堂公式のニンテンドーアカウント管理ポータルです。不審な入力要求や不自然な日本語はありません。',
        isScamIndicator: false,
        severity: 'safe',
      },
    ],
    analysis: {
      verdictTitle: '安全な正規の任天堂決済通知です',
      summary: 'Nintendo Switch Online利用券の自動更新完了を知らせる任天堂公式の正規通知です。',
      dangerLevel: '安全（正規通信）',
      scamTypeClassification: '正規のサブスクリプション購入通知（フィッシングではありません）',
      attackerGoal: '該当なし（正規のゲームサービス通信）',
      damageScenario: '被害はありません。正規の年額利用料金（¥2,400）の領収通知です。',
      safeAlternativeAction: '次回以降の自動更新を停止したい場合は、Nintendo Switch本体のeショップまたは公式アカウント設定から「利用券」を開いて更新停止できます。',
    },
  },
];

/**
 * Shuffle scenarios and guarantee a balanced, realistic challenge.
 * Mixes genuine and phishing scenarios proportionally
 * so users cannot guess simply by assuming "almost everything is phishing".
 */
export function getRandomScenarios(count = 15): Scenario[] {
  const shuffle = <T>(arr: T[]): T[] => {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  };

  if (count >= SCENARIOS.length) {
    return shuffle(SCENARIOS);
  }

  const phishing = SCENARIOS.filter((s) => s.isPhishing);
  const genuine = SCENARIOS.filter((s) => !s.isPhishing);

  const shuffledPhishing = shuffle(phishing);
  const shuffledGenuine = shuffle(genuine);

  // Approximately 40-50% genuine scenarios for realistic tension
  const ratio = genuine.length / SCENARIOS.length;
  const targetGenuineCount = Math.min(
    shuffledGenuine.length,
    Math.max(2, Math.round(count * ratio) + (Math.random() > 0.5 ? 1 : 0))
  );
  const targetPhishingCount = Math.min(
    shuffledPhishing.length,
    count - targetGenuineCount
  );

  const selected = [
    ...shuffledGenuine.slice(0, targetGenuineCount),
    ...shuffledPhishing.slice(0, targetPhishingCount),
  ];

  return shuffle(selected);
}


