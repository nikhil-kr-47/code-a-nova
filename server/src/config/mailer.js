import nodemailer from 'nodemailer';

export const SENDER_NAME = 'Code-a-Nova';
export const SENDER_EMAIL = process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('your_')
  ? process.env.EMAIL_USER
  : 'no-reply@codeanova.org';

const emailPass = (process.env.EMAIL_PASS || '').trim();
const emailUser = (process.env.EMAIL_USER || '').trim();

// Check if credentials are placeholders or empty
export const isMockMailer =
  !emailPass ||
  !emailUser ||
  emailPass === 'mock_app_password' ||
  emailPass.includes('your_') ||
  emailUser.includes('your_') ||
  emailUser === 'your_email@gmail.com';

// Create Nodemailer transport
export const createTransporter = () => {
  if (!isMockMailer) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }

  console.warn('[Mailer] Valid EMAIL_USER and EMAIL_PASS not detected. Running in mock/fallback mailer mode.');
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
