"""
patients.serializers

This file contains DRF serializers for Patient model.
Why: Serializers provide validation, shape input and output payloads and are reused by viewsets and tests.
Where: patients/serializers.py

We expose PatientSerializer (read/write) and caregiver assignment serializers.
"""
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Patient, PatientCaregiver


class PatientSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    caregivers = serializers.SerializerMethodField()

    class Meta:
        model = Patient
        fields = [
            'id',
            'user_id',
            'username',
            'date_of_birth',
            'age',
            'gender',
            'phone',
            'address',
            'preferred_language',
            'blood_group',
            'emergency_contact_name',
            'emergency_contact_phone',
            'medical_history',
            'allergies',
            'chronic_conditions',
            'caregivers',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user_id', 'username', 'created_at', 'updated_at']

    def get_caregivers(self, obj):
        return [
            {
                'caregiver_id': assignment.caregiver.id,
                'caregiver_username': assignment.caregiver.username,
                'relationship': assignment.relationship,
            }
            for assignment in obj.caregiver_assignments.select_related('caregiver').all()
        ]


class CaregiverAssignmentSerializer(serializers.ModelSerializer):
    patient_username = serializers.CharField(source='patient.user.username', read_only=True)
    caregiver_username = serializers.CharField(source='caregiver.username', read_only=True)
    caregiver_email = serializers.EmailField(source='caregiver.email', read_only=True)
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    caregiver = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.none(), required=False)

    class Meta:
        model = PatientCaregiver
        fields = [
            'id',
            'patient',
            'patient_username',
            'caregiver',
            'caregiver_username',
            'caregiver_email',
            'relationship',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'patient_username',
            'caregiver_username',
            'caregiver_email',
            'created_at',
            'updated_at',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        caregiver_queryset = get_user_model().objects.filter(profile__role='caregiver')
        self.fields['caregiver'].queryset = caregiver_queryset

    def validate(self, data):
        patient = data.get('patient')
        caregiver = data.get('caregiver')

        if not patient:
            raise serializers.ValidationError({'patient': 'Patient is required.'})

        if self.context['request'].user.is_authenticated:
            profile = getattr(self.context['request'].user, 'profile', None)
            if profile and profile.role == 'caregiver':
                caregiver = self.context['request'].user
                data['caregiver'] = caregiver

        if not caregiver:
            raise serializers.ValidationError({'caregiver': 'Caregiver is required.'})

        if getattr(caregiver, 'profile', None) and caregiver.profile.role != 'caregiver':
            raise serializers.ValidationError({'caregiver': 'Selected user must have caregiver role.'})

        return data
