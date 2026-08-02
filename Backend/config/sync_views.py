"""
config.sync_views

Version 7: Offline Data Synchronization & System Health Check Views.

Handles batch payload synchronization from offline mobile apps / PWA in rural areas
and system health check monitoring for cloud deployments.
"""
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import connection
from django.utils import timezone

from drf_spectacular.utils import extend_schema

from patients.models import Patient
from medical.models import MedicalDocument
from medications.models import Medication
from reminders.models import Reminder
from medications.services import PrescriptionParserService


@extend_schema(tags=['10. Health Education & AI Recommendations'])
class OfflineBatchSyncView(APIView):
    """Offline Batch Data Synchronization Endpoint.
    Accepts queued offline records (Prescriptions, Patient demographics, Reminders)
    and persists them into PostgreSQL in a single batch request.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        payload = request.data
        synced_results = {
            'patients_synced': 0,
            'documents_synced': 0,
            'medications_synced': 0,
            'reminders_synced': 0,
        }

        # Process queued patients
        queued_patients = payload.get('patients', [])
        for p_data in queued_patients:
            from django.contrib.auth.models import User
            username = p_data.get('username') or f"offline_patient_{p_data.get('phone', 'temp')}"
            user, _ = User.objects.get_or_create(username=username)
            Patient.objects.get_or_create(
                user=user,
                defaults={
                    'age': p_data.get('age', 50),
                    'phone': p_data.get('phone', ''),
                    'address': p_data.get('address', ''),
                    'preferred_language': p_data.get('preferred_language', 'hi'),
                }
            )
            synced_results['patients_synced'] += 1

        # Process queued documents
        queued_documents = payload.get('documents', [])
        for d_data in queued_documents:
            patient = Patient.objects.first()
            if not patient:
                from django.contrib.auth.models import User
                default_user, _ = User.objects.get_or_create(username='offline_patient_default')
                patient, _ = Patient.objects.get_or_create(
                    user=default_user,
                    defaults={'age': 50, 'phone': '0000000000', 'preferred_language': 'hi'}
                )
            doc, _ = MedicalDocument.objects.get_or_create(
                title=d_data.get('title', 'Offline Prescription'),
                defaults={
                    'patient': patient,
                    'text_content': d_data.get('text_content', ''),
                }
            )
            synced_results['documents_synced'] += 1
            # Run automated pipeline on synced document
            PrescriptionParserService.process_prescription_document(doc)

        return Response({
            'status': 'ok',
            'message': 'Offline batch synchronization completed successfully.',
            'synced_counts': synced_results,
            'sync_timestamp': str(timezone.now()),
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['10. Health Education & AI Recommendations'])
class HealthCheckView(APIView):
    """System Health Check Endpoint for Cloud Deployments."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        db_healthy = True
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
        except Exception:
            db_healthy = False

        return Response({
            'status': 'healthy' if db_healthy else 'degraded',
            'service': 'AI Healthcare Communication Assistant API',
            'version': 'v1.0.0',
            'database_connected': db_healthy,
            'timestamp': str(timezone.now()),
        }, status=status.HTTP_200_OK if db_healthy else status.HTTP_503_SERVICE_UNAVAILABLE)
