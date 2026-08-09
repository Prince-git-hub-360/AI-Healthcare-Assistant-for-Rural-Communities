"""
Database Design (Phase 1)

Schema covers the whole platform up front so later phases (Registration,
Login, Profile Management, Language Preference, Document Upload) just plug
into these tables instead of re-designing the schema.
"""

import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model — supports patients, doctors/health-workers, and staff."""

    class Role(models.TextChoices):
        PATIENT = 'patient', 'Patient'
        DOCTOR = 'doctor', 'Doctor / Health Worker'
        STAFF = 'staff', 'Staff / Admin'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.PATIENT)
    phone_number = models.CharField(
        max_length=20, unique=True, null=True, blank=True,
        help_text='Primary contact method for rural patients — supports OTP login.'
    )

    # Language Preference (Phase 2) — stored here so it's available platform-wide,
    # e.g. to drive the AI assistant's response language and SMS notifications.
    language_preference = models.CharField(
        max_length=10, default='en',
        help_text='ISO language code, see settings.LANGUAGES'
    )

    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username or str(self.phone_number)


class PatientProfile(models.Model):
    """Extended profile / demographic + rural-context data for Profile Management."""

    class Gender(models.TextChoices):
        MALE = 'M', 'Male'
        FEMALE = 'F', 'Female'
        OTHER = 'O', 'Other'
        UNSPECIFIED = 'U', 'Prefer not to say'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=Gender.choices, default=Gender.UNSPECIFIED)

    # Rural-community specific fields
    village_or_locality = models.CharField(max_length=150, blank=True)
    district = models.CharField(max_length=150, blank=True)
    nearest_health_center = models.CharField(max_length=150, blank=True)

    emergency_contact_name = models.CharField(max_length=150, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)

    blood_group = models.CharField(max_length=5, blank=True)
    known_allergies = models.TextField(blank=True)
    chronic_conditions = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Profile: {self.user}'


class HealthcareWorkerProfile(models.Model):
    """Extended profile for doctors / health workers (Healthcare Worker Registration)."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='worker_profile')
    license_number = models.CharField(max_length=100, blank=True)
    specialization = models.CharField(max_length=150, blank=True)
    health_center = models.CharField(max_length=150, blank=True)
    years_experience = models.PositiveIntegerField(null=True, blank=True)
    is_approved = models.BooleanField(
        default=False,
        help_text='Set true once staff/admin verifies license credentials.'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Worker profile: {self.user}'


class MedicalDocument(models.Model):
    """Uploaded medical records (Phase 3 feature — schema defined now)."""

    class DocumentType(models.TextChoices):
        PRESCRIPTION = 'prescription', 'Prescription'
        LAB_REPORT = 'lab_report', 'Lab Report'
        DISCHARGE_SUMMARY = 'discharge_summary', 'Discharge Summary'
        SCAN = 'scan', 'Scan / Imaging'
        ID_PROOF = 'id_proof', 'ID Proof'
        OTHER = 'other', 'Other'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_documents')
    uploaded_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='uploaded_documents'
    )
    document_type = models.CharField(max_length=20, choices=DocumentType.choices, default=DocumentType.OTHER)
    file = models.FileField(upload_to='medical_documents/%Y/%m/')
    title = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f'{self.document_type} — {self.patient} ({self.uploaded_at:%Y-%m-%d})'


class HealthContent(models.Model):
    """Healthcare Content Repository — educational articles/tips published by staff/doctors."""

    class ContentType(models.TextChoices):
        ARTICLE = 'article', 'Article'
        VIDEO = 'video', 'Video'
        FAQ = 'faq', 'FAQ'
        ADVISORY = 'advisory', 'Health Advisory'

    title = models.CharField(max_length=200)
    content_type = models.CharField(max_length=20, choices=ContentType.choices, default=ContentType.ARTICLE)
    body = models.TextField(blank=True, help_text='Article text or FAQ answer.')
    media_url = models.URLField(blank=True, help_text='External link for videos or attachments.')
    category = models.CharField(max_length=100, blank=True, help_text='e.g. Maternal Health, Nutrition, First Aid')
    language = models.CharField(max_length=10, default='en', help_text='ISO language code, see settings.LANGUAGES')
    published_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name='published_content'
    )
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Translation(models.Model):
    """Medical Language Translation — translates prescriptions, discharge summaries,
    and healthcare instructions into the patient's preferred Indian language."""

    class SourceType(models.TextChoices):
        PRESCRIPTION = 'prescription', 'Prescription'
        DISCHARGE_SUMMARY = 'discharge_summary', 'Discharge Summary'
        INSTRUCTION = 'instruction', 'Healthcare Instruction'
        OTHER = 'other', 'Other'

    document = models.ForeignKey(
        MedicalDocument, on_delete=models.CASCADE, null=True, blank=True,
        related_name='translations'
    )
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='translations')
    source_type = models.CharField(max_length=20, choices=SourceType.choices, default=SourceType.OTHER)
    source_text = models.TextField(help_text='Original extracted or provided text')
    target_language = models.CharField(max_length=10, help_text='e.g. hi, ta, te, bn, mr, gu, kn')
    translated_text = models.TextField(blank=True)
    simplified_explanation = models.TextField(
        blank=True, help_text='Plain-language explanation of medical terms'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.source_type} → {self.target_language} ({self.patient})'    
class MedicalEntityExtraction(models.Model):
    """NLP Processing Engine — stores extracted diseases, medications, and
    treatment instructions from a patient's medical text/document."""

    document = models.ForeignKey(
        MedicalDocument, on_delete=models.CASCADE, null=True, blank=True,
        related_name='entity_extractions'
    )
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='entity_extractions')
    source_text = models.TextField()
    diseases = models.JSONField(default=list, blank=True)
    medications = models.JSONField(default=list, blank=True)
    treatment_instructions = models.JSONField(default=list, blank=True)
    other_entities = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Entities for {self.patient} ({self.created_at:%Y-%m-%d})'
class SymptomQuery(models.Model):
    """Symptom Explanation Module — stores a patient's symptom/health questions
    and the general educational information returned."""

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='symptom_queries')
    query = models.TextField(help_text='The symptom or health question asked')
    language = models.CharField(max_length=10, default='en')
    symptom_information = models.TextField(blank=True)
    possible_related_conditions = models.JSONField(default=list, blank=True)
    disease_awareness = models.TextField(blank=True)
    preventive_care = models.JSONField(default=list, blank=True)
    when_to_see_a_doctor = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.patient} — {self.query[:40]}'    