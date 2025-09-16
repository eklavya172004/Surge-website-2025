import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailTemplateParams {
  url: string;
  baseUrl: string;
  email?: string;
}

interface VerificationRequestParams {
  identifier: string;
  url: string;
  provider: {
    from: string;
  };
}

export function html({ url }: EmailTemplateParams): string {
  const escapedUrl = `${url.replace(/\./g, "&#8203;.")}`;
  const buttonText = "Verify";
  return `
    <body>
      <p>Hi,</p>
      <p>Click the button below to sign in:</p>
      <a href="${escapedUrl}" style="padding: 10px 20px; background-color: #f3ad18; color: white; text-decoration: none;">${buttonText}</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </body>
  `;
}

export function text({ url, baseUrl }: EmailTemplateParams): string {
  return `Sign in to ${baseUrl}\n${url}\n\n`;
}

export async function sendVerificationRequest({
  identifier,
  url,
  provider,
}: VerificationRequestParams) {
  const { host } = new URL(url);

  await resend.emails.send({
    from: provider.from ?? "Your App <noreply@yourdomain.com>",
    to: identifier,
    subject: `Sign in to ${host}`,
    html: html({ url, baseUrl: host, email: identifier }),
    text: text({ url, baseUrl: host, email: identifier }),
  });
}
