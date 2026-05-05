import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import MealFeed from './components/MealFeed';
import Facilities from './components/Facilities';
import StarsGallery from './components/StarsGallery';
import FeedbackForm from './components/FeedbackForm';
import ToastContainer from './components/ToastContainer';
import Lightbox from './components/Lightbox';
import { School, Moon, Sun, Languages, Circle } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { t, toggleLanguage, lang } = useLanguage();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="App">
      <ToastContainer />
      <Lightbox />

      {/* Advanced Floating Pill Header */}
      <div style={{ position: 'sticky', top: '1rem', zIndex: 50, padding: '0 1rem', display: 'flex', justifyContent: 'center' }}>
        <header className="animate-slide-up" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: darkMode ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(24px)', 
          WebkitBackdropFilter: 'blur(24px)',
          border: `1px solid ${darkMode ? 'rgba(51, 65, 85, 0.8)' : 'rgba(255, 255, 255, 0.8)'}`, 
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.05)', 
          borderRadius: '9999px', 
          padding: '0.5rem 0.5rem 0.5rem 1.25rem', 
          width: '100%', 
          maxWidth: '900px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="Shale-Namma Pride Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
            </div>
            <div style={{ fontWeight: '800', fontSize: 'clamp(1rem, 3.5vw, 1.2rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {t('siteTitle')}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={toggleLanguage}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem' }}
              title={t('toggleLang')}
            >
              <Languages size={20} />
            </button>
            <span className="premium-badge" style={{ padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={t('liveSyncActive')}>
              <span className="live-pulse" style={{ margin: 0 }}></span>
            </span>
          </div>
        </header>
      </div>

      {/* Main Content with Premium Spacing */}
      <main style={{ paddingBottom: '6rem' }}>
        <Hero />
        <MealFeed />
        <Facilities />
        <StarsGallery />
        <FeedbackForm />
      </main>

      {/* Premium Footer */}
      <footer style={{ 
        background: darkMode ? 'var(--card-bg)' : 'white', 
        borderTop: '1px solid var(--border-color)',
        padding: '4rem 0 2rem',
        marginTop: 'auto'
      }}>
        <div className="container text-center">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
            <img src="/logo.png" alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            <span style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--text-primary)' }}>{t('siteTitle')}</span>
          </div>
          <p style={{ fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
            {t('footerText')}
          </p>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            &copy; {new Date().getFullYear()} {t('siteTitle')}. {t('allRightsReserved')}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
