import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const PRODUCT_NAMES: Record<string, string> = {
  ebook: "Top 10 Buchungs-Hacks E-Book",
  analyse: "10-Sekunden Reiseanalyse",
  kreditkarten: "Kreditkarten-Vergleich 2026",
  crashkurs: "Meilen-Crashkurs",
  masterplan: "Lounge & Upgrade Masterplan",
};

const PLAN_NAMES: Record<string, string> = {
  monthly: "Monatlich (9,90 €/Monat)",
  yearly: "Jährlich (99,00 €/Jahr)",
};

export async function sendPurchaseConfirmation({
  email,
  productId,
  userName,
}: {
  email: string;
  productId: string;
  userName?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] RESEND_API_KEY not set, skipping email");
    return;
  }

  const productName = PRODUCT_NAMES[productId] ?? productId;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://travelprof.vercel.app";
  const greeting = userName ? `Hallo ${userName}` : "Hallo";

  const dashboardLink = `${appUrl}/dashboard/produkte`;
  const PRODUCT_LINKS: Record<string, string> = {
    ebook: "/dashboard/produkte/ebook",
    kreditkarten: "/dashboard/produkte/kreditkarten",
    crashkurs: "/dashboard/produkte/crashkurs",
    masterplan: "/dashboard/produkte/masterplan",
    analyse: "/dashboard/analyse",
  };
  const directLink = PRODUCT_LINKS[productId]
    ? `${appUrl}${PRODUCT_LINKS[productId]}`
    : dashboardLink;

  await getResend().emails.send({
    from: "traveling.prof <noreply@email.travelingprof.de>",
    to: email,
    subject: `Dein Kauf: ${productName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: #e8793b; color: white; font-weight: 800; font-size: 18px; text-align: center;">TP</div>
          <p style="margin: 8px 0 0; font-weight: 700; font-size: 16px; color: #1a1a1a;">traveling.prof</p>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">${greeting},</h1>
        <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px;">
          vielen Dank für deinen Kauf! Dein Produkt <strong>${productName}</strong> steht ab sofort in deinem Dashboard bereit.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${directLink}" style="display: inline-block; padding: 14px 32px; background: #e8793b; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
            Jetzt öffnen
          </a>
        </div>

        <p style="font-size: 14px; color: #888; line-height: 1.6;">
          Du findest alle deine gekauften Produkte jederzeit unter:<br>
          <a href="${dashboardLink}" style="color: #e8793b;">${dashboardLink}</a>
        </p>

        <hr style="border: none; height: 1px; background: #eee; margin: 32px 0;">

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          Bei Fragen antworte einfach auf diese E-Mail.<br>
          traveling.prof &mdash; Dein Travel Hacking Partner
        </p>
      </div>
    `,
  });
}

export async function sendLeadmagnetEmail({
  email,
  name,
  productName,
}: {
  email: string;
  name?: string;
  productName: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] RESEND_API_KEY not set, skipping email");
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://travelprof.vercel.app";
  const greeting = name ? `Hallo ${name}` : "Hallo";

  await getResend().emails.send({
    from: "traveling.prof <noreply@email.travelingprof.de>",
    to: email,
    subject: `Dein Download: ${productName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: #e8793b; color: white; font-weight: 800; font-size: 18px; text-align: center;">TP</div>
          <p style="margin: 8px 0 0; font-weight: 700; font-size: 16px; color: #1a1a1a;">traveling.prof</p>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">${greeting},</h1>
        <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px;">
          vielen Dank für dein Interesse! Dein kostenloses Produkt <strong>${productName}</strong> findest du ab sofort in deinem Dashboard.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}/dashboard/produkte" style="display: inline-block; padding: 14px 32px; background: #e8793b; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
            Zum Dashboard
          </a>
        </div>

        <p style="font-size: 14px; color: #888; line-height: 1.6;">
          Folge uns auf Instagram für tägliche Travel Hacks:<br>
          <a href="https://www.instagram.com/traveling.prof" style="color: #e8793b;">@traveling.prof</a>
        </p>

        <hr style="border: none; height: 1px; background: #eee; margin: 32px 0;">

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          Du erhältst diese E-Mail, weil du dich für ${productName} eingetragen hast.<br>
          <a href="${appUrl}/datenschutz" style="color: #aaa;">Abmelden</a> &middot; traveling.prof &mdash; Dein Travel Hacking Partner
        </p>
      </div>
    `,
  });
}

export async function sendWaitlistWelcome({ email }: { email: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] RESEND_API_KEY not set, skipping email");
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://travelprof.vercel.app";

  await getResend().emails.send({
    from: "traveling.prof <noreply@email.travelingprof.de>",
    to: email,
    subject: "Willkommen bei traveling.prof!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: #e8793b; color: white; font-weight: 800; font-size: 18px; text-align: center;">TP</div>
          <p style="margin: 8px 0 0; font-weight: 700; font-size: 16px; color: #1a1a1a;">traveling.prof</p>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Willkommen!</h1>
        <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px;">
          Du bist jetzt auf der Liste der traveling.prof Community! Das erwartet dich:
        </p>

        <ul style="font-size: 15px; color: #555; line-height: 2; padding-left: 20px; margin-bottom: 24px;">
          <li>Exklusive Travel Hacks &amp; Deal-Alerts</li>
          <li>Frühzeitiger Zugang zu neuen Produkten</li>
          <li>Tipps zu Meilen, Lounges &amp; Upgrades</li>
        </ul>

        <div style="text-align: center; margin: 32px 0;">
          <a href="https://www.instagram.com/traveling.prof" style="display: inline-block; padding: 14px 32px; background: #e8793b; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
            @traveling.prof folgen
          </a>
        </div>

        <hr style="border: none; height: 1px; background: #eee; margin: 32px 0;">

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          Du erhältst diese E-Mail, weil du dich für die Community eingetragen hast.<br>
          <a href="${appUrl}/datenschutz" style="color: #aaa;">Abmelden</a> &middot; traveling.prof &mdash; Dein Travel Hacking Partner
        </p>
      </div>
    `,
  });
}

export async function sendAnalyseResultEmail({
  email,
  vorname,
  result,
}: {
  email: string;
  vorname: string;
  result: { level: string; monthlyMiles: string; yearlyMiles: string; cards: string[] };
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] RESEND_API_KEY not set, skipping email");
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://travelprof.vercel.app";
  const cardsHtml = result.cards
    .slice(0, 3)
    .map((c) => `<li>${c}</li>`)
    .join("");

  await getResend().emails.send({
    from: "traveling.prof <noreply@email.travelingprof.de>",
    to: email,
    subject: `Dein Travel-Setup, ${vorname}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: #e8793b; color: white; font-weight: 800; font-size: 18px; text-align: center;">TP</div>
          <p style="margin: 8px 0 0; font-weight: 700; font-size: 16px; color: #1a1a1a;">traveling.prof</p>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">Hallo ${vorname},</h1>
        <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px;">
          hier ist dein persönliches Travel-Setup auf einen Blick:
        </p>

        <div style="background: #f9f9f9; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #888; margin: 0 0 8px;">Dein Level</p>
          <p style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin: 0 0 16px;">${result.level}</p>
          <p style="font-size: 14px; color: #888; margin: 0 0 4px;">Meilenpotenzial</p>
          <p style="font-size: 16px; font-weight: 600; color: #1a1a1a; margin: 0;">
            ${result.monthlyMiles} / Monat &middot; ${result.yearlyMiles} / Jahr
          </p>
        </div>

        ${cardsHtml ? `
        <p style="font-size: 15px; color: #555; margin-bottom: 8px;"><strong>Deine Top-Karten:</strong></p>
        <ul style="font-size: 15px; color: #555; line-height: 2; padding-left: 20px; margin-bottom: 24px;">
          ${cardsHtml}
        </ul>
        ` : ""}

        <div style="text-align: center; margin: 32px 0;">
          <a href="${appUrl}/#produkte" style="display: inline-block; padding: 14px 32px; background: #e8793b; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
            Zum Meilen-Crashkurs
          </a>
        </div>

        <hr style="border: none; height: 1px; background: #eee; margin: 32px 0;">

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          Du erhältst diese E-Mail, weil du die Travel-Analyse genutzt hast.<br>
          <a href="${appUrl}/datenschutz" style="color: #aaa;">Abmelden</a> &middot; traveling.prof &mdash; Dein Travel Hacking Partner
        </p>
      </div>
    `,
  });
}

export async function sendSubscriptionConfirmation({
  email,
  plan,
  userName,
}: {
  email: string;
  plan: string;
  userName?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[Email] RESEND_API_KEY not set, skipping email");
    return;
  }

  const planName = PLAN_NAMES[plan] ?? plan;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://travelprof.vercel.app";
  const greeting = userName ? `Hallo ${userName}` : "Hallo";
  const dashboardLink = `${appUrl}/dashboard`;
  const settingsLink = `${appUrl}/dashboard/einstellungen`;

  await getResend().emails.send({
    from: "traveling.prof <noreply@email.travelingprof.de>",
    to: email,
    subject: "Willkommen in der VIP Community!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: #e8793b; color: white; font-weight: 800; font-size: 18px; text-align: center;">TP</div>
          <p style="margin: 8px 0 0; font-weight: 700; font-size: 16px; color: #1a1a1a;">traveling.prof</p>
        </div>

        <h1 style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">${greeting},</h1>
        <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px;">
          willkommen in der <strong>traveling.prof VIP Community</strong>! Dein Abo <strong>${planName}</strong> ist jetzt aktiv.
        </p>

        <p style="font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 24px;">
          Als VIP-Mitglied erhältst du exklusiven Zugang zu den neuesten Travel Hacks, monatlichen Live-Calls und unserer privaten Community.
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${dashboardLink}" style="display: inline-block; padding: 14px 32px; background: #e8793b; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px;">
            Zum Dashboard
          </a>
        </div>

        <p style="font-size: 14px; color: #888; line-height: 1.6;">
          Dein Abo verwalten kannst du jederzeit unter:<br>
          <a href="${settingsLink}" style="color: #e8793b;">${settingsLink}</a>
        </p>

        <hr style="border: none; height: 1px; background: #eee; margin: 32px 0;">

        <p style="font-size: 13px; color: #aaa; text-align: center;">
          Bei Fragen antworte einfach auf diese E-Mail.<br>
          traveling.prof &mdash; Dein Travel Hacking Partner
        </p>
      </div>
    `,
  });
}
