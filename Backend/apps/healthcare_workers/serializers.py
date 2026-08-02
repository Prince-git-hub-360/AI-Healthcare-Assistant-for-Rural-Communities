"""
healthcare_workers.serializers

Serializers for HealthcareWorker model. Provide a main HealthcareWorkerSerializer that exposes user info and worker profile.
Where: healthcare_workers/serializers.py

Design notes:
- user_id and username are provided as read-only fields from related User.
- HealthcareWorkerCreateSerializer could be added later for admin-only creation flows.
"""
from rest_framework import serializers

from .models import HealthcareWorker


class HealthcareWorkerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = HealthcareWorker
        fields = [
            'id',
            'user_id',
            'username',
            'full_name',
            'role',
            'designation',
            'qualifications',
            'registration_number',
            'specialties',
            'organization',
            'phone',
            'address',
            'bio',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user_id', 'username', 'full_name', 'created_at', 'updated_at']
