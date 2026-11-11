import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Users,
  Code,
  FolderGit2,
  Tv,
  ArrowRight,
  Layers,
  Sparkles,
  Building2,
  GraduationCap,
  Phone,
  Clock,
  Printer,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState('');

  const fetchMyRegistration = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hackathon/my-entry');
      if (res.data.success) {
        setHasRegistered(res.data.hasRegistered);
        setRegistration(res.data.registration);
      }
    } catch (err) {
      console.error('Error fetching registration:', err);
      setError('Could not load hackathon entry details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRegistration();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading your portal profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Participant Dashboard
            </h1>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Account</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <strong>{user?.name}</strong>! Track your hackathon status and team credentials here.
          </p>
        </div>

        {hasRegistered && (
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Registration Slip</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Profile summary + Registration status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: User Profile Card */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
              Account Overview
            </h2>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-100">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
                <div className="text-[11px] text-indigo-600 font-semibold mt-1">
                  Code-a-Nova Coder
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Email Verification</span>
                <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>OTP Confirmed</span>
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Member Since</span>
                <span className="font-semibold text-slate-700">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">Event Portal Status</span>
                <span className="font-semibold text-slate-900">
                  {hasRegistered ? 'Active Registration' : 'Awaiting Entry'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-3xl p-6 text-xs text-slate-600 space-y-3">
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Need Assistance?</span>
            </div>
            <p className="leading-relaxed">
              If you need to change registered teammate details or update your PPT slides before the deadline, reach out to our team at{' '}
              <a href="mailto:codeanova.official@gmail.com" className="text-indigo-600 font-semibold underline">
                codeanova.official@gmail.com
              </a>.
            </p>
          </div>
        </div>

        {/* Right Columns: Registration Details or "Register Now" CTA */}
        <div className="lg:col-span-2 space-y-6">
          {!hasRegistered ? (
            /* Unregistered State: Prompt user to register */
            <div className="bg-white border-2 border-dashed border-indigo-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                You haven't registered your project yet
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Take part in Code-a-Nova 2026! Submit your project proposal, select your track, and register up to 5 teammates today.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition"
                >
                  <span>Register Now for Hackathon</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Checklist guide */}
              <div className="mt-10 pt-8 border-t border-slate-100 max-w-lg mx-auto text-left">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Checklist before applying:
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your presentation slide deck URL (Google Drive / OneDrive with view access)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Working prototype link (GitHub repo, live preview, or Figma prototype)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Names and email addresses of your team members (if size &gt; 1)</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* Registered State: Full details of registration */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header Badge & ID */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Official Hackathon Entry
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {registration.projectName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700">
                      {registration.domainTrack}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{registration.status || 'Confirmed'}</span>
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 sm:text-right">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Registration ID
                  </div>
                  <div className="text-lg font-mono font-bold text-indigo-600 mt-0.5">
                    {registration.registrationId}
                  </div>
                </div>
              </div>

              {/* Academic & Lead Details */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Team Leader & Academic Info
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Leader Full Name</span>
                    <strong className="text-slate-800 text-sm font-semibold">{registration.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Contact Email</span>
                    <strong className="text-slate-800 text-sm font-semibold">{registration.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Mobile Number</span>
                    <strong className="text-slate-800 text-sm font-semibold">{registration.mobileNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Institution / College</span>
                    <strong className="text-slate-800 text-sm font-semibold">{registration.collegeName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Course & Branch</span>
                    <strong className="text-slate-800 text-sm font-semibold">
                      {registration.course} • {registration.branch}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Year of Study</span>
                    <strong className="text-slate-800 text-sm font-semibold">{registration.yearOfStudy}</strong>
                  </div>
                </div>
              </div>

              {/* Project Submissions Links */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Submission Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <a
                    href={registration.pptLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold text-slate-700">Presentation Deck (PPT)</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                  </a>

                  <a
                    href={registration.prototypeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <FolderGit2 className="w-4 h-4 text-indigo-600" />
                      <span className="font-semibold text-slate-700">Working Prototype Link</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                  </a>

                  {registration.demoVideoLink && (
                    <a
                      href={registration.demoVideoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="sm:col-span-2 flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Tv className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-slate-700">Demo Video (Optional URL)</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                    </a>
                  )}
                </div>
              </div>

              {/* Team Members List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Team Composition ({registration.teamSize} Member{registration.teamSize > 1 ? 's' : ''})
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    {registration.teamSize === 1 ? 'Solo Participant' : 'Team Entry'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {/* Lead */}
                  <div className="flex items-center justify-between p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{registration.fullName}</span>
                        <span className="text-slate-500">{registration.email}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                      Team Lead
                    </span>
                  </div>

                  {/* Teammates */}
                  {registration.teamMembers && registration.teamMembers.length > 0 && (
                    registration.teamMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                            {idx + 2}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{member.name}</span>
                            <span className="text-slate-500">{member.email}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">
                          Member
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
