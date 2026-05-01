import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Menu, X, Phone, Car, LayoutDashboard, LogIn, User as UserIcon, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CONTACT_INFO } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { signInWithGoogle } from '../lib/firebase';
import Logo from './Logo';

interface NavbarProps {
  onDashboardClick: () => void;
  onHomeClick: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Navbar({ onDashboardClick, onHomeClick, theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';
  const isVehiclePage = location.pathname.startsWith('/vehicle/');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '/', isHash: false },
    { name: t('nav.fleet'), href: '/#fleet', isHash: true },
    { name: t('nav.drivers'), href: '/#drivers', isHash: true },
    { name: t('nav.rates'), href: '/#rates', isHash: true },
    { name: t('nav.packages'), href: '/#packages', isHash: true },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: { href: string, isHash: boolean }) => {
    setIsOpen(false);
    if (link.isHash) {
      if (!isHome) {
        navigate(link.href);
      } else {
        const id = link.href.split('#')[1];
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(link.href);
    }
  };

  const currentViewStyle = scrolled || isDashboard || isVehiclePage
    ? 'bg-white/80 dark:bg-hotstar-bg/80 backdrop-blur-xl py-4 shadow-2xl shadow-black/5 border-b border-gray-100 dark:border-hotstar-border' 
    : 'bg-transparent py-8';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${currentViewStyle}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <Logo scrolled={scrolled || isDashboard || isVehiclePage || theme === 'dark'} className="cursor-pointer" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            <div className={`flex items-center space-x-1 px-1 py-1 rounded-[2rem] transition-all ${
              scrolled || isDashboard || isVehiclePage ? 'bg-gray-50/50 dark:bg-white/5' : 'bg-white/5 backdrop-blur-md'
            }`}>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full transition-all hover:bg-yellow-400 hover:text-black ${
                    scrolled || isDashboard || isVehiclePage ? 'text-gray-700 dark:text-gray-200' : 'text-gray-100'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            <div className="flex items-center space-x-3 ml-4">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-2xl transition-all border ${
                  scrolled || isDashboard || isVehiclePage
                    ? 'bg-white dark:bg-white/5 border-gray-100 dark:border-hotstar-border text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {theme === 'dark' ? (
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                )}
              </button>

              <div className="relative group">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    scrolled || isDashboard || isVehiclePage 
                      ? 'bg-white border-gray-100 text-gray-700 hover:bg-gray-50' 
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <Globe className="h-3.5 w-3.5 text-yellow-400" />
                  <span className="hidden lg:inline">{language === 'en' ? 'EN' : 'HI'}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-32 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                    >
                      <button 
                        onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                        className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-gray-50 transition-colors ${language === 'en' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700'}`}
                      >
                        English
                      </button>
                      <button 
                        onClick={() => { setLanguage('hi'); setShowLangMenu(false); }}
                        className={`w-full px-4 py-3 text-left text-xs font-bold hover:bg-gray-50 transition-colors ${language === 'hi' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700'}`}
                      >
                        हिंदी
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {loading ? (
                <div className="h-10 w-40 rounded-2xl bg-gray-100 animate-pulse"></div>
              ) : user ? (
                <button
                  onClick={onDashboardClick}
                  className={`flex items-center px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isDashboard 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black border border-gray-100 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/10'
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5 mr-2" />
                  {t('nav.dashboard')}
                </button>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="flex items-center bg-white/10 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all shadow-xl"
                >
                  <LogIn className="h-3.5 w-3.5 mr-2" />
                  {t('nav.signIn')}
                </button>
              )}
              
              <a
                href={`tel:${CONTACT_INFO.phone}`}
                className="flex items-center bg-yellow-400 text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-400/30 border-2 border-white"
              >
                <Phone className="h-3.5 w-3.5 mr-2" />
                {t('nav.callNow')}
              </a>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
             {user && (
               <button 
                 onClick={onDashboardClick}
                 className={`p-2 rounded-lg ${scrolled || isDashboard || isVehiclePage ? 'text-hotstar-bg dark:text-white' : 'text-white'}`}
               >
                 <LayoutDashboard className="h-6 w-6" />
               </button>
             )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${scrolled || isDashboard || isVehiclePage ? 'text-hotstar-bg dark:text-white' : 'text-white'} focus:outline-none`}
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="md:hidden fixed inset-0 bg-white dark:bg-hotstar-bg z-[60] flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-12">
               <Logo scrolled={true} />
               <button onClick={() => setIsOpen(false)}>
                  <X className="h-8 w-8 text-gray-900 dark:text-white" />
               </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="block text-3xl font-black text-gray-900 dark:text-white hover:text-yellow-500 transition-colors"
                >
                  {link.name}
                </a>
              ))}
              
              {user ? (
                <button
                  onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                  className="flex items-center w-full p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-xl font-bold text-gray-900 dark:text-white"
                >
                  <LayoutDashboard className="h-6 w-6 mr-4 text-yellow-500" />
                  {t('nav.dashboard')}
                </button>
              ) : (
                <button
                  onClick={() => {
                    signInWithGoogle();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full p-4 bg-yellow-400 rounded-2xl text-xl font-bold text-black"
                >
                  <LogIn className="h-6 w-6 mr-4" />
                  {t('nav.signIn')}
                </button>
              )}
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-white/10">
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="w-full flex items-center justify-center bg-black dark:bg-white dark:text-black text-white px-6 py-5 rounded-2xl text-xl font-bold shadow-2xl shadow-black/20"
                >
                  <Phone className="h-6 w-6 mr-3" />
                  {t('nav.callNow')}
                </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
