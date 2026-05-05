import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Facilities = () => {
  const { t } = useLanguage();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const facilitiesRef = ref(database, 'facility');
    const unsubscribe = onValue(facilitiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const facilitiesList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        setFacilities(facilitiesList);
      } else {
        setFacilities([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="container mt-16 animate-slide-up delay-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="premium-icon-wrapper">
          <Building2 size={24} />
        </div>
        <h2 style={{ marginBottom: 0 }}>{t('campusInfrastructure')}</h2>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card">
              <div className="skeleton skeleton-image"></div>
              <div className="skeleton skeleton-badge"></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
            </div>
          ))}
        </div>
      ) : facilities.length > 0 ? (
        <div className="grid grid-cols-3">
          {facilities.map((facility) => (
            <div key={facility.id} className="card">
              {facility.imageUrl && (
                <div className="card-image-wrapper" style={{ aspectRatio: '16/9' }}>
                  <img 
                    src={facility.imageUrl} 
                    alt={facility.title} 
                    className="card-image cursor-zoom-in" 
                    onClick={() => window.dispatchEvent(new CustomEvent('show-lightbox', { detail: facility.imageUrl }))}
                  />
                </div>
              )}
              <span className="badge category" style={{ marginBottom: '1rem', background: '#F3E8FF', color: '#7E22CE', boxShadow: '0 0 0 1px rgba(126, 34, 206, 0.2) inset' }}>
                {facility.category}
              </span>
              <h3 style={{ fontSize: '1.35rem' }}>{facility.title}</h3>
              <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: '1.6' }}>{facility.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-card text-center" style={{ padding: '4rem' }}>
          <div className="premium-icon-wrapper" style={{ margin: '0 auto 1rem' }}>
            <Building2 size={24} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>{t('noFacilitiesTitle')}</h3>
          <p>{t('noFacilitiesDesc')}</p>
        </div>
      )}
    </section>
  );
};

export default Facilities;
