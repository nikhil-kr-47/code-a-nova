import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Code2,
  Calendar,
  Trophy,
  Users,
  Flame,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Globe2,
  Lock,
  ChevronDown,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  Laptop,
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const tracks = [
    {
      icon: Cpu,
      title: 'Artificial Intelligence & ML',
      description: 'Generative models, intelligent agents, predictive analytics, and computer vision solving tangible challenges.',
      tags: ['LLMs', 'PyTorch', 'Vision AI'],
    },
    {
      icon: Globe2,
      title: 'Web Dev & Full-Stack Systems',
      description: 'High-performance web apps, responsive microservices, distributed systems, and real-time collaboration engines.',
      tags: ['React', 'Node.js', 'Distributed'],
    },
    {
      icon: Lock,
      title: 'Cyber Security & Cryptography',
      description: 'Zero-trust network models, penetration testing automation, vulnerability detectors, and tamper-proof auditing.',
      tags: ['Zero-Trust', 'Crypto', 'AppSec'],
    },
    {
      icon: Laptop,
      title: 'IoT & Smart Hardware',
      description: 'Connected sensor networks, embedded systems, smart robotics, and hardware automation for industry 4.0.',
      tags: ['Microcontrollers', 'Sensors', 'Automation'],
    },
    {
      icon: Flame,
      title: 'Blockchain & Decentralized Web',
      description: 'Transparent supply chains, decentralized identity (DID), smart contracts, and verifiable compute solutions.',
      tags: ['Solidity', 'Web3', 'DeFi'],
    },
    {
      icon: ShieldCheck,
      title: 'GreenTech & Sustainability',
      description: 'Carbon tracking metrics, renewable energy forecasting, waste recycling optimization, and ESG platforms.',
      tags: ['CleanTech', 'ESG', 'Analytics'],
    },
  ];

  const timelineSteps = [
    {
      phase: 'Phase 01',
      title: 'Proposal & Team Registration',
      date: 'Feb 15 – March 20, 2026',
      desc: 'Form your team (1-5 members), prepare your PPT slide deck and initial prototype links, and register on this portal.',
      active: true,
    },
    {
      phase: 'Phase 02',
      title: 'Shortlisting & Mentorship',
      date: 'March 25 – March 28, 2026',
      desc: 'Top 50 teams are paired with industry tech leaders for deep architectural guidance and refining concepts.',
      active: false,
    },
    {
      phase: 'Phase 03',
      title: '36-Hour National Sprint',
      date: 'April 04 – April 05, 2026',
      desc: 'Non-stop hacking sprint with 3 evaluation checkpoints, live coding sessions, and lightning mentor roundups.',
      active: false,
    },
    {
      phase: 'Phase 04',
      title: 'Grand Finale & Award Ceremony',
      date: 'April 06, 2026',
      desc: 'Top 10 finalists present live to jury; prize pool distribution and incubation grants announced.',
      active: false,
    },
  ];

  const faqs = [
    {
      q: 'Who is eligible to participate in Code-a-Nova?',
      a: 'Any undergraduate or postgraduate student enrolled in an accredited university or college (B.Tech, M.Tech, BCA, MCA, BSc, etc.) can participate. Both solo and team participants are welcome.',
    },
    {
      q: 'What is the maximum and minimum team size?',
      a: 'Teams can range from 1 member (solo coder) to up to 5 members. The team leader submits the registration form with team members’ names and email IDs.',
    },
    {
      q: 'Is there any registration fee?',
      a: 'No! Registration for Code-a-Nova 2026 is 100% free of cost, supported by our premier industry partners and sponsors.',
    },
    {
      q: 'What submissions are needed during registration?',
      a: 'You will need: Project Title, Track selection, a shareable PPT link (Google Drive / OneDrive), a working Prototype link (GitHub / Figma / demo), and optionally a short demo video link.',
    },
    {
      q: 'How does the email OTP authentication work?',
      a: 'When you create an account, our backend dispatches a 6-digit OTP code directly to your email address from Code-a-Nova. The OTP expires in 10 minutes.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 sm:pb-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Announcement Pill */}
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-indigo-50 border border-indigo-200/80 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-indigo-700 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-6 sm:mb-8 max-w-full">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 shrink-0" />
            <span className="truncate">Registration Live for 2026 Edition</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Build Bold Solutions at{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Code-a-Nova
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
            The national 36-hour sprint where passionate engineers, creators, and problem-solvers turn groundbreaking ideas into deployed software.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
            <Link
              to={isAuthenticated ? '/dashboard' : '/signup'}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 sm:px-8 py-3.5 text-sm sm:text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition"
            >
              <span>{isAuthenticated ? 'Go to My Dashboard' : 'Register Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#tracks"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 text-sm sm:text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition"
            >
              Explore Tracks
            </a>
          </div>

          {/* Key Quick Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="text-xl sm:text-3xl font-extrabold text-indigo-600">₹5,00,000</div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">Total Prize Pool</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="text-xl sm:text-3xl font-extrabold text-slate-900">36 Hours</div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">Non-stop Hacking</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="text-xl sm:text-3xl font-extrabold text-slate-900">1,200+</div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">Expected Hackers</div>
            </div>
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
              <div className="text-xl sm:text-3xl font-extrabold text-slate-900">1 - 5</div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">Team Size</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Anchor */}
      <section id="about" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm text-center sm:text-left flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Code2 className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">About Code-a-Nova</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Fueling India's Next Generation of Tech Builders
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Code-a-Nova brings together top collegiate developers, designers, and innovators across India. Over 36 hours, teams collaborate to build end-to-end software and hardware prototypes evaluated by industry architects and startup founders.
            </p>
          </div>
        </div>
      </section>

      {/* Tracks / Domains Section */}
      <section id="tracks" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Innovation Arenas</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Choose Your Track
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 px-2">
            Pick from 6 specialized technology domains designed to push real-world impact and creative problem solving.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tracks.map((track, i) => {
            const Icon = track.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 transition">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{track.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">{track.description}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {track.tags.map((tag, tIndex) => (
                    <span
                      key={tIndex}
                      className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Roadmap</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Hackathon Timeline
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 px-2">
            Pivotal milestones from proposal submission to the grand final presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {timelineSteps.map((step, i) => (
            <div
              key={i}
              className={`p-5 sm:p-6 rounded-2xl border transition relative ${
                step.active
                  ? 'bg-indigo-50/50 border-indigo-300 shadow-sm'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
                  {step.phase}
                </span>
                {step.active && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white">
                    Live Now
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">{step.title}</h3>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 mb-2.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{step.date}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Rewards</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Prize Pool & Perks
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 px-2">
            Rewarding top talent with cash prizes, cloud credits, and accelerator access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-md md:max-w-none mx-auto">
          {/* 1st Place - Shown first on mobile, center on desktop */}
          <div className="bg-slate-900 text-white border-2 border-indigo-500 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between relative order-1 md:order-2 md:-translate-y-3">
            <div className="inline-block self-start sm:self-center bg-indigo-600 text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow mb-4">
              🏆 Grand Champion
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">First Place Winner</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4">₹2,50,000</div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>₹2,50,000 Unrestricted cash prize</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Incubation interview & founder mentorship</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>$10,000 Cloud vouchers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct sponsor interview opportunities</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2nd Place */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between order-2 md:order-1">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base mb-3">
                🥈
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">First Runner-Up</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 mb-4">₹1,50,000</div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct cash award</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>$2,500 Cloud Credits</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Winner Certificate & Swag</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between order-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base mb-3">
                🥉
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Second Runner-Up</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 mb-4">₹75,000</div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct cash award</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>$1,000 Cloud Credits</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Merchandise kit & Certificate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Queries</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden transition"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-4 sm:px-6 py-3.5 sm:py-4.5 flex items-center justify-between text-sm sm:text-base font-semibold text-slate-900 hover:text-indigo-600 transition"
              >
                <span className="pr-2">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 transition-transform ${
                    openFaq === index ? 'transform rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-3xl p-6 sm:p-12 text-center shadow-lg relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to show what you can build?
          </h2>
          <p className="mt-2 sm:mt-3 text-indigo-100 max-w-xl mx-auto text-xs sm:text-base px-2">
            Create an account, verify your email with OTP, and register your team for Code-a-Nova 2026 today.
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              to={isAuthenticated ? '/dashboard' : '/signup'}
              className="inline-flex items-center space-x-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-indigo-700 hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-xl shadow transition"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Create Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
