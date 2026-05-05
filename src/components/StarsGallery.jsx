import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { Trophy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const StarsGallery = () => {
  const { t } = useLanguage();
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const starsRef = ref(database, 'stars');
    const unsubscribe = onValue(starsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const starsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        setStars(starsList);
      } else {
        setStars([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="container mt-16 animate-slide-up delay-400">
      <div className="flex items-center gap-3 mb-8">
        <div className="premium-icon-wrapper">
          <Trophy size={24} />
        </div>
        <h2 style={{ marginBottom: 0 }}>{t('studentExcellence')}</h2>
      </div>
      
      {loading ? (
        <div className="horizontal-scroll">
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{ flex: '0 0 340px' }}>
              <div className="skeleton skeleton-image" style={{ aspectRatio: '3/4', height: 'auto' }}></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-badge"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          ))}
        </div>
      ) : stars.length > 0 ? (
        <div className="horizontal-scroll">
          {stars.map((star) => (
            <div key={star.id} className="card" style={{ flex: '0 0 340px' }}>
              {star.imageUrl && (
                <div className="card-image-wrapper" style={{ aspectRatio: '3/4', marginBottom: '1.5rem' }}>
                  <img 
                    src={star.imageUrl} 
                    alt={star.studentName} 
                    className="card-image cursor-zoom-in" 
                    onClick={() => window.dispatchEvent(new CustomEvent('show-lightbox', { detail: star.imageUrl }))}
                  />
                </div>
              )}
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{star.studentName}</h3>
              <span className="badge pending" style={{ marginBottom: '1rem', display: 'inline-block' }}>
                {star.category}
              </span>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{star.achievement}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-card text-center" style={{ padding: '4rem' }}>
          <div className="premium-icon-wrapper" style={{ margin: '0 auto 1rem' }}>
            <Trophy size={24} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>{t('noStarsTitle')}</h3>
          <p>{t('noStarsDesc')}</p>
        </div>
      )}
    </section>
  );
};

export default StarsGallery;
