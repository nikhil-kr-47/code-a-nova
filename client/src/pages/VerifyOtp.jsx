import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Mail,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOtp, resendOtp } = useAuth();

  // Extract email from query param or router state
  const queryEmail = new URLSearchParams(location.search).get('email') || '';
  const [email, setEmail] = useState(queryEmail);

  // 6-digit OTP state as array of 6 strings
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // 10-minute timer (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      setError('Please provide the email address you registered with.');
    }
  }, [email]);

  // Expiry countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste of whole OTP
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      return setError('Please enter the complete 6-digit verification code.');
    }

    if (!email) {
      return setError('Email is missing. Please go back to signup.');
    }

    setLoading(true);

    try {
      const res = await verifyOtp(email, fullOtp);
      if (res.success) {
        setSuccessMsg('Account verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Your account is verified! You can now log in.' },
          });
        }, 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired OTP. Please check and retry.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setError('');
    setSuccessMsg('');
    setResending(true);

    try {
      const res = await resendOtp(email);
      if (res.success) {
        setSuccessMsg('A new 6-digit OTP has been dispatched to your email.');
        setTimeLeft(600);
        setResendCooldown(45);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 text-indigo-600 items-center justify-center mb-3 sm:mb-4">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Verify Your Email</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            We sent a 6-digit security code from <strong>Code-a-Nova</strong> to
          </p>
          <div className="inline-flex items-center space-x-1.5 mt-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 max-w-full truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{email || 'your email address'}</span>
          </div>
          <p className="text-[11px] sm:text-xs text-amber-700 bg-amber-50 border border-amber-200/70 rounded-lg px-3 py-1.5 mt-2.5 max-w-xs mx-auto">
            Please check your <strong>Inbox</strong> and <strong>Spam / Junk</strong> folder.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-rose-700 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-2.5 text-emerald-800 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5 sm:space-y-6">
          {/* 6 Digit Input Boxes */}
          <div>
            <div
              className="flex items-center justify-center gap-1.5 sm:gap-2.5 max-w-full"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                  className="w-10 h-13 sm:w-12 sm:h-14 md:w-13 md:h-16 text-center text-xl sm:text-2xl font-bold font-mono bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:bg-white focus:outline-none transition shadow-inner"
                />
              ))}
            </div>

            {/* Timer and Expiry */}
            <div className="flex items-center justify-between mt-3 text-xs text-slate-500 px-1">
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Expires in:{' '}
                  <strong className={timeLeft < 60 ? 'text-rose-600' : 'text-slate-700'}>
                    {formatTimer(timeLeft)}
                  </strong>
                </span>
              </div>
              <span>10-min validity</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6 || timeLeft === 0}
            className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition disabled:opacity-60 text-sm"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying code...</span>
              </div>
            ) : (
              <>
                <span>Verify & Activate Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend OTP Section */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center justify-center text-xs sm:text-sm space-y-2">
          <p className="text-slate-500 text-center">
            Didn't receive the OTP code? Be sure to check your <strong>Spam</strong> or <strong>Promotions</strong> folder.
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || resending}
            className="inline-flex items-center space-x-1.5 font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>
              {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
            </span>
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-slate-400">
          Entered the wrong email?{' '}
          <Link to="/signup" className="text-slate-600 hover:underline">
            Back to Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
