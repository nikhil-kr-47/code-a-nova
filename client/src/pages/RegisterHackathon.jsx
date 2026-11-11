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
  Link2,
  FileText,
  FolderGit2,
  Tv,
  Phone,
  Mail,
  User,
  Plus,
  Trash2,
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

  // Dynamic teammates state: [{ name: '', email: '' }]
  const [teamMembers, setTeamMembers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Sync user info into form on mount
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Check if user has already registered
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const res = await api.get('/hackathon/my-entry');
        if (res.data.hasRegistered) {
          navigate('/dashboard');
        }
      } catch (err) {
        // Continue if not registered
      }
    };
    checkExisting();
  }, [navigate]);

  // Adjust dynamic team members whenever teamSize changes
  const handleTeamSizeChange = (newSize) => {
    const size = parseInt(newSize, 10);
    setFormData((prev) => ({ ...prev, teamSize: size }));

    if (size <= 1) {
      setTeamMembers([]);
    } else {
      const neededMembers = size - 1; // 1 is lead, remaining are members
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

    // Teammates validation
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

  // If successfully registered, show Success Modal
  if (successData) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Registration Successful
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              You're Registered for Code-a-Nova 2026!
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A formal confirmation email has been dispatched via Nodemailer to{' '}
              <strong>{successData.email}</strong> with your full event breakdown.
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
            className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition"
          >
            <span>Proceed to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-700 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Code-a-Nova 2026 Official Application</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Hackathon Project Registration
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
          Fill in all required project and team details. A confirmation email will be automatically sent upon successful submission.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Please fix the following error:</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Team Leader & Basic Info */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>1. Team Leader Information</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The primary point of contact for project evaluation and correspondence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Aarav Sharma"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Minimum 3 characters, letters only
              </span>
            </div>

            {/* Email Address (Pre-filled from auth session) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed font-medium"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Locked: Pre-filled from your authenticated session
              </span>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
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
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                10-digit Indian mobile number
              </span>
            </div>

            {/* College Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                College / University <span className="text-rose-500">*</span>
              </label>
              <select
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                <option value="">Select your institution...</option>
                {colleges.map((col, idx) => (
                  <option key={idx} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* If College = Other */}
            {formData.collegeName === 'Other' && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enter College / University Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="otherCollege"
                  value={formData.otherCollege}
                  onChange={handleChange}
                  placeholder="e.g. SRM Easwari Engineering College, Chennai"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
            )}

            {/* Course */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Degree / Course <span className="text-rose-500">*</span>
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                {courses.map((crs, idx) => (
                  <option key={idx} value={crs}>
                    {crs}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Branch / Specialization <span className="text-rose-500">*</span>
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                {branches.map((brn, idx) => (
                  <option key={idx} value={brn}>
                    {brn}
                  </option>
                ))}
              </select>
            </div>

            {/* Year of Study */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Year of Study <span className="text-rose-500">*</span>
              </label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
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
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>2. Project & Domain Track</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify your project proposal, technology domain, and shareable submission links.
            </p>
          </div>

          <div className="space-y-4">
            {/* Domain / Track */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Domain / Track <span className="text-rose-500">*</span>
              </label>
              <select
                name="domainTrack"
                value={formData.domainTrack}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              >
                {domains.map((dom, idx) => (
                  <option key={idx} value={dom}>
                    {dom}
                  </option>
                ))}
              </select>
            </div>

            {/* Project Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Title / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="e.g. NeuroSync: Real-Time Edge EEG Diagnostics"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Minimum 5 characters long
              </span>
            </div>

            {/* PPT Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Presentation Slide Deck Link (PPT) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="pptLink"
                  value={formData.pptLink}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/file/d/... or OneDrive link"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Google Drive or OneDrive shareable link (ensure link access is set to 'Anyone with link can view')
              </span>
            </div>

            {/* Prototype Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Prototype Link <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="prototypeLink"
                  value={formData.prototypeLink}
                  onChange={handleChange}
                  placeholder="https://github.com/... or Figma or live demo link"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                GitHub repository, Figma design prototype, or live hosted application demo
              </span>
            </div>

            {/* Demo Video Link (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Demo Video Link <span className="text-slate-400 text-[10px] lowercase font-normal">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Tv className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  name="demoVideoLink"
                  value={formData.demoVideoLink}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=... or Drive video link"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                YouTube or Google Drive video preview (2-3 minutes walkthrough)
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Team Size & Dynamic Members */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>3. Team Size & Dynamic Teammate Entry</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select total team size (1 to 5). Teammate input fields will dynamically render below.
            </p>
          </div>

          {/* Team Size Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Total Team Size (Including Leader) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-3 max-w-md">
              {[1, 2, 3, 4, 5].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleTeamSizeChange(size)}
                  className={`py-3 px-2 text-center rounded-2xl border font-bold text-sm transition ${
                    formData.teamSize === size
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-base">{size}</span>
                  <span className="block text-[10px] font-medium opacity-80">
                    {size === 1 ? 'Solo' : `${size} Mbrs`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Members Render Area */}
          {formData.teamSize === 1 ? (
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong>Solo Participation:</strong> You are registering as an individual. No additional teammate boxes needed.
              </span>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Teammate Details ({teamMembers.length} additional member{teamMembers.length > 1 ? 's' : ''})
              </div>

              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-bold">
                        {index + 2}
                      </span>
                      <span>Teammate #{index + 2}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Member Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        placeholder="e.g. Priya Patel"
                        required
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                        Member Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        placeholder="e.g. priya@university.edu"
                        required
                        className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-900 rounded-3xl text-white shadow-lg">
          <div>
            <div className="text-sm font-bold">Ready to finalize your entry?</div>
            <div className="text-xs text-slate-400 mt-0.5">
              A confirmation email will be sent automatically to {formData.email}.
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md transition disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting entry & sending email...</span>
              </div>
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
