import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const SUPPORTED_LANGUAGES = [
  {
    code: 'EN',
    label: 'English',
    nativeLabel: 'English',
    toastMsg: 'Language changed to English'
  },
  {
    code: 'HI',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    toastMsg: 'भाषा को हिन्दी में बदला गया (Language switched to Hindi)'
  },
  {
    code: 'TA',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
    toastMsg: 'மொழி தமிழாக மாற்றப்பட்டது (Language switched to Tamil)'
  },
  {
    code: 'MR',
    label: 'Marathi',
    nativeLabel: 'मराठी',
    toastMsg: 'भाषा मराठीत बदलली (Language switched to Marathi)'
  }
];

const HINDI_TRANSLATIONS = {
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

const TAMIL_TRANSLATIONS = {
  // Brand & Gov Header
  'Government of India': 'இந்திய அரசு',
  'भारत सरकार | Government of India': 'இந்திய அரசு | Government of India',
  'Legal Metrology Act, 2009': 'சட்டமுறை அளவியல் சட்டம், 2009',
  'Directorate of Legal Metrology': 'சட்டமுறை அளவியல் இயக்ககம்',
  'National Consumer Helpline: 1915': 'தேசிய நுகர்வோர் உதவி எண்: 1915',
  'Ministry of Consumer Affairs, Food & Public Distribution': 'நுகர்வோர் விவகாரங்கள், உணவு மற்றும் பொது விநியோக அமைச்சகம்',
  'Department of Consumer Affairs (DoCA)': 'நுகர்வோர் விவகாரங்கள் துறை (DoCA)',
  'Trust Scale': 'டிரஸ்ட் ஸ்கேல் (Trust Scale)',
  'National Online Verification & Stamping Portal for Weighing and Measuring Instruments': 'எடை மற்றும் அளவிடும் கருவிகளுக்கான தேசிய ஆன்லைன் சரிபார்ப்பு மற்றும் முத்திரையிடும் தளம்',
  'Quick QR Scan': 'விரைவு QR ஸ்கேன்',
  'PORTAL WORKFLOW GUIDE': 'போர்டல் பணிப்பாய்வு வழிகாட்டி',
  'Reset Portal Data': 'போர்டல் தரவை மீட்டமை',

  // Auth Buttons & Roles
  'Login': 'உள்நுழைக',
  'Sign Up': 'பதிவு செய்க',
  'Officer & Admin': 'அதிகாரி & நிர்வாகி',
  'Logout': 'வெளியேறு',
  'Citizen': 'குடிமகன்',
  'Trader': 'வணிகர்',
  'LMO Officer': 'எல்எம்ஓ அதிகாரி',
  'GATC Lab': 'ஜிஏடிசி ஆய்வகம்',
  'Admin': 'நிர்வாகி',
  'ROLE:': 'பங்கு:',

  // Navigation Menu
  'Home': 'முகப்பு',
  'Verify Certificate': 'சான்றிதழ் சரிபார்த்தல்',
  'QR Scan': 'QR ஸ்கேன்',
  'Portal Login / Role Switcher': 'போர்டல் உள்நுழைவு / பங்கு மாற்றி',
  'Public Search': 'பொதுத் தேடல்',
  'Trader Dashboard': 'வணிகர் டாஷ்போர்டு',
  'My Instruments': 'எனது கருவிகள்',
  'Register Instrument': 'கருவியை பதிவு செய்க',
  'Verification Applications': 'சரிபார்ப்பு விண்ணப்பங்கள்',
  'Apply for Verification': 'சரிபார்ப்புக்கு விண்ணப்பிக்கவும்',
  'Certificates & Stamping': 'சான்றிதழ்கள் & முத்திரையிடல்',
  'Profile & Alerts': 'சுயவிவரம் & அறிவிப்புகள்',
  'Officer Dashboard': 'அதிகாரி டாஷ்போர்டு',
  'Assigned Verifications': 'ஒதுக்கப்பட்ட சரிபார்ப்புகள்',
  'Field Digital Checklist & Stamping': 'கள டிஜிட்டல் சரிபார்ப்புப் பட்டியல் & முத்திரையிடல்',
  'My Inspection Roster': 'எனது ஆய்வுப் பட்டியல்',
  'GATC Lab Dashboard': 'ஜிஏடிசி ஆய்வக டாஷ்போர்டு',
  'Metrology Test Bench': 'அளவியல் சோதனை பெஞ்ச்',
  'National Dashboard': 'தேசிய டாஷ்போர்டு',
  'Handover & Supervision': 'ஒப்படைப்பு & மேற்பார்வை',
  'Applications Desk': 'விண்ணப்பங்கள் மேசை',
  'Instruments Registry': 'கருவிகள் பதிவேடு',
  'Stakeholders': 'பங்குதாரர்கள்',
  'Dispatch & Schedule': 'அனுப்புதல் & அட்டவணை',
  'Certificates & Revocation': 'சான்றிதழ்கள் & ரத்து',
  'Analytics': 'பகுப்பாய்வு',
  'Audit Ledger': 'தணிக்கைப் பதிவேடு',

  // Login Page & Auth
  'Commercial Trader & Stakeholder Portal': 'வணிக வர்த்தகர் மற்றும் பங்குதாரர் போர்டல்',
  'Sign In to Commercial & Public Portal': 'வணிக & பொது போர்ட்டலில் உள்நுழையவும்',
  'Select Access Category:': 'அணுகல் வகையைத் தேர்ந்தெடுக்கவும்:',
  'Trader / Commercial Business': 'வணிகர் / வணிக நிறுவனம்',
  'GATC Standards Lab': 'ஜிஏடிசி தரநிலைகள் ஆய்வகம்',
  'Citizen / Consumer': 'குடிமகன் / நுகர்வோர்',
  'Account Password:': 'கணக்கு கடவுச்சொல்:',
  'Security Code (Captcha):': 'பாதுகாப்பு குறியீடு (கேப்ட்சா):',
  'Enter 5-digit code': '5 இலக்கக் குறியீட்டை உள்ளிடவும்',
  'Auto-Fill': 'தானாக நிரப்பவும்',
  'Auto-Fill Captcha': 'கேப்ட்சாவை தானாக நிரப்பவும்',
  'Remember session on this computer': 'இந்த கணினியில் அமர்வை நினைவில் கொள்க',
  'Need public verification?': 'பொது சரிபார்ப்பு தேவையா?',
  'Sign In as Trader': 'வணிகராக உள்நுழைக',
  'Sign In as GATC Standards Lab': 'ஜிஏடிசி ஆய்வகமாக உள்நுழைக',
  'Sign In as Citizen': 'குடிமகனாக உள்நுழைக',
  'New commercial establishment or trader applicant?': 'புதிய வணிக நிறுவனமா அல்லது வணிகர் விண்ணப்பதாரரா?',
  'Register for New Trader Account →': 'புதிய வணிகர் கணக்கிற்கு பதிவு செய்க →',
  'Commercial & Public Directory (Traders, Labs & Citizens)': 'வணிக & பொது அடைவு (வணிகர்கள், ஆய்வகங்கள் மற்றும் குடிமக்கள்)',
  '5 Public Accounts': '5 பொதுக் கணக்குகள்',
  'Stakeholder & Designation': 'பங்குதாரர் & பதவி',
  'Category': 'வகை',
  'Username': 'பயனர்பெயர்',
  'Password': 'கடவுச்சொல்',
  '1-Click Auto-Fill': '1-கிளிக் தானியங்கு நிரப்புதல்',
  'Filled': 'நிரப்பப்பட்டது',
  'Fill & Test': 'நிரப்பி சோதிக்கவும்',

  // Official Login Page
  'Enforcement & Directorate Command Portal': 'அமலாக்கம் & இயக்கக கட்டளை போர்டல்',
  'RESTRICTED GOVERNMENT PORTAL': 'தடைசெய்யப்பட்ட அரசு போர்டல்',
  'Official Use Only': 'அதிகாரப்பூர்வ பயன்பாட்டிற்கு மட்டும்',
  'Legal Metrology Officer (LMO)': 'சட்டமுறை அளவியல் அதிகாரி (LMO)',
  'National Controller (Admin)': 'தேசிய கட்டுப்பாட்டாளர் (நிர்வாகி)',
  'Officer Service Authentication': 'அதிகாரி சேவை அங்கீகாரம்',
  'Field Inspector Workbench & Digital Stamping Console': 'கள ஆய்வாளர் பணிமேடை & டிஜிட்டல் முத்திரை கன்சோல்',
  'Select Officer Preset (Quick Fill):': 'அதிகாரி முன்னமைவைத் தேர்ந்தெடுக்கவும் (விரைவு நிரப்புதல்):',
  'Officer Badge ID / Service Username': 'அதிகாரி பேட்ஜ் ஐடி / சேவை பயனர்பெயர்',
  'Security Password / Key': 'பாதுகாப்பு கடவுச்சொல் / சாவி',
  'Sign In to Enforcement Workbench →': 'அமலாக்க பணிமேடையில் உள்நுழைக →',
  'National Directorate Authentication': 'தேசிய இயக்கக அங்கீகாரம்',
  'Controller Service ID / Email': 'கட்டுப்பாட்டாளர் சேவை ஐடி / மின்னஞ்சல்',
  'Controller Secret Master Key': 'கட்டுப்பாட்டாளர் ரகசிய முதன்மை சாவி',
  'Access National Command Console': 'தேசிய கட்டளை பணியகத்தை அணுகவும்',
  'Admin Handover & Supervisory Hub': 'நிர்வாக ஒப்படைப்பு & மேற்பார்வை மையம்',
  'Supervise / Take Over LMO Officer': 'எல்எம்ஓ அதிகாரியை மேற்பார்வையிடு / பொறுப்பேற்கவும்',
  'Supervise / Audit Trader Account': 'வணிகர் கணக்கை மேற்பார்வையிடு / தணிக்கை செய்',
  'Supervise LMO': 'எல்எம்ஓ மேற்பார்வை',
  'Audit Trader': 'வணிகர் தணிக்கை',
  'Open Full Admin Handover Console': 'முழு நிர்வாக ஒப்படைப்பு கன்சோலைத் திறக்கவும்',

  // Landing Page & Alerts
  'National Online Verification & Stamping Portal for Weights & Measures': 'எடை & அளவைகளுக்கான தேசிய ஆன்லைன் சரிபார்ப்பு & முத்திரையிடும் தளம்',
  'Official Role Portals': 'அதிகாரப்பூர்வ பங்கு போர்ட்டல்கள்',
  'Business Trader Portal': 'வணிக வர்த்தகர் போர்டல்',
  'Register instruments & submit verification applications': 'கருவிகளைப் பதிவு செய்து சரிபார்ப்பு விண்ணப்பங்களைச் சமர்ப்பிக்கவும்',
  'Field inspection, test recording & digital stamping': 'கள ஆய்வு, சோதனை பதிவு & டிஜிட்டல் முத்திரையிடல்',
  'Directorate Command & Admin': 'இயக்கக கட்டளை & நிர்வாகி',
  'Zonal monitoring, officer allocation & policy audit': 'மண்டல கண்காணிப்பு, அதிகாரி ஒதுக்கீடு & கொள்கை தணிக்கை',
  'Verify Scale Stamping Certificate': 'அளவுகோல் முத்திரையிடல் சான்றிதழைச் சரிபார்க்கவும்',
  'Enter Certificate Number or Instrument Serial Number': 'சான்றிதழ் எண் அல்லது கருவியின் வரிசை எண்ணை உள்ளிடவும்',
  'Search & Verify Certificate': 'சான்றிதழைத் தேடி சரிபார்க்கவும்',
  'Report Unverified Scale': 'சரிபார்க்கப்படாத அளவுகோலைப் புகாரளிக்கவும்',
  'Report Scale / Fraud': 'அளவுகோல் / மோசடியைப் புகாரளிக்கவும்',
  'Live Metrology Statistics': 'நேரடி அளவியல் புள்ளிவிவரங்கள்',
  'Registered Instruments': 'பதிவு செய்யப்பட்ட கருவிகள்',
  'Active Certificates': 'செயலில் உள்ள சான்றிதழ்கள்',
  'Inspections Completed': 'முடிக்கப்பட்ட ஆய்வுகள்',
  'GATC Test Centers': 'ஜிஏடிசி சோதனை மையங்கள்',
  'Statutory Consumer Notice': 'சட்டப்பூர்வ நுகர்வோர் அறிவிப்பு',
  'Every commercial weighing instrument in India must possess a valid verification certificate under Section 24 of the Legal Metrology Act, 2009.': 'சட்டமுறை அளவியல் சட்டம், 2009 இன் பிரிவு 24 இன் படி இந்தியாவில் உள்ள ஒவ்வொரு வணிக எடை போடும் கருவியும் செல்லுபடியாகும் சரிபார்ப்புச் சான்றிதழைப் பெற்றிருக்க வேண்டும்.'
};

const MARATHI_TRANSLATIONS = {
  // Brand & Gov Header
  'Government of India': 'भारत सरकार',
  'भारत सरकार | Government of India': 'भारत सरकार | Government of India',
  'Legal Metrology Act, 2009': 'वैध मापनशास्त्र अधिनियम, २००९',
  'Directorate of Legal Metrology': 'वैध मापनशास्त्र संचालनालय',
  'National Consumer Helpline: 1915': 'राष्ट्रीय ग्राहक हेल्पलाइन: १९१५',
  'Ministry of Consumer Affairs, Food & Public Distribution': 'ग्राहक व्यवहार, अन्न आणि सार्वजनिक वितरण मंत्रालय',
  'Department of Consumer Affairs (DoCA)': 'ग्राहक व्यवहार विभाग (DoCA)',
  'Trust Scale': 'ट्रस्ट स्केल',
  'National Online Verification & Stamping Portal for Weighing and Measuring Instruments': 'वजन आणि मापे उपकरणांसाठी राष्ट्रीय ऑनलाइन पडताळणी व मुद्रांकन पोर्टल',
  'Quick QR Scan': 'त्वरित क्यूआर स्कॅन',
  'PORTAL WORKFLOW GUIDE': 'पोर्टल कार्यप्रवाह मार्गदर्शक',
  'Reset Portal Data': 'पोर्टल डेटा रीसेट करा',

  // Auth Buttons & Roles
  'Login': 'लॉगिन',
  'Sign Up': 'नोंदणी करा',
  'Officer & Admin': 'अधिकारी आणि ॲडमिन',
  'Logout': 'लॉग आउट',
  'Citizen': 'नागरिक',
  'Trader': 'व्यापारी',
  'LMO Officer': 'एलएमओ अधिकारी',
  'GATC Lab': 'जीएटीसी लॅब',
  'Admin': 'प्रशासक',
  'ROLE:': 'भूमिका:',

  // Navigation Menu
  'Home': 'मुख्यपृष्ठ',
  'Verify Certificate': 'प्रमाणपत्र पडताळणी',
  'QR Scan': 'क्यूआर स्कॅन',
  'Portal Login / Role Switcher': 'पोर्टल लॉगिन / भूमिका स्विचर',
  'Public Search': 'सार्वजनिक शोध',
  'Trader Dashboard': 'व्यापारी डॅशबोर्ड',
  'My Instruments': 'माझी उपकरणे',
  'Register Instrument': 'उपकरण नोंदणी करा',
  'Verification Applications': 'पडताळणी अर्ज',
  'Apply for Verification': 'पडताळणीसाठी अर्ज करा',
  'Certificates & Stamping': 'प्रमाणपत्रे आणि मुद्रांकन',
  'Profile & Alerts': 'प्रोफाइल आणि सूचना',
  'Officer Dashboard': 'अधिकारी डॅशबोर्ड',
  'Assigned Verifications': 'नियुक्त पडताळण्या',
  'Field Digital Checklist & Stamping': 'फील्ड डिजिटल चेकलिस्ट आणि मुद्रांकन',
  'My Inspection Roster': 'माझी तपासणी यादी',
  'GATC Lab Dashboard': 'जीएटीसी लॅब डॅशबोर्ड',
  'Metrology Test Bench': 'मापनशास्त्र चाचणी बेंच',
  'National Dashboard': 'राष्ट्रीय डॅशबोर्ड',
  'Handover & Supervision': 'हस्तांतरण आणि पर्यवेक्षण',
  'Applications Desk': 'अर्ज डेस्क',
  'Instruments Registry': 'उपकरणे नोंदवही',
  'Stakeholders': 'भागधारक',
  'Dispatch & Schedule': 'प्रेषण आणि वेळापत्रक',
  'Certificates & Revocation': 'प्रमाणपत्रे आणि रद्द करणे',
  'Analytics': 'विश्लेषण',
  'Audit Ledger': 'ऑडिट खातेवही',

  // Login Page & Auth
  'Commercial Trader & Stakeholder Portal': 'व्यावसायिक व्यापारी आणि भागधारक पोर्टल',
  'Sign In to Commercial & Public Portal': 'व्यावसायिक आणि सार्वजनिक पोर्टलवर साइन इन करा',
  'Select Access Category:': 'प्रवेश श्रेणी निवडा:',
  'Trader / Commercial Business': 'व्यापारी / व्यावसायिक व्यवसाय',
  'GATC Standards Lab': 'जीएटीसी मानके प्रयोगशाळा',
  'Citizen / Consumer': 'नागरिक / ग्राहक',
  'Account Password:': 'खाते पासवर्ड:',
  'Security Code (Captcha):': 'सुरक्षा कोड (कॅप्चा):',
  'Enter 5-digit code': '५-अंकी कोड प्रविष्ट करा',
  'Auto-Fill': 'स्वयंचलित भरा',
  'Auto-Fill Captcha': 'कॅप्चा स्वयंचलित भरा',
  'Remember session on this computer': 'या संगणकावर सत्र लक्षात ठेवा',
  'Need public verification?': 'सार्वजनिक पडताळणी हवी आहे?',
  'Sign In as Trader': 'व्यापारी म्हणून साइन इन करा',
  'Sign In as GATC Standards Lab': 'जीएटीसी लॅब म्हणून साइन इन करा',
  'Sign In as Citizen': 'नागरिक म्हणून साइन इन करा',
  'New commercial establishment or trader applicant?': 'नवीन व्यावसायिक संस्था किंवा व्यापारी अर्जदार?',
  'Register for New Trader Account →': 'नवीन व्यापारी खात्यासाठी नोंदणी करा →',
  'Commercial & Public Directory (Traders, Labs & Citizens)': 'व्यावसायिक आणि सार्वजनिक डिरेक्टरी (व्यापारी, प्रयोगशाळा आणि नागरिक)',
  '5 Public Accounts': '५ सार्वजनिक खाती',
  'Stakeholder & Designation': 'भागधारक आणि पदनाम',
  'Category': 'श्रेणी',
  'Username': 'वापरकर्तानाव',
  'Password': 'पासवर्ड',
  '1-Click Auto-Fill': '१-क्लिक स्वयंचलित भरा',
  'Filled': 'भरले',
  'Fill & Test': 'भरा आणि चाचणी करा',

  // Official Login Page
  'Enforcement & Directorate Command Portal': 'अंमलबजावणी आणि संचालनालय कमांड पोर्टल',
  'RESTRICTED GOVERNMENT PORTAL': 'प्रतिबंधित सरकारी पोर्टल',
  'Official Use Only': 'केवळ अधिकृत वापरासाठी',
  'Legal Metrology Officer (LMO)': 'वैध मापनशास्त्र अधिकारी (LMO)',
  'National Controller (Admin)': 'राष्ट्रीय नियंत्रक (ॲडमिन)',
  'Officer Service Authentication': 'अधिकारी सेवा प्रमाणीकरण',
  'Field Inspector Workbench & Digital Stamping Console': 'फील्ड निरीक्षक वर्कबेंच आणि डिजिटल मुद्रांकन कन्सोल',
  'Select Officer Preset (Quick Fill):': 'अधिकारी प्रीसेट निवडा (त्वरित भरा):',
  'Officer Badge ID / Service Username': 'अधिकारी बॅज आयडी / सेवा वापरकर्तानाव',
  'Security Password / Key': 'सुरक्षा पासवर्ड / की',
  'Sign In to Enforcement Workbench →': 'अंमलबजावणी वर्कबेंचवर साइन इन करा →',
  'National Directorate Authentication': 'राष्ट्रीय संचालनालय प्रमाणीकरण',
  'Controller Service ID / Email': 'नियंत्रक सेवा आयडी / ईमेल',
  'Controller Secret Master Key': 'नियंत्रक गुप्त मास्टर की',
  'Access National Command Console': 'राष्ट्रीय कमांड कन्सोलमध्ये प्रवेश करा',
  'Admin Handover & Supervisory Hub': 'ॲडमिन हस्तांतरण आणि पर्यवेक्षी केंद्र',
  'Supervise / Take Over LMO Officer': 'एलएमओ अधिकाऱ्याचे पर्यवेक्षण / ताबा घ्या',
  'Supervise / Audit Trader Account': 'व्यापारी खात्याचे पर्यवेक्षण / ऑडिट करा',
  'Supervise LMO': 'एलएमओचे पर्यवेक्षण करा',
  'Audit Trader': 'व्यापारी ऑडिट',
  'Open Full Admin Handover Console': 'संपूर्ण ॲडमिन हस्तांतरण कन्सोल उघडा',

  // Landing Page & Alerts
  'National Online Verification & Stamping Portal for Weights & Measures': 'वजन आणि मापांसाठी राष्ट्रीय ऑनलाइन पडताळणी आणि मुद्रांकन पोर्टल',
  'Official Role Portals': 'अधिकृत भूमिका पोर्टल',
  'Business Trader Portal': 'व्यवसाय व्यापारी पोर्टल',
  'Register instruments & submit verification applications': 'उपकरणांची नोंदणी करा आणि पडताळणी अर्ज सादर करा',
  'Field inspection, test recording & digital stamping': 'फील्ड तपासणी, चाचणी नोंद आणि डिजिटल मुद्रांकन',
  'Directorate Command & Admin': 'संचालनालय कमांड आणि ॲडमिन',
  'Zonal monitoring, officer allocation & policy audit': 'क्षेत्रीय देखरेख, अधिकारी वाटप आणि धोरण ऑडिट',
  'Verify Scale Stamping Certificate': 'वजन काटा मुद्रांकन प्रमाणपत्र पडताळा',
  'Enter Certificate Number or Instrument Serial Number': 'प्रमाणपत्र क्रमांक किंवा उपकरण अनुक्रमांक प्रविष्ट करा',
  'Search & Verify Certificate': 'प्रमाणपत्र शोधा आणि पडताळा',
  'Report Unverified Scale': 'अपडताळलेल्या वजन काट्याची तक्रार करा',
  'Report Scale / Fraud': 'काटा / फसवणुकीची तक्रार नोंदवा',
  'Live Metrology Statistics': 'थेट मापनशास्त्र आकडेवारी',
  'Registered Instruments': 'नोंदणीकृत उपकरणे',
  'Active Certificates': 'सक्रिय प्रमाणपत्रे',
  'Inspections Completed': 'पूर्ण झालेल्या तपासण्या',
  'GATC Test Centers': 'जीएटीसी चाचणी केंद्रे',
  'Statutory Consumer Notice': 'वैधानिक ग्राहक सूचना',
  'Every commercial weighing instrument in India must possess a valid verification certificate under Section 24 of the Legal Metrology Act, 2009.': 'वैध मापनशास्त्र अधिनियम, २००९ च्या कलम २४ अन्वये भारतातील प्रत्येक व्यावसायिक वजन काट्याकडे वैध पडताळणी प्रमाणपत्र असणे अनिवार्य आहे।'
};

export const TRANSLATIONS = {
  HI: HINDI_TRANSLATIONS,
  TA: TAMIL_TRANSLATIONS,
  MR: MARATHI_TRANSLATIONS,
  // Backward compatibility: default flat access points to Hindi
  ...HINDI_TRANSLATIONS
};

// Build multi-directional phrase mapping for seamless transitions across any language
const PHRASE_MAP = [];
Object.keys(HINDI_TRANSLATIONS).forEach((enKey) => {
  const targets = {
    EN: enKey,
    HI: HINDI_TRANSLATIONS[enKey] || enKey,
    TA: TAMIL_TRANSLATIONS[enKey] || enKey,
    MR: MARATHI_TRANSLATIONS[enKey] || enKey
  };

  const forms = new Set([enKey, targets.HI, targets.TA, targets.MR]);
  forms.forEach((form) => {
    if (form && typeof form === 'string' && form.trim().length > 1) {
      PHRASE_MAP.push({
        source: form.trim(),
        targets
      });
    }
  });
});

// Sort longest phrase first so compound phrases are matched before subphrases
PHRASE_MAP.sort((a, b) => b.source.length - a.source.length);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('emaap_portal_language') || 'EN';
  });

  const switchLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('emaap_portal_language', newLang);
  };

  const toggleLanguage = () => {
    const langCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
    const currentIndex = langCodes.indexOf(language);
    const nextLang = langCodes[(currentIndex + 1) % langCodes.length];
    switchLanguage(nextLang);
  };

  const t = (text) => {
    if (!text || language === 'EN') return text;
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[text]) return langDict[text];
    return text;
  };

  // Automated bidirectional DOM text-node translation across all supported languages
  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();

    const translateNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const original = node.nodeValue;
        if (!original || !original.trim()) return;

        const trimmed = original.trim();

        // 1. Exact match on full trimmed text
        for (const item of PHRASE_MAP) {
          if (item.source === trimmed) {
            const targetVal = item.targets[language] || item.targets.EN;
            if (trimmed !== targetVal) {
              node.nodeValue = original.replace(trimmed, targetVal);
            }
            return;
          }
        }

        // 2. Substring replacements for compound sentences
        let currentText = original;
        let modified = false;
        for (const item of PHRASE_MAP) {
          if (currentText.includes(item.source)) {
            const targetVal = item.targets[language] || item.targets.EN;
            if (item.source !== targetVal) {
              currentText = currentText.split(item.source).join(targetVal);
              modified = true;
            }
          }
        }

        if (modified) {
          node.nodeValue = currentText;
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
    <LanguageContext.Provider value={{ language, setLanguage, switchLanguage, toggleLanguage, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
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
