import nodemailer from 'nodemailer';

export const SENDER_NAME = 'Code-a-Nova';
export const SENDER_EMAIL =
  process.env.EMAIL_FROM ||
  process.env.EMAIL_USER ||
  'no-reply@codeanova.org';

const emailPass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').trim();
const emailUser = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
const smtpHost = (process.env.SMTP_HOST || '').trim();
const emailService = (process.env.EMAIL_SERVICE || '').trim().toLowerCase();

export const createTransporter = () => {
  // If Brevo or custom SMTP host is configured
  if (emailService === 'brevo' || smtpHost.includes('brevo') || smtpHost.includes('sendinblue') || smtpHost) {
    return nodemailer.createTransport({
      host: smtpHost || 'smtp-relay.brevo.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  // Gmail SMTP
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
};

const transporter = createTransporter();
export default transporter;
