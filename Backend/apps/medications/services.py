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

    # Regex patterns for forms, strengths, dosage patterns, and durations
    FORM_PATTERN = re.compile(r'\b(tab|tablet|cap|capsule|syr|syrup|inj|injection|sachet|ointment|drops?|susp|suspension|powder)\b', re.IGNORECASE)
    STRENGTH_PATTERN = re.compile(r'\b(\d+(?:\.\d+)?\s*(?:mg|g|mcg|ml|iu|gm|%))\b', re.IGNORECASE)
    DOSAGE_PATTERN = re.compile(r'\b([0-2])\s*[-–/]\s*([0-2])\s*[-–/]\s*([0-2])\b')
    DURATION_PATTERN = re.compile(r'\b(?:for|x|\*|\/)?\s*(\d+)\s*(?:days?|day|d)\b', re.IGNORECASE)

    # Blacklist keywords for non-medicine lines
    NOISE_KEYWORDS = [
        'signature', 'doctor', 'dr.', 'dr ', 'patient', 'mr.', 'mr ', 'mrs.', 'mrs ', 'ms.', 'ms ',
        'name', 'age', 'year', 'years', 'yr', 'yrs', 'male', 'female', 'sex', 'gender',
        'date', 'dated', 'hospital', 'clinic', 'center', 'centre', 'dispensary', 'nursing',
        'address', 'phone', 'mobile', 'tel', 'contact', 'reg', 'opd', 'ipd', 'consultant',
        'facility', 'vaccination', 'bring this', 'next time', 'next visit', 'review',
        'investigation', 'test', 'report', 'advise', 'advice', 'rest', 'bed rest', 'diet',
        'loose motion', 'vomit', 'vomitting', 'vomiting', 'fever', 'cough', 'cold', 'headache',
        'pain', 'spasmodic', 'weight', 'wt', 'bp', 'blood pressure', 'pulse', 'temp', 'temperature',
        'symptoms', 'diagnosis', 'chief complaint', 'c/o', 'k/c/o', 'h/o', 'rx', 'prescribed', 'page',
    ]

    @classmethod
    def _is_noise_line(cls, line: str) -> bool:
        """Returns True if the line is clinically irrelevant metadata, header, or signature."""
        l_lower = line.strip().lower()
        if len(l_lower) < 3:
            return True
        if l_lower.isdigit():
            return True
        if any(noise in l_lower for noise in cls.NOISE_KEYWORDS):
            # If it explicitly has a medicine dosage pattern or form, check if name is meaningful
            has_form = cls.FORM_PATTERN.search(l_lower)
            has_dosage = cls.DOSAGE_PATTERN.search(l_lower)
            if not has_form and not has_dosage:
                return True
            # Even with form/dosage, if it starts with doctor signature or patient name, it's noise
            if any(l_lower.startswith(n) for n in ['doctor', 'dr', 'patient', 'name', 'age', 'date', 'signature', 'facility', 'please bring']):
                return True
        return False

    @classmethod
    def parse_text(cls, raw_text: str) -> List[Dict[str, Any]]:
        """Parses raw prescription text and returns structured medicine dicts."""
        if not raw_text:
            return []

        lines = [line.strip() for line in raw_text.replace(';', '\n').split('\n') if line.strip()]
        parsed_medicines = []

        for line in lines:
            if cls._is_noise_line(line):
                continue

            med_dict = cls._parse_single_line(line)
            if med_dict and med_dict.get('name') and not cls._is_noise_line(med_dict.get('name', '')):
                # Additional sanity check: medicine name must not be a noise word
                if med_dict['name'].lower() not in ['medication', 'tablet', 'capsule', 'syrup', 'injection', 'dose', 'tablets', 'powder']:
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

        # Extract Dosage Pattern e.g., 1-0-1, 1-1-1, 1-0-0, 0-0-1
        dosage_match = cls.DOSAGE_PATTERN.search(line)
        morning, afternoon, night = False, False, False
        frequency = FrequencyChoices.ONCE_DAILY
        dosage_text = ''
        dosage_amount = '1'

        line_lower = line.lower()

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
        else:
            # Frequency abbreviations: BD/BID = twice daily, TDS/TID = thrice daily, OD = once daily, HS = bedtime, SOS = as needed
            if re.search(r'\b(tds|tid|thrice|3\s*times|1-1-1)\b', line_lower):
                morning, afternoon, night = True, True, True
                frequency = FrequencyChoices.THRICE_DAILY
                dosage_text = '1-1-1 (Thrice daily)'
            elif re.search(r'\b(bd|bid|twice|2\s*times|1-0-1)\b', line_lower):
                morning, night = True, True
                afternoon = False
                frequency = FrequencyChoices.TWICE_DAILY
                dosage_text = '1-0-1 (Twice daily)'
            elif re.search(r'\b(od|once|1\s*time|1-0-0)\b', line_lower):
                morning = True
                afternoon, night = False, False
                frequency = FrequencyChoices.ONCE_DAILY
                dosage_text = '1-0-0 (Once daily)'
            elif re.search(r'\b(hs|bedtime|at night|0-0-1)\b', line_lower):
                night = True
                morning, afternoon = False, False
                dosage_text = '0-0-1 (At bedtime)'
            elif re.search(r'\b(sos|as needed|if required)\b', line_lower):
                morning = True
                dosage_text = 'SOS (As needed)'

        # Parse timing flags (PC = after food, AC = before food, BBF = before breakfast)
        after_food = any(kw in line_lower for kw in ['pc', 'after food', 'after meal', 'post cibum', 'after breakfast', 'after dinner', 'after lunch'])
        before_food = any(kw in line_lower for kw in ['ac', 'bbf', 'before food', 'before meal', 'ante cibum', 'before breakfast', 'empty stomach'])

        if 'hs' in line_lower or 'bedtime' in line_lower or 'at night' in line_lower:
            night = True

        # Extract Medicine Name (remove strength, form, duration, and dosage numbers from line)
        clean_name = line
        if form_match:
            clean_name = clean_name.replace(form_match.group(0), '')
        if strength_match:
            clean_name = clean_name.replace(strength_match.group(0), '')
        if dosage_match:
            clean_name = clean_name.replace(dosage_match.group(0), '')

        clean_name = re.sub(r'\b(pc|ac|bbf|hs|tab|cap|syr|inj|sachet|powder|for|\d+\s*(?:days?|d)|after food|before food|at bedtime|twice daily|thrice daily|once daily|sos|bd|bid|tds|tid|od)\b', '', clean_name, flags=re.IGNORECASE)
        clean_name = re.sub(r'[^a-zA-Z0-9\s-]', '', clean_name).strip()

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

        # Extract course duration mentioned in raw text (e.g., "for 4 days", "4 days", "4d", "x 4 days")
        doc_dur_match = cls.DURATION_PATTERN.search(raw_text)
        default_doc_duration = int(doc_dur_match.group(1)) if doc_dur_match else 5

        parsed_meds_data = []

        # 1. First priority: Use structured AI OCR medications if provided
        if ocr_medications and isinstance(ocr_medications, list):
            for ocr_m in ocr_medications:
                if not isinstance(ocr_m, dict):
                    continue
                raw_name = str(ocr_m.get('name') or ocr_m.get('medicine_name') or '').strip()
                if not raw_name or cls._is_noise_line(raw_name):
                    continue

                clean_name = raw_name.title()
                dosage = str(ocr_m.get('dosage') or ocr_m.get('frequency') or ocr_m.get('dosage_instructions') or '1 dose')
                m_lower = (dosage + ' ' + raw_name + ' ' + str(ocr_m.get('timing', '')) + ' ' + str(ocr_m.get('meal_rule', ''))).lower()

                # Extract individual duration if given
                dur_m = cls.DURATION_PATTERN.search(dosage) or cls.DURATION_PATTERN.search(str(ocr_m.get('duration', ''))) or doc_dur_match
                if not dur_m and ocr_m.get('duration_days'):
                    try:
                        dur_days = int(ocr_m.get('duration_days'))
                    except (ValueError, TypeError):
                        dur_days = default_doc_duration
                else:
                    dur_days = int(dur_m.group(1)) if dur_m else default_doc_duration

                # Precise morning/afternoon/night parsing
                morning, afternoon, night = False, False, False
                if re.search(r'\b(tds|tid|thrice|3\s*times|1-1-1)\b', m_lower):
                    morning, afternoon, night = True, True, True
                elif re.search(r'\b(bd|bid|twice|2\s*times|1-0-1)\b', m_lower):
                    morning, night = True, True
                elif re.search(r'\b(od|once|1\s*time|1-0-0|morning)\b', m_lower):
                    morning = True
                elif re.search(r'\b(hs|bedtime|at night|0-0-1|night)\b', m_lower):
                    night = True
                else:
                    morning = 'morn' in m_lower or '1-' in m_lower or 'od' in m_lower
                    afternoon = 'aft' in m_lower or 'noon' in m_lower or '-1-' in m_lower or 'lunch' in m_lower
                    night = 'night' in m_lower or 'hs' in m_lower or '-1' in m_lower or 'bedtime' in m_lower or 'dinner' in m_lower

                # If no slot was matched, default to morning
                if not morning and not afternoon and not night:
                    morning = True

                parsed_meds_data.append({
                    'name': clean_name,
                    'form': ocr_m.get('form') or 'Tablet',
                    'strength': ocr_m.get('strength') or '',
                    'dosage_text': dosage,
                    'dosage_amount': str(ocr_m.get('dosage_amount') or '1'),
                    'frequency': FrequencyChoices.THRICE_DAILY if (morning and afternoon and night) else (FrequencyChoices.TWICE_DAILY if (morning and night) else FrequencyChoices.ONCE_DAILY),
                    'duration_days': dur_days,
                    'morning': morning,
                    'afternoon': afternoon,
                    'night': night,
                    'after_food': any(kw in m_lower for kw in ['after', 'pc', 'post']),
                    'before_food': any(kw in m_lower for kw in ['before', 'ac', 'bbf', 'ante', 'empty']),
                    'source': SourceChoices.EXTRACTED,
                    'confidence': float(ocr_m.get('confidence') or 0.95),
                })

        # 2. Second priority: If no structured AI OCR medicines were available, parse clean lines from raw text
        if not parsed_meds_data:
            parsed_meds_data = cls.parse_text(raw_text)

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
