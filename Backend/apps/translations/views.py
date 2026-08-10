"""
translations.views

API views for managing translations, medical text simplifications, and Voice Guidance Audio (TTS).
Uses Django REST Framework ModelViewSet with filtering, search, and custom voice actions.
"""
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from drf_spectacular.utils import extend_schema

from .models import Translation
from .serializers import TranslationSerializer, VoiceGuidanceRequestSerializer
from .services import MedicalTranslationService, VoiceGuidanceService
from patients.models import Patient


@extend_schema(tags=['07. Voice Guidance & Speech Processing'])
class TranslationViewSet(viewsets.ModelViewSet):
    """ViewSet for listing, creating, retrieving, updating, and deleting Translation records.

    Filters available:
    - patient: Filter by patient ID
    - document: Filter by medical document ID
    - medication: Filter by medication ID
    - target_language: Filter by target language code (e.g. 'hi', 'te', 'ta', 'kn', 'mr')
    
    Search fields:
    - original_text
    - simplified_text
    - translated_text
    """

    serializer_class = TranslationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['patient', 'document', 'medication', 'target_language']
    search_fields = ['original_text', 'simplified_text', 'translated_text']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        """Returns translations queryset."""
        queryset = Translation.objects.all().select_related('patient__user', 'document', 'medication')
        user = self.request.user

        if user.is_authenticated and not user.is_staff:
            profile = getattr(user, 'profile', None)
            if profile and profile.role == 'patient':
                patient = getattr(user, 'patient', None)
                if patient:
                    return queryset.filter(patient=patient)

        return queryset

    @action(detail=False, methods=['post'], url_path='generate-voice-guidance')
    def generate_voice_guidance(self, request, *args, **kwargs):
        """Custom endpoint to translate medical text and generate localized voice guidance audio (.wav/.mp3)."""
        serializer = VoiceGuidanceRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        raw_text = serializer.validated_data['text']
        target_language = serializer.validated_data.get('target_language', 'hi')
        patient_id = serializer.validated_data.get('patient_id')
        generate_audio = serializer.validated_data.get('generate_audio', True)

        # Perform Regional Translation
        translation_result = MedicalTranslationService.translate_guidance(raw_text, target_language)

        # Perform Voice Guidance Synthesis (TTS)
        audio_url = None
        if generate_audio:
            audio_url = VoiceGuidanceService.generate_audio_guidance(
                text=translation_result['translated_text'],
                lang_code=target_language,
                file_prefix='patient_voice_guidance'
            )

        # Persist record in PostgreSQL if patient exists
        patient = Patient.objects.filter(id=patient_id).first() if patient_id else Patient.objects.first()
        record_id = None

        if patient:
            trans_record = Translation.objects.create(
                patient=patient,
                target_language=target_language,
                original_text=raw_text,
                simplified_text=raw_text,
                translated_text=translation_result['translated_text'],
                audio_file=audio_url if audio_url else None,
            )
            record_id = trans_record.id

        return Response({
            'status': 'ok',
            'translation_id': record_id,
            'target_language': target_language,
            'language_name': translation_result['language_name'],
            'original_text': raw_text,
            'translated_text': translation_result['translated_text'],
            'audio_url': request.build_absolute_uri(audio_url) if audio_url else None,
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['07. Voice Guidance & Speech Processing'])
class TranslateTextAPIView(viewsets.ViewSet):
    """API endpoint for translating and simplifying prescription text into any regional language."""
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        raw_text = request.data.get('text') or request.data.get('original_text') or ''
        target_language = request.data.get('target_language') or request.data.get('language') or 'hi'

        if not raw_text.strip():
            return Response({'status': 'error', 'error': 'No text provided to translate'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from medical.groq_ocr_service import GroqVisionOCRService
            groq_res = GroqVisionOCRService.process_text_with_groq(raw_text, target_language=target_language)
            if groq_res.get('status') == 'success' and (groq_res.get('simplified_text') or groq_res.get('extracted_text')):
                translated = groq_res.get('simplified_text') or groq_res.get('extracted_text')
                return Response({
                    'status': 'success',
                    'target_language': target_language,
                    'original_text': raw_text,
                    'translated_text': translated,
                    'simplified_text': translated,
                    'medications': groq_res.get('medications', []),
                    'engine': groq_res.get('ocr_engine', 'groq-llama-3.3-70b-versatile'),
                }, status=status.HTTP_200_OK)
        except Exception:
            pass

        # Fallback to MedicalTranslationService if Groq fails
        trans_res = MedicalTranslationService.translate_guidance(raw_text, target_language)
        return Response({
            'status': 'success',
            'target_language': target_language,
            'original_text': raw_text,
            'translated_text': trans_res.get('translated_text', raw_text),
            'simplified_text': trans_res.get('translated_text', raw_text),
            'engine': 'medical-translation-fallback',
        }, status=status.HTTP_200_OK)

