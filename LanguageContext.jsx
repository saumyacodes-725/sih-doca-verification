import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const TRANSLATIONS = {
  // Brand & Gov Header
  'Government of India': 'भारत सरकार',
  'भारत सरकार | Government of India': 'भारत सरकार | Government of India',
  'Legal Metrology Act, 2009': 'विधिक मापविज्ञान अधिनियम, 2009',
  'Directorate of Legal Metrology': 'विधिक मापविज्ञान निदेशालय',
  'National Consumer Helpline: 1915': 'राष्ट्रीय उपभोक्ता हेल्पलाइन: 1915',
  'Ministry of Consumer Affairs, Food & Public Distribution': 'उपभोक्ता मामले, खाद्य एवं सार्वजनिक वितरण मंत्रालय',
  'Department of Consumer Affairs (DoCA)': 'उपभोक्ता मामले विभाग (DoCA)',
  'Trust Scale': 'ट्रस्ट स्केल',
  'National Online Verification & Stamping Portal for Weighing and Measuring Instruments': 'बांट और माप उपकरणों के लिए राष्ट्रीय ऑनलाइन सत्यापन एवं मुद्रांकन पोर्टल',
  'Quick QR Scan': 'त्वरित क्यूआर स्कैन',
  'PORTAL WORKFLOW GUIDE': 'पोर्टल कार्यप्रवाह गाइड',
  'Reset Portal Data': 'पोर्टल डेटा रीसेट करें',

  // Auth Buttons & Roles
  'Login': 'लॉग इन',
  'Sign Up': 'पंजीकरण करें',
  'Officer & Admin': 'अधिकारी एवं एडमिन',
  'Logout': 'लॉग आउट',
  'Citizen': 'नागरिक',
  'Trader': 'व्यापारी',
  'LMO Officer': 'एलएमओ अधिकारी',
  'GATC Lab': 'जीएटीसी लैब',
  'Admin': 'व्यवस्थापक',
  'ROLE:': 'भूमिका:',

  // Navigation Menu
  'Home': 'मुख्य पृष्ठ',
  'Verify Certificate': 'प्रमाणपत्र सत्यापन',
  'QR Scan': 'क्यूआर स्कैन',
  'Portal Login / Role Switcher': 'पोर्टल लॉगिन / भूमिका स्विचर',
  'Public Search': 'सार्वजनिक खोज',
  'Trader Dashboard': 'व्यापारी डैशबोर्ड',
  'My Instruments': 'मेरे उपकरण',
  'Register Instrument': 'उपकरण पंजीकृत करें',
  'Verification Applications': 'सत्यापन आवेदन',
  'Apply for Verification': 'सत्यापन हेतु आवेदन',
  'Certificates & Stamping': 'प्रमाणपत्र एवं मुद्रांकन',
  'Profile & Alerts': 'प्रोफाइल एवं सूचनाएं',
  'Officer Dashboard': 'अधिकारी डैशबोर्ड',
  'Assigned Verifications': 'आवंटित सत्यापन',
  'Field Digital Checklist & Stamping': 'फील्ड डिजिटल चेकलिस्ट एवं मुद्रांकन',
  'My Inspection Roster': 'निरीक्षण रोस्टर',
  'GATC Lab Dashboard': 'जीएटीसी लैब डैशबोर्ड',
  'Metrology Test Bench': 'मापविज्ञान परीक्षण बेंच',
  'National Dashboard': 'राष्ट्रीय डैशबोर्ड',
  'Handover & Supervision': 'हस्तांतरण एवं पर्यवेक्षण',
  'Applications Desk': 'आवेदन डेस्क',
  'Instruments Registry': 'उपकरण रजिस्ट्री',
  'Stakeholders': 'हितधारक',
  'Dispatch & Schedule': 'प्रेषण एवं अनुसूची',
  'Certificates & Revocation': 'प्रमाणपत्र एवं निरस्तीकरण',
  'Analytics': 'विश्लेषण',
  'Audit Ledger': 'ऑडिट खाता',

  // Login Page & Auth
  'Commercial Trader & Stakeholder Portal': 'वाणिज्यिक व्यापारी एवं हितधारक पोर्टल',
  'Sign In to Commercial & Public Portal': 'वाणिज्यिक एवं सार्वजनिक पोर्टल में प्रवेश करें',
  'Select Access Category:': 'पहुंच श्रेणी चुनें:',
  'Trader / Commercial Business': 'व्यापारी / वाणिज्यिक व्यवसाय',
  'GATC Standards Lab': 'जीएटीसी मानक प्रयोगशाला',
  'Citizen / Consumer': 'नागरिक / उपभोक्ता',
  'Account Password:': 'खाता पासवर्ड:',
  'Security Code (Captcha):': 'सुरक्षा कोड (कैप्चा):',
  'Enter 5-digit code': '5-अंकों का कोड दर्ज करें',
  'Auto-Fill': 'स्वतः भरें',
  'Auto-Fill Captcha': 'कैप्चा स्वतः भरें',
  'Remember session on this computer': 'इस कंप्यूटर पर सत्र याद रखें',
  'Need public verification?': 'सार्वजनिक सत्यापन चाहिए?',
  'Sign In as Trader': 'व्यापारी के रूप में लॉग इन करें',
  'Sign In as GATC Standards Lab': 'जीएटीसी लैब के रूप में लॉग इन करें',
  'Sign In as Citizen': 'नागरिक के रूप में लॉग इन करें',
  'New commercial establishment or trader applicant?': 'नया वाणिज्यिक प्रतिष्ठान या व्यापारी आवेदक?',
  'Register for New Trader Account →': 'नए व्यापारी खाते हेतु पंजीकरण करें →',
  'Commercial & Public Directory (Traders, Labs & Citizens)': 'वाणिज्यिक एवं सार्वजनिक निर्देशिका (व्यापारी, लैब्स एवं नागरिक)',
  '5 Public Accounts': '5 सार्वजनिक खाते',
  'Stakeholder & Designation': 'हितधारक एवं पदनाम',
  'Category': 'श्रेणी',
  'Username': 'उपयोगकर्ता नाम',
  'Password': 'पासवर्ड',
  '1-Click Auto-Fill': '1-क्लिक स्वतः भरें',
  'Filled': 'भरा गया',
  'Fill & Test': 'भरें एवं परीक्षण करें',

  // Official Login Page
  'Enforcement & Directorate Command Portal': 'प्रवर्तन एवं निदेशालय कमान पोर्टल',
  'RESTRICTED GOVERNMENT PORTAL': 'प्रतिबंधित सरकारी पोर्टल',
  'Official Use Only': 'केवल आधिकारिक उपयोग हेतु',
  'Legal Metrology Officer (LMO)': 'विधिक मापविज्ञान अधिकारी (LMO)',
  'National Controller (Admin)': 'राष्ट्रीय नियंत्रक (व्यवस्थापक)',
  'Officer Service Authentication': 'अधिकारी सेवा प्रमाणीकरण',
  'Field Inspector Workbench & Digital Stamping Console': 'फील्ड इंस्पेक्टर कार्यक्षेत्र एवं डिजिटल मुद्रांकन कंसोल',
  'Select Officer Preset (Quick Fill):': 'अधिकारी प्रीसेट चुनें (त्वरित भरें):',
  'Officer Badge ID / Service Username': 'अधिकारी बैज आईडी / सेवा उपयोक्ता',
  'Security Password / Key': 'सुरक्षा पासवर्ड / कुंजी',
  'Sign In to Enforcement Workbench →': 'प्रवर्तन कार्यक्षेत्र में प्रवेश करें →',
  'National Directorate Authentication': 'राष्ट्रीय निदेशालय प्रमाणीकरण',
  'Controller Service ID / Email': 'नियंत्रक सेवा आईडी / ईमेल',
  'Controller Secret Master Key': 'नियंत्रक गोपनीय मास्टर कुंजी',
  'Access National Command Console': 'राष्ट्रीय कमान कंसोल पर जाएं',
  'Admin Handover & Supervisory Hub': 'व्यवस्थापक हस्तांतरण एवं पर्यवेक्षी हब',
  'Supervise / Take Over LMO Officer': 'एलएमओ अधिकारी का पर्यवेक्षण / कार्यभार लें',
  'Supervise / Audit Trader Account': 'व्यापारी खाते का पर्यवेक्षण / ऑडिट करें',
  'Supervise LMO': 'एलएमओ का पर्यवेक्षण',
  'Audit Trader': 'व्यापारी ऑडिट',
  'Open Full Admin Handover Console': 'पूर्ण व्यवस्थापक हस्तांतरण कंसोल खोलें',

  // Landing Page & Alerts
  'National Online Verification & Stamping Portal for Weights & Measures': 'बांट और माप के लिए राष्ट्रीय ऑनलाइन सत्यापन एवं मुद्रांकन पोर्टल',
  'Official Role Portals': 'आधिकारिक भूमिका पोर्टल',
  'Business Trader Portal': 'व्यावसायिक व्यापारी पोर्टल',
  'Register instruments & submit verification applications': 'उपकरण पंजीकृत करें एवं सत्यापन आवेदन जमा करें',
  'Field inspection, test recording & digital stamping': 'फील्ड निरीक्षण, परीक्षण रिकॉर्डिंग एवं डिजिटल मुद्रांकन',
  'Directorate Command & Admin': 'निदेशालय कमान एवं व्यवस्थापक',
  'Zonal monitoring, officer allocation & policy audit': 'क्षेत्रीय निगरानी, अधिकारी आवंटन एवं नीति ऑडिट',
  'Verify Scale Stamping Certificate': 'पैमाना मुद्रांकन प्रमाणपत्र सत्यापित करें',
  'Enter Certificate Number or Instrument Serial Number': 'प्रमाणपत्र संख्या या उपकरण क्रम संख्या दर्ज करें',
  'Search & Verify Certificate': 'प्रमाणपत्र खोजें एवं सत्यापित करें',
  'Report Unverified Scale': 'असत्यापित पैमाने की शिकायत करें',
  'Report Scale / Fraud': 'पैमाने / धोखाधड़ी की शिकायत दर्ज करें',
  'Live Metrology Statistics': 'प्रत्यक्ष मापविज्ञान आंकड़े',
  'Registered Instruments': 'पंजीकृत उपकरण',
  'Active Certificates': 'सक्रिय प्रमाणपत्र',
  'Inspections Completed': 'पूर्ण किए गए निरीक्षण',
  'GATC Test Centers': 'जीएटीसी परीक्षण केंद्र',
  'Statutory Consumer Notice': 'सांविधिक उपभोक्ता सूचना',
  'Every commercial weighing instrument in India must possess a valid verification certificate under Section 24 of the Legal Metrology Act, 2009.': 'विधिक मापविज्ञान अधिनियम, 2009 की धारा 24 के तहत भारत में प्रत्येक वाणिज्यिक तौल उपकरण के पास एक वैध सत्यापन प्रमाणपत्र होना अनिवार्य है।'
};

const nodeOriginalMap = new WeakMap();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('emaap_portal_language') || 'EN';
  });

  const switchLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('emaap_portal_language', newLang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'EN' ? 'HI' : 'EN';
    switchLanguage(nextLang);
  };

  const t = (text) => {
    if (!text || language === 'EN') return text;
    return TRANSLATIONS[text] || text;
  };

  // Automated DOM text-node translation for high fidelity across arbitrary text
  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();

    const phrases = Object.entries(TRANSLATIONS).sort(
      (a, b) => b[0].length - a[0].length
    );

    const translateNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!nodeOriginalMap.has(node)) {
          nodeOriginalMap.set(node, node.nodeValue);
        }

        const original = nodeOriginalMap.get(node);

        if (language === 'HI') {
          const trimmed = original.trim();
          if (trimmed && TRANSLATIONS[trimmed]) {
            node.nodeValue = original.replace(trimmed, TRANSLATIONS[trimmed]);
          } else if (trimmed && trimmed.length > 2) {
            let replaced = original;
            for (const [en, hi] of phrases) {
              if (replaced.includes(en)) {
                replaced = replaced.split(en).join(hi);
              }
            }
            node.nodeValue = replaced;
          }
        } else {
          // Restore English
          node.nodeValue = original;
        }
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.tagName !== 'SCRIPT' &&
        node.tagName !== 'STYLE' &&
        node.tagName !== 'INPUT' &&
        node.tagName !== 'TEXTAREA' &&
        node.tagName !== 'CODE' &&
        !node.classList?.contains('no-translate')
      ) {
        Array.from(node.childNodes).forEach(translateNode);
      }
    };

    translateNode(document.body);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(translateNode);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, switchLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
