import React, { createContext, useContext, useState, useEffect } from 'react';

const dictionary = {
  en: {
    siteTitle: "Shale-Namma Pride",
    heroBadge: "✨ Welcome to the Official Parents Portal",
    heroTitle: "Transparency and Excellence in Education.",
    heroSubtitle: "Stay seamlessly connected with real-time updates directly from the administration. Experience a new standard of trust.",
    viewUpdates: "View Updates",
    parentsPortal: "Parents Portal",
    adminOnline: "Admin Online",
    adminOffline: "Admin Offline",
    adminTyping: "Administration is typing a response...",
    liveSyncText: "LIVE SYNC",
    liveSyncActive: "Live Sync Active",
    attachImage: "Attach Image",
    midDayMeals: "Mid-Day Meals",
    noMealsTitle: "No meals posted yet",
    noMealsDesc: "Check back later for today's menu update.",
    postedToday: "Posted Today",
    syncingKitchen: "Syncing with school kitchen...",
    campusInfrastructure: "Campus Infrastructure",
    noFacilitiesTitle: "No facilities available",
    noFacilitiesDesc: "We are updating our gallery. Please check back later.",
    loadingGallery: "Loading facilities gallery...",
    studentExcellence: "Student Excellence",
    noStarsTitle: "No student stars posted yet",
    noStarsDesc: "We look forward to celebrating our students' achievements here.",
    loadingAchievements: "Loading achievements...",
    communityVoice: "Community Voice",
    shareThoughtsTitle: "Share Your Thoughts",
    shareThoughtsDesc: "We value your input. Direct communication with the administration helps us improve every day.",
    nameLabel: "Your Name (Optional)",
    namePlaceholder: "e.g. Priya (Class 5 Parent)",
    anonymousLabel: "Keep this feedback anonymous",
    messageLabel: "Your Message",
    messagePlaceholder: "Share your ideas, concerns, or suggestions...",
    submitBtn: "Submit to Administration",
    submittingBtn: "Sending securely...",
    recentConversations: "Recent Conversations",
    resolved: "Resolved",
    pending: "Pending Review",
    officialResponse: "Official Response",
    noFeedback: "Be the first to share your thoughts.",
    footerText: "Fostering transparency and excellence in education. A direct connection between our school and your home.",
    allRightsReserved: "All rights reserved.",
    toggleLang: "Switch to Kannada"
  },
  kn: {
    siteTitle: "ಶಾಲೆ-ನಮ್ಮ ಹೆಮ್ಮೆ",
    heroBadge: "✨ ಅಧಿಕೃತ ಪೋಷಕರ ಪೋರ್ಟಲ್‌ಗೆ ಸ್ವಾಗತ",
    heroTitle: "ಶಿಕ್ಷಣದಲ್ಲಿ ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಶ್ರೇಷ್ಠತೆ.",
    heroSubtitle: "ಆಡಳಿತದಿಂದ ನೇರವಾಗಿ ನೈಜ-ಸಮಯದ ನವೀಕರಣಗಳೊಂದಿಗೆ ಮನಬಂದಂತೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ. ನಂಬಿಕೆಯ ಹೊಸ ಗುಣಮಟ್ಟವನ್ನು ಅನುಭವಿಸಿ.",
    viewUpdates: "ನವೀಕರಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    parentsPortal: "ಪೋಷಕರ ಪೋರ್ಟಲ್",
    adminOnline: "ಆಡಳಿತ ಆನ್‌ಲೈನ್",
    adminOffline: "ಆಡಳಿತ ಆಫ್‌ಲೈನ್",
    adminTyping: "ಆಡಳಿತವು ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಟೈಪ್ ಮಾಡುತ್ತಿದೆ...",
    liveSyncText: "ಲೈವ್ ಸಿಂಕ್",
    liveSyncActive: "ಲೈವ್ ಸಿಂಕ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    attachImage: "ಚಿತ್ರವನ್ನು ಲಗತ್ತಿಸಿ",
    midDayMeals: "ಮಧ್ಯಾಹ್ನದ ಬಿಸಿಯೂಟ",
    noMealsTitle: "ಇನ್ನೂ ಯಾವುದೇ ಊಟವನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿಲ್ಲ",
    noMealsDesc: "ಇಂದಿನ ಮೆನು ನವೀಕರಣಕ್ಕಾಗಿ ನಂತರ ಪರಿಶೀಲಿಸಿ.",
    postedToday: "ಇಂದು ಪೋಸ್ಟ್ ಮಾಡಲಾಗಿದೆ",
    syncingKitchen: "ಶಾಲೆಯ ಅಡುಗೆಮನೆಯೊಂದಿಗೆ ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...",
    campusInfrastructure: "ಕ್ಯಾಂಪಸ್ ಮೂಲಸೌಕರ್ಯ",
    noFacilitiesTitle: "ಯಾವುದೇ ಸೌಲಭ್ಯಗಳು ಲಭ್ಯವಿಲ್ಲ",
    noFacilitiesDesc: "ನಾವು ನಮ್ಮ ಗ್ಯಾಲರಿಯನ್ನು ನವೀಕರಿಸುತ್ತಿದ್ದೇವೆ. ದಯವಿಟ್ಟು ನಂತರ ಪರಿಶೀಲಿಸಿ.",
    loadingGallery: "ಗ್ಯಾಲರಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    studentExcellence: "ವಿದ್ಯಾರ್ಥಿ ಶ್ರೇಷ್ಠತೆ",
    noStarsTitle: "ಇನ್ನೂ ಯಾವುದೇ ವಿದ್ಯಾರ್ಥಿ ಸಾಧನೆಗಳನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿಲ್ಲ",
    noStarsDesc: "ನಮ್ಮ ವಿದ್ಯಾರ್ಥಿಗಳ ಸಾಧನೆಗಳನ್ನು ಇಲ್ಲಿ ಆಚರಿಸಲು ನಾವು ಎದುರು ನೋಡುತ್ತಿದ್ದೇವೆ.",
    loadingAchievements: "ಸಾಧನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    communityVoice: "ಸಮುದಾಯದ ಧ್ವನಿ",
    shareThoughtsTitle: "ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ",
    shareThoughtsDesc: "ನಿಮ್ಮ ಅಭಿಪ್ರಾಯವನ್ನು ನಾವು ಗೌರವಿಸುತ್ತೇವೆ. ಆಡಳಿತದೊಂದಿಗೆ ನೇರ ಸಂವಹನವು ಪ್ರತಿದಿನ ನಮ್ಮನ್ನು ಸುಧಾರಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
    nameLabel: "ನಿಮ್ಮ ಹೆಸರು (ಐಚ್ಛಿಕ)",
    namePlaceholder: "ಉದಾ. ಪ್ರಿಯಾ (೫ನೇ ತರಗತಿ ಪೋಷಕರು)",
    anonymousLabel: "ಈ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಅನಾಮಧೇಯವಾಗಿರಿಸಿ",
    messageLabel: "ನಿಮ್ಮ ಸಂದೇಶ",
    messagePlaceholder: "ನಿಮ್ಮ ಆಲೋಚನೆಗಳು, ಕಾಳಜಿಗಳು ಅಥವಾ ಸಲಹೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...",
    submitBtn: "ಆಡಳಿತಕ್ಕೆ ಸಲ್ಲಿಸಿ",
    submittingBtn: "ಸುರಕ್ಷಿತವಾಗಿ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...",
    recentConversations: "ಇತ್ತೀಚಿನ ಸಂಭಾಷಣೆಗಳು",
    resolved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
    pending: "ಪರಿಶೀಲನೆ ಬಾಕಿಯಿದೆ",
    officialResponse: "ಅಧಿಕೃತ ಪ್ರತಿಕ್ರಿಯೆ",
    noFeedback: "ನಿಮ್ಮ ಆಲೋಚನೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುವಲ್ಲಿ ಮೊದಲಿಗರಾಗಿರಿ.",
    footerText: "ಶಿಕ್ಷಣದಲ್ಲಿ ಪಾರದರ್ಶಕತೆ ಮತ್ತು ಶ್ರೇಷ್ಠತೆಯನ್ನು ಬೆಳೆಸುವುದು. ನಮ್ಮ ಶಾಲೆ ಮತ್ತು ನಿಮ್ಮ ಮನೆಯ ನಡುವೆ ನೇರ ಸಂಪರ್ಕ.",
    allRightsReserved: "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    toggleLang: "Switch to English"
  }
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('appLang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLang', lang);
    if (lang === 'kn') {
      document.documentElement.lang = 'kn';
    } else {
      document.documentElement.lang = 'en';
    }
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'kn' : 'en');
  };

  const t = (key) => dictionary[lang][key] || dictionary['en'][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
