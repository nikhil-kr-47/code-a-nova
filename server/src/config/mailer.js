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

  // If Brevo SMTP or custom relay credentials are present
  if (emailUser.includes('brevo.com') || emailPass.startsWith('xsmtpsib') || smtpHost.includes('brevo')) {
    console.log('[Mailer] Active Nodemailer transport: Brevo SMTP Relay (smtp-relay.brevo.com:587)');
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false, // 587 uses STARTTLS
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  // Gmail SMTP
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

export const SENDER_EMAIL = getSenderEmail();
export default transporter;
