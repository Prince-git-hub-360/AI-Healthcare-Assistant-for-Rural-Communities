from datetime import date
from django.contrib.auth.models import User
from django.db import models


class RoleChoices(models.TextChoices):
    PATIENT = 'patient', 'Patient'
    HEALTHCARE_WORKER = 'healthcare_worker', 'Healthcare Worker'
    DOCTOR = 'doctor', 'Doctor'
    CAREGIVER = 'caregiver', 'Caregiver'
    ADMIN = 'admin', 'Admin'


class LanguageChoices(models.TextChoices):
    ENGLISH = 'en', 'English'
    HINDI = 'hi', 'Hindi'
    BENGALI = 'bn', 'Bengali'
    TAMIL = 'ta', 'Tamil'
    TELUGU = 'te', 'Telugu'
    MARATHI = 'mr', 'Marathi'
    KANNADA = 'kn', 'Kannada'
    MALAYALAM = 'ml', 'Malayalam'
    GUJARATI = 'gu', 'Gujarati'
    PUNJABI = 'pa', 'Punjabi'
    URDU = 'ur', 'Urdu'
    ORIYA = 'or', 'Oriya'


class GenderChoices(models.TextChoices):
    MALE = 'M', 'Male'
    FEMALE = 'F', 'Female'
    OTHER = 'O', 'Other'
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY', 'Prefer Not To Say'


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(
        max_length=32,
        choices=RoleChoices.choices,
        default=RoleChoices.PATIENT,
    )
    gender = models.CharField(
        max_length=20,
        choices=GenderChoices.choices,
        default=GenderChoices.PREFER_NOT_TO_SAY,
    )
    date_of_birth = models.DateField(null=True, blank=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    preferred_language = models.CharField(
        max_length=8,
        choices=LanguageChoices.choices,
        default=LanguageChoices.HINDI,
    )
    phone_number = models.CharField(max_length=20, blank=True)
    village_or_town = models.CharField(max_length=100, blank=True)
    district = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=10, blank=True)
    address = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    profile_photo = models.TextField(blank=True)
    voice_guidance = models.BooleanField(default=True)
    voice_speed = models.CharField(max_length=20, default='normal')
    text_size = models.CharField(max_length=20, default='standard')
    high_contrast = models.BooleanField(default=False)
    emergency_contact_relationship = models.CharField(max_length=50, blank=True)
    caregiver_name = models.CharField(max_length=100, blank=True)
    caregiver_mobile = models.CharField(max_length=20, blank=True)
    medication_reminders = models.BooleanField(default=True)
    missed_medication_alerts = models.BooleanField(default=True)
    caregiver_notifications = models.BooleanField(default=True)
    healthcare_followup_reminders = models.BooleanField(default=True)
    important_healthcare_updates = models.BooleanField(default=True)
    is_phone_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)


    @property
    def calculated_age(self):
        if self.date_of_birth:
            today = date.today()
            return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return self.age

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()}) profile"
