import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import transporter, { SENDER_NAME, SENDER_EMAIL } from '../config/mailer.js';
import { generateOtp } from '../utils/generateOtp.js';
import { getOtpEmailTemplate } from '../utils/emailTemplates.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'code_a_nova_default_jwt_secret_key_2026',
    { expiresIn: '7d' }
  );
};

/**
 * @desc   Register user, generate & email 6-digit OTP
 * @route  POST /api/auth/signup
 * @access Public
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists and is verified
    let existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.',
      });
    }

    // Salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingUser && !existingUser.isVerified) {
      // Update unverified user details
      existingUser.name = name.trim();
      existingUser.password = hashedPassword;
      await existingUser.save();
    } else {
      // Create new unverified user
      existingUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
      });
    }

    // Generate 6-digit OTP
    const otpCode = generateOtp();

    // Remove any previous active OTP for this email
    await Otp.deleteMany({ email: normalizedEmail });

    // Store new OTP in database (10 min TTL handled by schema)
    await Otp.create({
      email: normalizedEmail,
      otp: otpCode,
    });

    // Send email using Nodemailer
    const emailPayload = getOtpEmailTemplate(otpCode);
    await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
      to: normalizedEmail,
      subject: emailPayload.subject,
      text: emailPayload.text,
      html: emailPayload.html,
    });

    return res.status(201).json({
      success: true,
      message: 'Signup initiated! A 6-digit OTP has been sent to your email.',
      email: normalizedEmail,
    });
  } catch (error) {
    console.error('[Signup Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error occurred during signup.',
    });
  }
};

/**
 * @desc   Verify 6-digit OTP and activate account
 * @route  POST /api/auth/verify-otp
 * @access Public
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Look for matching OTP record
    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      otp: cleanOtp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.',
      });
    }

    // Mark user as verified
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Associated user account not found.',
      });
    }

    user.isVerified = true;
    await user.save();

    // Invalidate OTP after first use
    await Otp.deleteMany({ email: normalizedEmail });

    return res.status(200).json({
      success: true,
      message: 'Account successfully verified! You may now log in.',
    });
  } catch (error) {
    console.error('[Verify OTP Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.',
    });
  }
};

/**
 * @desc   Resend a new 6-digit OTP
 * @route  POST /api/auth/resend-otp
 * @access Public
 */
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account registered with this email.',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account is already verified. Please log in directly.',
      });
    }

    // Generate fresh OTP
    const otpCode = generateOtp();

    // Clear previous OTP records
    await Otp.deleteMany({ email: normalizedEmail });

    // Save new record
    await Otp.create({
      email: normalizedEmail,
      otp: otpCode,
    });

    // Send email using Nodemailer
    const emailPayload = getOtpEmailTemplate(otpCode);
    await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
      to: normalizedEmail,
      subject: emailPayload.subject,
      text: emailPayload.text,
      html: emailPayload.html,
    });

    return res.status(200).json({
      success: true,
      message: 'A fresh OTP has been dispatched to your email.',
    });
  } catch (error) {
    console.error('[Resend OTP Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to resend OTP at this time.',
    });
  }
};

/**
 * @desc   Authenticate user & return JWT token
 * @route  POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        needsVerification: true,
        email: normalizedEmail,
        message: 'Your email is not verified yet. Please verify your OTP to continue.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed due to server error.',
    });
  }
};
