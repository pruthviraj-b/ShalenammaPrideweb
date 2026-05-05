import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Lightbox = () => {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    const handleOpen = (e) => setImgUrl(e.detail);
    window.addEventListener('show-lightbox', handleOpen);
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') setImgUrl(null);
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('show-lightbox', handleOpen);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  if (!imgUrl) return null;

  return (
    <div className="lightbox-overlay" onClick={() => setImgUrl(null)}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={() => setImgUrl(null)}>
          <X size={20} />
        </button>
        <img src={imgUrl} alt="Expanded view" className="lightbox-image" />
      </div>
    </div>
  );
};

export default Lightbox;
