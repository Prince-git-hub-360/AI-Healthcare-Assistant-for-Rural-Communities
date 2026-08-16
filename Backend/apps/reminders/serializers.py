from rest_framework import serializers

from .models import Reminder


class ReminderSerializer(serializers.ModelSerializer):
    patient_id = serializers.IntegerField(source='patient.id', read_only=True)
    medication_id = serializers.IntegerField(source='medication.id', read_only=True)
    duration_days = serializers.SerializerMethodField()

    class Meta:
        model = Reminder
        fields = [
            'id', 'patient', 'patient_id', 'medication', 'medication_id',
            'title', 'notes', 'time', 'start_date', 'end_date', 'duration_days',
            'frequency', 'custom_rule', 'delivery_method',
            'active', 'last_sent', 'next_run', 'dose_status', 'acknowledged_at',
            'missed_alert_sent', 'caregiver_notified_at', 'timezone',
            'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'patient_id', 'medication_id', 'duration_days', 'created_by', 'created_at', 'updated_at', 'last_sent', 'next_run', 'acknowledged_at', 'caregiver_notified_at']

    def get_duration_days(self, obj):
        if obj.start_date and obj.end_date:
            return max(1, (obj.end_date - obj.start_date).days + 1)
        if obj.medication and obj.medication.start_date and obj.medication.end_date:
            return max(1, (obj.medication.end_date - obj.medication.start_date).days + 1)
        return 5

    def validate(self, data):
        if not data.get('patient'):
            raise serializers.ValidationError({'patient': 'Patient is required for a reminder'})
        if not data.get('title'):
            raise serializers.ValidationError({'title': 'Title is required'})
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = None
        if request and hasattr(request, 'user') and request.user and not request.user.is_anonymous:
            user = request.user
        if user:
            validated_data['created_by'] = user
        reminder = super().create(validated_data)
        # schedule a next_run placeholder
        try:
            reminder.schedule_next_run()
        except Exception:
            # scheduling failures should not block creation
            pass
        return reminder
