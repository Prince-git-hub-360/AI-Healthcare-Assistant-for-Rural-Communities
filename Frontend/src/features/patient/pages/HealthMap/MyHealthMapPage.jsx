import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, LANGUAGES } from '../../../../shared/context/AuthContext';
import { api } from '../../../../services/api';
import {
  SparklesIcon,
  SpeakerIcon,
  CheckIcon,
  SearchIcon,
  AlertIcon,
  DocumentIcon,
  PillIcon,
  HeartIcon,
  ShieldIcon,
  HospitalIcon,
  ClockIcon,
} from '../../../../shared/icons/Icons';
import { speakNativeAudio, stopNativeAudio } from '../../../../shared/utils/speech';

// Comprehensive 14-Organ & System Knowledge Base with Multilingual Clinical Wisdom
export const ORGANS_KNOWLEDGE_BASE = [
  {
    id: 'cardio',
    name: 'Heart & Blood Circulation',
    category: 'vital',
    icon: '❤️',
    image: '/assets/anatomy/organs/heart_3d.jpg',
    color: '#E11D48',
    bgGradient: 'from-rose-500/20 via-rose-500/5 to-transparent',
    borderColor: 'border-rose-300 dark:border-rose-900/60',
    nativeName: {
      hi: 'हृदय और रक्त परिसंचरण',
      kn: 'ಹೃದಯ ಮತ್ತು ರಕ್ತ ಪರಿಚಲನೆ',
      mr: 'हृदय आणि रक्तदाब',
      te: 'గుండె & రక్త ప్రసరణ',
      ta: 'இதயம் & ரத்த ஓட்டம்',
      bn: 'হৃদয় ও রক্তচাপ',
      gu: 'હૃદય અને રક્ત પરિભ્રમણ',
      pa: 'ਦਿਲ ਅਤੇ ਖੂਨ ਦਾ ਦੌਰਾ',
      ml: 'ഹൃദയവും രക്തചംക്രമണവും',
      or: 'ହୃଦୟ ଏବଂ ରକ୍ତ ସଞ୍ଚାଳନ',
      en: 'Heart & Blood Circulation'
    },
    benchmark: {
      bp: '120/80 mmHg',
      pulse: '72 bpm',
      target: 'Normal Blood Pressure & Pulse'
    },
    whatIsIt: 'Your heart is a muscular pump in your chest that beats 70 to 80 times every minute, pumping fresh oxygen and life-giving blood to your brain, muscles, and every organ.',
    warningSigns: [
      'Sudden heavy pressure, squeezing, or tightness in the center of the chest.',
      'Chest pain radiating to the left arm, shoulder, jaw, or neck with cold sweat.',
      'Sudden severe breathlessness while resting or walking a few steps.'
    ],
    dailyCareTips: [
      'Cut down daily salt (namak) — avoid raw salt, salty pickles, and papad.',
      'Walk briskly for 30 minutes every morning in fresh air.',
      'Switch from heavy saturated oils to mustard oil or peanut oil in moderation.',
      'Take prescribed BP/Heart medications at the exact same hour every morning.'
    ],
    dosAndDonts: {
      dos: ['Eat fresh green vegetables and seasonal fruits.', 'Practice morning deep breathing and calm walking.', 'Check Blood Pressure once every month at your PHC.'],
      donts: ['Never stop BP medicine suddenly when feeling fine.', 'Avoid bidi, smoking, and chewing tobacco/gutkha.', 'Avoid excessive fried street snacks and vanaspati ghee.']
    },
    keywords: ['relicard', 'dalstep', 'blood pressure', 'bp', 'heart', 'cardio', 'atorvastatin', 'amlodipine', 'telmisartan', 'cardiac', 'pulse', 'cholesterol']
  },
  {
    id: 'pulmonary',
    name: 'Lungs & Respiratory System',
    category: 'vital',
    icon: '🫁',
    image: '/assets/anatomy/organs/lungs_3d.jpg',
    color: '#06B6D4',
    bgGradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    borderColor: 'border-cyan-300 dark:border-cyan-900/60',
    nativeName: {
      hi: 'फेफड़े और श्वसन तंत्र',
      kn: 'ಶ್ವಾಸಕೋಶ ಮತ್ತು ಉಸಿರಾಟ',
      mr: 'फुफ्फुसे आणि श्वसनसंस्था',
      te: 'ఊపిరితిత్తులు & శ్వాస వ్యవస్థ',
      ta: 'நுரையீரல் & சுவாசம்',
      bn: 'ফুসফুস ও শ্বাসতন্ত্র',
      gu: 'ફેફસાં અને શ્વસનતંત્ર',
      pa: 'ਫੇਫੜੇ ਅਤੇ ਸਾਹ ਪ੍ਰਣਾਲੀ',
      ml: 'ശ്വാസകോശവും ശ്വസനവും',
      or: 'ଫୁସଫୁସ ଏବଂ ଶ୍ୱାସକ୍ରିୟା',
      en: 'Lungs & Respiratory System'
    },
    benchmark: {
      bp: 'SpO2: 95%–100%',
      pulse: '14–18 breaths/min',
      target: 'Clear Airways & High Oxygen'
    },
    whatIsIt: 'The lungs absorb fresh oxygen from the air into your bloodstream and breathe out carbon dioxide waste gas from every cell.',
    warningSigns: [
      'Persistent cough lasting longer than 2 weeks (potential TB or infection alert).',
      'Coughing up blood or rust-colored sputum.',
      'High whistling sound (wheezing) or gasping for breath when lying down.'
    ],
    dailyCareTips: [
      'Ensure well-ventilated kitchens — avoid inhaling wood/chulha smoke directly.',
      'Inhale warm water steam with a pinch of tulsi during seasonal weather change.',
      'Drink warm water during cold mornings to clear mucus from the throat.',
      'Complete full antibiotic or inhaler courses prescribed by your PHC doctor.'
    ],
    dosAndDonts: {
      dos: ['Open windows for sunlight and fresh air circulation.', 'Wear a cloth scarf or mask in dusty farming/threshing areas.', 'Get vaccinated for Pneumonia and routine TB screening.'],
      donts: ['Never ignore a 2-week continuous cough — visit PHC immediately.', 'Do not smoke bidis or sit near indoor wood-smoke chulhas.', 'Avoid cold iced drinks when experiencing sore throat.']
    },
    keywords: ['lung', 'cough', 'asthma', 'inhaler', 'ambroxol', 'chest', 'breath', 'oxygen', 'spo2', 'bronchial', 'respiratory', 'cold', 'tb', 'tuberculosis']
  },
  {
    id: 'neuro',
    name: 'Brain & Nervous System',
    category: 'vital',
    icon: '🧠',
    image: '/assets/anatomy/organs/brain_3d.jpg',
    color: '#3B82F6',
    bgGradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
    borderColor: 'border-blue-300 dark:border-blue-900/60',
    nativeName: {
      hi: 'मस्तिष्क और तंत्रिका तंत्र',
      kn: 'ಮೆದುಳು ಮತ್ತು ನರಮಂಡಲ',
      mr: 'मेंदू आणि मज्जासंस्था',
      te: 'మెదడు & నాడీ వ్యవస్థ',
      ta: 'மூளை & நரம்பு மண்டலம்',
      bn: 'মস্তিষ্ক ও স্নায়ুতন্ত্র',
      gu: 'મગજ અને ચેતાતંત્ર',
      pa: 'ਦਿਮਾਗ ਅਤੇ ਨਾੜੀ ਪ੍ਰਣਾਲੀ',
      ml: 'തലച്ചോറും നാഡീവ്യവസ്ഥയും',
      or: 'ମସ୍ତିଷ୍କ ଏବଂ ସ୍ନାୟୁ ପ୍ରଣାଳୀ',
      en: 'Brain & Nervous System'
    },
    benchmark: {
      bp: '7–8 Hours Sleep',
      pulse: 'Sharp Reflexes',
      target: 'Optimal Memory & Nerve Strength'
    },
    whatIsIt: 'The brain is the master control center that directs your memory, thoughts, speech, walking balance, and feeling sensations in hands and feet.',
    warningSigns: [
      'FAST Stroke Alert: Sudden Face drooping, Arm weakness, or Slurred Speech.',
      'Sudden blinding headache unlike anything experienced before.',
      'Loss of sensation, tingling "pins and needles" in feet (diabetic neuropathy).'
    ],
    dailyCareTips: [
      'Prioritize 7 to 8 hours of peaceful nighttime sleep in a dark, quiet room.',
      'Eat Vitamin B-rich foods like sprouted grams, lentils, and dairy milk.',
      'Engage in daily social conversations, reading, or memory games to keep mind sharp.',
      'Keep blood sugar and BP tightly controlled to protect brain blood vessels.'
    ],
    dosAndDonts: {
      dos: ['Rush to hospital within 3 hours if someone shows stroke signs.', 'Take prescribed Vitamin B12 and nerve medicines after meals.', 'Stay hydrated with clean water throughout hot days.'],
      donts: ['Never neglect sudden loss of balance or slurred speech.', 'Avoid chronic mental stress and late-night mobile screen use.', 'Do not take heavy sleeping pills without a doctor prescription.']
    },
    keywords: ['benfomate', 'neuropathy', 'headache', 'migraine', 'nerve', 'brain', 'sleep', 'paracetamol', 'fever', 'stress', 'neuro', 'stroke']
  },
  {
    id: 'digestive',
    name: 'Stomach & Intestines (Gut)',
    category: 'vital',
    icon: '🫄',
    image: '/assets/anatomy/organs/stomach_3d.jpg',
    color: '#D97706',
    bgGradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    borderColor: 'border-amber-300 dark:border-amber-900/60',
    nativeName: {
      hi: 'पेट, आंत और पाचन तंत्र',
      kn: 'ಹೊಟ್ಟೆ, ಕರುಳು ಮತ್ತು ಜೀರ್ಣಕ್ರಿಯೆ',
      mr: 'पोट, आतडे आणि पचनसंस्था',
      te: 'జీర్ణాశయం & ప్రేగులు',
      ta: 'வயிறு & குடல் செரிமானம்',
      bn: 'পাকস্থলী ও অন্ত্রের হজম',
      gu: 'જઠર અને પાચનતંત્ર',
      pa: 'ਪੇਟ ਅਤੇ ਪਾਚਨ ਪ੍ਰਣਾਲੀ',
      ml: 'വയറും ദഹനവ്യവസ്ഥയും',
      or: 'ପେଟ ଏବଂ ହଜମ ପ୍ରକ୍ରିୟା',
      en: 'Stomach & Intestines'
    },
    benchmark: {
      bp: 'Daily Regular Bowel',
      pulse: 'Zero Burning Acidity',
      target: 'Healthy Gut Flora & Digestion'
    },
    whatIsIt: 'Your stomach and intestines break down food into energy, absorb vitamins and minerals, and shield your body from harmful gut bacteria.',
    warningSigns: [
      'Severe watery diarrhea (>3 times/day) leading to sunken eyes and dizziness.',
      'Black tarry stools or vomiting blood (internal ulcer warning).',
      'Intense stabbing stomach pain that does not improve after passing gas.'
    ],
    dailyCareTips: [
      'Always drink filtered or boiled warm water, especially during monsoon season.',
      'In case of loose motions, mix 1 packet of ORS in 1 Liter clean water and sip regularly.',
      'Take antacid / gas capsules (Pantocid/Omeprazole) 30 minutes before breakfast.',
      'Eat freshly cooked meals with curd, buttermilk, and fiber-rich greens.'
    ],
    dosAndDonts: {
      dos: ['Wash hands with soap before eating and after using the toilet.', 'Drink homemade buttermilk (chaas) with cumin for digestion.', 'Eat meals at fixed times every day.'],
      donts: ['Never eat stale or uncovered street food.', 'Avoid excess red chili powder, reheated oils, and gut-irritating spices.', 'Do not withhold liquids during diarrhea — give plenty of ORS.']
    },
    keywords: ['stomach', 'pantocid', 'antacid', 'digestion', 'acidity', 'gas', 'gut', 'ulcer', 'gastric', 'reflux', 'diarrhea', 'ors', 'vomiting']
  },
  {
    id: 'liver',
    name: 'Liver & Metabolism',
    category: 'vital',
    icon: '🥩',
    image: '/assets/anatomy/organs/liver_3d.jpg',
    color: '#EA580C',
    bgGradient: 'from-orange-500/20 via-orange-500/5 to-transparent',
    borderColor: 'border-orange-300 dark:border-orange-900/60',
    nativeName: {
      hi: 'यकृत (लिवर) और चयापचय',
      kn: 'ಯಕೃತ್ತು (ಲಿವರ್) ಮತ್ತು ಚಯಾಪಚಯ',
      mr: 'यकृत (लिव्हर) आणि आरोग्य',
      te: 'కాలేయం & జీవక్రియ',
      ta: 'கல்லீரல் செயல்பாடு',
      bn: 'যকৃৎ (লিভার) ও মেটাবলিজম',
      gu: 'યકૃત (લીવર) અને ચયાપચય',
      pa: 'ਜਿਗਰ (ਲਿਵਰ) ਅਤੇ ਸਿਹਤ',
      ml: 'കരൾ (ലിവർ) ആരോഗ്യം',
      or: 'ଯକୃତ (ଲିଭର) ସ୍ୱାସ୍ଥ୍ୟ',
      en: 'Liver & Metabolism'
    },
    benchmark: {
      bp: 'Clear Amber Urine',
      pulse: 'Normal Bilirubin',
      target: 'Toxin Filtering & Healthy Liver'
    },
    whatIsIt: 'The liver is your body’s chemical factory. It neutralizes toxins, produces bile to digest fats, and stores glycogen energy.',
    warningSigns: [
      'Yellowing of the whites of your eyes and skin (Jaundice / पीलिया).',
      'Dark tea-colored urine with pale white stools.',
      'Swelling in the abdomen (fluid accumulation) and extreme loss of appetite.'
    ],
    dailyCareTips: [
      'Avoid all forms of local country liquor and alcohol that destroy liver tissue.',
      'Eat light, boiled foods with turmeric, papaya, and amla (Indian gooseberry).',
      'Drink clean boiled water to prevent Hepatitis A and E viral infections.',
      'Avoid unnecessary self-medication with unprescribed painkiller tablets.'
    ],
    dosAndDonts: {
      dos: ['Eat freshly cooked home food rich in antioxidants.', 'Drink clean safe water to protect against waterborne jaundice.', 'Get Hepatitis B vaccination at the PHC.'],
      donts: ['Strictly zero alcohol consumption.', 'Avoid eating cut fruits exposed to flies in open markets.', 'Do not take heavy doses of Paracetamol without doctor guidance.']
    },
    keywords: ['liver', 'jaundice', 'hepatitis', 'bilirubin', 'fatty liver', 'sgot', 'sgpt', 'bile', 'alcohol', 'cirrhosis']
  },
  {
    id: 'kidneys',
    name: 'Kidneys & Urinary System',
    category: 'vital',
    icon: '🫘',
    image: '/assets/anatomy/organs/kidneys_3d.jpg',
    color: '#0D9488',
    bgGradient: 'from-teal-500/20 via-teal-500/5 to-transparent',
    borderColor: 'border-teal-300 dark:border-teal-900/60',
    nativeName: {
      hi: 'गुर्दे (किडनी) और मूत्र प्रणाली',
      kn: 'ಮೂತ್ರಪಿಂಡಗಳು (ಕಿಡ್ನಿ) ಮತ್ತು ಶೋಧನೆ',
      mr: 'मूत्रपिंड (किडनी) आणि मूत्राशय',
      te: 'మూత్రపిండాలు (కిడ్నీలు)',
      ta: 'சிறுநீரகங்கள் & சிறுநீர்ப்பை',
      bn: 'বৃক্ক (কিডনি) ও মূত্রনালী',
      gu: 'મૂત્રપિંડ (કિડની) અને મૂત્રમાર્ગ',
      pa: 'ਗੁਰਦੇ (ਕਿਡਨੀ) ਅਤੇ ਪਿਸ਼ਾਬ ਪ੍ਰਣਾਲੀ',
      ml: 'വൃക്കകളും മൂത്രവ്യവസ്ഥയും',
      or: 'ବୃକ୍‌କ (କିଡନୀ) ଏବଂ ମୂତ୍ରାଶୟ',
      en: 'Kidneys & Urinary System'
    },
    benchmark: {
      bp: 'Creatinine: 0.7–1.2 mg/dL',
      pulse: '2.5–3 Liters Water',
      target: 'Optimal Filtration & Clear Urine'
    },
    whatIsIt: 'Your two kidneys filter 180 liters of blood daily to flush out toxic urea and waste fluids while keeping vital salts balanced.',
    warningSigns: [
      'Puffiness around the eyes in the morning and swelling in both ankles/feet.',
      'Severe burning sensation or difficulty passing urine with fever/chills.',
      'Frothy, foamy, or red blood-tinged urine.'
    ],
    dailyCareTips: [
      'Drink 2.5 to 3 liters of clean drinking water evenly throughout the day.',
      'Never hold urine for long periods — empty bladder promptly.',
      'Control high blood pressure and diabetes, which are the #1 cause of kidney damage.',
      'Avoid popping unprescribed NSAID painkiller pills (Diclofenac/Ibuprofen).'
    ],
    dosAndDonts: {
      dos: ['Maintain hydration with clean drinking water and coconut water.', 'Get routine urine albumin tests if you have diabetes or hypertension.', 'Eat fresh gourd, cucumber, and barley water.'],
      donts: ['Never take over-the-counter painkiller pills repeatedly for body aches.', 'Do not hold urine for hours.', 'Avoid excessive raw salt consumption.']
    },
    keywords: ['kidney', 'renal', 'creatinine', 'urine', 'filter', 'hydration', 'urea', 'nephro', 'swelling', 'dialysis', 'bladder']
  },
  {
    id: 'pancreas',
    name: 'Pancreas & Blood Sugar (Diabetes)',
    category: 'chronic',
    icon: '🩺',
    image: '/assets/anatomy/organs/pancreas_3d.jpg',
    color: '#854D0E',
    bgGradient: 'from-yellow-500/20 via-yellow-500/5 to-transparent',
    borderColor: 'border-yellow-300 dark:border-yellow-900/60',
    nativeName: {
      hi: 'अग्न्याशय और रक्त शर्करा (मधुमेह)',
      kn: 'ಮೇದೋಜ್ಜೀರಕ ಗ್ರಂಥಿ ಮತ್ತು ರಕ್ತದ ಸಕ್ಕರೆ (ಮಧುಮೇಹ)',
      mr: 'स्वा स्वादुपिंड आणि रक्तातील साखर (मधुमेह)',
      te: 'క్లోమం & రక్తంలో చక్కెర (మధుమేహం)',
      ta: 'கணையம் & இரத்த சர்க்கரை (நீரிழிவு)',
      bn: 'অগ্ন্যাশয় ও রক্তের শর্করা (ডায়াবেটিস)',
      gu: 'સ્વાદુપિંડ અને ડાયાબિટીસ',
      pa: 'ਲਬਲਬਾ ਅਤੇ ਸ਼ੂਗਰ (ਸ਼ੱਕਰ ਰੋਗ)',
      ml: 'പാൻക്രിയാസും പ്രമേഹവും',
      or: 'ଅଗ୍ନାଶୟ ଏବଂ ମଧୁମେହ (ଚିନି ରୋଗ)',
      en: 'Pancreas & Blood Sugar'
    },
    benchmark: {
      bp: 'Fasting: 70–100 mg/dL',
      pulse: 'Post Meal: <140 mg/dL',
      target: 'HbA1c < 6.5% (Non-Diabetic)'
    },
    whatIsIt: 'The pancreas produces natural insulin hormone that unlocks body cells to absorb blood glucose sugar for daily physical energy.',
    warningSigns: [
      'Excessive thirst, frequent urination (especially at night), and dry mouth.',
      'Rapid unexplained weight loss despite eating normally.',
      'Slow-healing foot wounds or non-healing ulcers that risk infection.'
    ],
    dailyCareTips: [
      'Switch from polished white rice and maida to traditional millets: Ragi, Jowar, Bajra.',
      'Take Metformin or prescribed diabetes pills strictly after meals on time.',
      'Inspect feet daily for cuts, blisters, or thorn pricks; wear comfortable slippers.',
      'Engage in 30 minutes of physical walking or farming activity daily.'
    ],
    dosAndDonts: {
      dos: ['Eat fiber-rich fenugreek (methi), bitter gourd (karela), and green beans.', 'Check fasting blood sugar once every month at the sub-center.', 'Wear footwear even indoors to protect diabetic feet.'],
      donts: ['Never skip meals after taking diabetes medications (prevents low sugar shock).', 'Avoid refined white sugar, sweets (mithai), and sweet tea.', 'Do not walk barefoot on hot mud roads or rough fields.']
    },
    keywords: ['metformin', 'sugar', 'glucose', 'diabetes', 'insulin', 'hba1c', 'pancreas', 'glimepiride', 'glycomet', 'sweet', 'diabetic']
  },
  {
    id: 'blood',
    name: 'Blood, Hemoglobin & Immunity',
    category: 'vital',
    icon: '🩸',
    image: '/assets/anatomy/organs/blood_3d.jpg',
    color: '#991B1B',
    bgGradient: 'from-red-600/20 via-red-600/5 to-transparent',
    borderColor: 'border-red-300 dark:border-red-900/60',
    nativeName: {
      hi: 'रक्त, हीमोग्लोबिन और रोग प्रतिरोधक क्षमता',
      kn: 'ರಕ್ತ, ಹಿಮೋಗ್ಲೋಬಿನ್ ಮತ್ತು ರೋಗನಿರೋಧಕ ಶಕ್ತಿ',
      mr: 'रक्त, हिमोग्लोबिन आणि प्रतिकारशक्ती',
      te: 'రక్తం, హిమోగ్లోబిన్ & రోగనిరోధక శక్తి',
      ta: 'இரத்தம், ஹீமோகுளோபின் & நோய் எதிர்ப்பு',
      bn: 'রক্ত, হিমোগ्लोবিন ও রোগ প্রতিরোধ',
      gu: 'લોહી, હિમોગ્લોબિન અને રોગપ્રતિકારક શક્તિ',
      pa: 'ਖੂਨ, ਹੀਮੋਗਲੋਬਿਨ ਅਤੇ ਪ੍ਰਤੀਰੋਧਕ ਸਮਰੱਥਾ',
      ml: 'രക്തം, ഹീമോഗ്ലോബിൻ & പ്രതിരോധശേഷി',
      or: 'ରକ୍ତ, ହିମୋଗ୍ଲୋବିନ୍ ଏବଂ ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତି',
      en: 'Blood, Hemoglobin & Immunity'
    },
    benchmark: {
      bp: 'Hb: 12.0–15.5 g/dL',
      pulse: 'WBC: 4,000–11,000',
      target: 'Strong Oxygen Carrier & Immunity'
    },
    whatIsIt: 'Blood carries oxygen via red hemoglobin cells to all body tissues while white cells fight off infections and platelets seal cuts.',
    warningSigns: [
      'Pale inner eyelids, tongue, and nail beds with extreme fatigue (Anemia alert).',
      'Dizziness or fainting spells when standing up quickly.',
      'Unexplained easy skin bruising or bleeding from gums.'
    ],
    dailyCareTips: [
      'Eat iron-rich local foods: Jaggery (Gud), Roasted Chana, Spinach (Palak), Beetroot.',
      'Take Iron & Folic Acid (IFA) red/blue tablets supplied free by ASHA workers.',
      'Pair iron-rich foods with Vitamin C (lemon/amla) to dramatically boost absorption.',
      'Cook in traditional iron kadhais to naturally infuse dietary iron.'
    ],
    dosAndDonts: {
      dos: ['Eat green leafy vegetables (saag) at least 3 times a week.', 'Take Iron tablets after dinner with water or lemon juice.', 'Deworm every 6 months with Albendazole tablets.'],
      donts: ['Do not drink strong tea or coffee immediately after meals (blocks iron).', 'Never ignore pale conjunctiva or persistent exhaustion.', 'Do not stop iron tablets due to black stool (it is harmless).']
    },
    keywords: ['blood', 'hemoglobin', 'anemia', 'iron', 'folic acid', 'platelets', 'wbc', 'rbc', 'cbc', 'fatigue', 'weakness', 'pale']
  },
  {
    id: 'bones',
    name: 'Bones, Joints & Spine',
    category: 'lifestyle',
    icon: '🦴',
    image: '/assets/anatomy/organs/bones_3d.jpg',
    color: '#64748B',
    bgGradient: 'from-slate-500/20 via-slate-500/5 to-transparent',
    borderColor: 'border-slate-300 dark:border-slate-700',
    nativeName: {
      hi: 'हड्डियां, जोड़ और रीढ़ की हड्डी',
      kn: 'ಮೂಳೆಗಳು, ಕೀಲುಗಳು ಮತ್ತು ಬೆನ್ನುಮೂಳೆ',
      mr: 'हाडे, सांधे आणि मणका',
      te: 'ఎముకలు, కీళ్ళు & వెన్నుముక',
      ta: 'எலும்புகள், மூட்டுகள் & முதுகெலும்பு',
      bn: 'হাড়, জয়েন্ট ও মেরুদণ্ড',
      gu: 'હાડકાં, સાંધા અને કરોડરજ્જુ',
      pa: 'ਹੱਡੀਆਂ, ਜੋੜ ਅਤੇ ਰੀੜ੍ਹ ਦੀ ਹੱਡੀ',
      ml: 'അസ്ഥികളും സന്ധികളും നട്ടെല്ലും',
      or: 'ହାଡ଼, ଗଣ୍ଠି ଏବଂ ମେରୁଦଣ୍ଡ',
      en: 'Bones, Joints & Spine'
    },
    benchmark: {
      bp: 'Calcium: 8.5–10.2 mg/dL',
      pulse: 'Pain-Free Motion',
      target: 'Strong Skeletal Structure'
    },
    whatIsIt: 'Your 206 bones and flexible cartilage joints provide the sturdy framework for standing, lifting farming loads, and walking.',
    warningSigns: [
      'Severe morning joint stiffness lasting >1 hour with red, swollen knuckles.',
      'Inability to bear weight on knee or hip after a fall (fracture risk).',
      'Sudden shooting electric pain traveling down the leg (Sciatica/nerve pinch).'
    ],
    dailyCareTips: [
      'Get 20 minutes of gentle morning sunlight to synthesize natural Vitamin D3.',
      'Consume calcium-dense local staples: Ragi (finger millet), sesame (til), and milk.',
      'Maintain an upright posture when lifting heavy farm loads — bend knees, not back.',
      'Do gentle knee-strengthening exercises while sitting on a chair.'
    ],
    dosAndDonts: {
      dos: ['Eat Ragi mudde, Ragi roti, and dairy products for strong bone density.', 'Wear supportive footwear during long standing agricultural shifts.', 'Take Calcium + Vitamin D3 supplements as prescribed.'],
      donts: ['Never bend abruptly at the waist to lift 50kg sacks.', 'Avoid smoking and excessive alcohol, which leach calcium from bones.', 'Do not ignore persistent severe joint swelling.']
    },
    keywords: ['bone', 'joint', 'calcium', 'vitamin d', 'arthritis', 'knee', 'spine', 'back pain', 'fracture', 'osteoporosis', 'ragi']
  },
  {
    id: 'eyes',
    name: 'Eyes & Vision Care',
    category: 'lifestyle',
    icon: '👁️',
    image: '/assets/anatomy/organs/eyes_3d.jpg',
    color: '#0284C7',
    bgGradient: 'from-sky-500/20 via-sky-500/5 to-transparent',
    borderColor: 'border-sky-300 dark:border-sky-900/60',
    nativeName: {
      hi: 'आंखें और दृष्टि स्वास्थ्य',
      kn: 'ಕಣ್ಣುಗಳು ಮತ್ತು ದೃಷ್ಟಿ ಆರೈಕೆ',
      mr: 'डोळे आणि दृष्टी काळजी',
      te: 'కళ్ళు & దృష్టి సంరక్షణ',
      ta: 'கண்கள் & பார்வை நலம்',
      bn: 'চোখ ও দৃষ্টিশক্তি',
      gu: 'આંખો અને દ્રષ્ટિ સંભાળ',
      pa: 'ਅੱਖਾਂ ਅਤੇ ਨਜ਼ਰ ਦੀ ਦੇਖਭਾਲ',
      ml: 'കണ്ണുകളും കാഴ്ചയും',
      or: 'ଆଖି ଏବଂ ଦୃଷ୍ଟିଶକ୍ତି',
      en: 'Eyes & Vision Care'
    },
    benchmark: {
      bp: '6/6 Sharp Vision',
      pulse: 'IOP: 10–21 mmHg',
      target: 'Clear Lens & Healthy Retina'
    },
    whatIsIt: 'Your eyes capture light through the cornea and lens, projecting clear images onto the retina to guide your daily life and work.',
    warningSigns: [
      'Cloudy, milky blurriness or glare around night lights (Cataract / मोतियाबिंद).',
      'Sudden severe eye pain with rainbow halos and headache (Glaucoma emergency).',
      'Floating dark spots or curtain-like vision loss (Retina alert in diabetes).'
    ],
    dailyCareTips: [
      'Eat Vitamin A-rich foods: Carrots, Papaya, Mango, Pumpkin, and Drumstick leaves.',
      'Wash eyes gently with clean cold drinking water after working in dusty fields.',
      'Get free cataract screening at government district PHC eye camps annually.',
      'Keep blood sugar controlled to prevent diabetic retinopathy vision damage.'
    ],
    dosAndDonts: {
      dos: ['Wear protective wide-brim hats or sunglasses during harsh sunny farming.', 'Visit the PHC immediately for cataract surgery if vision gets foggy.', 'Use doctor-prescribed eye drops only.'],
      donts: ['Never put unsterile rose water, milk, or herbal juices into the eyes.', 'Do not rub eyes vigorously with dirty farming hands.', 'Never use leftover steroid eye drops for red eye infections.']
    },
    keywords: ['eye', 'vision', 'cataract', 'glasses', 'cornea', 'retina', 'blindness', 'vitamin a', 'glaucoma', 'motiyabind']
  },
  {
    id: 'ent',
    name: 'Ears, Nose & Throat (ENT)',
    category: 'lifestyle',
    icon: '👂',
    image: '/assets/anatomy/organs/ent_3d.jpg',
    color: '#8B5CF6',
    bgGradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
    borderColor: 'border-purple-300 dark:border-purple-900/60',
    nativeName: {
      hi: 'कान, नाक और गला (ENT)',
      kn: 'ಕಿವಿ, ಮೂಗು ಮತ್ತು ಗಂಟಲು',
      mr: 'कान, नाक आणि घसा',
      te: 'చెవులు, ముక్కు & గొంతు',
      ta: 'காது, மூக்கு & தொண்டை',
      bn: 'কান, নাক ও গলা',
      gu: 'કાન, નાક અને ગળું',
      pa: 'ਕੰਨ, ਨੱਕ ਅਤੇ ਗਲਾ',
      ml: 'ചെവി, മൂക്ക്, തൊണ്ട',
      or: 'କାନ, ନାକ ଏବଂ ଗଳା',
      en: 'Ears, Nose & Throat (ENT)'
    },
    benchmark: {
      bp: 'Clear Hearing',
      pulse: 'Clean Sinuses',
      target: 'Infection-Free ENT Pathways'
    },
    whatIsIt: 'Your ENT system enables clear hearing, balance in the inner ear, air filtration through the nasal passage, and speech articulation.',
    warningSigns: [
      'Yellow pus discharge or foul-smelling fluid draining from the ear.',
      'Severe earache with reduced hearing, especially in young children.',
      'Persistent hoarse, raspy voice lasting >3 weeks or difficulty swallowing.'
    ],
    dailyCareTips: [
      'Gargle with warm salt water twice daily for soothing throat irritation.',
      'Keep ears completely dry — do not insert safety pins, matchsticks, or hairpins.',
      'Inhale mild steam for blocked sinuses during winter and rains.',
      'Get children checked at the PHC if they complain of ear pain after a cold.'
    ],
    dosAndDonts: {
      dos: ['Dry outer ears gently with a clean soft towel after bathing.', 'Gargle warm saline water for sore throat relief.', 'Consult a doctor for safe earwax cleaning.'],
      donts: ['Never poke sharp objects (matchsticks/pins) into the ear canal.', 'Do not pour hot mustard oil or unverified herbal drops into ears.', 'Avoid exposure to deafening loud speakers without ear protection.']
    },
    keywords: ['ear', 'nose', 'throat', 'ent', 'hearing', 'tonsil', 'sinus', 'voice', 'cough', 'hoarseness', 'earache']
  },
  {
    id: 'teeth',
    name: 'Teeth, Gums & Oral Care',
    category: 'lifestyle',
    icon: '🦷',
    image: '/assets/anatomy/organs/teeth_3d.jpg',
    color: '#10B981',
    bgGradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    borderColor: 'border-emerald-300 dark:border-emerald-900/60',
    nativeName: {
      hi: 'दांत, मसूड़े और मौखिक स्वच्छता',
      kn: 'ಹಲ್ಲುಗಳು, ಒಸಡುಗಳು ಮತ್ತು ಬಾಯಿ',
      mr: 'दात, हिरड्या आणि तोंडाचे आरोग्य',
      te: 'దంతాలు & చిగుళ్ళ సంరక్షణ',
      ta: 'பற்கள் & ஈறுகள் நலம்',
      bn: 'দাঁত, মাড়ি ও মুখের যত্ন',
      gu: 'દાંત, પેઢા અને મુખની સ્વચ્છતા',
      pa: 'ਦੰਦ, ਮਸੂੜੇ ਅਤੇ ਮੂੰਹ ਦੀ ਸਫਾਈ',
      ml: 'പല്ലുകളും മോണകളും',
      or: 'ଦାନ୍ତ ଏବଂ ମାଢ଼ି ସ୍ୱାସ୍ଥ୍ୟ',
      en: 'Teeth, Gums & Oral Care'
    },
    benchmark: {
      bp: 'Healthy Pink Gums',
      pulse: '32 Strong Teeth',
      target: 'Cavity-Free & Zero Bleeding'
    },
    whatIsIt: 'Strong teeth and resilient gums are essential for chewing nutritious solid food, clear speech, and preventing heart-damaging oral infections.',
    warningSigns: [
      'White or red patches inside the mouth (leukoplakia — precancerous warning).',
      'Non-healing mouth ulcer that does not heal within 2 weeks.',
      'Bleeding gums when eating and loose, shifting adult teeth.'
    ],
    dailyCareTips: [
      'Brush teeth twice a day (morning and night before bed) using a soft brush.',
      'Rinse mouth thoroughly with clean water after every meal or snack.',
      'Strictly avoid gutkha, khaini, paan masala, and tobacco that cause oral cancer.',
      'Neem datun sticks can be used gently without injuring soft gum tissue.'
    ],
    dosAndDonts: {
      dos: ['Rinse mouth with water after drinking sweet tea or eating food.', 'Eat crunchy raw carrots and apples to naturally strengthen gums.', 'Visit the dental clinic at your Community Health Centre (CHC).'],
      donts: ['Strictly zero gutkha, khaini, supari, and tobacco consumption.', 'Do not use abrasive brick powder or rough charcoal that destroys enamel.', 'Never ignore a mouth sore or patch that stays over 2 weeks.']
    },
    keywords: ['teeth', 'tooth', 'gums', 'oral', 'cavity', 'gutkha', 'tobacco', 'mouth', 'dental', 'bleeding']
  },
  {
    id: 'maternal',
    name: 'Maternal & Child Wellness',
    category: 'maternal',
    icon: '🤰',
    image: '/assets/anatomy/organs/maternal_3d.jpg',
    color: '#EC4899',
    bgGradient: 'from-pink-500/20 via-pink-500/5 to-transparent',
    borderColor: 'border-pink-300 dark:border-pink-900/60',
    nativeName: {
      hi: 'मातृ, गर्भावस्था एवं शिशु स्वास्थ्य',
      kn: 'ತಾಯಿ ಮತ್ತು ಮಗುವಿನ ಆರೋಗ್ಯ',
      mr: 'माता आणि बाल संगोपन',
      te: 'తల్లి & శిశు సంరక్షణ',
      ta: 'தாய் & சேய் நலம்',
      bn: 'মাতৃ ও শিশু স্বাস্থ্য',
      gu: 'માતા અને બાળ આરોગ્ય',
      pa: 'ਮਾਂ ਅਤੇ ਬੱਚੇ ਦੀ ਦੇਖਭਾਲ',
      ml: 'മാതൃ-ശിശു സംരക്ഷണം',
      or: 'ମାତୃ ଏବଂ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ',
      en: 'Maternal & Child Wellness'
    },
    benchmark: {
      bp: 'BP: <130/80 in Pregnancy',
      pulse: '100% Immunization',
      target: 'Safe Delivery & Thriving Baby'
    },
    whatIsIt: 'Ensuring safe motherhood, adequate pregnancy nutrition, danger sign monitoring, and timely child vaccinations under Ayushman Bharat.',
    warningSigns: [
      'Pregnancy Danger Signs: Vaginal bleeding, severe headache with blurry vision, or swollen face.',
      'Reduced or absent fetal movements in the third trimester.',
      'Child Danger Signs: Inability to breastfeed, chest indrawing, high fever with seizures.'
    ],
    dailyCareTips: [
      'Attend all 4 mandatory Antenatal Checkups (ANC) at your local Anganwadi/PHC.',
      'Take 180 Iron-Folic Acid tablets + Calcium during pregnancy to prevent birth defects.',
      'Exclusive breastfeeding for the first 6 full months (no water, honey, or cow milk).',
      'Follow the National Immunization Schedule: BCG, Polio, Pentavalent, Rotavirus, Measles.'
    ],
    dosAndDonts: {
      dos: ['Register pregnancy early with your local ASHA worker (MCP Card).', 'Eat extra nutritious meals: eggs, pulses, milk, green vegetables, and jaggery.', 'Always plan delivery in a government hospital / PHC (108 Ambulance).'],
      donts: ['Never attempt risky home deliveries without skilled birth attendants.', 'Do not give honey, ghutti, or animal milk to babies under 6 months.', 'Do not skip routine baby vaccine dates.']
    },
    keywords: ['pregnancy', 'maternal', 'baby', 'child', 'anc', 'breastfeeding', 'vaccine', 'immunization', 'asha', 'delivery', 'iron']
  },
  {
    id: 'skin',
    name: 'Skin, Hair & Infection Defense',
    category: 'lifestyle',
    icon: '🧴',
    image: '/assets/anatomy/organs/skin_3d.jpg',
    color: '#14B8A6',
    bgGradient: 'from-teal-500/20 via-teal-500/5 to-transparent',
    borderColor: 'border-teal-300 dark:border-teal-900/60',
    nativeName: {
      hi: 'त्वचा, बाल और संक्रमण सुरक्षा',
      kn: 'ಚರ್ಮ ಮತ್ತು ಸೋಂಕು ರಕ್ಷಣೆ',
      mr: 'त्वचा आणि संसर्ग प्रतिबंध',
      te: 'చర్మం & సంక్రమణ రక్షణ',
      ta: 'தோல் & தொற்று பாதுகாப்பு',
      bn: 'ত্বক ও সংক্রমণ সুরক্ষা',
      gu: 'ત્વચા અને ચેપ સુરક્ષા',
      pa: 'ਚਮੜੀ ਅਤੇ ਇਨਫੈਕਸ਼ਨ ਸੁਰੱਖਿਆ',
      ml: 'ചർമ്മവും രോഗപ്രതിരോധവും',
      or: 'ଚର୍ମ ଏବଂ ସଂକ୍ରମଣ ସୁରକ୍ଷା',
      en: 'Skin, Hair & Infection Defense'
    },
    benchmark: {
      bp: 'Intact Skin Barrier',
      pulse: 'Zero Fungal Rashes',
      target: 'Clean, Hydrated & Rash-Free'
    },
    whatIsIt: 'Your skin is your largest organ, acting as a waterproof shield against dirt, harmful parasites, and bacteria while regulating body temperature.',
    warningSigns: [
      'Expanding red ring-shaped itchy rash (Ringworm / दाद/Fungal infection).',
      'Intense nighttime itching between fingers and wrists (Scabies / खाज).',
      'Non-healing skin ulcers or loss of sensation over a skin patch (Leprosy screening).'
    ],
    dailyCareTips: [
      'Bathe daily with clean water and mild soap, especially after heavy farm sweating.',
      'Wear clean, dry, loose cotton clothes — change clothes immediately if damp.',
      'Keep skin folds (groin, armpits, under feet) completely dry to prevent fungal growth.',
      'Use coconut oil or simple moisturizer on dry, cracked winter skin.'
    ],
    dosAndDonts: {
      dos: ['Wash and dry clothes in bright open sunlight to kill fungal spores.', 'Use antifungal creams (Clotrimazole) as prescribed for the full 2–3 weeks.', 'Keep fingernails trimmed and clean.'],
      donts: ['Never use strong steroid fairness/triple-action creams for ringworm (makes fungus worse).', 'Do not share towels, bedsheets, or clothes with someone having scabies.', 'Avoid scratching itchy rashes with dirty nails.']
    },
    keywords: ['skin', 'rash', 'ringworm', 'fungus', 'itching', 'scabies', 'dermatology', 'eczema', 'wound', 'sunscreen']
  }
];

export const MyHealthMapPage = ({ setCurrentView, onOpenChat }) => {
  const { user, currentLang, updateLanguage, showToast } = useAuth();
  const [selectedOrganId, setSelectedOrganId] = useState('cardio');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'vital', 'chronic', 'maternal', 'lifestyle'
  const [speaking, setSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85);

  // Active organ object
  const activeOrgan = useMemo(() => {
    return ORGANS_KNOWLEDGE_BASE.find((o) => o.id === selectedOrganId) || ORGANS_KNOWLEDGE_BASE[0];
  }, [selectedOrganId]);

  // Filtered list by Category and Search Query
  const filteredOrgans = useMemo(() => {
    return ORGANS_KNOWLEDGE_BASE.filter((org) => {
      // Category filter
      if (activeCategory !== 'all' && org.category !== activeCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = org.name.toLowerCase().includes(q);
        const matchNative = Object.values(org.nativeName).some((n) => n?.toLowerCase().includes(q));
        const matchDesc = org.whatIsIt.toLowerCase().includes(q);
        const matchKeywords = org.keywords.some((k) => k.toLowerCase().includes(q));
        return matchName || matchNative || matchDesc || matchKeywords;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Spoken Voice Narration in Native Language
  const handleSpeak = async () => {
    if (speaking) {
      stopNativeAudio();
      setSpeaking(false);
      return;
    }

    const nativeName = activeOrgan.nativeName[currentLang] || activeOrgan.name;
    const textToSpeak = `${nativeName}. ${activeOrgan.whatIsIt} महत्वपूर्ण सुझाव: ${activeOrgan.dailyCareTips.slice(0, 2).join('. ')}`;

    setSpeaking(true);
    if (showToast) showToast(`Playing voice guide for ${nativeName}...`, 'info');
    try {
      await speakNativeAudio(textToSpeak, currentLang || 'hi');
    } catch {}
    setSpeaking(false);
  };

  const handleConsultAI = () => {
    const nativeName = activeOrgan.nativeName[currentLang] || activeOrgan.name;
    const prompt = `I am learning about ${activeOrgan.name} (${nativeName}) on the Swasthya Gyan Kendra. Please give me personalized rural home care guidance, warning signs, and dietary tips in my language.`;

    if (onOpenChat) {
      onOpenChat(prompt);
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('swasthya:open_ai_assistant', {
          detail: { prompt, area: activeOrgan.name }
        })
      );
    }
  };

  const handleShareWhatsApp = () => {
    const nativeName = activeOrgan.nativeName[currentLang] || activeOrgan.name;
    const shareText = `*🏥 Swasthya Gyan Kendra • ${nativeName} Guide*\n\n📌 *Overview:* ${activeOrgan.whatIsIt}\n\n⚠️ *Warning Signs:*\n${activeOrgan.warningSigns.map((w) => `• ${w}`).join('\n')}\n\n🥗 *Home Care Tips:*\n${activeOrgan.dailyCareTips.map((d) => `• ${d}`).join('\n')}\n\n_Shared from Swasthya Sanchar AI Health Assistant_`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    if (showToast) showToast('Sharing health guide via WhatsApp...', 'success');
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B0F17] min-h-screen font-sans text-slate-900 dark:text-slate-100 pb-20 transition-colors">
      <div className="max-w-[1400px] mx-auto space-y-6 px-3 sm:px-6 pt-3">

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            1. TOP HEADER ROW: BRANDING + SEARCH + LANGUAGE
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-[#0B4F42] via-[#0D5C4D] to-teal-950 text-white rounded-3xl p-6 shadow-xl">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-teal-400/25 text-teal-200 border border-teal-300/30 px-3 py-0.5 rounded-full">
                📚 SWASTHYA GYAN KENDRA
              </span>
              <span className="bg-[#E2A233] text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                14 Systems Covered
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>🩺 All-Organ Health &amp; Wellness Knowledge Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-teal-100/90 font-medium">
              Understand how your body works, recognize red-flag warning signs, and follow healthy rural nutrition across all Indian languages.
            </p>
          </div>

          {/* Controls: Native Language Selector */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 flex items-center gap-2">
              <span className="text-xs pl-2 font-bold text-teal-200">🌐 Language:</span>
              <select
                value={currentLang}
                onChange={(e) => updateLanguage(e.target.value)}
                className="bg-white text-slate-900 font-extrabold text-xs rounded-xl px-3 py-2 cursor-pointer outline-none shadow-sm"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            2. SEARCH & TOPIC CATEGORY SELECTOR BAR
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search organ, symptom, or condition (e.g. Heart, Sugar, Cough, Liver, Anemia)..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-2.5 pl-4 pr-10 text-xs font-bold outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon size={16} />
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: '🌟 All 14 Systems' },
              { id: 'vital', label: '🫀 Vital Organs' },
              { id: 'chronic', label: '🌾 Diabetes & Sugar' },
              { id: 'maternal', label: '🤰 Mother & Child' },
              { id: 'lifestyle', label: '🦴 Bone & Senses' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#0B4F42] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. HORIZONTAL 14-ORGAN SELECTOR CAROUSEL (ICON & PHOTO GRID)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {filteredOrgans.map((org) => {
            const isSelected = selectedOrganId === org.id;
            const nativeTitle = org.nativeName[currentLang] || org.nativeName.hi;

            return (
              <button
                key={org.id}
                type="button"
                onClick={() => setSelectedOrganId(org.id)}
                className={`group flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl min-w-[115px] max-w-[135px] border-2 transition-all cursor-pointer shrink-0 space-y-1 text-center relative overflow-hidden ${
                  isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/80 border-[#0B4F42] dark:border-teal-400 scale-105 shadow-md ring-2 ring-teal-600/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Organ High-Res Image Thumbnail */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-slate-200 dark:border-slate-700 bg-slate-900 flex items-center justify-center">
                  {org.image ? (
                    <img
                      src={org.image}
                      alt={org.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : null}
                  <span className="text-xl hidden">{org.icon}</span>
                </div>

                <span className="font-extrabold text-[11px] text-slate-900 dark:text-white truncate w-full pt-1">
                  {org.name.split(' ')[0]}
                </span>
                <span className="text-[9px] font-bold text-teal-700 dark:text-teal-300 truncate w-full">
                  {nativeTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            4. ACTIVE ORGAN DEEP-DIVE KNOWLEDGE DOSSIER (2-COLUMN GRID)
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================= */}
          {/* LEFT PANEL: ORGAN HERO CARD & WARNING SIGNS (Col 7)       */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Main Organ Educational Card */}
            <div className={`bg-white dark:bg-slate-900 border ${activeOrgan.borderColor} rounded-3xl p-6 sm:p-7 shadow-sm space-y-5 relative overflow-hidden transition-all`}>
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-3xl shadow-sm">
                    {activeOrgan.icon}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {activeOrgan.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-black text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                        {activeOrgan.nativeName[currentLang] || activeOrgan.nativeName.hi}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        {activeOrgan.category.toUpperCase()} SYSTEM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benchmark Pill */}
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 text-right shrink-0">
                  <div className="text-[10px] font-black text-slate-400 uppercase">Healthy Benchmark</div>
                  <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {activeOrgan.benchmark.bp}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500">{activeOrgan.benchmark.target}</div>
                </div>
              </div>

              {/* 🌟 HIGH-QUALITY 3D ORGAN HERO VISUAL BANNER (FULL 100% VISIBILITY) */}
              {activeOrgan.image && (
                <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-950 via-[#0B1220] to-slate-950 shadow-lg group">
                  <div className="h-72 sm:h-96 w-full flex items-center justify-center p-3 sm:p-4">
                    <img
                      src={activeOrgan.image}
                      alt={activeOrgan.name}
                      className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                    />
                  </div>

                  {/* Gradient Overlay & Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/10 pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5 shadow-sm">
                        <span>✨ Complete 3D Model</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak();
                      }}
                      className="pointer-events-auto bg-[#0B4F42] hover:bg-teal-700 text-white text-[11px] font-black px-3 py-1 rounded-full border border-teal-400/40 shadow-sm flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <span>🔊</span>
                      <span>{speaking ? 'Stop' : `Listen Audio`}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 1. How It Works (Simple Rural Language) */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span>📖</span>
                  <span>How It Works in Your Body (कार्यप्रणाली):</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  {activeOrgan.whatIsIt}
                </p>
              </div>

              {/* 2. Red-Flag Warning Signs */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>Red-Flag Warning Signs — When to Rush to a Doctor:</span>
                </h3>
                <div className="space-y-2">
                  {activeOrgan.warningSigns.map((sign, i) => (
                    <div
                      key={i}
                      className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3 rounded-xl flex items-start gap-2.5 text-xs text-rose-950 dark:text-rose-200 font-bold"
                    >
                      <span className="text-rose-600 text-sm shrink-0">🚨</span>
                      <span className="leading-snug">{sign}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio & WhatsApp Action Toolbar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSpeak}
                    className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
                      speaking
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-[#0B4F42] hover:bg-[#093f35] text-white'
                    }`}
                  >
                    <SpeakerIcon size={16} />
                    <span>{speaking ? '⏹ Stop Voice' : `▶ Listen in ${LANGUAGES.find((l) => l.code === currentLang)?.native || 'Hindi'}`}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>📲 Share WhatsApp</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleConsultAI}
                  className="text-xs font-extrabold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <SparklesIcon size={14} />
                  <span>Ask AI about {activeOrgan.name} →</span>
                </button>
              </div>

            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT PANEL: RURAL DIET, DO'S & DON'TS, MYTH BUSTER (Col 5) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Daily Rural Nutrition & Home Care */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span>🥗</span>
                <span>Rural Nutrition &amp; Daily Self-Care:</span>
              </h3>

              <div className="space-y-2">
                {activeOrgan.dailyCareTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✔</span>
                    <span className="leading-snug">{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Do's & Don'ts Box */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span>⚖️</span>
                <span>Do's and Don'ts (क्या करें और क्या न करें):</span>
              </h3>

              <div className="space-y-3 text-xs font-semibold">
                {/* DO'S */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <span>✅ DO (अवश्य करें):</span>
                  </div>
                  {activeOrgan.dosAndDonts.dos.map((item, i) => (
                    <div key={i} className="text-slate-700 dark:text-slate-300 pl-4 relative before:absolute before:left-1 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-500">
                      {item}
                    </div>
                  ))}
                </div>

                {/* DON'TS */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <span>❌ DON'T (कभी न करें):</span>
                  </div>
                  {activeOrgan.dosAndDonts.donts.map((item, i) => (
                    <div key={i} className="text-slate-700 dark:text-slate-300 pl-4 relative before:absolute before:left-1 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-rose-500">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Community Care Hotline Card */}
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800/90 dark:to-slate-800/60 border border-teal-200 dark:border-slate-700 rounded-3xl p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚑</span>
                <div>
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">Emergency National Helplines</div>
                  <div className="text-[10px] text-slate-500 font-medium">Free 24/7 Government Medical Emergency Services</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-extrabold">
                <a href="tel:108" className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-xl text-center shadow-xs">
                  📞 108 (Ambulance)
                </a>
                <a href="tel:104" className="bg-[#0B4F42] hover:bg-[#093f35] text-white p-2 rounded-xl text-center shadow-xs">
                  📞 104 (Health Advice)
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            5. RURAL HEALTH MYTH BUSTERS & FREQUENTLY ASKED QUESTIONS
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Rural Health Myth Busters &amp; Common Questions (स्वास्थ्य तथ्य)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Common misconceptions answered by medical doctors for rural communities
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl space-y-2">
              <div className="text-xs font-black text-rose-600 dark:text-rose-400">
                ❌ MYTH: "I feel active, so I can skip my BP tablet today."
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                ✅ <strong>FACT:</strong> High Blood Pressure is a "silent condition" that rarely causes pain before a stroke. Never skip daily medicine.
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl space-y-2">
              <div className="text-xs font-black text-rose-600 dark:text-rose-400">
                ❌ MYTH: "Antibiotics cure viral cold, cough, and fever."
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                ✅ <strong>FACT:</strong> Colds and flu are viral. Antibiotics only treat bacterial infections. Rest, warm fluids, and steam are the true remedies.
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl space-y-2">
              <div className="text-xs font-black text-rose-600 dark:text-rose-400">
                ❌ MYTH: "Drinking water during diarrhea makes loose motions worse."
              </div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                ✅ <strong>FACT:</strong> Dehydration is what makes diarrhea fatal. Always give plenty of ORS electrolyte water and clean boiled water.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyHealthMapPage;
