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
    objects = models.Manager()
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


class EmergencySessionStatusChoices(models.TextChoices):
    ACTIVE = 'active', 'Active'
    RESOLVED = 'resolved', 'Resolved'
    CANCELLED = 'cancelled', 'Cancelled'


class EmergencySession(models.Model):
    """Tracks active emergency SOS events and temporary live location sharing."""
    objects = models.Manager()
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='emergency_sessions')
    token = models.CharField(max_length=64, unique=True, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=EmergencySessionStatusChoices.choices,
        default=EmergencySessionStatusChoices.ACTIVE,
    )
    emergency_type = models.CharField(max_length=64, default='General Medical Emergency')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    accuracy_meters = models.FloatField(null=True, blank=True)
    heading = models.FloatField(null=True, blank=True)
    speed = models.FloatField(null=True, blank=True)
    address_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Emergency SOS ({self.status}) - Patient {self.patient.user.username}"


class EmergencyLocationLog(models.Model):
    """Temporary coordinate updates for an active emergency session."""
    objects = models.Manager()
    session = models.ForeignKey(EmergencySession, on_delete=models.CASCADE, related_name='location_logs')
    latitude = models.FloatField()
    longitude = models.FloatField()
    accuracy_meters = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"Location ({self.latitude}, {self.longitude}) for Session {self.session.token[:8]}"


class FacilityTypeChoices(models.TextChoices):
    PHC = 'PHC', 'Primary Health Centre'
    CHC = 'CHC', 'Community Health Centre'
    HOSPITAL = 'HOSPITAL', 'Hospital / District Hospital'
    CLINIC = 'CLINIC', 'Clinic'
    PHARMACY = 'PHARMACY', 'Pharmacy / Jan Aushadhi Kendra'
    BLOOD_BANK = 'BLOOD_BANK', 'Blood Bank / Storage Unit'
    AMBULANCE_BASE = 'AMBULANCE_BASE', 'Ambulance Station'


class HealthcareFacility(models.Model):
    """Directory of rural health facilities, pharmacies, blood banks, and ambulance stations."""
    objects = models.Manager()
    osm_id = models.CharField(max_length=100, unique=True, null=True, blank=True, db_index=True)
    name = models.CharField(max_length=255)
    facility_type = models.CharField(
        max_length=64,
        choices=FacilityTypeChoices.choices,
        default=FacilityTypeChoices.PHC,
    )
    district = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100, default='Karnataka')
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    phone = models.CharField(max_length=30, blank=True)
    services_list = models.JSONField(default=list, blank=True)
    data_provenance = models.CharField(max_length=32, default='VERIFIED_STATIC')
    is_verified = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    last_synced_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_facility_type_display()}) - {self.district}"


