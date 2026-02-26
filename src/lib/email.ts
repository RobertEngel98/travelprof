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
  kreditkarten: "Kreditkarten-Vergleich 2025",
  crashkurs: "Meilen-Crashkurs",
  masterplan: "Lounge & Upgrade Masterplan",
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
  const directLink = productId === "ebook"
    ? `${appUrl}/dashboard/produkte/ebook`
    : dashboardLink;

  await getResend().emails.send({
    from: "traveling.prof <noreply@travelingprof.de>",
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
