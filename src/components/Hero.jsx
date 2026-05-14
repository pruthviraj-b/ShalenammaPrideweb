import React from 'react';
import { ChevronRight, LayoutGrid, Star, Bell } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = ({ setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <>

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge animate-slide-up">
              <span className="hero-badge-icon">✨</span>
              <span>{t('heroBadge') || 'Official Parents Portal'}</span>
            </div>
            <h1 className="hero-title animate-slide-up delay-100 text-balance">
              {t('heroTitle')}
            </h1>
            <p className="hero-subtitle animate-slide-up delay-200 text-balance">
              {t('heroSubtitle')}
            </p>
            <div className="hero-buttons animate-slide-up delay-300">
              <button className="btn btn-primary" onClick={() => {
                const el = document.getElementById('dashboard-grid');
                if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
              }}>
                <Bell size={18} />
                {t('viewUpdates')}
                <ChevronRight size={18} />
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('Infrastructure')}>
                <LayoutGrid size={18} />
                {t('heroExplore')}
              </button>
            </div>


            <div className="scroll-indicator animate-bounce delay-1000" style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-text)', opacity: 0.6 }}>
              <div style={{ width: '20px', height: '30px', border: '2px solid var(--muted-text)', borderRadius: '10px', position: 'relative' }}>
                <div style={{ width: '4px', height: '8px', background: 'var(--muted-text)', borderRadius: '2px', position: 'absolute', top: '4px', left: '50%', transform: 'translateX(-50%)' }}></div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scroll to discover</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
