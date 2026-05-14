import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Award, Crown, ArrowUpRight } from 'lucide-react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { useLanguage } from '../context/LanguageContext';

const StarsGallery = ({ limit, excludeToday }) => {
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const starsRef = ref(database, 'stars');
    const unsubscribe = onValue(starsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let starsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => (b.priority || 0) - (a.priority || 0));

        if (excludeToday) {
          const today = new Date().setHours(0, 0, 0, 0);
          starsList = starsList.filter(s => new Date(s.timestamp).setHours(0, 0, 0, 0) !== today);
        }

        if (limit) {
          starsList = starsList.slice(0, limit);
        }

        setStars(starsList);
      } else {
        setStars([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const topThree = stars.slice(0, 3);
  const otherStars = stars.slice(3);

  return (
    <section className="animate-slide-up" style={{ padding: (limit || excludeToday) ? '0 0 4rem 0' : '4rem 0' }}>
      {!(limit || excludeToday) && (
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="feature-badge" style={{ margin: '0 auto 1.5rem' }}>
            <Crown size={16} /> HALL OF FAME
          </div>
          <h2 style={{ marginBottom: '1rem', justifyContent: 'center' }}>
            {t('studentExcellence') || 'Celebrating Student Stars'}
          </h2>
          <p style={{ maxWidth: '700px', margin: '0 auto' }}>
            Recognizing the exceptional talent and hard work of our outstanding students.
          </p>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))' }}>
          {[1].map(i => (
            <div key={i} className="card shimmer" style={{ height: '250px', borderRadius: '24px' }} />
          ))}
        </div>
      ) : stars.length === 0 ? (
        (excludeToday || limit) ? null : (
          <div className="card text-center" style={{ padding: '6rem 2rem', background: 'var(--primary-bg)', borderRadius: '24px' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--white)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: 'var(--shadow-md)' }}>
              <Trophy size={40} color="var(--govt-blue)" />
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{t('starsStageSet')}</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '1.1rem' }}>{t('starsStageDesc')}</p>
          </div>
        )
      ) : (
        <>
          {/* Responsive Podium Section */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '6rem', flexWrap: 'wrap' }}>
            {topThree[1] && <PodiumCard star={topThree[1]} rank={2} color="#94A3B8" icon={<Medal size={24} />} height="240px" delay="0.2s" />}
            {topThree[0] && <PodiumCard star={topThree[0]} rank={1} color="#F59E0B" icon={<Crown size={32} />} height="300px" delay="0s" isLarge />}
            {topThree[2] && <PodiumCard star={topThree[2]} rank={3} color="#D97706" icon={<Award size={24} />} height="200px" delay="0.4s" />}
          </div>

          {/* Achievements Grid */}
          {otherStars.length > 0 && (
            <div style={{ marginTop: '4rem' }}>
              <h3 style={{ marginBottom: '2.5rem', textAlign: 'center' }}>Recent Recognitions</h3>
              <div className="responsive-grid">
                {otherStars.map((star) => (
                  <AchievementCard key={star.id} star={star} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

const PodiumCard = ({ star, rank, color, icon, height, delay, isLarge }) => (
  <div className="animate-slide-up" style={{ 
    textAlign: 'center', 
    width: isLarge ? 'min(100%, 320px)' : 'min(100%, 280px)', 
    animationDelay: delay
  }}>
    <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
      <div style={{ 
        width: isLarge ? '140px' : '110px', 
        height: isLarge ? '140px' : '110px', 
        borderRadius: '50%', 
        overflow: 'hidden', 
        margin: '0 auto', 
        border: `4px solid ${color}`,
        boxShadow: `0 10px 30px ${color}30`,
        background: 'var(--bg-color)'
      }}>
        <img 
          src={star.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(star.studentName)}&background=random&color=fff&size=128`} 
          alt={star.studentName} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(star.studentName)}&background=random&color=fff&size=128`; 
          }}
        />
      </div>
      <div style={{ 
        position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', 
        background: color, color: 'white', width: '36px', height: '36px', borderRadius: '50%', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', border: '3px solid var(--bg-color)' 
      }}>
        {rank}
      </div>
    </div>
    
    <div className="card" style={{ padding: '2rem 1.5rem', minHeight: height, justifyContent: 'center' }}>
      <h3 style={{ fontSize: isLarge ? '1.5rem' : '1.25rem', marginBottom: '0.5rem' }}>{star.studentName}</h3>
      <div style={{ color: color, fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
        {star.category}
      </div>
      <p style={{ fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
        "{star.achievementTitle || star.achievement}"
      </p>
    </div>
  </div>
);

const AchievementCard = ({ star }) => (
  <div className="card hover-scale" style={{ padding: '1.5rem', flexDirection: 'row', gap: '1.25rem', alignItems: 'center' }}>
    <div style={{ width: '70px', height: '70px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
      <img 
        src={star.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(star.studentName)}&background=random&color=fff&size=128`} 
        alt={star.studentName} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(star.studentName)}&background=random&color=fff&size=128`; 
        }}
      />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{star.studentName}</h4>
        <div className="feature-badge">{star.category}</div>
      </div>
      <p className="line-clamp-2" style={{ fontSize: '0.85rem' }}>
        {star.achievementTitle || star.achievement}
      </p>
      <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-primary)', fontSize: '0.75rem', fontWeight: '800' }}>
        DETAILS <ArrowUpRight size={14} />
      </div>
    </div>
  </div>
);

export default StarsGallery;
