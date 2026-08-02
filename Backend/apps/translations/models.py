"""
translations.models

This module defines the Translation model for storing simplified medical text
and regional language translations.

Why: Rural patients like Lakshmi often cannot read medical terminology, Latin
dosage acronyms (e.g. 1-0-1, PC, HS), or complex discharge instructions.
This model acts as the data repository for storing simplified explanations,
regional language translations, and audio guidance references.
"""
from django.db import models
from accounts.models import LanguageChoices


class Translation(models.Model):
    """Translation and medical simplification domain model.

    Fields:
    - patient: Link to the Patient (patients.Patient) receiving guidance
    - document: Optional link to the source MedicalDocument (medical.MedicalDocument)
    - medication: Optional link to a specific Medication (medications.Medication)
    - target_language: Choice field for target regional language
    - original_text: The original medical text or dosage instruction
    - simplified_text: Simplified plain-language medical explanation
    - translated_text: Translated explanation in the patient's preferred language
    - audio_file: Optional path for generated audio voice guidance (V5 feature ready)
    - created_at / updated_at: Audit timestamps
    """

    patient = models.ForeignKey(
        'patients.Patient',
        on_delete=models.CASCADE,
        related_name='translations',
    )
    document = models.ForeignKey(
        'medical.MedicalDocument',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='translations',
    )
    medication = models.ForeignKey(
        'medications.Medication',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='translations',
    )

    target_language = models.CharField(
        max_length=8,
        choices=LanguageChoices.choices,
        default=LanguageChoices.HINDI,
    )

    original_text = models.TextField(blank=True, help_text="Original prescription text or medical phrase")
    simplified_text = models.TextField(blank=True, help_text="Simplified plain-language medical guidance")
    translated_text = models.TextField(blank=True, help_text="Text translated into regional language")

    audio_file = models.FileField(
        upload_to='translations/audio/',
        blank=True,
        null=True,
        help_text="Generated voice guidance audio file",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        lang_display = self.get_target_language_display()
        return f"Translation ({lang_display}) for Patient ID {self.patient_id}"
