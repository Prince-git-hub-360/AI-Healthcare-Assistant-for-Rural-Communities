"""
medical.views

Viewset for MedicalDocument model.
Configured with AllowAny for Version 1 API testing.
Automatically triggers OCR Engine & PrescriptionParserService pipeline on uploaded documents.
"""
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import ValidationError, PermissionDenied

from drf_spectacular.utils import extend_schema

from .models import MedicalDocument
from .serializers import MedicalDocumentSerializer
from .filters import MedicalDocumentFilter
from .ocr_service import OpticalCharacterRecognitionService
from medications.services import PrescriptionParserService
from patients.models import PatientCaregiver


@extend_schema(tags=['04. Medical Documents & Clinical Records'])
class MedicalDocumentViewSet(viewsets.ModelViewSet):
    queryset = MedicalDocument.objects.all()
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = MedicalDocumentFilter
    search_fields = ['title', 'text_content', 'translated_text']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        user = self.request.user
        if not user or user.is_anonymous:
            return MedicalDocument.objects.all()
        if user.is_staff:
            return MedicalDocument.objects.all()

        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'healthcare_worker':
            return MedicalDocument.objects.all()

        return MedicalDocument.objects.filter(patient__user=user)

    def perform_create(self, serializer):
        user = self.request.user
        if not user or user.is_anonymous:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.filter(profile__role='patient').first() or User.objects.first()

        profile = getattr(user, 'profile', None)
        patient = serializer.validated_data.get('patient')

        if not patient:
            from patients.models import Patient
            patient, _ = Patient.objects.get_or_create(user=user)

        doc = serializer.save(uploaded_by=user, patient=patient)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        doc = serializer.instance
        ocr_data = {}
        target_lang = (
            request.query_params.get('lang')
            or request.data.get('target_language')
            or request.data.get('language')
            or getattr(doc, 'language', None)
        )
        profile = getattr(request.user, 'profile', None)
        if not target_lang and profile:
            target_lang = profile.preferred_language
        target_lang = target_lang or 'hi'


        try:
            ocr_data = OpticalCharacterRecognitionService.extract_text_from_document(doc, target_language=target_lang)
            doc.refresh_from_db()
        except Exception:
            pass

        try:
            PrescriptionParserService.process_prescription_document(doc)
            doc.refresh_from_db()
        except Exception:
            pass

        res_data = self.get_serializer(doc).data
        if ocr_data:
            res_data['extracted_text'] = ocr_data.get('extracted_text') or doc.text_content
            res_data['simplified_text'] = ocr_data.get('simplified_text') or doc.simplified_text
            res_data['translated_text'] = ocr_data.get('translated_text') or doc.translated_text
            res_data['medications'] = ocr_data.get('medications', [])
            res_data['confidence'] = ocr_data.get('confidence')

        headers = self.get_success_headers(res_data)
        return Response(res_data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_destroy(self, instance):
        """Cascade delete all linked medication reminders when a prescription is deleted."""
        try:
            from medications.models import Medication
            Medication.objects.filter(document=instance).delete()
        except Exception:
            pass

        try:
            from reminders.models import Reminder
            Reminder.objects.filter(document=instance).delete()
        except Exception:
            pass

        instance.delete()
