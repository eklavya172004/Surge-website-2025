import { Resend } from "resend";

// Load environment variables
import { config } from "dotenv";
config({ path: ".env.local" });

async function testEmail() {
  console.log("Testing email sending...");

  // Check if required environment variables are set
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set in environment variables");
    return;
  }

  if (!process.env.EMAIL_FROM) {
    console.error("EMAIL_FROM is not set in environment variables");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TEST!, // Replace with your email for testing
      subject: "Test Email from Surge App",
      html: "<p>This is a test email to verify that email sending is working correctly.</p>",
    });

    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail();
