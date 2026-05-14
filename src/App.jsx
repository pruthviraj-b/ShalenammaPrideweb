import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Hero from './components/Hero';
import MealFeed from './components/MealFeed';
import Facilities from './components/Facilities';
import StarsGallery from './components/StarsGallery';
import FeedbackForm from './components/FeedbackForm';
import ToastContainer from './components/ToastContainer';
import Lightbox from './components/Lightbox';
import { Home, Utensils, Building2, Trophy, Bell, Moon, Sun, Mail, Phone, MapPin, Shield, Users, Award, MessageSquare, ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

import AnnouncementsFeed from './components/AnnouncementsFeed';
import NotificationMarquee from './components/NotificationMarquee';
import PortalCapabilities from './components/PortalCapabilities';
import TodayUpdates from './components/TodayUpdates';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const { t, toggleLanguage, lang } = useLanguage();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navItems = [
    { id: 'Home', icon: <Home size={22} />, label: t('navHome') },
    { id: 'Meals', icon: <Utensils size={22} />, label: t('navMeals') },
    { id: 'Infrastructure', icon: <Building2 size={22} />, label: t('navInfrastructure') },
    { id: 'Student Stars', icon: <Trophy size={22} />, label: t('navStars') },
    { id: 'Notices', icon: <Bell size={22} />, label: t('navNotices') },
  ];

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ToastContainer />
      <Lightbox />


      <header className="govt-header">
        <div className="container">
          <div className="govt-header-top">
            <div className="govt-logo-center"></div>
            <img src="/logo.png" alt="Shale-Namma Pride" className="govt-logo" />
            <div className="govt-header-controls">
              <div className="lang-toggle-wrapper">
                <button onClick={() => lang !== 'en' && toggleLanguage()} className={`lang-btn ${lang === 'en' ? 'active' : ''}`}>EN</button>
                <button onClick={() => lang !== 'kn' && toggleLanguage()} className={`lang-btn ${lang === 'kn' ? 'active' : ''}`}>ಕನ್ನಡ</button>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
          <h1 className="govt-title">{t('siteTitle')}</h1>
          <p className="govt-subtitle">{t('parentsPortal')}</p>
          <div className="values-bar">
            <span><Shield size={14} /> {t('valTransparency')}</span>
            <span className="dot" />
            <span><Users size={14} /> {t('valSafety')}</span>
            <span className="dot" />
            <span><Award size={14} /> {t('valAchievement')}</span>
            <span className="dot" />
            <span><MessageSquare size={14} /> {t('valCommunication')}</span>
          </div>


          <nav className="premium-nav">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`premium-nav-btn ${activeTab === item.id ? 'active' : ''}`}
              >
                <span className="nav-icon">
                  {React.cloneElement(item.icon, { size: 18 })}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <NotificationMarquee />


      <main style={{ flex: 1, paddingBottom: '80px' }}>
        {activeTab === 'Home' && (
          <>
            <div className="container" style={{ paddingTop: '2rem' }}>
               <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success)', color: 'white', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.05em' }} className="animate-pulse">
                 <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }}></div>
                 {t('liveSyncActive') || 'LIVE REAL-TIME FEED'}
               </div>
            </div>
            <Hero setActiveTab={setActiveTab} />
            <PortalCapabilities />
            <TodayUpdates setActiveTab={setActiveTab} />
            <div className="container" style={{ marginTop: '2rem' }}>
              <div className="section-header">
                <div className="section-badge">
                  <Calendar size={14} /> ARCHIVED RECORDS
                </div>
                <h2 className="section-title">Past Meal Log</h2>
              </div>
              <MealFeed excludeToday={true} />
            </div>

            <div className="container" style={{ marginTop: '4rem' }}>
              <div className="section-header">
                <div className="section-badge">
                  <Calendar size={14} /> ARCHIVED RECORDS
                </div>
                <h2 className="section-title">Campus Development</h2>
              </div>
              <Facilities limit={2} excludeToday={true} />
            </div>

            <div className="container" style={{ marginTop: '4rem' }}>
              <div className="section-header">
                <div className="section-badge">
                  <Calendar size={14} /> ARCHIVED RECORDS
                </div>
                <h2 className="section-title">Past Student Stars</h2>
              </div>
              <StarsGallery limit={3} excludeToday={true} /> 
            </div>

            <div className="container" style={{ marginTop: '4rem' }}>
              <div className="section-header">
                <div className="section-badge">
                  <Calendar size={14} /> ARCHIVED RECORDS
                </div>
                <h2 className="section-title">Past Official Notices</h2>
              </div>
              <AnnouncementsFeed limit={2} excludeToday={true} />
            </div>
          </>
        )}
        <div className="container">
          {activeTab === 'Meals' && <MealFeed />}
          {activeTab === 'Infrastructure' && <Facilities />}
          {activeTab === 'Student Stars' && <StarsGallery />}
          {activeTab === 'Feedback' && <FeedbackForm />}
          {activeTab === 'Notices' && <AnnouncementsFeed />}
        </div>


        {activeTab === 'Home' && (
          <section className="promo-section">
             <div className="container">
                <h2 style={{ marginBottom: '1rem' }} className="text-balance">{t('promoTitle1')} {t('promoTitle2')}</h2>
                <p>{t('promoDesc')}</p>
                <button className="btn btn-secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{t('promoBtn')}</button>
             </div>
          </section>
        )}
      </main>


      <footer className="site-footer">
        <div className="container">

          <div className="footer-brand">
            <div className="footer-logo-wrapper">
              <img src="/logo.png" alt="Gov Logo" className="footer-logo-small" />
              <div>
                <h3 className="footer-brand-title">Shale-Namma Pride</h3>
                <div className="footer-brand-badge">
                  <Shield size={10} /> {t('parentsPortal') || 'Official Parents Portal'}
                </div>
              </div>
            </div>
            <p className="footer-desc">
              {t('footerText') || 'Fostering transparency and excellence in education. A direct connection between our school and your home.'}
            </p>
          </div>


          <div className="footer-section">
            <h4 className="footer-section-title">{t('footerQuickLinks') || 'Quick Access'}</h4>
            <div className="footer-links-grid">
              {navItems.map(item => (
                <button key={item.id} className="footer-link-card" onClick={() => setActiveTab(item.id)}>
                  <div className="footer-link-icon">
                    {React.cloneElement(item.icon, { size: 18 })}
                  </div>
                  <span className="footer-link-label">{item.label}</span>
                </button>
              ))}
              <button className="footer-link-card" onClick={() => setActiveTab('Feedback')}>
                <div className="footer-link-icon"><MessageSquare size={18} /></div>
                <span className="footer-link-label">{t('navFeedback') || 'Feedback'}</span>
              </button>
            </div>
          </div>


          <div className="footer-section">
            <h4 className="footer-section-title">{t('footerContact') || 'Contact Administration'}</h4>
            <div className="footer-contact-card">
              <div className="contact-item-row">
                <div className="contact-icon-box"><Mail size={18} /></div>
                <span className="contact-text">support@shalenamma.edu.in</span>
                <ChevronRight className="contact-arrow" size={16} />
              </div>
              <div className="contact-item-row">
                <div className="contact-icon-box"><Phone size={18} /></div>
                <span className="contact-text">+91 80000 00000</span>
                <ChevronRight className="contact-arrow" size={16} />
              </div>
              <div className="contact-item-row">
                <div className="contact-icon-box"><MapPin size={18} /></div>
                <span className="contact-text">123 Education Hub, Bengaluru</span>
                <ChevronRight className="contact-arrow" size={16} />
              </div>
            </div>
          </div>


          <div className="footer-bottom">
            <p className="copyright-text">
              &copy; 2025 Shale-Namma Pride • {t('allRightsReserved') || 'All rights reserved.'}
            </p>
            <div className="footer-policy-links">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>


      <div className="floating-nav-wrapper">
        <nav className="floating-nav-container">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-tab ${activeTab === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default App;
