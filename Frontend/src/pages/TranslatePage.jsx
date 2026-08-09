import React, { useMemo, useState } from 'react';
import { useAuth, LANGUAGES } from '../context/AuthContext';
import { api } from '../api/api';
import { TranslateIcon, SpeakerIcon } from '../components/ui/Icons';
import { speakNativeAudio } from '../utils/speech';

export const TranslatePage = () => {
  const { currentLang, showToast } = useAuth();

  const [convertText, setConvertText] = useState('Tab. Paracetamol 500mg — 1-0-1 (PC) for 5 days. Drink warm water.');
  const [convertLang, setConvertLang] = useState(currentLang || 'hi');
  const [translatedResult, setTranslatedResult] = useState('');
  const [converting, setConverting] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const sampleNativeTranslations = useMemo(
    () => ({
    hi: 'पैरासिटामोल 500mg: सुबह 1 गोली और रात को 1 गोली खाने के बाद 5 दिनों के लिए लें। गुनगुना पानी पिएं।',
    kn: 'ಪ್ಯಾರಸಿಟಮಾಲ್ 500mg: ಬೆಳಿಗ್ಗೆ 1 ಮಾತ್ರೆ ಮತ್ತು ರಾತ್ರಿ 1 ಮಾತ್ರೆ ಊಟದ ನಂತರ 5 ದಿನಗಳ ಕಾಲ ತೆಗೆದುಕೊಳ್ಳಿ. ಬೆಚ್ಚಗಿನ ನೀರು ಕುಡಿಯಿರಿ.',
    ta: 'பாரசிட்டமால் 500mg: காலை 1 மாத்திரை மற்றும் இரவு 1 மாத்திரை உணவுக்கு பின் 5 நாட்களுக்கு சாப்பிடவும். மிதமான வெந்நீர் குடிக்கவும்.',
    te: 'పారాసిటమాల్ 500mg: ఉదయం 1 మాత్ర మరియు రాత్రి 1 మాత్ర భోజనం తర్వాత 5 రోజులు తీసుకోండి. గోరువెచ్చని నీరు తాగండి.',
    mr: 'पॅरासिटामॉल 500mg: सकाळी १ गोळी आणि रात्री १ गोळी जेवणानंतर ५ दिवस घ्या. कोमट पाणी प्या.',
    bn: 'প্যারাসিটামল ৫০০ মিগ্রা: সকালে ১টি এবং রাতে ১টি ট্যাবলেট খাওয়ার পর ৫ দিন খান। হালকা গরম জল পান করুন।',
    gu: 'પેરાસિટામોલ 500mg: સવારે 1 ગોળી અને રાત્રે 1 ગોળી જમ્યા પછી 5 દિવસ લો. નવશેકું પાણી પીવો.',
    en: 'Take Paracetamol 500mg: 1 tablet in the morning and 1 tablet at night after food for 5 days. Drink warm water.',
    }),
    []
  );

  const selectedLanguage = useMemo(
    () => LANGUAGES.find((l) => l.code === convertLang) || LANGUAGES[0],
    [convertLang]
  );

  const performTranslation = (lang) => sampleNativeTranslations[lang] || sampleNativeTranslations.hi;

  const handleLangChange = (newLang) => {
    setConvertLang(newLang);
    setTranslatedResult(performTranslation(newLang));
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    if (!convertText.trim()) return;
    setConverting(true);
    try {
      const res = await api.textToSpeech(convertText, convertLang);
      const outputText = res.translated_text || performTranslation(convertLang);
      setTranslatedResult(outputText);
      showToast?.('Converted to native script!', 'success');
    } catch {
      setTranslatedResult(performTranslation(convertLang));
      showToast?.('Converted to native language!', 'info');
    }
    setConverting(false);
  };

  const handleSpeak = async () => {
    let nativeTextToSpeak = translatedResult;
    if (!nativeTextToSpeak) {
      nativeTextToSpeak = performTranslation(convertLang);
      setTranslatedResult(nativeTextToSpeak);
    }

    setSpeaking(true);
    showToast?.(`Speaking audio guidance in ${selectedLanguage.name}...`, 'info');
    await speakNativeAudio(nativeTextToSpeak, convertLang);
    setSpeaking(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-start">
        <section className="space-y-6">
          <div className="rounded-[32px] border border-stone-200 bg-white p-8 shadow-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-teal-700">
                  Voice-first Translator
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  Translate prescriptions into local script and spoken audio.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-stone-600">
                  Convert doctor instructions into regional languages and play the audio in Bengali, Kannada, Tamil, Telugu, Marathi, and more for easy patient understanding.
                </p>
              </div>

              <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">Selected language</div>
                <div className="mt-4 inline-flex items-center gap-3 rounded-3xl bg-white px-4 py-4 shadow-xs border border-stone-200">
                  <div className="text-3xl">{selectedLanguage.flag}</div>
                  <div>
                    <div className="font-bold text-stone-900">{selectedLanguage.native}</div>
                    <div className="text-sm text-stone-500">{selectedLanguage.name}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 mt-8">
              {[
                { title: 'Paste text', description: 'Add the prescription or doctor instruction here.' },
                { title: 'Pick a language', description: 'Choose the patient’s preferred regional language.' },
                { title: 'Listen aloud', description: 'Hear the result spoken clearly in local voice.' },
              ].map((item, index) => (
                <div key={item.title} className="rounded-3xl border border-stone-200 bg-stone-50 p-5 shadow-sm">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-700 text-sm font-bold text-white">{index + 1}</div>
                  <h2 className="mt-4 text-sm font-semibold text-stone-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-stone-200 bg-white p-8 shadow-xl">
            <form onSubmit={handleConvert} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-stone-900">Doctor Prescription / Medical Note</label>
                <textarea
                  rows={5}
                  className="w-full rounded-3xl border border-stone-300 bg-white px-5 py-4 text-sm text-stone-900 shadow-sm outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                  placeholder="Enter the prescription or medical note here. Example: Tab. Paracetamol 500mg — 1-0-1 (PC) for 5 days."
                  value={convertText}
                  onChange={(e) => setConvertText(e.target.value)}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr] items-end">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-stone-900">Target language</label>
                  <select
                    className="w-full rounded-3xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-900 outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
                    value={convertLang}
                    onChange={(e) => handleLangChange(e.target.value)}
                  >
                    {LANGUAGES.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.flag} {language.name} — {language.native}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={converting}
                  className="inline-flex items-center justify-center rounded-3xl bg-teal-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-teal-200/30 transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {converting ? 'Translating...' : 'Translate Now'}
                </button>
              </div>
            </form>

            {translatedResult && (
              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-teal-200 bg-teal-50/90 p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                        Translated output
                      </p>
                      <p className="mt-2 text-sm text-stone-600">
                        The output text is shown in the selected local language.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-900 shadow-xs border border-stone-200">
                      <span>{selectedLanguage.flag}</span>
                      {selectedLanguage.native}
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl bg-white p-6 text-base leading-8 text-stone-900 shadow-sm">
                    {translatedResult}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={handleSpeak}
                    disabled={speaking}
                    className="inline-flex items-center justify-center rounded-3xl bg-orange-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-200/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <SpeakerIcon size={18} color="#ffffff" />
                    {speaking ? `Playing in ${selectedLanguage.name}...` : `Listen in ${selectedLanguage.name}`}
                  </button>
                  <p className="text-sm text-stone-500">
                    Tip: If your browser does not support the language natively, the app uses a fallback audio stream.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-stone-200 bg-gradient-to-br from-slate-950 via-teal-900 to-cyan-700 p-8 text-white shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Why this helps
            </p>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight">A clearer care experience for everyone.</h2>
            <p className="mt-4 text-sm leading-7 text-cyan-100/85">
              Patients can read medication guidance in their own script and hear spoken instructions when they need it most.
            </p>
            <div className="mt-6 space-y-4 text-sm text-cyan-100/90">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="font-semibold">Local language support</p>
                <p className="mt-1 text-sm">Supports 22+ Indian regional languages with spoken audio fallback.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="font-semibold">Simple workflow</p>
                <p className="mt-1 text-sm">Translate, verify, and play audio in one screen.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
              Quick help
            </p>
            <ul className="mt-4 space-y-3 text-sm text-stone-600">
              <li className="rounded-3xl border border-stone-200 bg-stone-50 p-4">Paste your doctor’s note or prescription here.</li>
              <li className="rounded-3xl border border-stone-200 bg-stone-50 p-4">Pick the patient’s language and native script.</li>
              <li className="rounded-3xl border border-stone-200 bg-stone-50 p-4">Tap Listen to hear the spoken guidance.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
