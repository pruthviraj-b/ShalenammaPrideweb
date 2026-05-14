import React from 'react';
import { Shield, Zap, Heart, CheckCircle2, Star, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PortalCapabilities = () => {
  const { t } = useLanguage();

  const capabilities = [
    { icon: <Shield size={24} />, title: t('valTransparency'), desc: 'Every detail of school life shared directly with you.' },
    { icon: <Zap size={24} />, title: 'Daily Updates', desc: 'See today\'s meals, notices, and achievements instantly.' },
    { icon: <Heart size={24} />, title: 'Healthy Meals', desc: 'We ensure fresh and healthy food for every student, every day.' },
    { icon: <Users size={24} />, title: 'Easy Contact', desc: 'A simple way for you to talk to the school administration.' },
  ];

  return (
    <section className="capabilities-section" style={{ padding: '4rem 0', background: 'var(--govt-surface-light)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-badge" style={{ marginBottom: '1rem' }}>
            {t('dashCapTitle') || 'PLATFORM CAPABILITIES'}
          </div>
          <h2 className="section-title" style={{ maxWidth: '700px', margin: '0 auto 1.5rem' }}>
            {t('dashCapHeading') || 'Everything your child needs, in one portal.'}
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            {t('dashCapDesc') || 'Our integrated system brings together nutrition, safety, achievements, and communication into a single premium experience.'}
          </p>
        </div>

        <div className="capabilities-grid">
          {capabilities.map((cap, index) => (
            <div key={index} className="card" style={{ 
              padding: '2rem', 
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'var(--primary-bg)', 
                color: 'var(--govt-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                {cap.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{cap.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted-text)', margin: 0 }}>{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortalCapabilities;
