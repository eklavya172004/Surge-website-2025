import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailTemplateParams {
  url: string;
  baseUrl: string;
  email?: string;
  name?: string;
}

interface VerificationRequestParams {
  identifier: string;
  url: string;
  provider: {
    from: string;
  };
  user?: {
    name?: string;
  };
}

export function html({ url, name }: EmailTemplateParams): string {
  const buttonText = "Verify Email";
  return `
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #f3ad18;">Verify your email address</h1>
        <p>Hello${name ? ` ${name}` : ''},</p>
        <p>Thank you for registering. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="display: inline-block; padding: 12px 24px; background-color: #f3ad18; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
             ${buttonText}
          </a>
        </div>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          ${url}
        </p>
      </div>
    </body>
  `;
}

export function text({ url, baseUrl, name }: EmailTemplateParams): string {
  return `Hello${name ? ` ${name}` : ''},

Thank you for registering. Please verify your email address by clicking the link below:

${url}

If you didn't create an account, you can safely ignore this email.

This link will expire in 24 hours.

---
${baseUrl}
`;
}

export async function sendVerificationRequest({
  identifier,
  url,
  provider,
  user,
}: VerificationRequestParams) {
  const { host } = new URL(url);

  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set in environment variables");
    }

    if (!identifier) {
      throw new Error("Email identifier is required");
    }

    const result = await resend.emails.send({
      from: provider.from ?? "Your App <noreply@yourdomain.com>",
      to: identifier,
      subject: `Verify your email address`,
      html: html({ url, baseUrl: host, email: identifier, name: user?.name }),
      text: text({ url, baseUrl: host, email: identifier, name: user?.name }),
    });
    
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(`Failed to send verification email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
