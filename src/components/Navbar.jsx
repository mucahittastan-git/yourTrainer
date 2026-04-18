import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useTheme } from '../utils/ThemeContext';
import { User, Users, Menu, X, Dumbbell, Home, Calendar, Moon, Sun, Palette } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const { currentPT } = useAuth();
  const { accentColor, changeAccentColor, ACCENT_COLORS } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Ders Takibi', href: '/lessons', icon: Calendar },
    { name: 'Yeni Üye', href: '/clients/new', icon: Users },
    { name: 'Üye Listesi', href: '/clients/list', icon: Users },
    { name: 'Profil', href: '/profile', icon: User },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav 
      className={`fixed w-full top-0 z-[100] transition-all duration-500 ${
        isScrolled 
          ? 'glass-card border-none shadow-2xl py-2' 
          : 'bg-transparent py-4'
      }`} 
      role="navigation" 
      aria-label="Ana gezinme"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="p-2 btn-primary shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Dumbbell className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-black text-main tracking-tighter">YourTrainer</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-white/20">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    active
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-slate-500 hover:text-primary-500'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? 'text-primary-600' : 'text-slate-400'}`} aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Controls & Profile (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Accent Picker only */}
            <div className="relative">
              <button
                onClick={() => setIsStyleOpen(!isStyleOpen)}
                className={`p-2.5 rounded-xl bg-white/50 backdrop-blur-md border border-white/20 text-slate-500 hover:text-primary-500 transition-all active:scale-95 ${isStyleOpen ? 'text-primary-500 ring-2 ring-primary-500/20' : ''}`}
                title="Renk Teması"
              >
                <Palette className="h-5 w-5" />
              </button>

              {isStyleOpen && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setIsStyleOpen(false)} />
                  <div className="absolute top-full mt-3 right-0 glass-card p-4 rounded-3xl min-w-[200px] animate-fade-in border-white/20 shadow-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Renk Paleti</p>
                    <div className="grid grid-cols-5 gap-2">
                      {ACCENT_COLORS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => {
                            changeAccentColor(color.id);
                            setIsStyleOpen(false);
                          }}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${accentColor.id === color.id ? 'border-primary-500 scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                          style={{ backgroundColor: color.primary }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link to="/profile" className="flex items-center space-x-3 bg-white/50 backdrop-blur-md p-1.5 pr-4 rounded-2xl border border-white/20 hover:bg-white transition-all duration-300 group cursor-pointer">
              <div className="w-8 h-8 rounded-xl btn-primary flex items-center justify-center text-white font-black text-xs shadow-md group-hover:scale-110 transition-transform">
                {currentPT?.ad?.charAt(0)}
              </div>
              <div className="text-[11px] font-black text-main uppercase tracking-wider">
                {currentPT?.ad}
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/50 backdrop-blur-md border border-white/20 text-slate-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (Glassmorphic) */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="mx-4 mt-4 p-4 rounded-[2.5rem] glass-card border-none space-y-2">
            <div className="grid grid-cols-5 gap-2 px-2 pb-4 mb-4 border-b border-white/10">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => {
                    changeAccentColor(color.id);
                  }}
                  className={`w-10 h-10 rounded-2xl border-2 transition-all mx-auto ${accentColor.id === color.id ? 'border-primary-500' : 'border-transparent'}`}
                  style={{ backgroundColor: color.primary }}
                />
              ))}
            </div>
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${
                    active
                      ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                      : 'text-slate-500 hover:bg-white/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={`p-2 rounded-xl ${active ? 'bg-primary-500 text-white shadow-lg' : 'bg-slate-100'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
