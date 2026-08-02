from rest_framework import serializers
from django.utils.text import get_valid_filename
import uuid

from .models import MedicalDocument
from patients.models import Patient
from django.conf import settings


class MedicalDocumentSerializer(serializers.ModelSerializer):
    # Allow clients to provide a patient id when creating documents (staff/healthcare worker flows).
    # For patients creating their own document, the view will set patient automatically.
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all(), required=False)
    uploaded_by = serializers.CharField(source='uploaded_by.username', read_only=True)
    patient_username = serializers.CharField(source='patient.user.username', read_only=True)

    class Meta:
        model = MedicalDocument
        fields = [
            'id',
            'patient',
            'patient_username',
            'uploaded_by',
            'title',
            'document_type',
            'original_file',
            'text_content',
            'language',
            'translated_text',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['uploaded_by', 'created_at', 'updated_at', 'patient_username']

    def validate_original_file(self, file):
        # File may be None
        if not file:
            return file
        # Size check
        max_size = getattr(settings, 'MAX_DOCUMENT_UPLOAD_SIZE', 5 * 1024 * 1024)
        if file.size > max_size:
            raise serializers.ValidationError(f'File too large. Max size is {max_size} bytes')
        # Content type check
        allowed = getattr(settings, 'ALLOWED_DOCUMENT_MIME_TYPES', ['application/pdf', 'image/jpeg', 'image/png'])
        content_type = getattr(file, 'content_type', None)
        if content_type and content_type not in allowed:
            raise serializers.ValidationError('Unsupported file type.')
        return file

    def create(self, validated_data):
        # Sanitize filename to avoid unsafe characters and collisions
        file = validated_data.get('original_file', None)
        if file:
            filename = get_valid_filename(file.name)
            unique_name = f"{uuid.uuid4().hex}_{filename}"
            file.name = unique_name
            validated_data['original_file'] = file
        return super().create(validated_data)
