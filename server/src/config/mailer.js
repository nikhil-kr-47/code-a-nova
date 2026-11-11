import nodemailer from 'nodemailer';

// Sender configuration per specification
export const SENDER_NAME = 'Code-a-Nova';
export const SENDER_EMAIL = process.env.EMAIL_USER || 'no-reply@codeanova.org';

export const isMockMailer =
  !process.env.EMAIL_PASS ||
  process.env.EMAIL_PASS === 'mock_app_password' ||
  process.env.EMAIL_PASS.trim() === '';

// Create Nodemailer transport
export const createTransporter = () => {
  if (!isMockMailer) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Graceful fallback for local development / testing without live credentials
  console.warn('[Mailer] EMAIL_USER and EMAIL_PASS not set in environment. Running in mock/preview mailer mode.');
  return {
    sendMail: async (options) => {
      console.log('====================================================');
      console.log(`[Mock Mailer] Sending email from: "${SENDER_NAME}" <${SENDER_EMAIL}>`);
      console.log(`[Mock Mailer] To: ${options.to}`);
      console.log(`[Mock Mailer] Subject: ${options.subject}`);
      console.log(`[Mock Mailer] Preview Text / OTP content:`);
      console.log(options.text || '(HTML message sent)');
      console.log('====================================================');
      return { messageId: `mock-${Date.now()}` };
    },
  };
};

const transporter = createTransporter();
export default transporter;
