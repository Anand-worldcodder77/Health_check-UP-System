const express = require('express');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const Package = require('../models/Package');
const Test = require('../models/Test');

const router = express.Router();
const reportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Only PDF, JPG, PNG, or WEBP report upload is allowed.'));
  },
});

const extractPdfText = async (buffer) => {
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text || '';
  } finally {
    await parser.destroy();
  }
};

const emergencyKeywords = [
  'breathing problem',
  'breathlessness',
  'shortness of breath',
  'chest pain',
  'blue lips',
  'severe wheezing',
  'fainting',
  'blood in cough',
  'very high fever',
];

const symptomMap = [
  {
    keywords: ['cough', 'breath', 'breathing', 'wheezing', 'cold', 'fever', 'throat'],
    tags: ['cbc', 'crp', 'chest', 'allergy', 'infection', 'respiratory', 'covid', 'flu'],
  },
  {
    keywords: ['diabetes', 'sugar', 'thirst', 'urination', 'fatigue'],
    tags: ['diabetes', 'glucose', 'hba1c', 'sugar'],
  },
  {
    keywords: ['thyroid', 'weight', 'hair fall', 'tired', 'fatigue'],
    tags: ['thyroid', 'tsh', 't3', 't4'],
  },
  {
    keywords: ['heart', 'chest', 'bp', 'blood pressure', 'cholesterol'],
    tags: ['heart', 'lipid', 'cholesterol', 'cardiac'],
  },
  {
    keywords: ['pregnancy', 'pregnant', 'pcos', 'period'],
    tags: ['pregnancy', 'hormone', 'pcos'],
  },
];

const normalize = (value = '') => value.toString().toLowerCase();

const detectLanguageStyle = (message = '') => {
  if (/[\u0900-\u097F]/.test(message)) return 'hindi';
  const hinglishWords = /\b(mujhe|mera|meri|hai|hain|kya|kaise|batao|kam|jada|zyada|ghata|badha|karu|ho raha|bukhar|khansi|saans|dard)\b/i;
  if (hinglishWords.test(message)) return 'hinglish';
  return 'english';
};

const languageLine = (style) => {
  if (style === 'hindi') return 'MUST answer in Hindi using Devanagari script only. Do not use English paragraphs except medical test names.';
  if (style === 'english') return 'MUST answer in professional, clear English only. Do not use Hindi or Hinglish words.';
  return 'MUST answer in natural Hinglish, matching the user tone, but professional.';
};

const conditionProfiles = [
  {
    id: 'respiratory',
    keywords: ['cough', 'khansi', 'breath', 'breathing', 'saans', 'wheezing', 'cold', 'fever', 'throat'],
    summary: {
      english: 'Your symptoms sound respiratory and need severity-based triage. Cough with breathing difficulty can range from allergy/viral infection to asthma flare, bronchitis, pneumonia, or another lung/heart related problem. I cannot diagnose online, but breathing trouble should not be ignored.',
      hinglish: 'Aapke symptoms respiratory lag rahe hain aur severity ke hisaab se triage zaroori hai. Cough ke saath breathing problem allergy/viral infection se lekar asthma flare, bronchitis, pneumonia ya lung/heart related issue tak ho sakta hai. Online final diagnosis nahi ho sakta, par saans ki dikkat ignore nahi karni chahiye.',
      hindi: 'आपके लक्षण श्वसन तंत्र से जुड़े लगते हैं और गंभीरता के हिसाब से जांच जरूरी है। खांसी के साथ सांस की दिक्कत एलर्जी/वायरल इंफेक्शन से लेकर अस्थमा, ब्रोंकाइटिस, निमोनिया या फेफड़े/दिल से जुड़ी समस्या तक हो सकती है। ऑनलाइन अंतिम निदान नहीं किया जा सकता, लेकिन सांस की तकलीफ को नजरअंदाज नहीं करना चाहिए।',
    },
    clinicalContext: 'Doctor normally checks oxygen saturation, respiratory rate, fever pattern, chest sounds, asthma/allergy history, sputum color, duration, and whether symptoms are worsening. If symptoms are mild, supportive care may help, but breathlessness, chest pain, blue lips, confusion, or low oxygen needs urgent care.',
    possibleCauses: ['Viral upper respiratory infection', 'Allergy or asthma flare', 'Bronchitis or pneumonia', 'Post-nasal drip/acid reflux triggered cough', 'Heart/lung issue if chest pain, swelling, low oxygen, or severe breathlessness is present'],
    homeRemedies: ['Warm fluids and hydration', 'Avoid smoke, dust, cold air, strong perfume', 'Steam only if it suits you; avoid if it worsens wheeze', 'Rest and avoid heavy exercise while breathless', 'Monitor fever, oxygen saturation if available, and symptom duration'],
    nextSteps: ['Seek urgent care if breathing difficulty is moderate/severe', 'Consider CBC/CRP and doctor exam if fever or infection signs are present', 'Consider allergy/respiratory review if recurrent seasonal cough', 'Book related screening only as support, not as replacement for doctor care'],
  },
  {
    id: 'diabetes',
    keywords: ['diabetes', 'sugar', 'glucose', 'hba1c', 'thirst', 'urination', 'peshab'],
    summary: {
      english: 'Your question points toward blood sugar/diabetes screening. Symptoms like excessive thirst, frequent urination, fatigue, weight change, blurry vision, or delayed wound healing can be associated with high sugar, but testing is needed.',
      hinglish: 'Aapka question blood sugar/diabetes screening se related lagta hai. Zyada pyaas, baar-baar urination, fatigue, weight change, blurry vision ya wound healing delay high sugar se linked ho sakte hain, par confirm test se hota hai.',
      hindi: 'आपका सवाल ब्लड शुगर/डायबिटीज स्क्रीनिंग से जुड़ा लगता है। ज्यादा प्यास, बार-बार पेशाब, थकान, वजन में बदलाव, धुंधला दिखना या घाव भरने में देरी हाई शुगर से जुड़ सकते हैं, लेकिन पुष्टि जांच से होती है।',
    },
    clinicalContext: 'Doctors compare fasting glucose, post-meal glucose, HbA1c, symptoms, medicines, diet, body weight, and family history. One reading can be affected by recent meals, stress, infection, or steroids; HbA1c gives a 2-3 month average.',
    possibleCauses: ['Prediabetes/diabetes', 'Recent high carbohydrate meal', 'Stress or infection', 'Steroid medicine effect', 'Low activity and weight gain'],
    homeRemedies: ['Avoid sugary drinks', 'Prefer balanced meals with protein/fiber', 'Walk after meals if medically safe', 'Hydrate well', 'Do not start/stop diabetes medicine without doctor advice'],
    nextSteps: ['Check fasting sugar, post-meal sugar, and HbA1c', 'Consult doctor if sugar is very high or symptoms are strong', 'Track readings with date/time and meal context'],
  },
  {
    id: 'thyroid',
    keywords: ['thyroid', 'tsh', 't3', 't4', 'hair fall', 'weight', 'tired'],
    summary: {
      english: 'Your question suggests thyroid-related screening. Fatigue, weight change, hair fall, constipation, palpitations, anxiety, or heat/cold intolerance can overlap with thyroid imbalance, but TSH with Free T3/T4 is needed.',
      hinglish: 'Aapka question thyroid screening se related lagta hai. Fatigue, weight change, hair fall, constipation, palpitations, anxiety ya heat/cold intolerance thyroid imbalance me aa sakte hain, par TSH + Free T3/T4 se clarity milti hai.',
      hindi: 'आपका सवाल थायरॉइड स्क्रीनिंग से जुड़ा लगता है। थकान, वजन में बदलाव, बाल झड़ना, कब्ज, धड़कन, बेचैनी या गर्मी/ठंड सहन न होना थायरॉइड असंतुलन में हो सकता है, लेकिन TSH और Free T3/T4 से स्पष्टता मिलती है।',
    },
    clinicalContext: 'Doctors interpret TSH together with Free T4/Free T3, symptoms, pregnancy status, current thyroid medicine, and autoimmune markers such as anti-TPO when needed.',
    possibleCauses: ['Hypothyroidism', 'Hyperthyroidism', 'Autoimmune thyroiditis', 'Incorrect thyroid medicine dose', 'Temporary illness-related variation'],
    homeRemedies: ['Take thyroid medicine only as prescribed', 'Do not self-start iodine supplements', 'Maintain sleep and balanced diet', 'Take thyroid medicine fasting if already prescribed'],
    nextSteps: ['Check TSH, Free T3, Free T4', 'Add anti-TPO if doctor suspects autoimmune thyroiditis', 'Review with doctor if values are abnormal or symptoms are strong'],
  },
  {
    id: 'liver',
    keywords: ['bilirubin', 'sgpt', 'sgot', 'alt', 'ast', 'liver', 'jaundice', 'yellow', 'dark urine'],
    summary: {
      english: 'Your question points toward liver/bile related interpretation. Values like bilirubin, ALT/AST, ALP, and GGT need to be read together with symptoms such as yellow eyes, dark urine, abdominal pain, fever, alcohol/medicine history, and the report reference range.',
      hinglish: 'Aapka question liver/bile related interpretation se linked lagta hai. Bilirubin, ALT/AST, ALP, GGT ko yellow eyes, dark urine, abdominal pain, fever, alcohol/medicine history aur report reference range ke saath read karna chahiye.',
      hindi: 'आपका सवाल लिवर/बाइल से जुड़ी रिपोर्ट की व्याख्या से संबंधित लगता है। बिलीरुबिन, ALT/AST, ALP, GGT को पीली आंखें, गहरा पेशाब, पेट दर्द, बुखार, शराब/दवा इतिहास और रिपोर्ट की रेफरेंस रेंज के साथ पढ़ना चाहिए।',
    },
    clinicalContext: 'Mild bilirubin elevation may occur with fasting/dehydration or Gilbert syndrome, but liver inflammation, bile duct obstruction, gallbladder disease, hemolysis, alcohol, and medicine effects must be considered based on the full panel.',
    possibleCauses: ['Gilbert syndrome or fasting/dehydration', 'Liver inflammation/infection', 'Bile duct or gallbladder issue', 'Alcohol or medicine effect', 'RBC breakdown/hemolysis'],
    homeRemedies: ['Hydrate well', 'Avoid alcohol', 'Avoid unnecessary painkillers/supplements until doctor review', 'Eat light balanced meals', 'Seek care if jaundice/dark urine/fever/abdominal pain'],
    nextSteps: ['Review full LFT: direct/indirect bilirubin, SGPT/ALT, SGOT/AST, ALP, GGT', 'Consult doctor if bilirubin is repeatedly high or symptoms are present', 'Consider ultrasound/hepatitis markers if doctor advises'],
  },
];

const getConditionProfile = (message = '') => {
  const text = normalize(message);
  return conditionProfiles.find((profile) => profile.keywords.some((keyword) => text.includes(keyword))) || null;
};

const labKnowledge = [
  {
    keys: ['bilirubin', 'total bilirubin', 'direct bilirubin', 'indirect bilirubin'],
    label: 'Bilirubin',
    highMeaning: 'Bilirubin high hone ka matlab liver, bile flow, gallbladder/bile duct, ya red blood cell breakdown se related issue ho sakta hai. Mild elevation kabhi-kabhi fasting, dehydration, recent illness, medicines, ya Gilbert syndrome jaise benign condition me bhi dikhta hai.',
    lowMeaning: 'Low bilirubin usually clinically important nahi hota; doctor overall liver panel ke saath interpret karta hai.',
    highReasons: ['Liver inflammation/infection', 'Bile duct/gallbladder blockage', 'Gilbert syndrome', 'Hemolysis yani RBC breakdown', 'Alcohol/medicine effect', 'Recent fasting/dehydration'],
    lowReasons: ['Usually not clinically significant', 'Lab variation'],
    action: 'LFT panel me SGOT/AST, SGPT/ALT, ALP, GGT, direct/indirect bilirubin aur symptoms jaise yellow eyes, dark urine, pale stool, fever, abdominal pain ke saath doctor review karein.',
  },
  {
    keys: ['hb', 'hemoglobin', 'haemoglobin'],
    label: 'Hemoglobin',
    highMeaning: 'Hemoglobin high dehydration, smoking, high altitude, lung/heart condition ya rarely blood disorder se ho sakta hai.',
    lowMeaning: 'Hemoglobin low anemia suggest kar sakta hai. Common reasons iron deficiency, B12/folate deficiency, blood loss, chronic inflammation, kidney disease ya heavy periods ho sakte hain.',
    highReasons: ['Dehydration', 'Smoking', 'High altitude', 'Chronic lung/heart condition', 'Rare blood disorder'],
    lowReasons: ['Iron deficiency', 'Vitamin B12/folate deficiency', 'Blood loss/heavy periods', 'Chronic inflammation', 'Kidney-related anemia'],
    action: 'CBC indices, ferritin/iron profile, B12, folate aur stool/period history ke saath doctor review karein.',
  },
  {
    keys: ['wbc', 'white blood cell', 'white cells', 'tlc'],
    label: 'WBC / TLC',
    highMeaning: 'WBC high infection, inflammation, stress, steroid medicines, allergy ya rarely blood disorder me badh sakta hai.',
    lowMeaning: 'WBC low viral illness, medicine effect, autoimmune condition, nutritional deficiency ya bone marrow suppression me ho sakta hai.',
    highReasons: ['Bacterial/viral infection', 'Inflammation', 'Stress response', 'Steroid medicine', 'Allergy', 'Rare hematology disorder'],
    lowReasons: ['Viral infection', 'Medicine effect', 'Autoimmune condition', 'B12/folate deficiency', 'Bone marrow suppression'],
    action: 'Differential count, fever/infection symptoms, CRP/ESR aur repeat CBC trend ke saath doctor review karein.',
  },
  {
    keys: ['platelet', 'platelets'],
    label: 'Platelets',
    highMeaning: 'Platelets high inflammation, infection recovery, iron deficiency, recent surgery ya rarely bone marrow disorder me ho sakte hain.',
    lowMeaning: 'Platelets low dengue/viral illness, medicine effect, immune platelet disorder, liver/spleen issue ya bone marrow problem me ho sakte hain.',
    highReasons: ['Inflammation/infection recovery', 'Iron deficiency', 'Recent surgery', 'Chronic inflammatory disease'],
    lowReasons: ['Viral fever/dengue', 'Medicine effect', 'Immune platelet disorder', 'Liver/spleen issue'],
    action: 'Bleeding spots, gum bleed, fever, dengue risk aur repeat CBC ke saath urgent review karein agar count very low ho.',
  },
  {
    keys: ['glucose', 'sugar', 'fasting sugar', 'fbs', 'ppbs'],
    label: 'Blood glucose',
    highMeaning: 'Sugar high diabetes/prediabetes, stress, infection, steroid medicine ya meal timing issue se ho sakta hai.',
    lowMeaning: 'Sugar low delayed meal, diabetes medicine/insulin, heavy exercise ya endocrine/liver issue se ho sakta hai.',
    highReasons: ['Diabetes/prediabetes', 'Recent meal', 'Infection/stress', 'Steroid medicine', 'Low activity/high carb diet'],
    lowReasons: ['Missed meal', 'Diabetes medicine/insulin', 'Heavy exercise', 'Alcohol intake', 'Endocrine/liver issue'],
    action: 'Fasting/PP sugar, HbA1c, symptoms aur medicines ke saath doctor review karein.',
  },
  {
    keys: ['hba1c', 'a1c'],
    label: 'HbA1c',
    highMeaning: 'HbA1c high pichhle 2-3 mahine ka average blood sugar high indicate karta hai.',
    lowMeaning: 'Very low HbA1c overtreatment, anemia/hemolysis, recent blood loss ya lab interference me misleading ho sakta hai.',
    highReasons: ['Diabetes/prediabetes', 'High carbohydrate intake', 'Low physical activity', 'Stress/infection', 'Medicine adherence issue'],
    lowReasons: ['Low sugar episodes', 'Anemia/hemolysis', 'Recent blood loss/transfusion', 'Lab variation'],
    action: 'Doctor ke saath diabetes plan, diet, activity, medicines aur glucose monitoring discuss karein.',
  },
  {
    keys: ['tsh', 'thyroid'],
    label: 'TSH',
    highMeaning: 'TSH high usually hypothyroidism/underactive thyroid ki taraf point karta hai, especially T3/T4 low ho.',
    lowMeaning: 'TSH low hyperthyroidism/overactive thyroid, thyroid medicine over-dose ya pregnancy/illness related variation me ho sakta hai.',
    highReasons: ['Hypothyroidism', 'Iodine imbalance', 'Autoimmune thyroiditis', 'Missed thyroid medicine'],
    lowReasons: ['Hyperthyroidism', 'Excess thyroid medicine', 'Pregnancy/acute illness effect'],
    action: 'Free T3, Free T4, anti-TPO aur symptoms ke saath endocrinology/doctor review karein.',
  },
  {
    keys: ['alt', 'sgpt', 'ast', 'sgot'],
    label: 'Liver enzymes',
    highMeaning: 'ALT/AST high liver cell irritation/injury suggest kar sakte hain. Fatty liver, alcohol, viral hepatitis, medicines, muscle injury ya metabolic issues common causes hain.',
    lowMeaning: 'Low ALT/AST usually clinically important nahi hota.',
    highReasons: ['Fatty liver', 'Alcohol', 'Viral hepatitis', 'Medicine/supplement effect', 'Muscle injury', 'Metabolic syndrome'],
    lowReasons: ['Usually not significant', 'Lab variation'],
    action: 'LFT repeat, hepatitis markers, ultrasound liver, alcohol/medicine review aur doctor consultation karein.',
  },
  {
    keys: ['creatinine', 'egfr', 'urea'],
    label: 'Kidney markers',
    highMeaning: 'Creatinine/urea high dehydration, kidney function reduction, high protein intake, medicines, obstruction ya muscle breakdown se ho sakta hai.',
    lowMeaning: 'Low creatinine low muscle mass/pregnancy me aa sakta hai; usually isolated low value less concerning hota hai.',
    highReasons: ['Dehydration', 'Kidney function issue', 'Certain painkillers/medicines', 'High protein intake', 'Urinary obstruction'],
    lowReasons: ['Low muscle mass', 'Pregnancy', 'Lab variation'],
    action: 'eGFR, urine routine, BP, diabetes status aur medicine history ke saath doctor review karein.',
  },
];

const extractTypedLabFindings = (message = '') => {
  const text = normalize(message);
  const findings = [];

  labKnowledge.forEach((lab) => {
    const matchedKey = lab.keys.find((key) => {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
      return new RegExp(`(^|[^a-z0-9])${escapedKey}([^a-z0-9]|$)`, 'i').test(text);
    });
    if (!matchedKey) return;

    const escapedKey = matchedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const keyMatch = text.match(new RegExp(`(^|[^a-z0-9])${escapedKey}([^a-z0-9]|$)`, 'i'));
    const keyIndex = keyMatch?.index || 0;
    const localSegment = message.slice(keyIndex + (keyMatch?.[0]?.length || 0), keyIndex + (keyMatch?.[0]?.length || 0) + 100);
    const valueMatch = localSegment.match(/([0-9]+(?:\.[0-9]+)?)(?:\s*(<|>|<=|>=)\s*([0-9]+(?:\.[0-9]+)?))?/i);
    const localHigh = /(high|jada|zyada|badha|bada|increase|elevated|above|upar|jyada)/i.test(localSegment);
    const localLow = /(low|kam|ghata|decrease|reduced|below|neeche)/i.test(localSegment);

    let status = 'review_needed';
    let value = valueMatch?.[1] || 'value mentioned';
    const comparator = valueMatch?.[2];
    const rangeValue = valueMatch?.[3];

    if (valueMatch && comparator && rangeValue) {
      const numericValue = Number(value);
      const numericRange = Number(rangeValue);
      if ((comparator === '<' || comparator === '<=') && numericValue > numericRange) status = 'high';
      if ((comparator === '>' || comparator === '>=') && numericValue < numericRange) status = 'low';
      value = `${value} ${comparator} ${rangeValue}`;
    } else if (localHigh) {
      status = 'high';
    } else if (localLow) {
      status = 'low';
    } else if (valueMatch) {
      const numericValue = Number(value);
      if (lab.label === 'Blood glucose' && numericValue >= 126 && /(fasting|fbs)/i.test(localSegment)) status = 'high';
      if (lab.label === 'HbA1c' && numericValue >= 5.7) status = 'high';
      if (lab.label === 'Liver enzymes' && numericValue > 56) status = 'high';
      if (lab.label === 'Hemoglobin' && numericValue < 12) status = 'low';
    }

    findings.push({
      testName: lab.label,
      value,
      status,
      remark: status === 'high'
        ? lab.highMeaning
        : status === 'low'
          ? lab.lowMeaning
          : `${lab.label} ko report ke reference range, symptoms aur baaki related values ke saath interpret karna chahiye.`,
      possibleReasons: status === 'high'
        ? lab.highReasons
        : status === 'low'
          ? lab.lowReasons
          : ['Reference range unclear', 'Exact value/context incomplete', 'Trend/repeat value needed'],
      action: lab.action,
    });
  });

  return findings;
};

const buildClinicContext = (profile, typedFindings, reportText) => {
  if (typedFindings.length) {
    const focusedMarkers = typedFindings.map((finding) => `${finding.testName} (${finding.status})`).join(', ');
    return [
      `Doctor ${focusedMarkers} ko isolated number ki tarah nahi dekhega; har value ko symptoms aur reference range ke saath compare karega.`,
      'Pehle symptoms poochega: weakness kab se hai, fever/jaundice/dark urine/breathlessness/chest pain/weight loss/bleeding hai ya nahi.',
      'History me medicines, supplements, alcohol/steroid use, fasting status, hydration, recent infection, diet aur previous report trend check kiya jata hai.',
      'Physical check me BP, pulse, temperature, oxygen saturation, pallor/anemia signs, jaundice, abdominal tenderness/liver size, dehydration signs aur infection signs dekhe jaate hain.',
      'Related markers saath me compare hote hain: CBC me Hb-WBC-platelets, diabetes me fasting/PP sugar-HbA1c, liver me bilirubin direct/indirect-SGPT/SGOT-ALP-GGT, kidney me creatinine-eGFR-urine test.',
      'Agar value borderline hai to repeat/trend helpful hota hai; agar value clearly abnormal hai ya symptoms strong hain to same day/early clinical review better hota hai.',
    ];
  }

  if (profile?.id === 'respiratory') {
    return [
      'Doctor cough/breathing problem me duration, fever pattern, sputum color, wheezing, chest pain aur symptoms worsening ka timeline poochta hai.',
      'History me asthma/allergy, smoking, dust/pollution exposure, recent infection, medicines aur previous similar episodes check kiye jaate hain.',
      'Clinic exam me oxygen saturation, respiratory rate, pulse, temperature aur chest auscultation se wheeze/crackles/pneumonia signs dekhe jaate hain.',
      'Agar saans phool rahi hai to sirf cough syrup enough nahi hota; asthma flare, pneumonia, bronchitis ya heart/lung stress rule out karna padta hai.',
      'Mild viral/allergy symptoms me supportive care chal sakti hai, lekin breathlessness ya low oxygen me urgent examination zaroori hota hai.',
    ];
  }

  if (profile?.id === 'diabetes') {
    return [
      'Doctor sugar report ko fasting status, last meal timing, post-meal sugar, HbA1c aur symptoms ke saath read karta hai.',
      'History me family diabetes, weight/waist, diet, activity, infection/stress, steroid medicine aur current medicines check hote hain.',
      'Fasting glucose 100-125 mg/dL impaired fasting/prediabetes range ho sakta hai; 126 mg/dL ya usse upar repeat confirm hone par diabetes range consider hota hai.',
      'HbA1c 5.7-6.4% prediabetes range aur 6.5% ya usse upar diabetes range me aa sakta hai, lekin final label repeat/confirmatory test se hota hai.',
      'Clinic me BP, weight, foot/skin infection signs, hydration aur eye/kidney risk factors bhi review kiye ja sakte hain.',
    ];
  }

  if (profile?.id === 'liver') {
    return [
      'Doctor liver report ko bilirubin direct/indirect, SGPT/ALT, SGOT/AST, ALP, GGT, albumin aur PT/INR ke saath interpret karta hai.',
      'Symptoms me yellow eyes, dark urine, pale stool, itching, right upper abdomen pain, fever, nausea aur appetite/weight change poocha jata hai.',
      'History me alcohol, painkiller/antibiotic/supplement use, hepatitis exposure, obesity/fatty liver risk aur previous LFT trend check hota hai.',
      'Mild isolated bilirubin kabhi fasting/dehydration/Gilbert syndrome me aa sakta hai, par enzymes high hon ya jaundice symptoms hon to follow-up zaroori hai.',
      'Clinic exam me jaundice, abdominal tenderness, liver enlargement, fever aur dehydration signs dekhe jaate hain.',
    ];
  }

  if (profile?.id === 'thyroid') {
    return [
      'Doctor TSH ko Free T4/Free T3 ke saath read karta hai, sirf TSH number se final decision nahi hota.',
      'Symptoms me weight change, hair fall, constipation/loose motion, heat/cold intolerance, anxiety, sleep aur fatigue poocha jata hai.',
      'Pulse, BP, neck swelling/goiter, tremor, skin dryness aur pregnancy status check kiya ja sakta hai.',
      'TSH high usually underactive thyroid direction me point karta hai; TSH low overactive thyroid ya medicine over-dose me ho sakta hai.',
      'Thyroid medicine dose self-adjust nahi karni chahiye; repeat test aur doctor review ke basis par dose decide hoti hai.',
    ];
  }

  if (reportText) {
    return [
      'Doctor uploaded report ko table-wise dekhta hai: patient age/sex, sample date, units, reference ranges aur high/low flags.',
      'Previous trend aur current symptoms ke bina ek single abnormal value final diagnosis nahi banati.',
      'AI scan me agar text/image unclear ho to result final nahi maana jata; clear report ya manually typed values se interpretation better hoti hai.',
      'Abnormal value ko related panel, physical exam aur medicine/history ke saath connect karke next action decide hota hai.',
    ];
  }

  return [
    'Doctor pehle symptom duration, severity, age, existing disease, medicines aur allergy history poochta hai.',
    'Vitals me BP, pulse, temperature, oxygen saturation aur physical exam important hote hain.',
    'Same symptom infection, allergy, lifestyle, medicine effect ya chronic disease se aa sakta hai, isliye test selection context ke baad hota hai.',
    'Red flags present hon to home care ke bajay urgent examination priority hoti hai.',
  ];
};

const buildRedFlags = (profile, typedFindings) => {
  const flags = new Set();

  if (profile?.id === 'respiratory') {
    [
      'Saans lene me moderate/severe dikkat, fast breathing, ya oxygen saturation 94% se kam',
      'Chest pain/tightness, blue lips/face, confusion, fainting, ya severe wheezing',
      'Blood in cough, persistent high fever, drowsiness, ya symptoms rapidly worsen hona',
      'Cough/fever better hone ke baad phir se high fever, breathlessness ya chest pain ke saath return hona',
    ].forEach((flag) => flags.add(flag));
  }

  if (profile?.id === 'diabetes' || typedFindings.some((finding) => finding.testName.includes('glucose') || finding.testName.includes('HbA1c'))) {
    [
      'Sugar very high ho aur vomiting, severe weakness, dehydration, deep/fast breathing, confusion ya drowsiness ho',
      'Sugar low symptoms: sweating, shaking, confusion, fainting, seizures, ya unable to eat',
      'Frequent urination/thirst ke saath weight loss, blurred vision, infection ya wound healing delay',
    ].forEach((flag) => flags.add(flag));
  }

  if (profile?.id === 'liver' || typedFindings.some((finding) => finding.testName.includes('Bilirubin') || finding.testName.includes('Liver'))) {
    [
      'Yellow eyes/skin, dark urine, pale stool, severe itching, ya right upper abdomen pain',
      'Fever with jaundice, repeated vomiting, severe weakness, confusion, sleepiness, ya bleeding/bruising',
      'Alcohol/medicine exposure ke baad liver values high aur symptoms present hona',
    ].forEach((flag) => flags.add(flag));
  }

  if (profile?.id === 'thyroid' || typedFindings.some((finding) => finding.testName.includes('TSH'))) {
    [
      'Very fast heartbeat, chest pain, fainting, severe anxiety/tremor, ya unexplained weight loss',
      'Extreme sleepiness, confusion, very slow pulse, swelling, or severe cold intolerance',
      'Pregnancy me abnormal thyroid value, because dose and monitoring need doctor supervision',
    ].forEach((flag) => flags.add(flag));
  }

  if (typedFindings.some((finding) => finding.testName.includes('Hemoglobin'))) {
    [
      'Severe breathlessness, chest pain, fainting, black stool, heavy bleeding, or very fast heartbeat with low Hb symptoms',
    ].forEach((flag) => flags.add(flag));
  }

  if (!flags.size) {
    [
      'Severe pain, breathing difficulty, fainting, confusion, bleeding, persistent high fever, or rapidly worsening symptoms',
      'New neurological symptoms like weakness on one side, slurred speech, seizure, or severe headache',
      'Any abnormal report value with strong symptoms, pregnancy, elderly age, heart/kidney/liver disease, or uncontrolled diabetes',
    ].forEach((flag) => flags.add(flag));
  }

  return [...flags].slice(0, 6);
};

const getCatalog = async () => {
  const [packages, tests] = await Promise.all([
    Package.find({ isActive: true })
      .select('title slug category shortDescription price discountedPrice testCount reportTimeHours searchTags')
      .sort({ isBestSeller: -1, updatedAt: -1 })
      .limit(80)
      .lean(),
    Test.find({ isActive: true })
      .select('name code category description price mrp discountPercent turnaroundTime searchTags sampleType')
      .sort({ updatedAt: -1 })
      .limit(120)
      .lean(),
  ]);

  return { packages, tests };
};

const findRelevantCards = (message, catalog) => {
  const text = normalize(message);
  const tags = new Set();

  symptomMap.forEach((group) => {
    if (group.keywords.some((keyword) => text.includes(keyword))) {
      group.tags.forEach((tag) => tags.add(tag));
    }
  });

  const scoreItem = (item) => {
    const haystack = normalize([
      item.title,
      item.name,
      item.category,
      item.shortDescription,
      item.description,
      ...(item.searchTags || []),
    ].filter(Boolean).join(' '));

    let score = 0;
    tags.forEach((tag) => {
      if (haystack.includes(tag)) score += 3;
    });
    text.split(/\s+/).filter((word) => word.length > 3).forEach((word) => {
      if (haystack.includes(word)) score += 1;
    });
    return score;
  };

  const packageCards = catalog.packages
    .map((item) => ({ type: 'package', score: scoreItem(item), ...item }))
    .filter((item) => item.score > 0);
  const testCards = catalog.tests
    .map((item) => ({ type: 'test', score: scoreItem(item), ...item }))
    .filter((item) => item.score > 0);

  const scoredCards = [...packageCards, ...testCards]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const profile = getConditionProfile(message);
  const staticCardsByProfile = {
    respiratory: [
      { _id: 'ai-cbc', type: 'test', title: 'CBC with infection marker', category: 'Respiratory screening', shortDescription: 'Useful first screening when cough, fever or infection symptoms are present.', discountedPrice: 399, price: 399, reportTimeHours: 24 },
      { _id: 'ai-allergy', type: 'package', title: 'Allergy / Respiratory Health Check', category: 'Allergy/Intolerance', shortDescription: 'Suggested when cough is recurrent, seasonal, or triggered by dust.', discountedPrice: 999, price: 999, reportTimeHours: 24 },
    ],
    diabetes: [
      { _id: 'ai-hba1c', type: 'test', title: 'HbA1c', category: 'Diabetes', shortDescription: 'Shows average blood sugar over the last 2-3 months.', discountedPrice: 399, price: 399, reportTimeHours: 24 },
      { _id: 'ai-glucose', type: 'package', title: 'Diabetes Screening Basic', category: 'Diabetes', shortDescription: 'Useful for fasting/post-meal sugar and diabetes risk screening.', discountedPrice: 399, price: 399, reportTimeHours: 24 },
    ],
    thyroid: [
      { _id: 'ai-tsh', type: 'test', title: 'TSH Thyroid Test', category: 'Thyroid', shortDescription: 'Primary screening marker for thyroid imbalance.', discountedPrice: 299, price: 299, reportTimeHours: 24 },
      { _id: 'ai-thyroid-profile', type: 'package', title: 'Thyroid Profile', category: 'Thyroid', shortDescription: 'Checks T3, T4 and TSH together.', discountedPrice: 499, price: 499, reportTimeHours: 24 },
    ],
    liver: [
      { _id: 'ai-lft', type: 'package', title: 'Liver Function Test', category: 'Liver', shortDescription: 'Checks bilirubin, liver enzymes and bile flow markers.', discountedPrice: 599, price: 599, reportTimeHours: 24 },
      { _id: 'ai-bilirubin', type: 'test', title: 'Bilirubin Profile', category: 'Liver', shortDescription: 'Useful when bilirubin is high or jaundice symptoms are present.', discountedPrice: 299, price: 299, reportTimeHours: 24 },
    ],
  };
  const staticCards = staticCardsByProfile[profile?.id] || staticCardsByProfile.respiratory;
  const fallbackCards = [
    ...catalog.packages.slice(0, 2).map((item) => ({ type: 'package', ...item })),
    ...catalog.tests.slice(0, 2).map((item) => ({ type: 'test', ...item })),
  ];

  const sourceCards = scoredCards.length ? scoredCards : (staticCards.length ? staticCards : fallbackCards);
  return sourceCards
    .slice(0, 4)
    .map((item) => ({
      id: item._id,
      type: item.type,
      title: item.title || item.name,
      category: item.category,
      description: item.shortDescription || item.description || 'Related health check',
      price: item.discountedPrice || item.price,
      mrp: item.price || item.mrp,
      reportTimeHours: item.reportTimeHours || item.turnaroundTime,
    }));
};

const extractJson = (text = '') => {
  const cleaned = text.replace(/```json|```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  return JSON.parse(cleaned.slice(start, end + 1));
};

const withTimeout = (ms = 12000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timeout) };
};

const buildFallbackAnswer = (message, cards, hasEmergency, reportText = '') => {
  const typedFindings = extractTypedLabFindings(message);
  const findingNames = typedFindings.map((finding) => `${finding.testName} ${finding.status}`).join(', ');
  const languageStyle = detectLanguageStyle(message);
  const profile = getConditionProfile(message);
  const profileSummary = profile?.summary?.[languageStyle] || profile?.summary?.hinglish;
  const clinicalContext = buildClinicContext(profile, typedFindings, reportText);
  const redFlags = buildRedFlags(profile, typedFindings);
  return {
  doctorExplanation: typedFindings.length
    ? [
      `What I noticed: ${findingNames} mentioned hai, isliye ye report value normal range se compare karni zaroori hai.`,
      'What it may mean: Ek abnormal value final diagnosis nahi hoti, par body me liver, blood, sugar, thyroid, kidney ya infection-related stress ka signal ho sakti hai depending on marker.',
      'Why it can happen: Dehydration, recent infection, diet/fasting, medicines, alcohol, chronic condition, ya lab variation common reasons ho sakte hain.',
      'What to do next: Same report ke related markers, symptoms, vitals aur repeat trend ke saath doctor ko dikhayein.',
      'When to worry: Severe weakness, fever, yellow eyes, dark urine, chest pain, breathlessness, fainting, bleeding, confusion ya rapidly worsening symptoms me urgent care lein.',
    ]
    : profile
      ? [
        `What I noticed: Aapka question ${profile.id} symptoms/report context se match karta hai.`,
        `What it may mean: ${profileSummary}`,
        `Why it can happen: ${profile.possibleCauses.slice(0, 3).join(', ')}.`,
        'What to do next: Symptoms duration, severity, medicines, vitals aur relevant tests ke saath doctor review best rahega.',
        'When to worry: Breathing difficulty, chest pain, fainting, confusion, very high fever, severe weakness ya symptoms rapidly worsen hon to urgent care lein.',
      ]
      : [
        'What I noticed: Aapne symptoms/report related question pucha hai, lekin exact values ya duration limited hai.',
        'What it may mean: First-level triage ke liye symptoms ki severity, duration, age, medicines aur medical history important hoti hai.',
        'Why it can happen: Infection, allergy, lifestyle, dehydration, stress, medicines ya chronic condition possibilities ho sakti hain.',
        'What to do next: Exact symptom duration, fever, pain location, report values aur current medicines note karke doctor se discuss karein.',
        'When to worry: Severe pain, breathing difficulty, fainting, confusion, bleeding, persistent high fever ya worsening symptoms me urgent care lein.',
      ],
  summary: hasEmergency
    ? 'Aapke symptoms me breathing difficulty ka mention hai, jo cough/cold ke saath kabhi-kabhi urgent ho sakta hai. Agar saans lene me zyada dikkat, chest tightness/pain, lips blue, confusion, fainting, oxygen low, ya rapidly worsening wheezing ho to emergency care/doctor ko turant contact karein. Agar symptoms mild hain, tab bhi 24 hours ke andar clinician review lena safer rahega.'
    : typedFindings.length
      ? `Aapne jo real lab value/message diya hai uske basis par ${findingNames} review-needed finding dikhti hai. Iska matlab final diagnosis nahi hota, kyunki lab result ko age, symptoms, medicines, hydration, fasting status, aur report ke reference range ke saath interpret karna padta hai. Neeche har abnormal/mentioned marker ka professional interpretation, possible reasons aur next action diya hai.`
    : reportText
      ? 'Uploaded report ko scan karke first-level medical explanation diya ja raha hai. Lab values ko hamesha report ke apne reference range, age, sex, medicines, symptoms aur medical history ke saath interpret karna chahiye. Ye diagnosis nahi hai; abnormal values ya active symptoms ke liye doctor se consult karein.'
      : profileSummary || 'Aapke symptoms ke basis par ye professional first-level triage guidance hai. Main possible causes, safe home care, red flags aur suitable test options bata raha hoon. Ye final diagnosis nahi hai; symptoms badh rahe hon ya persistent hon to doctor se consult karein.',
  clinicalContext,
  possibleCauses: typedFindings.length
    ? [...new Set(typedFindings.flatMap((finding) => finding.possibleReasons))].slice(0, 8)
    : hasEmergency
    ? [
      'Acute respiratory infection ya bronchitis',
      'Asthma/allergy flare with wheezing',
      'Pneumonia ya lower respiratory infection',
      'Severe anxiety/panic can mimic breathlessness, but physical causes must be ruled out first',
      'Heart/lung related issue if chest pain, sweating, bluish lips, or low oxygen is present',
    ]
    : profile?.possibleCauses || [
      'Viral infection, allergy, lifestyle/diet pattern, dehydration, recent stress, medicine effect, or chronic condition depending on your symptoms/report values.',
      'Exact cause report values, physical exam, vitals, medical history and repeat testing trend se confirm hota hai.',
    ],
  homeRemedies: profile?.homeRemedies || [
    'Hydration maintain rakhein: warm water, soup, ORS ya normal fluids. Dehydration lab values aur symptoms dono ko worsen kar sakta hai.',
    'Cough/cold me steam inhalation 5-10 min kar sakte hain, lekin burning risk se bachkar. Asthma/wheezing me steam suit na kare to avoid karein.',
    'Smoke, dust, strong perfume, cold air aur pollution exposure avoid karein.',
    'Rest karein, sleep improve karein, aur heavy exercise temporarily avoid karein agar breathlessness ya fever ho.',
    'Fever ya body ache me self-medication se pehle allergy, liver/kidney issue, pregnancy ya existing medicines ka dhyan rakhein.',
    'Persistent cough, fever, wheezing, yellow/green sputum, chest discomfort, ya breathing issue ho to doctor consult karein.',
  ],
  nextSteps: profile?.nextSteps || [
    'Symptoms ka duration, fever, oxygen saturation, pulse, BP, medicines, allergy/asthma history, aur report date note karein.',
    'Agar report uploaded hai, abnormal values ko report ke reference range ke saath doctor ko dikhayein. Same lab me repeat test trend useful hota hai.',
    'Related test cards awareness/screening ke liye hain. Card click karke booking form open kar sakte hain.',
    'Severe breathing difficulty, chest pain, fainting, blue lips, blood in cough, or confusion me chatbot ka wait na karein, emergency help lein.',
  ],
  redFlags,
  reportFindings: typedFindings.length
    ? typedFindings
    : reportText
    ? [{
      testName: 'Uploaded report',
      value: 'PDF text scanned',
      status: 'review_needed',
      remark: 'Report text read ho gaya, lekin exact high/low value reliably identify nahi ho paayi. Clear lab table/reference range wala PDF upload karein ya value manually type karein.',
      possibleReasons: ['Scanned/unclear PDF', 'Reference range missing', 'Report formatting not readable'],
      action: 'Doctor/lab specialist se report review karwayein, especially symptoms present hon to.',
    }]
    : [],
  recommendedTests: cards,
  disclaimer: 'AI guidance educational hai. Final diagnosis aur treatment qualified doctor karega.',
  provider: 'fallback',
  language: languageStyle,
  };
};

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const timeout = withTimeout();
  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: timeout.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.35, responseMimeType: 'application/json' },
        }),
      },
    );
  } finally {
    timeout.cancel();
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Gemini request failed');
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || '';
};

const callGeminiWithFile = async (prompt, buffer, mimeType) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured');
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const timeout = withTimeout(25000);
  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: timeout.signal,
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: buffer.toString('base64'),
                },
              },
              { text: prompt },
            ],
          }],
          generationConfig: { temperature: 0.25, responseMimeType: 'application/json' },
        }),
      },
    );
  } finally {
    timeout.cancel();
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Gemini file request failed');
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n') || '';
};

const callGrok = async (prompt) => {
  const apiKey = process.env.GROK_API_KEY || process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('Grok API key not configured');
  const model = process.env.GROK_MODEL || 'grok-3-mini';
  const timeout = withTimeout();
  let response;
  try {
    response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: timeout.signal,
      body: JSON.stringify({
        model,
        temperature: 0.35,
        messages: [
          { role: 'system', content: 'You are a cautious healthcare symptom guidance assistant. Return valid JSON only.' },
          { role: 'user', content: prompt },
        ],
      }),
    });
  } finally {
    timeout.cancel();
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Grok request failed');
  return data.choices?.[0]?.message?.content || '';
};

const handleChatRequest = async (req, res) => {
  try {
    const message = (req.body.message || '').trim();
    if (!message) return res.status(400).json({ error: 'Question is required.' });

    const catalog = await getCatalog();
    const cards = findRelevantCards(message, catalog);
    const hasEmergency = emergencyKeywords.some((keyword) => normalize(message).includes(keyword));
    const languageStyle = detectLanguageStyle(message);
    const catalogContext = [...catalog.packages.slice(0, 30), ...catalog.tests.slice(0, 40)]
      .map((item) => ({
        title: item.title || item.name,
        category: item.category,
        tags: item.searchTags,
        price: item.discountedPrice || item.price,
        reportTimeHours: item.reportTimeHours || item.turnaroundTime,
      }));

    const prompt = `
User question: ${message}

Uploaded report extracted text / scan instruction:
${req.reportText ? req.reportText.slice(0, 12000) : 'No PDF report uploaded.'}
${req.needsVisionRead ? 'Important: The report file is also attached as native input. Read it visually/OCR-style, table-wise, and extract lab values yourself.' : ''}

Platform catalog context:
${JSON.stringify(catalogContext)}

Language instruction:
${languageLine(languageStyle)}

Return JSON with keys:
summary: detailed professional Hinglish answer with safety triage and PDF report explanation if uploaded,
doctorExplanation: array of point-wise doctor-style explanation bullets,
clinicalContext: detailed direct clinic context: what a doctor would ask, what vitals/exam points would be checked, how the report/symptom is interpreted, and which related values matter,
reportFindings: array. Each item must include testName, value, status ("high"|"low"|"normal"|"review_needed"), remark, possibleReasons array, action,
possibleCauses: array of likely categories/possibilities, not final diagnosis,
homeRemedies: array of safe home-care steps,
redFlags: array of warning signs requiring urgent care; must be specific to the user's symptom/report, not generic,
nextSteps: array of practical next steps,
disclaimer: one sentence,
recommendedSearchTags: array of catalog keywords.

Rules:
- Do not diagnose with certainty.
- If breathing problem, chest pain, blue lips, fainting, severe wheezing, or blood in cough is mentioned, advise urgent doctor/emergency care.
- Recommend platform tests only as awareness/screening, not as a replacement for doctor care.
- If a report PDF/image is uploaded, extract visible blood test/lab values, units, flags (H/L), and reference ranges. Explain possible meaning of abnormal/high/low values in simple terms, without claiming final diagnosis.
- For every clearly visible high/low report value, mention: kya badha/ghata hai, possible common reasons, risk/meaning, and next practical action.
- If reference range is missing or text is unclear, say "review_needed" instead of guessing.
- After report remarks, give home remedies only when safe and symptom-appropriate.
- Use the user's language style: Hinglish/Hindi-friendly, but professional.
- Give a long, useful answer: at least 6-10 sentences in summary/clinicalContext combined, and practical bullet arrays.
- Make the response point-wise, like a doctor explaining a report to a patient: "What I noticed", "What it may mean", "Why it can happen", "What to do next", "When to worry".
- Clinical context must be direct and practical, not short: mention clinic questions, vitals/physical examination, related report markers, and when repeat/trend matters.
- Red flags must match the condition. Example: diabetes should mention very high/low sugar symptoms; liver should mention jaundice/dark urine/abdominal pain/confusion/bleeding; respiratory should mention low oxygen/chest pain/blue lips/blood in cough.
- Use real platform catalog context for recommended tests/packages only; do not invent package prices if not in catalog.
`;

    let provider = 'gemini';
    let aiJson = null;
    const providerStatus = { gemini: 'not_called', grok: 'not_called' };
    try {
      providerStatus.gemini = 'called';
      aiJson = extractJson(req.reportBuffer ? await callGeminiWithFile(prompt, req.reportBuffer, req.reportMimeType) : await callGemini(prompt));
      providerStatus.gemini = aiJson ? 'ok' : 'invalid_json';
    } catch (geminiError) {
      providerStatus.gemini = geminiError.name === 'AbortError' ? 'timeout_or_network' : 'failed';
      provider = 'grok';
      try {
        providerStatus.grok = 'called';
        aiJson = extractJson(await callGrok(prompt));
        providerStatus.grok = aiJson ? 'ok' : 'invalid_json';
      } catch (grokError) {
        providerStatus.grok = grokError.name === 'AbortError' ? 'timeout_or_network' : 'failed';
        provider = 'fallback';
      }
    }

    const answer = aiJson || buildFallbackAnswer(message, cards, hasEmergency, req.reportText);
    res.json({
      ...answer,
      reportFindings: Array.isArray(answer.reportFindings) ? answer.reportFindings : [],
      recommendedTests: cards,
      provider,
      emergency: hasEmergency,
      reportScanned: Boolean(req.reportText),
      extractedCharacters: req.reportText?.length || 0,
      usedVisionPdf: Boolean(req.needsVisionRead),
      uploadedFileType: req.reportMimeType || null,
      language: answer.language || languageStyle,
      providerStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Chatbot failed.' });
  }
};

router.post('/', handleChatRequest);

router.post('/analyze-file', (req, res, next) => {
  reportUpload.single('report')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message || 'Report upload failed.' });
    return next();
  });
}, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Report PDF/image is required.' });
    req.reportMimeType = req.file.mimetype;
    req.reportBuffer = req.file.buffer;

    if (req.file.mimetype === 'application/pdf') {
      req.reportText = await extractPdfText(req.file.buffer);
      req.needsVisionRead = !req.reportText.trim() || req.reportText.trim().length < 80;
      if (req.needsVisionRead) {
        req.reportText = req.reportText.trim()
          ? `Only a small amount of selectable text was extracted: ${req.reportText.trim()}`
          : 'No selectable text was extracted; treat this as a scanned/image PDF and read the attached PDF visually.';
      }
    } else {
      req.reportText = 'Image report uploaded. Read the attached image visually/OCR-style and extract visible lab values, high/low flags, units, and reference ranges.';
      req.needsVisionRead = true;
    }
    req.body.message = req.body.message || 'Is report ko simple language me analyze karke bataiye.';
    return handleChatRequest(req, res);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'PDF scan failed.' });
  }
});

router.post('/analyze-pdf', (req, res, next) => {
  req.url = '/analyze-file';
  return router.handle(req, res, next);
});

module.exports = router;
