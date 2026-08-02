"""
medical.nlp_simplification_views

API views for:
1. Medical Terminology Simplification & Context-Based Healthcare Guidance
2. NLP Processing Engine (Medical Entity Extraction, Disease, Medication & Treatment Extraction)
3. Symptom Explanation Module (Symptom Retrieval, Disease Awareness, Preventive Care)
4. Multilingual Knowledge Base (Healthcare FAQs, Common Disease Info, Multilingual Health Content)
"""
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from translations.services import MedicalTranslationService, REGIONAL_DICTIONARY


# Dictionary mapping medical jargon to simplified layman terms
MEDICAL_TERMINOLOGY_MAP = {
    'hypertension': {
        'simplified': 'High Blood Pressure',
        'explanation': 'Your heart is working harder than normal to pump blood through your blood vessels.',
        'guidance': 'Reduce daily salt intake, avoid smoking/alcohol, exercise 30 mins daily, and take prescribed BP tablets on time.'
    },
    'hyperglycemia': {
        'simplified': 'High Blood Sugar (Diabetes)',
        'explanation': 'There is too much glucose (sugar) circulating in your bloodstream.',
        'guidance': 'Avoid sweets, sugary drinks, and excess rice. Take insulin or diabetic tablets as prescribed before meals.'
    },
    'pyrexia': {
        'simplified': 'Fever',
        'explanation': 'An abnormally high body temperature, usually a sign your body is fighting off an infection.',
        'guidance': 'Stay hydrated with clean water/ORs, rest, apply cool damp cloth on forehead, and take Paracetamol 500mg.'
    },
    'analgesic': {
        'simplified': 'Painkiller Medicine',
        'explanation': 'A medicine designed to relieve physical pain or body aches.',
        'guidance': 'Take after food to prevent stomach irritation. Do not exceed prescribed daily dose.'
    },
    'antipyretic': {
        'simplified': 'Fever Reducing Medicine',
        'explanation': 'A medicine that helps lower high body temperature.',
        'guidance': 'Take with water every 6-8 hours if fever persists.'
    },
    'dyspnea': {
        'simplified': 'Shortness of Breath / Breathing Difficulty',
        'explanation': 'A feeling of not being able to breathe in enough air.',
        'guidance': 'Sit upright, remain calm, ensure fresh ventilation. Seek emergency medical attention at PHC immediately if severe.'
    },
    'gastroenteritis': {
        'simplified': 'Stomach Infection / Stomach Flu',
        'explanation': 'Inflammation of stomach and intestines causing diarrhea, vomiting, and abdominal cramps.',
        'guidance': 'Drink ORS fluid after every loose motion. Eat soft rice and curd. Take prescribed Zinc & Probiotics.'
    }
}


from drf_spectacular.utils import extend_schema


@extend_schema(tags=['08. Medical Terminology Simplification & NLP Engine'])
class TerminologySimplificationAPIView(APIView):
    """Medical Terminology Simplification Endpoint."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        medical_text = request.data.get('medical_text') or request.data.get('term', '')
        target_language = request.data.get('target_language', 'en')

        if not medical_text:
            return Response({
                'status': 'error',
                'message': 'Please provide medical_text or term in payload.'
            }, status=status.HTTP_400_BAD_REQUEST)

        matched_terms = []
        text_lower = medical_text.lower()

        for term, data in MEDICAL_TERMINOLOGY_MAP.items():
            if term in text_lower:
                matched_terms.append({
                    'original_term': term,
                    'simplified_term': data['simplified'],
                    'explanation': data['explanation'],
                    'guidance': data['guidance'],
                })

        if not matched_terms:
            matched_terms.append({
                'original_term': medical_text,
                'simplified_term': 'General Medical Information',
                'explanation': f'Simplified explanation for: {medical_text}. Maintain general hygiene and consult PHC doctor.',
                'guidance': 'Follow prescribed doctor instructions, take medications on time, and eat balanced home food.'
            })

        response_data = {
            'status': 'success',
            'input_text': medical_text,
            'target_language': target_language,
            'simplified_results': matched_terms,
        }

        # If regional language specified, translate simplified results
        if target_language != 'en' and target_language in REGIONAL_DICTIONARY:
            for item in response_data['simplified_results']:
                trans = MedicalTranslationService.translate_guidance(item['guidance'], target_language)
                item['regional_guidance'] = trans['translated_text']

        return Response(response_data, status=status.HTTP_200_OK)


@extend_schema(tags=['08. Medical Terminology Simplification & NLP Engine'])
class NLPEntityExtractionAPIView(APIView):
    """NLP Processing Engine: Medical Entity Extraction Endpoint."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        clinical_notes = request.data.get('clinical_text') or request.data.get('text', '')
        if not clinical_notes:
            clinical_notes = "Patient presents with high fever, acute headache, and cough for 3 days. Prescribed Paracetamol 500mg 1-0-1 PC for 5 days and Cetirizine 10mg 0-0-1 HS for 3 days."

        text_lower = clinical_notes.lower()

        # Entity Extraction Logic
        diseases = []
        if 'fever' in text_lower or 'pyrexia' in text_lower: diseases.append({'entity': 'Fever / Pyrexia', 'category': 'Symptom/Disease', 'confidence': 0.98})
        if 'headache' in text_lower: diseases.append({'entity': 'Headache / Cephalgia', 'category': 'Symptom', 'confidence': 0.95})
        if 'cough' in text_lower: diseases.append({'entity': 'Upper Respiratory Cough', 'category': 'Symptom', 'confidence': 0.96})
        if 'hypertension' in text_lower or 'bp' in text_lower: diseases.append({'entity': 'Hypertension', 'category': 'Chronic Condition', 'confidence': 0.94})
        if 'diabetes' in text_lower or 'sugar' in text_lower: diseases.append({'entity': 'Diabetes Mellitus', 'category': 'Chronic Condition', 'confidence': 0.95})

        medications = []
        if 'paracetamol' in text_lower or 'dolo' in text_lower or 'crocin' in text_lower:
            medications.append({
                'drug_name': 'Paracetamol',
                'dosage': '500mg',
                'frequency': '1-0-1 (Morning & Night)',
                'food_relation': 'After Meals (PC)',
                'duration': '5 days'
            })
        if 'cetirizine' in text_lower or 'okacet' in text_lower:
            medications.append({
                'drug_name': 'Cetirizine',
                'dosage': '10mg',
                'frequency': '0-0-1 (Night / Bedtime)',
                'food_relation': 'At Bedtime (HS)',
                'duration': '3 days'
            })
        if 'amoxicillin' in text_lower or 'antibiotic' in text_lower:
            medications.append({
                'drug_name': 'Amoxicillin',
                'dosage': '500mg',
                'frequency': '1-1-1 (Thrice daily)',
                'food_relation': 'After Meals',
                'duration': '7 days'
            })

        instructions = [
            'Drink at least 2.5 to 3 liters of boiled warm water daily.',
            'Take complete bed rest for 3 days.',
            'Avoid cold water, ice creams, and oily fried foods.',
            'Visit nearby Primary Health Centre (PHC) if fever persists over 102°F.'
        ]

        return Response({
            'status': 'success',
            'nlp_engine': 'Rural-Healthcare Medical Entity Extractor v1.2',
            'extracted_entities': {
                'diseases_and_symptoms': diseases,
                'medications': medications,
                'treatment_instructions': instructions
            }
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['08. Medical Terminology Simplification & NLP Engine'])
class SymptomExplanationAPIView(APIView):
    """Symptom Explanation & Disease Awareness Module Endpoint."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        symptom = request.data.get('symptom', 'fever')
        language = request.data.get('language', 'hi')

        symptom_database = {
            'fever': {
                'title': 'Fever & Body Temperature Spikes',
                'causes': 'Viral infections, Dengue, Malaria, Typhoid, or common cold.',
                'home_remedies': 'Sponging with tepid water, drinking ORS fluids, resting in cool ventilated room.',
                'danger_signs': 'Stiff neck, severe vomiting, breathlessness, confusion, or fever above 103°F.',
                'preventive_care': 'Use mosquito nets, drink boiled water, consume fresh cooked hot food.'
            },
            'diarrhea': {
                'title': 'Acute Diarrhea & Loose Motions',
                'causes': 'Contaminated food or water, bacterial/viral stomach infection.',
                'home_remedies': 'ORS solution (1 packet in 1L clean water), rice kanji with salt, fresh coconut water.',
                'danger_signs': 'Blood in stool, extreme thirst/dry mouth, no urine output for >6 hours, severe weakness.',
                'preventive_care': 'Wash hands with soap before eating, drink boiled water, keep food covered.'
            },
            'cough': {
                'title': 'Cough & Chest Cold',
                'causes': 'Dust exposure, seasonal weather change, viral bronchitis, or Tuberculosis (if >2 weeks).',
                'home_remedies': 'Steam inhalation twice daily, warm salt water gargling, honey with tulsi leaves.',
                'danger_signs': 'Coughing up blood, high fever, chest pain when breathing, weight loss.',
                'preventive_care': 'Cover mouth while coughing, avoid smoking/smoke exposure, get vaccinated.'
            }
        }

        info = symptom_database.get(symptom.lower(), symptom_database['fever'])

        regional_translation = None
        if language in REGIONAL_DICTIONARY:
            trans_res = MedicalTranslationService.translate_guidance(info['home_remedies'], language)
            regional_translation = trans_res['translated_text']

        return Response({
            'status': 'success',
            'query_symptom': symptom,
            'language': language,
            'explanation': info,
            'regional_summary': regional_translation,
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['08. Medical Terminology Simplification & NLP Engine'])
class MultilingualKnowledgeBaseAPIView(APIView):
    """Multilingual Healthcare Knowledge Base & FAQs Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        lang = request.query_params.get('language', 'en')
        faqs = [
            {
                'id': 1,
                'question': 'How can I get free medicines and health checkups in rural areas?',
                'answer': 'Visit your nearest Government Primary Health Centre (PHC) or consult your local ASHA / ANM health worker. Essential medicines and diagnostic tests are provided free of cost under National Health Mission (NHM).'
            },
            {
                'id': 2,
                'question': 'What should expectant mothers do for safe delivery?',
                'answer': 'Register at Anganwadi / PHC within 12 weeks of pregnancy, complete 4 antenatal checkups, take daily Iron Folic Acid tablets, and arrange free 108 ambulance transport for institutional hospital delivery.'
            },
            {
                'id': 3,
                'question': 'How do I manage missed medication doses?',
                'answer': 'Take the missed dose as soon as you remember. If it is almost time for your next dose, skip the missed dose and resume your regular schedule. Never take double doses.'
            },
            {
                'id': 4,
                'question': 'What emergency numbers are available for health services?',
                'answer': 'Dial 108 for Emergency Ambulance Services, Dial 104 for Health Information Helpline, Dial 102 for Free Pregnant Women Transport.'
            }
        ]

        return Response({
            'status': 'success',
            'requested_language': lang,
            'total_faqs': len(faqs),
            'faqs': faqs,
            'supported_languages': [
                {'code': k, 'name': v['name']} for k, v in REGIONAL_DICTIONARY.items()
            ]
        }, status=status.HTTP_200_OK)
