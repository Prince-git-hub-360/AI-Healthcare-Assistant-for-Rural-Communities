from rest_framework import serializers


class MedicineContextSerializer(serializers.Serializer):
    name = serializers.CharField(required=False, allow_blank=True, default='')
    medicine_name = serializers.CharField(required=False, allow_blank=True, default='')
    dosage = serializers.CharField(required=False, allow_blank=True, default='')
    strength = serializers.CharField(required=False, allow_blank=True, default='')
    frequency = serializers.CharField(required=False, allow_blank=True, default='')
    timing = serializers.CharField(required=False, allow_blank=True, default='')
    duration = serializers.CharField(required=False, allow_blank=True, default='')
    instructions = serializers.CharField(required=False, allow_blank=True, default='')
    prescription_context = serializers.CharField(required=False, allow_blank=True, default='')


class MedicineAssistantQuerySerializer(serializers.Serializer):
    question = serializers.CharField(required=True, allow_blank=False, max_length=1000)
    medicine = MedicineContextSerializer(required=False, allow_null=True, default=None)
    language = serializers.CharField(required=False, allow_blank=True, default='English')
    conversation_history = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        default=list
    )

    def validate_question(self, value):
        cleaned = value.strip()
        if not cleaned:
            raise serializers.ValidationError("Question cannot be empty.")
        return cleaned
