"""
common.choices

Centralized System Choice Enums for Django Models and DRF Serializers.
"""
from django.db import models


class RoleChoices(models.TextChoices):
    PATIENT = 'patient', 'Patient'
    HEALTHCARE_WORKER = 'healthcare_worker', 'Healthcare Worker / ASHA'
    ADMIN = 'admin', 'System Administrator'


class LanguageChoices(models.TextChoices):
    ENGLISH = 'en', 'English'
    HINDI = 'hi', 'Hindi'
    TAMIL = 'ta', 'Tamil'
    TELUGU = 'te', 'Telugu'
    KANNADA = 'kn', 'Kannada'
    MARATHI = 'mr', 'Marathi'
    BENGALI = 'bn', 'Bengali'
    GUJARATI = 'gu', 'Gujarati'
    MALAYALAM = 'ml', 'Malayalam'
    PUNJABI = 'pa', 'Punjabi'


class GenderChoices(models.TextChoices):
    MALE = 'male', 'Male'
    FEMALE = 'female', 'Female'
    OTHER = 'other', 'Other'
    UNKNOWN = 'unknown', 'Prefer Not to Say'


class FrequencyChoices(models.TextChoices):
    ONCE_DAILY = 'once_daily', 'Once Daily (1x/day)'
    TWICE_DAILY = 'twice_daily', 'Twice Daily (2x/day)'
    THRICE_DAILY = 'thrice_daily', 'Thrice Daily (3x/day)'
    FOUR_TIMES_DAILY = 'four_times_daily', 'Four Times Daily (4x/day)'
    AS_NEEDED = 'as_needed', 'As Needed (PRN)'
    CUSTOM = 'custom', 'Custom Schedule'


class DeliveryMethodChoices(models.TextChoices):
    PUSH = 'push', 'Push Notification'
    SMS = 'sms', 'SMS Alert'
    PHONE_CALL = 'phone_call', 'Voice Call Alert'
    VOICE = 'voice', 'Voice Assistant Guidance'
