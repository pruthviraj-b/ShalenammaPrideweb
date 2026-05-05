import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section className="text-center animate-slide-up" style={{ padding: '8rem 0 6rem', position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        
        <div className="premium-badge animate-slide-up delay-100" style={{ 
          marginBottom: '2rem'
        }}>
          {t('heroBadge')}
        </div>

        <h1 className="animate-slide-up delay-200" style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          marginBottom: '1.5rem',
          maxWidth: '900px',
          margin: '0 auto 1.5rem',
          background: 'linear-gradient(135deg, var(--text-primary) 0%, #334155 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {t('heroTitle')}
        </h1>
        
        <p className="animate-slide-up delay-300" style={{ 
          fontSize: 'clamp(1.125rem, 2vw, 1.25rem)', 
          maxWidth: '600px', 
          margin: '0 auto 3rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.8'
        }}>
          {t('heroSubtitle')}
        </p>

        <div className="animate-slide-up delay-400" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn" onClick={() => window.scrollTo({ top: document.getElementById('meals').offsetTop - 100, behavior: 'smooth' })}>
            {t('viewUpdates')} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
