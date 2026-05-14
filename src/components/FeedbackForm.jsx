import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle, Clock, Info } from 'lucide-react';
import { database } from '../firebase';
import { ref, push, onValue, set } from 'firebase/database';
import { useLanguage } from '../context/LanguageContext';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({ name: '', feedback: '', category: 'General' });
  const [feedbackList, setFeedbackList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const { t } = useLanguage();

  useEffect(() => {
    const feedbackRef = ref(database, 'feedback');
    const unsubscribe = onValue(feedbackRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp);
        setFeedbackList(list);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.feedback) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const feedbackRef = ref(database, 'feedback');
      await push(feedbackRef, {
        ...formData,
        status: 'Pending',
        timestamp: Date.now()
      });
      setFormData({ name: '', feedback: '', category: 'General' });
      alert("Feedback sent successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to send feedback.");
    }
    setIsSubmitting(false);
  };

  const formatDate = (ms) => {
    return new Date(ms).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  const filteredFeedback = feedbackList.filter(item => {
    if (activeFilter === 'All') return true;
    return item.status === activeFilter;
  });

  return (
    <section className="animate-slide-up" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <div className="feature-badge" style={{ margin: '0 auto 1.5rem' }}>
          <MessageSquare size={16} /> PARENT COMMUNICATION
        </div>
        <h2 style={{ marginBottom: '1rem', justifyContent: 'center' }}>
          {t('feedbackTitle') || 'Direct Feedback Portal'}
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto' }}>
          Share your thoughts, suggestions, or concerns directly with the school administration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 450px), 1fr))', gap: '4rem', alignItems: 'start' }}>
        {/* Feedback Form */}
        <div className="card">
          <h3 style={{ marginBottom: '2rem' }}>Send Message</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>PARENT NAME</label>
              <input 
                className="input-field"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>CATEGORY</label>
              <select 
                className="input-field"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="General">General Inquiry</option>
                <option value="Academics">Academics</option>
                <option value="Facilities">Facilities</option>
                <option value="Meals">Meal Program</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>MESSAGE</label>
              <textarea 
                className="input-field"
                placeholder="How can we help you?"
                rows={5}
                style={{ resize: 'none' }}
                value={formData.feedback}
                onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '1.25rem' }}>
              {isSubmitting ? 'Sending...' : <><Send size={18} /> Send Feedback</>}
            </button>
          </form>
        </div>

        {/* Feedback History */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0 }}>Message History</h3>
            <div className="glass" style={{ display: 'flex', gap: '0.25rem', padding: '0.3rem', borderRadius: 'var(--radius-full)' }}>
               {['All', 'Pending', 'Resolved'].map(s => (
                 <button 
                  key={s} 
                  onClick={() => setActiveFilter(s)}
                  style={{ 
                    padding: '0.4rem 0.75rem', 
                    borderRadius: 'var(--radius-full)', 
                    border: 'none', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: activeFilter === s ? 'var(--text-primary)' : 'transparent',
                    color: activeFilter === s ? 'var(--bg-color)' : 'var(--text-secondary)'
                  }}
                 >{s}</button>
               ))}
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2rem', 
            maxHeight: '700px', 
            overflowY: 'auto', 
            padding: '1.5rem', 
            background: 'var(--blue-light)', 
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--govt-border)'
          }}>
            {filteredFeedback.length === 0 ? (
              <div className="card text-center" style={{ padding: '3rem', background: 'transparent', boxShadow: 'none', border: 'none' }}>
                <Info size={40} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                <p style={{ opacity: 0.6 }}>No messages found.</p>
              </div>
            ) : (
              filteredFeedback.map(item => (
                <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  {/* Parent Message Bubble (Aligned Right) */}
                  <div style={{ alignSelf: 'flex-end', maxWidth: '90%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '0.25rem', marginRight: '0.5rem' }}>
                      {item.name} • {item.category}
                    </div>
                    <div style={{ 
                      background: '#1E293B', // Solid dark slate for parent bubble 
                      color: 'white', 
                      padding: '1.25rem 1.5rem', 
                      borderRadius: '24px 24px 4px 24px', 
                      boxShadow: 'var(--shadow-md)',
                      position: 'relative',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: 'white' }}>{item.feedback}</p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center', marginTop: '0.75rem', fontSize: '0.7rem', opacity: 0.8 }}>
                         {formatDate(item.timestamp)}
                         {item.status?.toLowerCase() === 'resolved' ? <CheckCircle size={14} color="#10B981" /> : <Clock size={14} />}
                      </div>
                    </div>
                  </div>

                  {/* Admin Reply Bubble (Aligned Left) */}
                  {item.adminReply && (
                    <div style={{ alignSelf: 'flex-start', maxWidth: '90%', display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <div style={{ 
                        width: '36px', 
                        height: '36px', 
                        borderRadius: '50%', 
                        background: 'var(--blue)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white', 
                        flexShrink: 0,
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <MessageSquare size={18} />
                      </div>
                      <div style={{ 
                        background: 'var(--card-bg, #ffffff)', 
                        border: '1px solid var(--govt-border)',
                        padding: '1.25rem 1.5rem', 
                        borderRadius: '4px 24px 24px 24px', 
                        boxShadow: 'var(--shadow-md)'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--blue)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>SCHOOL ADMINISTRATION</div>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--navy)' }}>{item.adminReply}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackForm;
