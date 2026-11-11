import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  Code2,
  User,
  LogOut,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleNavClick = (path) => {
    setIsOpen(false);
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (location.pathname !== '/' && route === '/') {
        navigate(`/#${hash}`);
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Tracks', path: '/#tracks' },
    { name: 'Timeline', path: '/#timeline' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 group shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition">
              <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                Code-a-Nova
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-semibold tracking-wider text-indigo-600 -mt-0.5">
                Hackathon 2026
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  isActive(link.path)
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    location.pathname === '/dashboard'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {user?.name || 'User'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive(link.path)
                    ? 'text-indigo-600 bg-indigo-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2 bg-slate-50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-900 truncate">{user?.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-100"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                  <span>My Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 px-3 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
