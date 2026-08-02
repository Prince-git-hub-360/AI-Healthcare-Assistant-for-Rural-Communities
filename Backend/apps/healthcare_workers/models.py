"""
healthcare_workers.models

Defines the HealthcareWorker model which stores professional and contact details for doctors, nurses, and community health workers.
Why: Separate healthcare-worker domain model allows storing qualifications, registration numbers, specialties, and availability independently of the authentication User object.
Where: healthcare_workers/models.py inside the healthcare_workers app.

Design notes:
- Linked OneToOne to User to associate credentials with authentication.
- Role field (doctor, nurse, health_worker) to distinguish capabilities.
- Fields kept minimal now: designation, qualifications, registration_number, specialties (CSV text), organization, phone, address, bio, is_active, created_at, updated_at.
- Keep it extensible for future features (schedules, facility links, certificates).
"""
from django.conf import settings
from django.db import models


class HWRoleChoices(models.TextChoices):
    DOCTOR = 'doctor', 'Doctor'
    NURSE = 'nurse', 'Nurse'
    HEALTH_WORKER = 'health_worker', 'Health Worker'
    OTHER = 'other', 'Other'


class HealthcareWorker(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='healthcare_worker')

    role = models.CharField(max_length=32, choices=HWRoleChoices.choices, default=HWRoleChoices.HEALTH_WORKER)
    designation = models.CharField(max_length=255, blank=True)
    qualifications = models.CharField(max_length=512, blank=True)
    registration_number = models.CharField(max_length=128, blank=True)
    specialties = models.CharField(max_length=512, blank=True, help_text='Comma-separated specialties')
    organization = models.CharField(max_length=255, blank=True)

    phone = models.CharField(max_length=30, blank=True)
    address = models.TextField(blank=True)
    bio = models.TextField(blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.get_role_display()})"
