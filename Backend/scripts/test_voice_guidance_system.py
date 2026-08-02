"""
scripts/test_voice_guidance_system.py

Test script verifying the Multi-lingual Regional Translation & Voice Guidance Audio System (TTS).
Generates voice guidance audio files for Hindi, Telugu, and Tamil instructions.
"""
import os
import sys
from pathlib import Path

# Setup Django environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.test import Client
from translations.models import Translation

def test_voice_guidance():
    print("=" * 75)
    print("[+] TESTING REGIONAL TRANSLATION & VOICE GUIDANCE AUDIO SYSTEM (TTS)")
    print("=" * 75)

    client = Client()

    languages_to_test = [
        ('hi', 'Hindi'),
        ('te', 'Telugu'),
        ('ta', 'Tamil'),
    ]

    for lang_code, lang_name in languages_to_test:
        payload = {
            'text': 'Take 1 Paracetamol tablet in the morning after breakfast and 1 tablet at night after dinner.',
            'target_language': lang_code,
            'generate_audio': True,
        }

        res = client.post('/api/translations/generate-voice-guidance/', data=payload, content_type='application/json')

        if res.status_code == 200:
            data = res.json()
            print(f"[SUCCESS] {lang_name} ({lang_code.upper()}) Translation & Audio Generated! Record ID: #{data['translation_id']}")
            print(f" -> Audio URL: {data['audio_url']}")
        else:
            print(f"[!] Request Failed for {lang_name}: {res.status_code}")
            print(res.json())

    print("=" * 75)

if __name__ == '__main__':
    test_voice_guidance()
