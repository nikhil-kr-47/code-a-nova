import nodemailer from 'nodemailer';

export const SENDER_NAME = 'Code-a-Nova';
export const SENDER_EMAIL =
  process.env.EMAIL_FROM ||
  (process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('your_')
    ? process.env.EMAIL_USER
    : 'no-reply@codeanova.org');

const emailPass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').trim();
const emailUser = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
const smtpHost = (process.env.SMTP_HOST || '').trim();
const emailService = (process.env.EMAIL_SERVICE || '').trim().toLowerCase();

// Check if credentials are placeholders or empty
export const isMockMailer =
  !emailPass ||
  !emailUser ||
  emailPass === 'mock_app_password' ||
  emailPass.includes('your_') ||
  emailUser.includes('your_') ||
  emailUser === 'your_email@gmail.com';

// Create Nodemailer transport supporting Brevo, custom SMTP, or Gmail
export const createTransporter = () => {
  if (!isMockMailer) {
    // If Brevo is specified or custom SMTP host provided
    if (emailService === 'brevo' || smtpHost.includes('brevo') || smtpHost.includes('sendinblue') || smtpHost) {
      console.log('[Mailer] Configuring Nodemailer via Brevo / SMTP relay...');
      return nodemailer.createTransport({
        host: smtpHost || 'smtp-relay.brevo.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true', // false for port 587 (uses STARTTLS)
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
    }

    // Default to Gmail service
    console.log('[Mailer] Configuring Nodemailer via Gmail service...');
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  console.warn('[Mailer] Valid email credentials not detected. Running in mock/preview mailer mode.');
  return {
    sendMail: async (options) => {
      console.log('====================================================');
      console.log(`[Mock Mailer] From: "${SENDER_NAME}" <${SENDER_EMAIL}>`);
      console.log(`[Mock Mailer] To: ${options.to}`);
      console.log(`[Mock Mailer] Subject: ${options.subject}`);
      console.log(`[Mock Mailer] Text: ${options.text || '(HTML message sent)'}`);
      console.log('====================================================');
      return { messageId: `mock-${Date.now()}` };
    },
  };
};

const transporter = createTransporter();
export default transporter;
