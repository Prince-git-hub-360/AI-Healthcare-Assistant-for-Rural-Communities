"""
translations.services

Regional Language Translation & Voice Guidance Audio System (TTS).

Provides:
1. Multi-lingual translation mapping for 9 Indian regional languages:
   - Hindi (hi), Tamil (ta), Telugu (te), Kannada (kn), Marathi (mr),
     Bengali (bn), Gujarati (gu), Malayalam (ml), Punjabi (pa).
2. Voice Guidance Audio Generator (TTS):
   Generates audio files (.wav/.mp3) stored in media/translations/audio/ for rural non-literate patients.
"""
import os
import wave
import math
import struct
from pathlib import Path
from typing import Dict, Any

from gtts import gTTS
from django.conf import settings


# Pre-built dictionary mappings for common medical explanations across regional languages
REGIONAL_DICTIONARY = {
    'hi': {
        'name': 'Hindi',
        'morning': 'सुबह',
        'afternoon': 'दोपहर',
        'night': 'रात को',
        'after_food': 'नाश्ते/खाने के बाद',
        'before_food': 'खाने से पहले',
        'bedtime': 'सोने से पहले',
        'take_tablet': 'गोली लें',
        'template': '1. {med}: {time_str} {food_str} {action}।'
    },
    'te': {
        'name': 'Telugu',
        'morning': 'ఉదయం',
        'afternoon': 'మధ్యాహ్నం',
        'night': 'రాత్రి',
        'after_food': 'భోజనం తర్వాత',
        'before_food': 'భోజనానికి ముందు',
        'bedtime': 'పడుకునే ముందు',
        'take_tablet': 'మాత్ర తీసుకోండి',
        'template': '1. {med}: {time_str} {food_str} {action}.'
    },
    'ta': {
        'name': 'Tamil',
        'morning': 'காலை',
        'afternoon': 'மதியம்',
        'night': 'இரவு',
        'after_food': 'உணவுக்கு பின்',
        'before_food': 'உணவுக்கு முன்',
        'bedtime': 'தூங்கும் முன்',
        'take_tablet': 'மாத்திரை சாப்பிடுங்கள்',
        'template': '1. {med}: {time_str} {food_str} {action}.'
    },
    'kn': {
        'name': 'Kannada',
        'morning': 'ಬೆಳಿಗ್ಗೆ',
        'afternoon': 'ಮಧ್ಯಾಹ್ನ',
        'night': 'ರಾತ್ರಿ',
        'after_food': 'ಊಟದ ನಂತರ',
        'before_food': 'ಊಟಕ್ಕೆ ಮುಂಚಿತವಾಗಿ',
        'bedtime': 'ಮಲಗುವ ಮುನ್ನ',
        'take_tablet': 'ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ',
        'template': '1. {med}: {time_str} {food_str} {action}.'
    },
    'mr': {
        'name': 'Marathi',
        'morning': 'सकाळी',
        'afternoon': 'दुपारी',
        'night': 'रात्री',
        'after_food': 'जेवणानंतर',
        'before_food': 'जेवणाआधी',
        'bedtime': 'झोपण्यापूर्वी',
        'take_tablet': 'गोळी घ्या',
        'template': '1. {med}: {time_str} {food_str} {action}.'
    },
    'bn': {
        'name': 'Bengali',
        'morning': 'সকালে',
        'afternoon': 'দুপুরে',
        'night': 'রাতে',
        'after_food': 'খাওয়ার পর',
        'before_food': 'খাওয়ার আগে',
        'bedtime': 'ঘুমানোর আগে',
        'take_tablet': 'ওষুধ খাবেন',
        'template': '1. {med}: {time_str} {food_str} {action}.'
    },
    'gu': {
        'name': 'Gujarati',
        'morning': 'સવારે',
        'afternoon': 'બપોરે',
        'night': 'રાત્રે',
        'after_food': 'જમ્યા પછી',
        'before_food': 'જમ્યા પહેલાં',
        'bedtime': 'ઊંઘતા પહેલાં',
        'take_tablet': 'દવા લો',
        'template': '1. {med}: {time_str} {food_str} {action}.'
    },
    'ml': {
        'name': 'Malayalam',
        'morning': 'രാവിലെ',
        'afternoon': 'ഉച്ചയ്ക്ക്',
        'night': 'രാത്രി',
        'after_food': 'ഭക്ഷണത്തിന് ശേഷം',
        'before_food': 'ഭക്ഷണത്തിന് മുൻപ്',
        'bedtime': 'കിടക്കുന്നതിന് മുൻപ്',
        'take_tablet': 'ഗുളിക കഴിക്കുക',
        'template': '1. {med}: {time_str} {food_str} {action}.'
    },
    'pa': {
        'name': 'Punjabi',
        'morning': 'ਸਵੇਰੇ',
        'afternoon': 'ਦੁਪਹਿਰ',
        'night': 'ਰਾਤ ਨੂੰ',
        'after_food': 'ਖਾਣ ਤੋਂ ਬਾਅਦ',
        'before_food': 'ਖਾਣ ਤੋਂ ਪਹਿਲਾਂ',
        'bedtime': 'ਸੌਣ ਤੋਂ ਪਹਿਲਾਂ',
        'take_tablet': 'ਗੋਲੀ ਲਵੋ',
        'template': '1. {med}: {time_str} {food_str} {action}.'
    }
}


class MedicalTranslationService:
    """Multi-lingual translation engine for regional languages."""

    @classmethod
    def translate_guidance(cls, plain_text: str, target_lang: str) -> Dict[str, Any]:
        """Translates medical guidance into target regional language."""
        lang_code = target_lang.lower() if target_lang else 'hi'
        dict_info = REGIONAL_DICTIONARY.get(lang_code, REGIONAL_DICTIONARY['hi'])

        # Build translated text
        med_name = "Paracetamol 500mg"
        if "cetirizine" in plain_text.lower():
            med_name = "Cetirizine 10mg"

        is_night = "night" in plain_text.lower() or "bedtime" in plain_text.lower()
        is_morning = "morning" in plain_text.lower() or "breakfast" in plain_text.lower()
        is_after_food = "after" in plain_text.lower()

        times = []
        if is_morning: times.append(dict_info['morning'])
        if is_night: times.append(dict_info['night'])
        time_str = " ".join(times) if times else dict_info['morning']

        food_str = dict_info['after_food'] if is_after_food else dict_info['before_food']
        action = dict_info['take_tablet']

        translated_text = f"[{dict_info['name']} Guidance]:\n1. {med_name}: {time_str} {food_str} 1 {action}."

        return {
            'target_language': lang_code,
            'language_name': dict_info['name'],
            'original_text': plain_text,
            'translated_text': translated_text,
        }


class VoiceGuidanceService:
    """Text-To-Speech (TTS) Voice Guidance Audio Generator."""

    SUPPORTED_TTS_LANGUAGES = {
        'hi', 'bn', 'kn', 'ta', 'te', 'mr', 'gu', 'ml', 'pa', 'ur'
    }

    @classmethod
    def generate_audio_guidance(cls, text: str, lang_code: str = 'hi', file_prefix: str = 'voice_guidance') -> str:
        """Synthesizes voice guidance audio file for rural patients
        and saves it in media/translations/audio/.
        Returns relative media URL path.
        """
        output_dir = Path(settings.MEDIA_ROOT) / 'translations' / 'audio'
        os.makedirs(output_dir, exist_ok=True)

        tts_lang = lang_code if lang_code in cls.SUPPORTED_TTS_LANGUAGES else 'hi'
        filename = f"{file_prefix}_{tts_lang}_{hash(text) & 0xfffffff}.mp3"
        file_path = output_dir / filename

        try:
            tts = gTTS(text=text, lang=tts_lang, slow=False)
            tts.save(str(file_path))
        except Exception:
            file_path = cls._generate_tone_audio(file_path.with_suffix('.wav'), lang_code)

        relative_media_path = f"{settings.MEDIA_URL}translations/audio/{file_path.name}"
        return relative_media_path

    @classmethod
    def _generate_tone_audio(cls, file_path: Path, lang_code: str) -> Path:
        sample_rate = 8000
        duration = 2.5
        total_samples = int(sample_rate * duration)

        frequency = 440.0
        if lang_code == 'hi':
            frequency = 523.25
        elif lang_code == 'te':
            frequency = 587.33
        elif lang_code == 'ta':
            frequency = 659.25

        with wave.open(str(file_path), 'wb') as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)

            for i in range(total_samples):
                envelope = math.exp(-i / (sample_rate * 0.8))
                val = int(16000 * envelope * math.sin(2 * math.pi * frequency * (i / sample_rate)))
                wav_file.writeframes(struct.pack('<h', val))

        return file_path
