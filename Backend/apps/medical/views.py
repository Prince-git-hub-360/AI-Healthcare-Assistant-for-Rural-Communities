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
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = MedicalDocumentFilter
    search_fields = ['title', 'text_content', 'translated_text']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return MedicalDocument.objects.all()

        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'healthcare_worker':
            return MedicalDocument.objects.all()

        return MedicalDocument.objects.filter(patient__user=user)

    def perform_create(self, serializer):
        user = self.request.user
        profile = getattr(user, 'profile', None)
        patient = serializer.validated_data.get('patient')

        if profile and profile.role == 'patient':
            patient = getattr(user, 'patient', None)
            if not patient:
                from patients.models import Patient
                patient = Patient.objects.create(user=user)
            doc = serializer.save(uploaded_by=user, patient=patient)
        else:
            if not patient:
                raise ValidationError({'patient': 'A patient must be specified for this user role.'})

            if profile and profile.role == 'caregiver':
                assigned = PatientCaregiver.objects.filter(patient=patient, caregiver=user).exists()
                if not assigned:
                    raise PermissionDenied('Caregiver is not assigned to this patient.')

            doc = serializer.save(uploaded_by=user, patient=patient)

        # Trigger OCR Text Extraction from image asynchronously
        try:
            from .tasks import extract_text_from_document_task, process_prescription_document_task
            extract_text_from_document_task.delay(doc.id)
        except Exception:
            # fallback to synchronous execution if task scheduling fails
            try:
                OpticalCharacterRecognitionService.extract_text_from_document(doc)
            except Exception:
                pass

        # Trigger Automated Prescription Parsing & Pipeline Execution asynchronously
        try:
            process_prescription_document_task.delay(doc.id)
        except Exception:
            try:
                PrescriptionParserService.process_prescription_document(doc)
            except Exception:
                pass
