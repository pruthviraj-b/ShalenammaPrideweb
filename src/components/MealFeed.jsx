import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { Utensils, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MealFeed = () => {
  const { t } = useLanguage();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mealsRef = ref(database, 'meals');
    const unsubscribe = onValue(mealsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const mealsList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        setMeals(mealsList);
      } else {
        setMeals([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="meals" className="container mt-16 animate-slide-up delay-200">
      <div className="flex items-center gap-3 mb-8">
        <div className="premium-icon-wrapper">
          <Utensils size={24} />
        </div>
        <h2 style={{ marginBottom: 0 }}>{t('midDayMeals')}</h2>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card">
              <div className="skeleton skeleton-image"></div>
              <div className="skeleton skeleton-badge"></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-text"></div>
            </div>
          ))}
        </div>
      ) : meals.length > 0 ? (
        <div className="grid grid-cols-3">
          {meals.map((meal) => (
            <div key={meal.id} className="card">
              {meal.imageUrl ? (
                <div className="card-image-wrapper">
                  <img 
                    src={meal.imageUrl} 
                    alt={meal.menuText} 
                    className="card-image cursor-zoom-in" 
                    onClick={() => window.dispatchEvent(new CustomEvent('show-lightbox', { detail: meal.imageUrl }))}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge resolved" style={{ backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: 'var(--text-primary)' }}>
                      {t('postedToday')}
                    </span>
                  </div>
                </div>
              ) : null}
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{meal.menuText}</h3>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Calendar size={16} />
                <span>{meal.date}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-card text-center" style={{ padding: '4rem' }}>
          <div className="premium-icon-wrapper" style={{ margin: '0 auto 1rem' }}>
            <Utensils size={24} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>{t('noMealsTitle')}</h3>
          <p>{t('noMealsDesc')}</p>
        </div>
      )}
    </section>
  );
};

export default MealFeed;
