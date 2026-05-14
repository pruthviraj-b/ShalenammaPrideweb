import React, { useState, useEffect } from 'react';
import { Building2, Camera, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { useLanguage } from '../context/LanguageContext';

const Facilities = ({ limit, excludeToday }) => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const infraRef = ref(database, 'infrastructure');
    const unsubscribe = onValue(infraRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let infraList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);

        if (excludeToday) {
          const today = new Date().setHours(0, 0, 0, 0);
          infraList = infraList.filter(item => new Date(item.timestamp).setHours(0, 0, 0, 0) !== today);
        }

        if (limit) {
          infraList = infraList.slice(0, limit);
        }

        setFacilities(infraList);
      } else {
        setFacilities([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limit, excludeToday]);

  const formatDate = (ms) => {
    if (!ms) return '';
    return new Date(ms).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <section className="animate-slide-up" style={{ padding: (limit || excludeToday) ? '0 0 4rem 0' : '4rem 0' }}>
      {!(limit || excludeToday) && (
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="feature-badge" style={{ margin: '0 auto 1.5rem' }}>
            <Building2 size={16} /> CAMPUS UPDATES
          </div>
          <h2 style={{ marginBottom: '1rem', justifyContent: 'center' }}>
            {t('infraTitle') || 'Infrastructure & Facilities'}
          </h2>
          <p style={{ maxWidth: '700px', margin: '0 auto' }}>
            {t('infraSubtitle') || 'Latest updates on school building, facilities, and campus development.'}
          </p>
        </div>
      )}

      {loading ? (
        <div className="responsive-grid">
          {[1, 2].map(i => (
            <div key={i} className="card shimmer" style={{ height: '400px', borderRadius: '24px' }} />
          ))}
        </div>
      ) : facilities.length === 0 ? (
        (excludeToday || limit) ? null : (
          <div className="card text-center" style={{ padding: '6rem 2rem', background: 'var(--primary-bg)', borderRadius: '24px' }}>
            <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: 'var(--shadow-md)' }}>
              <Building2 size={40} color="var(--govt-blue)" />
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>No Infrastructure Updates</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '1.1rem' }}>There are currently no infrastructure posts from the administration.</p>
          </div>
        )
      ) : (
        <div className="responsive-grid">
          {facilities.map((fac) => (
            <div key={fac.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="card-image-container" style={{ margin: 0, height: '250px', cursor: 'zoom-in' }} onClick={() => window.dispatchEvent(new CustomEvent('show-lightbox', { detail: fac.imageUrl }))}>
                <img 
                  src={fac.imageUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80'} 
                  alt={fac.title || 'Facility'} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', padding: '0.6rem', borderRadius: '14px', color: '#10B981', boxShadow: 'var(--shadow-md)' }}>
                  <Camera size={20} />
                </div>
              </div>
              
              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div className="feature-badge" style={{ margin: 0 }}>{fac.category || 'Development'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--muted-text)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} /> {formatDate(fac.timestamp)}
                  </div>
                </div>
                
                <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{fac.title || 'Campus Update'}</h3>
                
                {fac.description && (
                  <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                    {fac.description}
                  </p>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#10B981', fontWeight: '700', fontSize: '0.85rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <ShieldCheck size={18} /> Verified by Administration
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Facilities;
