import React, { useEffect, useState, useRef } from 'react';
import { ref, push, set, onValue } from 'firebase/database';
import { database } from '../firebase';
import { MessageSquare, CheckCircle, Clock, Send, School, ImagePlus, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FeedbackForm = () => {
  const { t } = useLanguage();
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const feedbackRef = ref(database, 'feedback');
    const unsubscribe = onValue(feedbackRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const feedbackList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        setFeedbacks(feedbackList);
      } else {
        setFeedbacks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image using canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > 800) {
            height = Math.round((height * 800) / width);
            width = 800;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as compressed jpeg
          setAttachedImage(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      const feedbackRef = ref(database, 'feedback');
      const newFeedbackRef = push(feedbackRef);
      await set(newFeedbackRef, {
        name: anonymous ? 'Anonymous' : (name.trim() || 'Anonymous'),
        message: message.trim(),
        anonymous,
        resolved: false,
        timestamp: Date.now(),
        image: attachedImage || null
      });
      
      setName('');
      setMessage('');
      setAnonymous(false);
      setAttachedImage(null);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Feedback Sent Securely' }));
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: 'Failed to submit. Check config.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container mt-16 mb-16 animate-slide-up delay-400">
      <div className="flex items-center gap-3 mb-8">
        <div className="premium-icon-wrapper">
          <MessageSquare size={24} />
        </div>
        <h2 style={{ marginBottom: 0 }}>{t('communityVoice')}</h2>
      </div>

      <div className="grid grid-cols-2 gap-8" style={{ alignItems: 'start' }}>
        {/* Form Column */}
        <div className="card">
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('shareThoughtsTitle')}</h3>
            <p style={{ fontSize: '0.95rem' }}>{t('shareThoughtsDesc')}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.95rem' }}>{t('nameLabel')}</label>
              <input
                type="text"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                disabled={anonymous}
                style={{ opacity: anonymous ? 0.6 : 1 }}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}>
                <div style={{ position: 'relative', width: '20px', height: '20px' }}>
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    style={{ width: '100%', height: '100%', cursor: 'pointer', accentColor: 'var(--accent-color)' }}
                  />
                </div>
                {t('anonymousLabel')}
              </label>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '600', fontSize: '0.95rem' }}>{t('messageLabel')}</label>
              <textarea
                className="input-field"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('messagePlaceholder')}
                required
                rows="5"
                style={{ resize: 'vertical' }}
              />
            </div>

            {attachedImage && (
              <div style={{ marginBottom: '1.5rem', position: 'relative', display: 'inline-block' }}>
                <img src={attachedImage} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
                <button 
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--danger-color, #ef4444)', color: 'white', borderRadius: '50%', padding: '0.2rem', border: 'none', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleImageSelect} 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current.click()} 
                className="btn" 
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', flexShrink: 0 }}
                disabled={isSubmitting}
                title={t('attachImage')}
              >
                <ImagePlus size={18} />
              </button>
              <button type="submit" className="btn" style={{ flex: 1 }} disabled={isSubmitting}>
                {isSubmitting ? t('submittingBtn') : (
                  <>
                    {t('submitBtn')} <Send size={18} style={{ marginLeft: '0.5rem' }} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* History Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', paddingLeft: '0.5rem' }}>{t('recentConversations')}</h3>
          
          {feedbacks.length > 0 ? (
            feedbacks.map((fb) => (
              <div key={fb.id} className="card" style={{ padding: '1.5rem', borderLeft: fb.resolved ? '4px solid #10B981' : '4px solid #F59E0B' }}>
                <div className="flex justify-between items-start mb-3">
                  <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{fb.name}</span>
                  {fb.resolved ? (
                    <span className="premium-badge" style={{ color: '#10B981' }}>
                      <CheckCircle size={14} /> {t('resolved')}
                    </span>
                  ) : (
                    <span className="premium-badge" style={{ color: '#F59E0B' }}>
                      <Clock size={14} /> {t('pending')}
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1.25rem', fontSize: '1.05rem', lineHeight: '1.6' }}>"{fb.message}"</p>
                {fb.image && (
                  <img 
                    src={fb.image} 
                    alt="Feedback Attachment" 
                    className="gallery-image"
                    style={{ maxWidth: '200px', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', cursor: 'pointer', border: '1px solid var(--border-color)' }}
                    onClick={() => {
                      const event = new CustomEvent('open-lightbox', { detail: { src: fb.image, alt: 'Feedback Attachment' } });
                      window.dispatchEvent(event);
                    }}
                  />
                )}
                {fb.adminReply && (
                  <div style={{ 
                    backgroundColor: 'rgba(37, 99, 235, 0.1)', 
                    padding: '1.25rem', 
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--accent-color)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-color)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <School size={14} /> {t('officialResponse')}
                    </div>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>{fb.adminReply}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="card empty-card text-center" style={{ padding: '4rem' }}>
              <div className="premium-icon-wrapper" style={{ margin: '0 auto 1rem' }}>
                <MessageSquare size={24} />
              </div>
              <p>{t('noFeedback')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
export default FeedbackForm;
