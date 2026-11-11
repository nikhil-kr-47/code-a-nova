import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Mail, MapPin, Globe, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Code-a-Nova</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              India's premier student innovation hackathon uniting 1,200+ top engineering minds to build high-impact tech solutions.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/#tracks" className="hover:text-white transition">Domains & Tracks</Link>
              </li>
              <li>
                <Link to="/#timeline" className="hover:text-white transition">Event Timeline</Link>
              </li>
              <li>
                <Link to="/#prizes" className="hover:text-white transition">Prize Pool</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Help & Support</Link>
              </li>
            </ul>
          </div>

          {/* Registration Rules */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Participant Guide</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400">Team Size: 1 to 5 members</span>
              </li>
              <li>
                <span className="text-slate-400">Eligibility: College students</span>
              </li>
              <li>
                <span className="text-slate-400">Duration: 36-Hour National Sprint</span>
              </li>
              <li>
                <span className="text-slate-400">Mode: Hybrid (Online + Finals)</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Event Secretariat</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Official Queries</div>
                  <a href="mailto:codeanova.official@gmail.com" className="text-white hover:underline">
                    codeanova.official@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Grand Finale Hub</div>
                  <span className="text-slate-300">Bangalore Innovation Hub, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Code-a-Nova Hackathon. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-slate-400 transition cursor-pointer">Code of Conduct</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition cursor-pointer">Terms of Participation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
