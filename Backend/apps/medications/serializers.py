"""
medications.serializers

Serializers for Medication model. Provide MedicationSerializer for read/write operations.
"""
from rest_framework import serializers

from .models import Medication
from patients.serializers import PatientSerializer


class MedicationSerializer(serializers.ModelSerializer):
    patient_id = serializers.IntegerField(source='patient.id', read_only=True)
    patient_username = serializers.CharField(source='patient.user.username', read_only=True)
    document_id = serializers.IntegerField(source='document.id', read_only=True)

    class Meta:
        model = Medication
        fields = [
            'id',
            'patient',
            'patient_id',
            'patient_username',
            'document',
            'document_id',
            'name',
            'generic_name',
            'form',
            'strength',
            'dosage_text',
            'dosage_amount',
            'dosage_unit',
            'frequency',
            'before_food',
            'after_food',
            'morning',
            'afternoon',
            'night',
            'start_date',
            'end_date',
            'source',
            'confidence',
            'created_by',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'patient_id', 'patient_username', 'document_id', 'created_by', 'created_at', 'updated_at']

    def validate(self, data):
        if not data.get('patient'):
            raise serializers.ValidationError({'patient': 'Patient is required'})
        if not data.get('name'):
            raise serializers.ValidationError({'name': 'Medication name is required'})
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = None
        if request and hasattr(request, 'user') and request.user and not request.user.is_anonymous:
            user = request.user
        if user:
            validated_data['created_by'] = user
        return super().create(validated_data)


class PrescriptionParseRequestSerializer(serializers.Serializer):
    text = serializers.CharField(required=True, help_text="Raw prescription text or doctor notes")
    patient_id = serializers.IntegerField(required=False, allow_null=True)
    document_id = serializers.IntegerField(required=False, allow_null=True)
    save_to_db = serializers.BooleanField(default=True)

