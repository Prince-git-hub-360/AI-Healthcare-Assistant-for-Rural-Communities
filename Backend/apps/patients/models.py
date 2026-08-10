"""
patients.models

This file defines the Patient model which stores patient-specific medical and contact information.
Why: A dedicated Patient model keeps medical data separate from authentication (User) and profile metadata,
allowing richer health-related fields (blood group, emergency contact, medical history) to be stored and
managed independently. It links to the Django User model using a OneToOneField so each User with role="patient"
has an associated Patient record.

Where: patients/models.py inside the patients app.

Best practices used:
- OneToOne relation to User to separate auth from domain data
- Choice fields for gender and blood group to constrain values
- Timestamps for auditability
- __str__ for admin readability
"""
from django.conf import settings
from django.db import models


class GenderChoices(models.TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'
    OTHER = 'other', 'Other'
    UNKNOWN = 'unknown', 'Unknown'


class BloodGroupChoices(models.TextChoices):
    A_POS = 'A+', 'A+'
    A_NEG = 'A-', 'A-'
    B_POS = 'B+', 'B+'
    B_NEG = 'B-', 'B-'
    AB_POS = 'AB+', 'AB+'
    AB_NEG = 'AB-', 'AB-'
    O_POS = 'O+', 'O+'
    O_NEG = 'O-', 'O-'
    UNKNOWN = 'Unknown', 'Unknown'


class Patient(models.Model):
    """Patient domain model storing healthcare-specific information.

    Fields:
    - user: OneToOne to Django User (owner of this patient record)
    - date_of_birth, age: optional DOB and computed/entered age
    - gender: constrained choices
    - phone, address: contact details (phone stored as string for international formats)
    - preferred_language: re-used from accounts.LanguageChoices when available (stored as free text fallback)
    - blood_group: constrained choices
    - emergency_contact_name, emergency_contact_phone
    - medical_history: free text field to store past illnesses, surgeries, chronic conditions
    - allergies: free text
    - chronic_conditions: free text
    - created_at / updated_at timestamps

    Note: Keep clinical fields as text now; later these can be normalized into related tables if needed.
    """
    objects = models.Manager()

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient')

    date_of_birth = models.DateField(blank=True, null=True)
    age = models.PositiveSmallIntegerField(blank=True, null=True)
    gender = models.CharField(max_length=16, choices=GenderChoices.choices, default=GenderChoices.UNKNOWN)

    phone = models.CharField(max_length=30, blank=True)
    address = models.TextField(blank=True)
    preferred_language = models.CharField(max_length=16, blank=True)

    blood_group = models.CharField(max_length=8, choices=BloodGroupChoices.choices, default=BloodGroupChoices.UNKNOWN)

    emergency_contact_name = models.CharField(max_length=255, blank=True)
    emergency_contact_phone = models.CharField(max_length=30, blank=True)

    medical_history = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    chronic_conditions = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Patient: {self.user.username} ({self.user.get_full_name() or self.user.username})"


class PatientCaregiver(models.Model):
    """Association between a Patient and a caregiver user."""
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='caregiver_assignments')
    caregiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assigned_patients')
    relationship = models.CharField(max_length=128, blank=True, help_text='Relationship to patient, e.g. son, daughter, neighbour')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('patient', 'caregiver')
        ordering = ['-created_at']

    def __str__(self):
        return f"Caregiver {self.caregiver.username} for Patient {self.patient.user.username}"
