import { formatPrice } from "@/lib/pricing";

export interface OrderDetails {
  name: string;
  email: string;
  company: string;
  planName: string;
  billing: "month" | "year";
  users: number;
  features: string[];
  oneTime: number;
  discount: number;
  discountRate: number;
  /** Free optional health insurance cover, 0 when the order doesn't qualify. */
  insuranceCover: number;
  total: number;
}

interface EmailOptions {
  /** Absolute URL of the header image. The image is left out when missing. */
  imageUrl?: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string, strong = false) {
  const weight = strong ? "font-weight:bold; color:#1a3557;" : "";
  return `<tr>
            <td style="padding:8px 0; color:#777; border-bottom:1px solid #eee;">${label}</td>
            <td align="right" style="padding:8px 0; border-bottom:1px solid #eee; ${weight}">${value}</td>
          </tr>`;
}

function orderRows(order: OrderDetails) {
  const rows = [
    row("Plan", escapeHtml(order.planName)),
    row("Billing", order.billing === "year" ? "Yearly" : "Monthly"),
    row("Users", String(order.users)),
  ];
  if (order.oneTime > 0) {
    rows.push(row("One time set-up payment", formatPrice(order.oneTime)));
  }
  if (order.discount > 0) {
    rows.push(
      row(
        `Volume discount (${order.discountRate * 100}%)`,
        `&minus;${formatPrice(order.discount)}`,
      ),
    );
  }
  rows.push(
    row(`Total (first ${order.billing})`, formatPrice(order.total), true),
  );
  return rows.join("\n          ");
}

function featureList(order: OrderDetails) {
  if (order.features.length < 2) return "";
  const cell = (feature?: string) =>
    feature
      ? `<td width="50%" valign="top" style="padding:4px 0; color:#555; font-size:14px;"><span style="color:#ff6a00; font-weight:bold;">&#10003;</span>&nbsp; ${escapeHtml(feature)}</td>`
      : `<td width="50%"></td>`;
  const rows: string[] = [];
  for (let i = 0; i < order.features.length; i += 2) {
    rows.push(
      `<tr>${cell(order.features[i])}${cell(order.features[i + 1])}</tr>`,
    );
  }
  return `
        <p style="color:#555; margin-bottom:8px;">Included features (${order.features.length}):</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fa; border-radius:6px; padding:8px 14px;">
          ${rows.join("\n          ")}
        </table>
`;
}

function insurancePerk(order: OrderDetails) {
  if (order.insuranceCover <= 0) return "";
  const cover = new Intl.NumberFormat("en").format(order.insuranceCover);
  return `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
          <tr>
            <td style="background:#fff4ec; border-left:4px solid #ff6a00; border-radius:6px; padding:12px 16px; color:#1a3557; font-size:14px;">
              <strong>Plus free optional health insurance</strong> up to GHC${cover}
            </td>
          </tr>
        </table>
`;
}

function layout(heading: string, body: string, { imageUrl }: EmailOptions) {
  const image = imageUrl ? `<img src="${imageUrl}" alt="" width="120" />` : "";
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${heading}</title>
</head>
<body style="margin:0; padding:0; background:#f4f4f4; font-family:Arial, sans-serif;">

  <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; margin:40px auto; border-radius:8px; overflow:hidden;">

    <tr>
      <td style="padding:20px 30px;">
        <h2 style="margin:0; font-weight:bold;">
          <span style="color:#ff6a00;">WORK</span><span style="color:#1a3557;">Phelo</span>
        </h2>
      </td>
    </tr>

    <tr>
      <td style="background:#eef1f4; padding:40px 30px;">
        <table width="100%">
          <tr>
            <td style="font-size:28px; font-weight:600; color:#555;">
              ${heading}
            </td>
            <td align="right">
              ${image}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:30px; color:#555; font-size:15px; line-height:1.6;">
${body}
      </td>
    </tr>

    <tr>
      <td style="padding:20px 30px; border-top:1px solid #eee;">
        <h3 style="margin:0;">
          <span style="color:#ff6a00;">WORK</span><span style="color:#1a3557;">Phelo</span>
        </h3>
        <p style="color:#888; font-size:12px; margin-top:5px;">
          © 2026 WorkPhelo All rights reserved
        </p>
      </td>
    </tr>

  </table>

</body>
</html>`;
}

/** Sent to the person who placed the order. */
export function orderProcessedEmail(
  order: OrderDetails,
  options: EmailOptions = {},
) {
  const subject = `Your WorkPhelo order has been processed`;
  const html = layout(
    "Your order is processed",
    `
        <p>Hi ${escapeHtml(order.name)},</p>

        <p>
          Thank you for choosing WorkPhelo. Your order for <strong>${escapeHtml(order.company)}</strong> has been processed.
        </p>

        <p style="color:#555;">Here is a summary of your order:</p>

        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
          ${orderRows(order)}
        </table>
${featureList(order)}${insurancePerk(order)}
        <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />

        <p style="color:#555;">What happens next:</p>
        <ul style="color:#555; padding-left:20px; line-height:1.8;">
          <li>Our team will review your order and set up your workspace</li>
          <li>We will contact you at ${escapeHtml(order.email)} to confirm the details</li>
          <li>You will receive an invitation to log in once everything is ready</li>
        </ul>

        <p style="color:#777;">
          If anything looks wrong, reply to this email and we will sort it out.
        </p>

        <p style="margin-top:24px;">Welcome aboard.</p>`,
    options,
  );
  return { subject, html };
}

/** Sent to the WorkPhelo team with the details of the request. */
export function orderRequestEmail(
  order: OrderDetails,
  options: EmailOptions = {},
) {
  const subject = `New plan request from ${order.company}`;
  const html = layout(
    "New plan request",
    `
        <p>Hi team,</p>

        <p>
          <strong>${escapeHtml(order.name)}</strong> from <strong>${escapeHtml(order.company)}</strong> has requested the <strong>${escapeHtml(order.planName)}</strong> plan.
        </p>

        <p style="color:#555;">Requester:</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
          ${row("Name", escapeHtml(order.name))}
          ${row("Email", `<a href="mailto:${escapeHtml(order.email)}" style="color:#1a3557;">${escapeHtml(order.email)}</a>`)}
          ${row("Company", escapeHtml(order.company))}
        </table>

        <hr style="border:none; border-top:1px solid #eee; margin:24px 0;" />

        <p style="color:#555;">Request details:</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
          ${orderRows(order)}
        </table>
${featureList(order)}${insurancePerk(order)}
        <p style="margin:30px 0;">
          <a href="mailto:${escapeHtml(order.email)}" style="
            background:#1a3557;
            color:#ffffff;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
            display:inline-block;
            font-weight:500;
          ">
            Reply to ${escapeHtml(order.name)}
          </a>
        </p>

        <p style="color:#777;">
          Please follow up with the requester to confirm the order and set up their workspace.
        </p>`,
    options,
  );
  return { subject, html };
}
