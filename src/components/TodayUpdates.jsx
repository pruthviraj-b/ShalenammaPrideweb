import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Utensils, Bell, Trophy, Building2, Calendar, ArrowRight, CheckCircle2, Star, AlertCircle, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const TodayUpdates = ({ setActiveTab }) => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const paths = ['meals', 'announcements', 'stars', 'infrastructure'];
    const today = new Date().setHours(0, 0, 0, 0);

    const fetchAll = async () => {
      try {
        const promises = paths.map(path => {
          const dbRef = ref(database, path);
          // We use onValue but only once for the initial load to be safe, 
          // or get() if preferred. Let's use get() for a clean async flow.
          return new Promise((resolve) => {
            onValue(dbRef, (snapshot) => {
              const data = snapshot.exists() ? snapshot.val() : {};
              const items = Object.keys(data).map(key => ({
                id: key,
                category: path,
                ...data[key]
              })).filter(item => 
                item.timestamp && new Date(item.timestamp).setHours(0, 0, 0, 0) === today
              );
              resolve(items);
            }, { onlyOnce: true });
          });
        });

        const results = await Promise.all(promises);
        const combined = results.flat().sort((a, b) => b.timestamp - a.timestamp);
        
        setUpdates(combined);
      } catch (error) {
        console.error("Error fetching today's updates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading || updates.length === 0) return null;

  return (
    <div className="container" style={{ marginTop: '4rem' }}>
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
        <div className="section-badge" style={{ background: 'var(--success)', color: 'white', border: 'none' }}>
          <Star size={14} /> {t('postedToday') || "TODAY'S LIVE UPDATES"}
        </div>
        <h2 className="section-title">Fresh Highlights</h2>
        <p>Everything shared by the school administration today.</p>
      </div>

      <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))' }}>
        {updates.map(update => (
          <div key={update.id} className="card animate-slide-up" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '1.5rem', padding: '2rem' }}>
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '16px', 
                background: getCategoryColor(update.category) + '15', 
                color: getCategoryColor(update.category),
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {getCategoryIcon(update.category)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: getCategoryColor(update.category), textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {update.category.replace('announcements', 'Notice')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-text)', fontWeight: '600' }}>
                    {new Date(update.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{update.title || update.studentName || (update.category === 'meals' ? 'Today\'s Menu' : 'Update')}</h3>
                <p className="line-clamp-2" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  {update.body || update.mealContent || update.achievementTitle || update.description}
                </p>
                {update.imageUrl && (
                  <div className="card-image-container" style={{ margin: 0, height: '200px' }}>
                    <img 
                      src={update.imageUrl} 
                      alt="Update" 
                      onError={(e) => {
                        e.target.onerror = null;
                        const fallbacks = {
                          'meals': 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=800&q=80',
                          'stars': `https://ui-avatars.com/api/?name=${encodeURIComponent(update.studentName || 'Student')}&background=random&color=fff&size=128`,
                          'announcements': 'https://images.unsplash.com/photo-1504150559433-c516936e89cd?w=800&q=80',
                          'infrastructure': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80'
                        };
                        e.target.src = fallbacks[update.category] || fallbacks['announcements'];
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div style={{ 
              padding: '1rem 2rem', background: 'var(--primary-bg)', 
              borderTop: '1px solid var(--border-color)', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
            }}>
               <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--muted-text)' }}>
                 Verified by Admin
               </span>
               <div 
                 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: getCategoryColor(update.category), fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                 onClick={() => {
                   const tabMap = {
                     'meals': 'Meals',
                     'announcements': 'Notices',
                     'stars': 'Student Stars',
                     'infrastructure': 'Infrastructure'
                   };
                   setActiveTab(tabMap[update.category]);
                 }}
               >
                 VIEW FULL DETAILS <ArrowRight size={14} />
               </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: '1px', background: 'var(--border-color)', margin: '4rem 0' }} />
    </div>
  );
};

const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'meals': return <Utensils size={28} />;
    case 'announcements': return <Bell size={28} />;
    case 'stars': return <Trophy size={28} />;
    case 'infrastructure': return <Building2 size={28} />;
    default: return <Info size={28} />;
  }
};

const getCategoryColor = (cat) => {
  switch (cat) {
    case 'meals': return '#F59E0B';
    case 'announcements': return '#EF4444';
    case 'stars': return '#3B82F6';
    case 'infrastructure': return '#10B981';
    default: return '#D4AF37';
  }
};

export default TodayUpdates;
