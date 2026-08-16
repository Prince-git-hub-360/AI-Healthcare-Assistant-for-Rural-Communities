"""
medications.services

Prescription Parsing & Automated Medical Pipeline Service.

Converts raw prescription text and doctor abbreviations (1-0-1, PC, HS, 500mg)
into structured database entities in PostgreSQL:
1. Medications (medications.Medication)
2. Simplified & Translated Text (translations.Translation)
3. Reminder Schedules (reminders.Reminder)
"""
import re
from typing import List, Dict, Any
from django.utils import timezone

from medications.models import Medication, FrequencyChoices, SourceChoices
from translations.models import Translation
from reminders.models import Reminder, DeliveryMethodChoices, FrequencyChoices as ReminderFrequency


class PrescriptionParserService:
    """Intelligent Medical Prescription Parser & Automated Pipeline."""

    # Regex patterns for forms, strengths, and dosage patterns
    FORM_PATTERN = re.compile(r'\b(tab|tablet|cap|capsule|syr|syrup|inj|injection|sachet)\b', re.IGNORECASE)
    STRENGTH_PATTERN = re.compile(r'\b(\d+(?:\.\d+)?\s*(?:mg|g|mcg|ml|iu))\b', re.IGNORECASE)
    DOSAGE_PATTERN = re.compile(r'\b([0-2])\s*[-–/]\s*([0-2])\s*[-–/]\s*([0-2])\b')
    DURATION_PATTERN = re.compile(r'\b(?:for|x)?\s*(\d+)\s*(?:days?|day|d)\b', re.IGNORECASE)

    @classmethod
    def parse_text(cls, raw_text: str) -> List[Dict[str, Any]]:
        """Parses raw prescription text and returns structured medicine dicts."""
        if not raw_text:
            return []

        lines = [line.strip() for line in raw_text.replace(';', '\n').split('\n') if line.strip()]
        parsed_medicines = []

        for line in lines:
            # Skip header/footer noise lines
            if any(kw in line.lower() for kw in ['rx:', 'patient', 'hospital', 'clinic', 'dr.', 'date:']):
                # Clean prefix if line starts with Rx:
                line = re.sub(r'^(rx:?|tab\.?|cap\.?)', '', line, flags=re.IGNORECASE).strip()
                if not line:
                    continue

            med_dict = cls._parse_single_line(line)
            if med_dict and med_dict.get('name'):
                parsed_medicines.append(med_dict)

        return parsed_medicines

    @classmethod
    def _parse_single_line(cls, line: str) -> Dict[str, Any]:
        """Parses a single prescription line."""
        form_match = cls.FORM_PATTERN.search(line)
        form = form_match.group(1).capitalize() if form_match else 'Tablet'

        strength_match = cls.STRENGTH_PATTERN.search(line)
        strength = strength_match.group(1) if strength_match else ''

        dur_match = cls.DURATION_PATTERN.search(line)
        duration_days = int(dur_match.group(1)) if dur_match else 5

        # Extract Dosage Pattern e.g., 1-0-1
        dosage_match = cls.DOSAGE_PATTERN.search(line)
        morning, afternoon, night = False, False, False
        frequency = FrequencyChoices.ONCE_DAILY
        dosage_text = ''
        dosage_amount = '1'

        if dosage_match:
            m, a, n = int(dosage_match.group(1)), int(dosage_match.group(2)), int(dosage_match.group(3))
            dosage_text = f"{m}-{a}-{n}"
            morning = m > 0
            afternoon = a > 0
            night = n > 0
            total_doses = (1 if morning else 0) + (1 if afternoon else 0) + (1 if night else 0)

            if total_doses == 3:
                frequency = FrequencyChoices.THRICE_DAILY
            elif total_doses == 2:
                frequency = FrequencyChoices.TWICE_DAILY
            elif total_doses == 1:
                frequency = FrequencyChoices.ONCE_DAILY

        # Parse timing flags (PC = after food, AC = before food, HS = bedtime)
        line_lower = line.lower()
        after_food = any(kw in line_lower for kw in ['pc', 'after food', 'after meal', 'post cibum'])
        before_food = any(kw in line_lower for kw in ['ac', 'before food', 'before meal', 'ante cibum'])

        if 'hs' in line_lower or 'bedtime' in line_lower or 'at night' in line_lower:
            night = True
            if not dosage_text:
                dosage_text = '0-0-1 HS (At Bedtime)'

        # Extract Medicine Name (remove strength, form, and dosage numbers from line)
        clean_name = line
        if form_match:
            clean_name = clean_name.replace(form_match.group(0), '')
        if strength_match:
            clean_name = clean_name.replace(strength_match.group(0), '')
        if dosage_match:
            clean_name = clean_name.replace(dosage_match.group(0), '')

        clean_name = re.sub(r'\b(pc|ac|hs|tab|cap|syr|inj|for|\d+\s*days|after food|before food|at bedtime)\b', '', clean_name, flags=re.IGNORECASE)
        clean_name = re.sub(r'[^a-zA-Z0-9\s]', '', clean_name).strip()

        if not clean_name:
            clean_name = 'Medication'

        return {
            'name': clean_name.title(),
            'form': form,
            'strength': strength,
            'dosage_text': dosage_text if dosage_text else '1 dose',
            'dosage_amount': dosage_amount,
            'frequency': frequency,
            'duration_days': duration_days,
            'morning': morning,
            'afternoon': afternoon,
            'night': night,
            'after_food': after_food,
            'before_food': before_food,
            'source': SourceChoices.EXTRACTED,
            'confidence': 0.94,
        }

    @classmethod
    def process_prescription_document(cls, document, ocr_medications: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Full automated pipeline: Takes a MedicalDocument, parses medicines,
        creates Medication records, Translation guidance, and Reminder alarms.
        """
        raw_text = document.text_content or ''
        parsed_meds_data = cls.parse_text(raw_text)

        # Check if entire document mentions a duration e.g. "for 3 days"
        doc_dur_match = cls.DURATION_PATTERN.search(raw_text)
        default_doc_duration = int(doc_dur_match.group(1)) if doc_dur_match else 5

        # Fallback to AI OCR medications if text regex parsing found no medicines
        if not parsed_meds_data and ocr_medications and isinstance(ocr_medications, list):
            for ocr_m in ocr_medications:
                if isinstance(ocr_m, dict) and ocr_m.get('name'):
                    name = str(ocr_m.get('name')).title()
                    dosage = str(ocr_m.get('dosage') or ocr_m.get('frequency') or '1 dose')
                    m_lower = dosage.lower()
                    
                    dur_m = cls.DURATION_PATTERN.search(dosage) or doc_dur_match
                    dur_days = int(dur_m.group(1)) if dur_m else default_doc_duration

                    morning = 'morn' in m_lower or '1-' in m_lower or 'daily' in m_lower or 'od' in m_lower
                    afternoon = 'aft' in m_lower or 'noon' in m_lower or '-1-' in m_lower or 'bd' in m_lower or 'twice' in m_lower
                    night = 'night' in m_lower or 'hs' in m_lower or '-1' in m_lower or 'bedtime' in m_lower

                    parsed_meds_data.append({
                        'name': name,
                        'form': ocr_m.get('form') or 'Tablet',
                        'strength': ocr_m.get('strength') or '',
                        'dosage_text': dosage,
                        'dosage_amount': '1',
                        'frequency': FrequencyChoices.ONCE_DAILY,
                        'duration_days': dur_days,
                        'morning': morning,
                        'afternoon': afternoon,
                        'night': night,
                        'after_food': 'after' in m_lower or 'pc' in m_lower,
                        'before_food': 'before' in m_lower or 'ac' in m_lower,
                        'source': SourceChoices.EXTRACTED,
                        'confidence': 0.90,
                    })

        if not parsed_meds_data and not raw_text:
            return {'medications': [], 'reminders': []}

        created_medications = []
        created_reminders = []

        start_date = timezone.now().date()

        for item in parsed_meds_data:
            # Fallback: if no specific timing flag was detected, default to Morning dose
            if not item.get('morning') and not item.get('afternoon') and not item.get('night'):
                item['morning'] = True

            dur_days = item.get('duration_days') or default_doc_duration
            end_date = start_date + timezone.timedelta(days=dur_days - 1)

            med, _ = Medication.objects.get_or_create(
                patient=document.patient,
                document=document,
                name=item['name'],
                defaults={
                    'form': item['form'],
                    'strength': item['strength'],
                    'dosage_text': item['dosage_text'],
                    'dosage_amount': item['dosage_amount'],
                    'frequency': item['frequency'],
                    'morning': item['morning'],
                    'afternoon': item['afternoon'],
                    'night': item['night'],
                    'after_food': item['after_food'],
                    'before_food': item['before_food'],
                    'start_date': start_date,
                    'end_date': end_date,
                    'source': item['source'],
                    'confidence': item['confidence'],
                }
            )
            created_medications.append(med)

            # Create Reminders automatically for morning / afternoon / night doses
            if med.morning:
                rem_morn, _ = Reminder.objects.get_or_create(
                    patient=document.patient,
                    medication=med,
                    title=f"{med.name} Morning Dose",
                    defaults={
                        'time': '08:00:00',
                        'notes': f"Take {med.dosage_amount} {med.form} after breakfast" if med.after_food else f"Take {med.dosage_amount} {med.form}",
                        'frequency': ReminderFrequency.DAILY,
                        'delivery_method': DeliveryMethodChoices.PUSH,
                        'start_date': start_date,
                        'end_date': end_date,
                        'active': True,
                    }
                )
                created_reminders.append(rem_morn)

            if med.afternoon:
                rem_aft, _ = Reminder.objects.get_or_create(
                    patient=document.patient,
                    medication=med,
                    title=f"{med.name} Afternoon Dose",
                    defaults={
                        'time': '13:30:00',
                        'notes': f"Take {med.dosage_amount} {med.form} after lunch" if med.after_food else f"Take {med.dosage_amount} {med.form}",
                        'frequency': ReminderFrequency.DAILY,
                        'delivery_method': DeliveryMethodChoices.PUSH,
                        'start_date': start_date,
                        'end_date': end_date,
                        'active': True,
                    }
                )
                created_reminders.append(rem_aft)

            if med.night:
                rem_night, _ = Reminder.objects.get_or_create(
                    patient=document.patient,
                    medication=med,
                    title=f"{med.name} Night Dose",
                    defaults={
                        'time': '20:00:00',
                        'notes': f"Take {med.dosage_amount} {med.form} after dinner" if med.after_food else f"Take {med.dosage_amount} {med.form} before bedtime",
                        'frequency': ReminderFrequency.DAILY,
                        'delivery_method': DeliveryMethodChoices.PUSH,
                        'start_date': start_date,
                        'end_date': end_date,
                        'active': True,
                    }
                )
                created_reminders.append(rem_night)

        # Create simplified & translated text record
        simplified_lines = []
        for idx, m in enumerate(created_medications, 1):
            timing = "after food" if m.after_food else ("before food" if m.before_food else "")
            doses = []
            if m.morning: doses.append("morning")
            if m.afternoon: doses.append("afternoon")
            if m.night: doses.append("night")
            schedule_str = " & ".join(doses) if doses else "daily"
            simplified_lines.append(f"{idx}. {m.name} {m.strength}: Take 1 {m.form.lower()} in the {schedule_str} {timing}.".strip())

        simplified_text = "\n".join(simplified_lines) if simplified_lines else "Take medications as prescribed by doctor."

        translation, _ = Translation.objects.get_or_create(
            patient=document.patient,
            document=document,
            target_language=document.patient.preferred_language or 'hi',
            defaults={
                'original_text': raw_text,
                'simplified_text': simplified_text,
                'translated_text': f"[Hindi Guidance]:\n{simplified_text}",
            }
        )

        return {
            'document_id': document.id,
            'medications_created': len(created_medications),
            'reminders_created': len(created_reminders),
            'translation_id': translation.id,
            'simplified_text': simplified_text,
        }
