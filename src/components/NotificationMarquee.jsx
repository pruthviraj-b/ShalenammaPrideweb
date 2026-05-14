import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, query, orderByChild } from 'firebase/database';
import { AlertCircle, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const NotificationMarquee = () => {
  const [notices, setNotices] = useState([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    const announcementsRef = query(ref(database, 'announcements'), orderByChild('timestamp'));
    const unsubscribe = onValue(announcementsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const now = Date.now();
        
        const allAnnouncements = Object.keys(data)
          .map(key => ({ id: key, ...data[key] }))
          .sort((a, b) => b.timestamp - a.timestamp);

        let urgent = allAnnouncements.filter(item => (item.priority === 'urgent' || item.priority === 'Urgent') && (now - item.timestamp) < 24 * 60 * 60 * 1000);
        
        if (urgent.length > 0) {
          setNotices(urgent);
          setIsUrgent(true);
        } else {
          const latest = allAnnouncements.slice(0, 3);
          setNotices(latest);
          setIsUrgent(false);
        }
      } else {
        setNotices([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const displayNotices = notices.length > 0 ? notices : [
    { id: 'default1', title: 'Welcome to Shale-Namma Pride Portal', body: 'Stay updated with real-time school announcements.', timestamp: 1715320000000 } // Static timestamp for default notice
  ];

  const now = Date.now();

  const formatTime = (ms) => {
    if (!ms) return '';
    const diff = now - ms;
    if (diff < 60000) return lang === 'kn' ? 'ಈಗಷ್ಟೆ' : 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + (lang === 'kn' ? ' ನಿಮಿಷಗಳ ಹಿಂದೆ' : 'm ago');
    if (diff < 86400000) return Math.floor(diff / 3600000) + (lang === 'kn' ? ' ಗಂಟೆಗಳ ಹಿಂದೆ' : 'h ago');
    return new Date(ms).toLocaleDateString();
  };

  return (
    <div className="ticker-bar">
      <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="ticker-badge" style={{ background: isUrgent ? 'var(--danger)' : 'var(--govt-blue)', color: isUrgent ? '#FFFFFF' : '#000000' }}>
          {isUrgent ? <AlertCircle size={14} /> : <Info size={14} />} 
          {isUrgent ? 'URGENT' : 'LATEST'}
        </div>
        <div className="marquee-container" style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div 
            style={{ 
              display: 'inline-block', 
              animation: 'scroll-marquee 30s linear infinite',
              willChange: 'transform'
            }}
          >
            {displayNotices.map((notice, i) => (
              <span key={notice.id} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginRight: '4rem', fontSize: '0.85rem' }}>
                <span style={{ opacity: 0.6, fontSize: '0.75rem', fontWeight: '500' }}>{formatTime(notice.timestamp)}</span>
                <span style={{ fontWeight: 500, color: 'var(--navy)' }}>• {notice.title}{notice.body ? ` - ${notice.body.replace(/\n/g, ' ')}` : ''}</span>
              </span>
            ))}
            {/* Duplicated for seamless infinite scrolling */}
            {displayNotices.map((notice, i) => (
              <span key={notice.id + '-dup'} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginRight: '4rem', fontSize: '0.85rem' }}>
                <span style={{ opacity: 0.6, fontSize: '0.75rem', fontWeight: '500' }}>{formatTime(notice.timestamp)}</span>
                <span style={{ fontWeight: 500, color: 'var(--navy)' }}>• {notice.title}{notice.body ? ` - ${notice.body.replace(/\n/g, ' ')}` : ''}</span>
              </span>
            ))}
          </div>
          <style>
            {`
              @keyframes scroll-marquee {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-50%, 0, 0); }
              }
              .ticker-bar:hover .marquee-container > div {
                animation-play-state: paused;
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

export default NotificationMarquee;
