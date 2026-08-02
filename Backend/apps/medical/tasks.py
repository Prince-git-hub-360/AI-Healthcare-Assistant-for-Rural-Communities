from celery import shared_task
from django.core.exceptions import ObjectDoesNotExist

from .models import MedicalDocument
from .ocr_service import OpticalCharacterRecognitionService
from medications.services import PrescriptionParserService


@shared_task(bind=True)
def extract_text_from_document_task(self, document_id):
    try:
        doc = MedicalDocument.objects.get(pk=document_id)
    except ObjectDoesNotExist:
        return {'status': 'error', 'reason': 'document_not_found', 'document_id': document_id}

    try:
        OpticalCharacterRecognitionService.extract_text_from_document(doc)
        return {'status': 'ok', 'document_id': document_id}
    except Exception as exc:
        # Log and return failure for retry
        raise self.retry(exc=exc, countdown=10, max_retries=3)


@shared_task(bind=True)
def process_prescription_document_task(self, document_id):
    try:
        doc = MedicalDocument.objects.get(pk=document_id)
    except ObjectDoesNotExist:
        return {'status': 'error', 'reason': 'document_not_found', 'document_id': document_id}

    try:
        PrescriptionParserService.process_prescription_document(doc)
        return {'status': 'ok', 'document_id': document_id}
    except Exception as exc:
        raise self.retry(exc=exc, countdown=10, max_retries=3)
