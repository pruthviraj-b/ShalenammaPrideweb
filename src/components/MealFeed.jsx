import React, { useState, useEffect } from 'react';
import { Utensils, Info, CheckCircle2, Leaf, Zap, Apple } from 'lucide-react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { useLanguage } from '../context/LanguageContext';

const MealFeed = ({ limit, excludeToday }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const mealRef = ref(database, 'meals');
    const unsubscribe = onValue(mealRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let mealList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        
        if (excludeToday) {
          const today = new Date().setHours(0, 0, 0, 0);
          mealList = mealList.filter(m => new Date(m.timestamp).setHours(0, 0, 0, 0) !== today);
        }

        setMeals(limit ? mealList.slice(0, limit) : mealList);
      } else {
        setMeals([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (ms) => {
    if (!ms) return '';
    return new Date(ms).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-US', {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  };

  const getNutrition = (mealName) => {
    const name = (mealName || '').toLowerCase();
    if (name.includes('rice') || name.includes('roti')) {
      return [
        { label: 'Energy', value: 'High', color: '#EF4444', icon: <Zap size={14} /> },
        { label: 'Veggie', value: 'Fresh', color: '#10B981', icon: <Leaf size={14} /> },
        { label: 'Vitamins', value: 'Rich', color: '#F59E0B', icon: <Apple size={14} /> }
      ];
    }
    return [
      { label: 'Balanced', value: 'Yes', color: '#3B82F6', icon: <CheckCircle2 size={14} /> },
      { label: 'Quality', value: 'Premium', color: '#10B981', icon: <Leaf size={14} /> }
    ];
  };

  return (
    <section className="animate-slide-up" style={{ padding: limit ? '0 0 4rem 0' : '4rem 0' }}>
      {!limit && (
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="feature-badge" style={{ margin: '0 auto 1.5rem' }}>
            <Utensils size={16} /> CAMPUS NUTRITION
          </div>
          <h2 style={{ marginBottom: '1rem', justifyContent: 'center' }}>
            {t('dailyMealProgram') || 'Daily Nutrition Log'}
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            {t('mealFeedSubtitle')}
          </p>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[1].map(i => (
            <div key={i} className="card shimmer" style={{ height: '300px', borderRadius: '24px' }} />
          ))}
        </div>
      ) : meals.length === 0 ? (
        (excludeToday || limit) ? null : (
          <div className="card text-center" style={{ padding: '6rem 2rem', background: 'var(--primary-bg)', borderRadius: '24px' }}>
            <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: 'var(--shadow-md)' }}>
              <Utensils size={40} color="var(--govt-blue)" />
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{t('mealPrepTitle')}</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '1.1rem' }}>{t('mealPrepDesc')}</p>
          </div>
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {meals.map((meal, index) => (
            <div 
              key={meal.id} 
              className="card" 
              style={{ 
                padding: 0, 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))',
                overflow: 'hidden',
                marginBottom: '2rem'
              }}
            >
              <div style={{ padding: '3.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--govt-blue)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
                      {index === 0 ? t('todaySpecial') : t('pastRecord')}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>{formatDate(meal.timestamp)}</h3>
                  </div>
                  {index === 0 && (
                    <div style={{ background: '#16A34A', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '100px', fontWeight: '800', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)' }}>
                      <CheckCircle2 size={16} /> SERVED
                    </div>
                  )}
                </div>

                <div className="glass" style={{ padding: '2rem', borderRadius: '24px', marginBottom: '2.5rem', background: 'var(--primary-bg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--muted-text)', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', opacity: 0.6 }}>{t('menuItems')}</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary-navy)', lineHeight: '1.5' }}>
                    {meal.mealContent || meal.message || meal.menuText}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {getNutrition(meal.mealContent || meal.message || meal.menuText).map((nutri, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'var(--card-bg)', padding: '0.75rem 1.25rem', borderRadius: '16px', border: `1px solid var(--border-color)`, boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ color: nutri.color }}>{nutri.icon}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{nutri.label}: <span style={{ color: nutri.color }}>{nutri.value}</span></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-image-container" style={{ margin: 0, height: '100%', borderRadius: 0 }}>
                <img 
                  src={meal.imageUrl || 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=800&q=80'} 
                  alt="Meal" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=800&q=80'; }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MealFeed;
