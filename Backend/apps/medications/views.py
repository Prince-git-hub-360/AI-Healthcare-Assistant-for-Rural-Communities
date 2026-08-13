"""
medications.views

ModelViewSet for Medication resources.
Configured with AllowAny for Version 1 development.
Includes custom endpoint /api/medications/parse-prescription/ for automated parsing.
"""
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from django.utils import timezone

from drf_spectacular.utils import extend_schema

from .models import Medication
from .serializers import MedicationSerializer, PrescriptionParseRequestSerializer
from .services import PrescriptionParserService
from patients.models import Patient
from medical.models import MedicalDocument


@extend_schema(tags=['05. Medications & Prescription Parsing'])
class MedicationViewSet(viewsets.ModelViewSet):
    queryset = Medication.objects.all()
    serializer_class = MedicationSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['patient', 'document', 'source']
    search_fields = ['name', 'generic_name', 'dosage_text', 'strength']
    ordering_fields = ['created_at', 'start_date', 'end_date']

    def get_queryset(self):
        user = self.request.user
        qs = Medication.objects.all()

        if user.is_authenticated and not user.is_staff:
            profile = getattr(user, 'profile', None)
            role = getattr(profile, 'role', None) if profile else None
            if role == 'patient':
                qs = qs.filter(patient__user=user)

        # Exclude extracted medications whose parent prescription document was deleted
        qs = qs.exclude(source='extracted', document__isnull=True)

        active = self.request.query_params.get('active')
        if active and active.lower() in ['1', 'true', 'yes']:
            today = timezone.localdate()
            qs = qs.filter(
                (models.Q(start_date__lte=today) | models.Q(start_date__isnull=True)) &
                (models.Q(end_date__gte=today) | models.Q(end_date__isnull=True))
            )
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated:
            profile = getattr(user, 'profile', None)
            role = getattr(profile, 'role', None) if profile else None
            if role == 'patient':
                patient = getattr(user, 'patient', None)
                if patient:
                    serializer.save(created_by=user, patient=patient)
                    return
            serializer.save(created_by=user)
        else:
            serializer.save()

    @action(detail=False, methods=['post'], url_path='parse-prescription')
    def parse_prescription(self, request, *args, **kwargs):
        """Custom endpoint to parse raw doctor prescription text into structured medications."""
        serializer = PrescriptionParseRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        raw_text = serializer.validated_data['text']
        patient_id = serializer.validated_data.get('patient_id')
        document_id = serializer.validated_data.get('document_id')
        save_to_db = serializer.validated_data.get('save_to_db', True)

        parsed_items = PrescriptionParserService.parse_text(raw_text)

        patient = Patient.objects.filter(id=patient_id).first() if patient_id else Patient.objects.first()
        document = MedicalDocument.objects.filter(id=document_id).first() if document_id else None

        created_records = []
        if save_to_db and patient:
            for item in parsed_items:
                med, _ = Medication.objects.get_or_create(
                    patient=patient,
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
                        'source': item['source'],
                        'confidence': item['confidence'],
                    }
                )
                created_records.append(med)

        return Response({
            'status': 'ok',
            'raw_text': raw_text,
            'parsed_count': len(parsed_items),
            'parsed_medicines': parsed_items,
            'saved_records': MedicationSerializer(created_records, many=True).data if created_records else [],
        }, status=status.HTTP_200_OK)
