import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  Users,
  Code,
  FolderGit2,
  Tv,
  ArrowRight,
  Sparkles,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs text-slate-500 font-medium">Loading your portal profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 overflow-x-hidden">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Participant Dashboard
            </h1>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Verified Account</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome back, <strong>{user?.name}</strong>! Track your hackathon status and credentials here.
          </p>
        </div>

        {hasRegistered && (
          <button
            onClick={handlePrint}
            className="self-start sm:self-auto inline-flex items-center space-x-1.5 px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Receipt</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Profile summary + Registration status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left Column: User Profile Card */}
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-3 pb-2.5 border-b border-slate-100">
              Account Overview
            </h2>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-indigo-100 shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-bold text-slate-900 truncate">{user?.name}</div>
                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                  Code-a-Nova Participant
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Email Verification</span>
                <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>OTP Confirmed</span>
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Account Created</span>
                <span className="font-semibold text-slate-700">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Hackathon Status</span>
                <span className="font-semibold text-slate-900">
                  {hasRegistered ? 'Active Registration' : 'Awaiting Submission'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl sm:rounded-3xl p-5 text-xs text-slate-600 space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Need Assistance?</span>
            </div>
            <p className="leading-relaxed text-[11px] sm:text-xs">
              For updates to your presentation link or team roster, reach our secretariat at{' '}
              <a href="mailto:codeanova.official@gmail.com" className="text-indigo-600 font-semibold underline">
                codeanova.official@gmail.com
              </a>.
            </p>
          </div>
        </div>

        {/* Right Columns: Registration Details or "Register Now" CTA */}
        <div className="lg:col-span-2 space-y-5">
          {!hasRegistered ? (
            <div className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                You haven't submitted your project yet
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1.5 leading-relaxed">
                Submit your project proposal, select your track, and register up to 5 teammates for Code-a-Nova 2026.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition text-xs sm:text-sm"
                >
                  <span>Register Now for Hackathon</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm space-y-5">
              {/* Header Badge & ID */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Official Hackathon Entry
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                    {registration.projectName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                      {registration.domainTrack}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{registration.status || 'Confirmed'}</span>
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:text-right">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Registration ID
                  </div>
                  <div className="text-base font-mono font-bold text-indigo-600 mt-0.5">
                    {registration.registrationId}
                  </div>
                </div>
              </div>

              {/* Academic & Lead Details */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Leader & Academic Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Leader Full Name</span>
                    <strong className="text-slate-800 font-semibold">{registration.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Contact Email</span>
                    <strong className="text-slate-800 font-semibold truncate block">{registration.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mobile Number</span>
                    <strong className="text-slate-800 font-semibold">{registration.mobileNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Institution / College</span>
                    <strong className="text-slate-800 font-semibold">{registration.collegeName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Course & Branch</span>
                    <strong className="text-slate-800 font-semibold">
                      {registration.course} • {registration.branch}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Year of Study</span>
                    <strong className="text-slate-800 font-semibold">{registration.yearOfStudy}</strong>
                  </div>
                </div>
              </div>

              {/* Submission Links */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                  Submission Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <a
                    href={registration.pptLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition group"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">Presentation Deck (PPT)</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                  </a>

                  <a
                    href={registration.prototypeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition group"
                  >
                    <div className="flex items-center space-x-2">
                      <FolderGit2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-semibold text-slate-700 truncate">Working Prototype</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                  </a>

                  {registration.demoVideoLink && (
                    <a
                      href={registration.demoVideoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="sm:col-span-2 flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition group"
                    >
                      <div className="flex items-center space-x-2">
                        <Tv className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="font-semibold text-slate-700 truncate">Demo Video Link</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                    </a>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                    Team Composition ({registration.teamSize} Member{registration.teamSize > 1 ? 's' : ''})
                  </h4>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs">
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                        1
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-900 block truncate">{registration.fullName}</span>
                        <span className="text-slate-500 text-[11px] truncate block">{registration.email}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white shrink-0 ml-2">
                      Leader
                    </span>
                  </div>

                  {registration.teamMembers && registration.teamMembers.length > 0 && (
                    registration.teamMembers.map((member, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {idx + 2}
                          </div>
                          <div className="truncate">
                            <span className="font-bold text-slate-900 block truncate">{member.name}</span>
                            <span className="text-slate-500 text-[11px] truncate block">{member.email}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700 shrink-0 ml-2">
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
