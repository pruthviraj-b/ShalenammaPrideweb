import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Bell, AlertCircle, Info, Calendar as CalendarIcon, Search, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AnnouncementsFeed = ({ limit, excludeToday }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const { t, lang } = useLanguage();

  useEffect(() => {
    const noticeRef = ref(database, 'announcements');
    const unsubscribe = onValue(noticeRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let noticeList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);

        if (excludeToday) {
          const today = new Date().setHours(0, 0, 0, 0);
          noticeList = noticeList.filter(n => new Date(n.timestamp).setHours(0, 0, 0, 0) !== today);
        }

        if (limit) {
          noticeList = noticeList.slice(0, limit);
        }

        setAnnouncements(noticeList);
      } else {
        setAnnouncements([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (ms) => {
    return new Date(ms).toLocaleDateString(lang === 'kn' ? 'kn-IN' : 'en-US', {
      weekday: 'short', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'Urgent': return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <AlertCircle size={20} />, label: 'Action Required' };
      case 'Important': return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: <Bell size={20} />, label: 'Important' };
      case 'Info': return { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', icon: <Info size={20} />, label: 'Information' };
      default: return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: <Bell size={20} />, label: 'General' };
    }
  };

  const filteredNotices = announcements.filter(notice => {
    const matchesSearch = (notice.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (notice.body && notice.body.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'All' || notice.priority === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="animate-slide-up" style={{ padding: (limit || excludeToday) ? '0 0 4rem 0' : '4rem 0' }}>
      {!(limit || excludeToday) && (
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="feature-badge" style={{ margin: '0 auto 1.5rem' }}>
            <Bell size={16} /> OFFICIAL BROADCAST
          </div>
          <h2 style={{ marginBottom: '1rem', justifyContent: 'center' }}>
            {t('noticeTitle') || 'Circulars & Notices'}
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            {t('noticeSubtitle') || 'Stay informed with real-time updates and official communications from the school.'}
          </p>
        </div>
      )}

      {/* Search & Filter Bar (Hidden when limit/excludeToday is set) */}
      {!(limit || excludeToday) && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 'min(100%, 300px)', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={18} />
            <input 
              type="text" 
              placeholder={t('searchCirculars') || "Search circulars..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field" 
              style={{ paddingLeft: '3.5rem' }}
            />
          </div>
          <div className="glass" style={{ display: 'flex', gap: '0.25rem', padding: '0.4rem', borderRadius: 'var(--radius-full)' }}>
            {['All', 'Urgent', 'Important', 'Info'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: 'var(--radius-full)', 
                  border: 'none', 
                  fontSize: '0.8rem', 
                  fontWeight: '700',
                  cursor: 'pointer',
                  background: filter === f ? 'var(--text-primary)' : 'transparent',
                  color: filter === f ? 'var(--bg-color)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {t(`filter${f}`) || f}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[1].map(i => (
            <div key={i} className="card shimmer" style={{ height: '200px', borderRadius: '24px' }} />
          ))}
        </div>
      ) : filteredNotices.length === 0 ? (
        (excludeToday || limit) ? null : (
          <div className="card text-center" style={{ padding: '6rem 2rem', background: 'var(--primary-bg)', borderRadius: '24px' }}>
            <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: 'var(--shadow-md)' }}>
              <Bell size={40} color="var(--govt-blue)" />
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{t('noNoticesYet')}</h3>
            <p style={{ maxWidth: '400px', margin: '0 auto', fontSize: '1.1rem' }}>{t('noNoticesDesc')}</p>
          </div>
        )
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {filteredNotices.map((notice) => {
            const config = getPriorityConfig(notice.priority);
            const isUrgent = notice.priority === 'Urgent';
            
            return (
              <div 
                key={notice.id} 
                className="card" 
                style={{ 
                  padding: '2.5rem', 
                  borderLeft: isUrgent ? `8px solid ${config.color}` : '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ background: config.bg, color: config.color, width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {config.icon}
                    </div>
                    <div>
                      <div style={{ color: config.color, fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                        {config.label}
                      </div>
                      <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{notice.title}</h3>
                    </div>
                  </div>
                  {notice.category && (
                    <div className="feature-badge">{notice.category}</div>
                  )}
                </div>
                
                {notice.body && (
                  <p style={{ marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
                    {notice.body}
                  </p>
                )}

                {notice.imageUrl && (
                  <div className="card-image-container" style={{ maxHeight: '400px', cursor: 'zoom-in' }} onClick={() => window.dispatchEvent(new CustomEvent('show-lightbox', { detail: notice.imageUrl }))}>
                    <img 
                      src={notice.imageUrl} 
                      alt="Attachment" 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504150559433-c516936e89cd?w=800&q=80'; }}
                    />
                  </div>
                )}

                {notice.documentUrl && (
                  <a href={notice.documentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ marginBottom: '2rem', width: 'fit-content' }}>
                    📄 View Document <ArrowUpRight size={18} />
                  </a>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CalendarIcon size={16} />
                    {formatDate(notice.timestamp)}
                  </div>
                  <div>By {notice.author || 'Administration'}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AnnouncementsFeed;
