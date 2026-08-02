"""
medications.models

Medication model stores medicines extracted from prescriptions or added manually.
Fields include patient link, optional source document, medicine name, dosage instruction text,
structured dosage fields (amount, unit), frequency, timing flags, start/end dates, form, strength,
source type (extracted/manual), confidence score, and timestamps.

Where: medications/models.py
Why: Central place to store medication data for reminders, analytics, and user display.
"""
from django.conf import settings
from django.db import models


class FrequencyChoices(models.TextChoices):
    ONCE_DAILY = 'once_daily', 'Once Daily'
    TWICE_DAILY = 'twice_daily', 'Twice Daily'
    THRICE_DAILY = 'thrice_daily', 'Thrice Daily'
    AS_NEEDED = 'as_needed', 'As needed'
    OTHER = 'other', 'Other'


class SourceChoices(models.TextChoices):
    EXTRACTED = 'extracted', 'Extracted'
    MANUAL = 'manual', 'Manual'


class Medication(models.Model):
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='medications')
    document = models.ForeignKey('medical.MedicalDocument', on_delete=models.SET_NULL, null=True, blank=True, related_name='medications')

    name = models.CharField(max_length=255)
    generic_name = models.CharField(max_length=255, blank=True)
    form = models.CharField(max_length=128, blank=True)  # tablet, syrup, injection
    strength = models.CharField(max_length=128, blank=True)  # e.g., 500 mg

    dosage_text = models.CharField(max_length=512, blank=True)  # raw instruction e.g., '1-0-1'
    dosage_amount = models.CharField(max_length=64, blank=True)  # parsed amount like '1'
    dosage_unit = models.CharField(max_length=32, blank=True)  # e.g., 'tablet'
    frequency = models.CharField(max_length=32, choices=FrequencyChoices.choices, default=FrequencyChoices.OTHER)

    before_food = models.BooleanField(default=False)
    after_food = models.BooleanField(default=False)
    morning = models.BooleanField(default=False)
    afternoon = models.BooleanField(default=False)
    night = models.BooleanField(default=False)

    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    source = models.CharField(max_length=32, choices=SourceChoices.choices, default=SourceChoices.MANUAL)
    confidence = models.FloatField(null=True, blank=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_medications')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} for {self.patient.user.username}"
