import crypto from 'crypto';

/**
 * Generates a 6-digit numeric OTP string
 * @returns {string} 6-digit OTP
 */
export const generateOtp = () => {
  // Generate random integer between 100000 and 999999
  const otp = crypto.randomInt(100000, 1000000).toString();
  return otp;
};
