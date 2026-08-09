"""
scripts/ocr_provider_test.py

Quick tester for EasyOCR (local) and OCR.space (hosted).

Usage:
  python Backend/scripts/ocr_provider_test.py --provider easyocr /path/to/image
  python Backend/scripts/ocr_provider_test.py --provider ocrspace /path/to/image

Set `OCR_SPACE_API_KEY` env var for OCR.space usage.
This script is non-invasive and does not modify your project files.
"""
import os
import sys
import argparse


def test_easyocr(image_path):
    try:
        import easyocr
    except Exception:
        print("EasyOCR not installed. Install with: pip install easyocr")
        return None

    try:
        reader = easyocr.Reader(['en'], gpu=False)
        results = reader.readtext(image_path, detail=0)
        text = "\n".join(results)
        print("=== EasyOCR result ===")
        print(text)
        return text
    except Exception as e:
        print("EasyOCR failed:", e)
        return None


def test_ocr_space(image_path, api_key=None):
    try:
        import requests
    except Exception:
        print("requests not installed. Install with: pip install requests")
        return None

    if not api_key:
        api_key = os.getenv('OCR_SPACE_API_KEY')
    if not api_key:
        print('OCR.space API key required. Set OCR_SPACE_API_KEY env var or pass key to function.')
        return None

    with open(image_path, 'rb') as f:
        r = requests.post(
            'https://api.ocr.space/parse/image',
            files={'file': f},
            data={'apikey': api_key, 'language': 'eng', 'isOverlayRequired': False}
        )

    try:
        j = r.json()
    except Exception as e:
        print('Non-JSON response from OCR.space:', e)
        print(r.text)
        return None

    parsed = j.get('ParsedResults')
    if not parsed:
        print('No parsed results. Response:', j)
        return None

    texts = [p.get('ParsedText', '') for p in parsed]
    text = "\n".join(texts)
    print("=== OCR.space result ===")
    print(text)
    return text


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('image', help='Path to image/PDF (single page recommended)')
    parser.add_argument('--provider', choices=['easyocr', 'ocrspace'], default='easyocr')
    args = parser.parse_args()

    image = args.image
    if not os.path.exists(image):
        print('Image not found:', image)
        sys.exit(1)

    if args.provider == 'easyocr':
        test_easyocr(image)
    else:
        test_ocr_space(image)


if __name__ == '__main__':
    main()
