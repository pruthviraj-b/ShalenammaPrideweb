import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Utensils, Building2, Trophy, Bell, ArrowRight, ChevronRight } from 'lucide-react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';

const Dashboard = ({ setActiveTab }) => {
  const { t, lang } = useLanguage();
  const [latestMeal, setLatestMeal] = useState(null);

  useEffect(() => {
    const mealRef = ref(database, 'meals');
    const unsubscribe = onValue(mealRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const mealList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        if (mealList.length > 0) {
          setLatestMeal(mealList[0]);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const formatDate = (ms) => {
    if (!ms) return '';
    return new Date(ms).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  };

  const services = [
    { id: 'Meals', title: t('dashboardMeal'), desc: t('dashMealSub'), icon: <Utensils size={24} /> },
    { id: 'Infrastructure', title: t('dashboardInfra'), desc: t('dashInfraSub'), icon: <Building2 size={24} /> },
    { id: 'Student Stars', title: t('dashboardStars'), desc: t('dashStarsSub'), icon: <Trophy size={24} /> },
    { id: 'Notices', title: t('dashboardNotices'), desc: t('dashNoticesSub'), icon: <Bell size={24} /> },
  ];

  return (
    <section className="dashboard-section animate-slide-up" id="dashboard-grid">
      <div className="container">

        {/* Quick Access Service Cards */}
        <div className="service-grid">
          {services.map((svc) => (
            <div key={svc.id} className="service-card" onClick={() => setActiveTab(svc.id)}>
              <div className="service-icon">{svc.icon}</div>
              <h4>{svc.title}</h4>
              <p>{svc.desc}</p>
              <div className="service-arrow"><ArrowRight size={14} /></div>
            </div>
          ))}
        </div>

        {/* Today's Meal Preview */}
        {latestMeal && (
          <div className="card" style={{ cursor: 'pointer', marginTop: '0.5rem' }} onClick={() => setActiveTab('Meals')}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="service-icon" style={{ flexShrink: 0 }}>
                <Utensils size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem' }}>{t('dashboardMeal') || "Today's Meal Update"}</h3>
                  <span style={{ color: 'var(--blue)', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {t('heroExplore') || 'View All'} <ChevronRight size={14} />
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '0.25rem', fontWeight: '600' }}>{formatDate(latestMeal.timestamp)}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gray-700)' }} className="line-clamp-2">
                  {latestMeal.mealContent || latestMeal.message || latestMeal.menuText}
                </div>
              </div>
              <div style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                <img src={latestMeal.imageUrl || 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400&q=80'} alt="Meal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Dashboard;
