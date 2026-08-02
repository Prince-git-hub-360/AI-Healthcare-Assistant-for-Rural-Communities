"""
translations.serializers

Serializers for the Translation model.
Handles serialization and validation for REST API endpoints.
"""
from rest_framework import serializers
from .models import Translation


class TranslationSerializer(serializers.ModelSerializer):
    """Detailed Read/Write serializer for Translation objects."""

    target_language_display = serializers.CharField(
        source='get_target_language_display',
        read_only=True,
    )
    patient_username = serializers.CharField(
        source='patient.user.username',
        read_only=True,
    )
    document_title = serializers.CharField(
        source='document.title',
        read_only=True,
        default=None,
    )
    medication_name = serializers.CharField(
        source='medication.name',
        read_only=True,
        default=None,
    )

    class Meta:
        model = Translation
        fields = [
            'id',
            'patient',
            'patient_username',
            'document',
            'document_title',
            'medication',
            'medication_name',
            'target_language',
            'target_language_display',
            'original_text',
            'simplified_text',
            'translated_text',
            'audio_file',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        original_text = attrs.get('original_text', getattr(self.instance, 'original_text', ''))
        simplified_text = attrs.get('simplified_text', getattr(self.instance, 'simplified_text', ''))
        translated_text = attrs.get('translated_text', getattr(self.instance, 'translated_text', ''))

        if not any([original_text, simplified_text, translated_text]):
            raise serializers.ValidationError(
                "At least one of 'original_text', 'simplified_text', or 'translated_text' must be provided."
            )
        return attrs


class VoiceGuidanceRequestSerializer(serializers.Serializer):
    text = serializers.CharField(required=True, help_text="Medical text to simplify and translate into voice guidance")
    target_language = serializers.CharField(default='hi', help_text="Target language code e.g. hi, ta, te, kn, mr, bn, gu, ml, pa")
    patient_id = serializers.IntegerField(required=False, allow_null=True)
    generate_audio = serializers.BooleanField(default=True)

