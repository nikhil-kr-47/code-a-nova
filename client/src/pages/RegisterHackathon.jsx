import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Code2,
  Users,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  FileText,
  FolderGit2,
  Tv,
  User,
} from 'lucide-react';

export const RegisterHackathon = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    mobileNumber: '',
    collegeName: '',
    otherCollege: '',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering (CSE)',
    yearOfStudy: '3rd Year',
    domainTrack: 'Artificial Intelligence & Machine Learning',
    projectName: '',
    pptLink: '',
    prototypeLink: '',
    demoVideoLink: '',
    teamSize: 1,
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const checkExisting = async () => {
      try {
        const res = await api.get('/hackathon/my-entry');
        if (res.data.hasRegistered) {
          navigate('/dashboard');
        }
      } catch (err) {
        // Continue
      }
    };
    checkExisting();
  }, [navigate]);

  const handleTeamSizeChange = (newSize) => {
    const size = parseInt(newSize, 10);
    setFormData((prev) => ({ ...prev, teamSize: size }));

    if (size <= 1) {
      setTeamMembers([]);
    } else {
      const neededMembers = size - 1;
      const updated = [...teamMembers];
      while (updated.length < neededMembers) {
        updated.push({ name: '', email: '' });
      }
      setTeamMembers(updated.slice(0, neededMembers));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      return 'Full Name must be at least 3 characters long.';
    }
    if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
      return 'Full Name must contain letters and spaces only.';
    }
    if (!formData.mobileNumber.trim() || !/^[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
      return 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).';
    }
    const selectedCollege =
      formData.collegeName === 'Other' ? formData.otherCollege.trim() : formData.collegeName;
    if (!selectedCollege) {
      return 'Please select or specify your college name.';
    }
    if (!formData.projectName.trim() || formData.projectName.trim().length < 5) {
      return 'Project Name must be at least 5 characters long.';
    }
    if (!formData.pptLink.trim() || !/^https?:\/\/.+/.test(formData.pptLink.trim())) {
      return 'Please provide a valid shareable PPT link (e.g. Google Drive / OneDrive).';
    }
    if (!formData.prototypeLink.trim() || !/^https?:\/\/.+/.test(formData.prototypeLink.trim())) {
      return 'Please provide a valid prototype link (e.g. GitHub / Figma / Live demo).';
    }
    if (
      formData.demoVideoLink.trim() &&
      !/^https?:\/\/.+/.test(formData.demoVideoLink.trim())
    ) {
      return 'Demo Video Link must be a valid URL (e.g. YouTube / Drive).';
    }

    if (formData.teamSize > 1) {
      for (let i = 0; i < teamMembers.length; i++) {
        const m = teamMembers[i];
        if (!m.name.trim()) {
          return `Please provide the name for Teammate #${i + 2}.`;
        }
        if (!m.email.trim() || !/^\S+@\S+\.\S+$/.test(m.email.trim())) {
          return `Please provide a valid email address for Teammate #${i + 2}.`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const finalCollege =
        formData.collegeName === 'Other' ? formData.otherCollege.trim() : formData.collegeName;

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        collegeName: finalCollege,
        course: formData.course,
        branch: formData.branch,
        yearOfStudy: formData.yearOfStudy,
        domainTrack: formData.domainTrack,
        projectName: formData.projectName.trim(),
        pptLink: formData.pptLink.trim(),
        prototypeLink: formData.prototypeLink.trim(),
        demoVideoLink: formData.demoVideoLink.trim(),
        teamSize: formData.teamSize,
        teamMembers: formData.teamSize > 1 ? teamMembers : [],
      };

      const res = await api.post('/hackathon/register', payload);

      if (res.data.success) {
        setSuccessData(res.data.registration);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to submit registration. Please check your inputs.';
      setError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const colleges = [
    'IIT Bombay',
    'IIT Delhi',
    'IIT Madras',
    'BITS Pilani',
    'NIT Trichy',
    'NIT Surathkal',
    'IIIT Hyderabad',
    'Delhi Technological University (DTU)',
    'Netaji Subhas University of Technology (NSUT)',
    'VIT Vellore',
    'SRM Institute of Science and Technology',
    'Manipal Institute of Technology',
    'PSG College of Technology',
    'Other',
  ];

  const courses = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc Computer Science', 'Other'];

  const branches = [
    'Computer Science & Engineering (CSE)',
    'Information Technology (IT)',
    'Electronics & Communication (ECE)',
    'Artificial Intelligence & Data Science',
    'Electrical & Electronics Engineering (EEE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering (CE)',
    'Other',
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const domains = [
    'Artificial Intelligence & Machine Learning',
    'Web Development & Distributed Systems',
    'IoT & Smart Hardware',
    'Cyber Security & Cryptography',
    'Blockchain & Decentralized Web',
    'GreenTech & Sustainability',
  ];

  if (successData) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Registration Successful
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              You're Registered for Code-a-Nova 2026!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              A formal confirmation email has been dispatched via Nodemailer to{' '}
              <strong>{successData.email}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Registration ID:</span>
              <strong className="text-indigo-600 font-mono text-sm">{successData.registrationId}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Project:</span>
              <strong className="text-slate-800">{successData.projectName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Domain / Track:</span>
              <strong className="text-slate-800">{successData.domainTrack}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Team Size:</span>
              <strong className="text-slate-800">{successData.teamSize} Member(s)</strong>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition text-sm"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 overflow-x-hidden">
      {/* Title Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-[11px] sm:text-xs font-semibold text-indigo-700 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Code-a-Nova 2026 Official Application</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hackathon Project Registration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl mx-auto px-2">
          Fill in all required project and team details. A confirmation email will be automatically sent upon submission.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Please fix the following error:</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Section 1: Team Leader & Basic Info */}
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm space-y-4 sm:space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>1. Team Leader Information</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Aarav Sharma"
                required
                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              />
              <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 block">
                Letters only, minimum 3 chars
              </span>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 cursor-not-allowed font-medium"
              />
              <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 block">
                Pre-filled from authenticated session
              </span>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="9876543210"
                  maxLength={10}
                  required
                  className="w-full pl-11 pr-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 block">
                10-digit Indian mobile number
              </span>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                College / University <span className="text-rose-500">*</span>
              </label>
              <select
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                <option value="">Select your institution...</option>
                {colleges.map((col, idx) => (
                  <option key={idx} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {formData.collegeName === 'Other' && (
              <div className="sm:col-span-2">
                <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Specify College Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="otherCollege"
                  value={formData.otherCollege}
                  onChange={handleChange}
                  placeholder="e.g. SRM Easwari Engineering College"
                  required
                  className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Degree / Course <span className="text-rose-500">*</span>
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                {courses.map((crs, idx) => (
                  <option key={idx} value={crs}>
                    {crs}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Branch / Specialization <span className="text-rose-500">*</span>
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                {branches.map((brn, idx) => (
                  <option key={idx} value={brn}>
                    {brn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Year of Study <span className="text-rose-500">*</span>
              </label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                {years.map((yr, idx) => (
                  <option key={idx} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Project & Domain Details */}
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm space-y-4 sm:space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>2. Project & Domain Track</span>
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Domain / Track <span className="text-rose-500">*</span>
              </label>
              <select
                name="domainTrack"
                value={formData.domainTrack}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                {domains.map((dom, idx) => (
                  <option key={idx} value={dom}>
                    {dom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Project Title / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="e.g. NeuroSync: Real-Time Edge EEG Diagnostics"
                required
                className="w-full px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              />
              <span className="text-[10px] sm:text-[11px] text-slate-400 mt-1 block">
                Minimum 5 characters long
              </span>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Presentation Slide Deck Link (PPT) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="pptLink"
                  value={formData.pptLink}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/..."
                  required
                  className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Prototype Link <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="prototypeLink"
                  value={formData.prototypeLink}
                  onChange={handleChange}
                  placeholder="https://github.com/... or Figma link"
                  required
                  className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Demo Video Link <span className="text-slate-400 text-[10px] lowercase font-normal">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Tv className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="demoVideoLink"
                  value={formData.demoVideoLink}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-9 pr-3.5 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Team Size & Dynamic Members */}
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>3. Team Size & Dynamic Teammate Entry</span>
            </h2>
          </div>

          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Total Team Size <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3 max-w-sm">
              {[1, 2, 3, 4, 5].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleTeamSizeChange(size)}
                  className={`py-2 sm:py-3 px-1 text-center rounded-xl sm:rounded-2xl border font-bold text-xs sm:text-sm transition ${
                    formData.teamSize === size
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-sm sm:text-base">{size}</span>
                  <span className="block text-[9px] sm:text-[10px] font-medium opacity-80">
                    {size === 1 ? 'Solo' : `${size} Mbrs`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {formData.teamSize === 1 ? (
            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong>Solo Entry:</strong> You are registering as an individual. No extra member boxes required.
              </span>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Teammate Details ({teamMembers.length} member{teamMembers.length > 1 ? 's' : ''})
              </div>

              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                >
                  <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {index + 2}
                    </span>
                    <span>Teammate #{index + 2}</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Member Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        placeholder="e.g. Priya Patel"
                        required
                        className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Member Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        placeholder="e.g. priya@university.edu"
                        required
                        className="w-full px-3 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-5 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-3xl text-white shadow-lg">
          <div>
            <div className="text-xs sm:text-sm font-bold">Ready to finalize your entry?</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Confirmation email will be dispatched automatically.
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-60 text-xs sm:text-sm"
          >
            {loading ? (
              <span>Submitting entry...</span>
            ) : (
              <>
                <span>Submit Hackathon Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterHackathon;
