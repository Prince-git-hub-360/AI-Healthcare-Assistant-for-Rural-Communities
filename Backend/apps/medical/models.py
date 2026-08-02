from django.conf import settings
from django.db import models

from accounts.models import LanguageChoices


class DocumentTypeChoices(models.TextChoices):
    PRESCRIPTION = 'prescription', 'Prescription'
    DISCHARGE_SUMMARY = 'discharge_summary', 'Discharge Summary'
    MEDICAL_REPORT = 'medical_report', 'Medical Report'
    HEALTH_CONTENT = 'health_content', 'Health Content'


class MedicalDocument(models.Model):
    """MedicalDocument linked to a Patient record (patients.Patient).

    Why change: Linking to Patient (domain model) instead of directly to User keeps domain relationships clear
    and allows storing patient-specific metadata separately from authentication.
    """
    patient = models.ForeignKey(
        'patients.Patient',
        on_delete=models.CASCADE,
        related_name='medical_documents',
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='uploaded_medical_documents',
    )
    title = models.CharField(max_length=255)
    document_type = models.CharField(
        max_length=32,
        choices=DocumentTypeChoices.choices,
        default=DocumentTypeChoices.PRESCRIPTION,
    )
    original_file = models.FileField(upload_to='medical_documents/', blank=True, null=True)
    text_content = models.TextField(blank=True)
    language = models.CharField(
        max_length=8,
        choices=LanguageChoices.choices,
        default=LanguageChoices.ENGLISH,
    )
    translated_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.get_document_type_display()})"
