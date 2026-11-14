import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const SENDER_NAME = 'Code-a-Nova';

export const getSenderEmail = () => {
  return (
    process.env.BREVO_SENDER_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.EMAIL_USER ||
    'kumar47nikhil@gmail.com'
  );
};

export const SENDER_EMAIL = getSenderEmail();

/**
 * Direct Brevo REST API dispatcher via HTTPS (port 443).
 * Essential for cloud hosts (like Render free tier) that block outbound SMTP ports 25, 465, and 587.
 */
const sendBrevoApiEmail = async ({ to, subject, html, text }) => {
  const apiKey = (
    process.env.BREVO_API_KEY ||
    process.env.BREVO_SMTP_KEY ||
    process.env.EMAIL_PASS ||
    ''
  ).trim();

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured in environment variables.');
  }

  const toList = Array.isArray(to)
    ? to.map((e) => ({ email: typeof e === 'string' ? e : e.email }))
    : [{ email: to }];

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: toList,
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Brevo API HTTP error: ${response.status}`);
  }
  return { messageId: data.messageId };
};

export const createTransporter = () => {
  const emailPass = (
    process.env.BREVO_SMTP_KEY ||
    process.env.SMTP_PASS ||
    process.env.EMAIL_PASS ||
    ''
  ).trim();

  const emailUser = (
    process.env.BREVO_SMTP_USER ||
    process.env.SMTP_USER ||
    process.env.EMAIL_USER ||
    ''
  ).trim();

  const smtpHost = (process.env.SMTP_HOST || 'smtp-relay.brevo.com').trim();
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

  // When deployed on Render or when Brevo is configured, prefer Brevo HTTPS API (port 443)
  // because Render Free Tier blocks outbound SMTP ports (587 / 465)
  const useBrevoApi =
    process.env.BREVO_API_KEY ||
    process.env.RENDER ||
    process.env.NODE_ENV === 'production' ||
    emailUser.includes('brevo') ||
    emailPass.startsWith('xsmtpsib') ||
    emailPass.startsWith('xkeysib');

  if (useBrevoApi) {
    console.log('[Mailer] Active Nodemailer transport: Brevo HTTPS API Gateway (Port 443 - zero block)');
    return {
      sendMail: async (mailOptions) => {
        try {
          return await sendBrevoApiEmail(mailOptions);
        } catch (apiError) {
          console.warn('[Mailer] Brevo API failed, falling back to SMTP relay:', apiError.message);
          const fallbackTransport = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: false,
            auth: { user: emailUser, pass: emailPass },
            connectionTimeout: 5000,
          });
          return await fallbackTransport.sendMail(mailOptions);
        }
      },
    };
  }

  // Gmail SMTP fallback for local development
  console.log('[Mailer] Active Nodemailer transport: Gmail Service');
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

const transporter = createTransporter();
export default transporter;
