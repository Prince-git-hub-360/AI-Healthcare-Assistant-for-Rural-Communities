from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


from .models import HealthContent, HealthcareWorkerProfile, MedicalDocument, MedicalEntityExtraction, PatientProfile, SymptomQuery, Translation, User

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'phone_number', 'password', 'password2', 'role', 'language_preference')
        extra_kwargs = {
            'phone_number': {'required': False, 'allow_blank': True},
            'role': {'required': False},
            'language_preference': {'required': False},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password2': 'Passwords do not match.'})
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class HealthcareWorkerRegistrationSerializer(serializers.ModelSerializer):
    """Registration for doctors / health workers — collects license/credential info up front."""

    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    license_number = serializers.CharField(write_only=True)
    specialization = serializers.CharField(write_only=True, required=False, allow_blank=True)
    health_center = serializers.CharField(write_only=True, required=False, allow_blank=True)
    years_experience = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = User
        fields = (
            'username', 'phone_number', 'password', 'password2', 'language_preference',
            'license_number', 'specialization', 'health_center', 'years_experience',
        )
        extra_kwargs = {
            'phone_number': {'required': False, 'allow_blank': True},
            'language_preference': {'required': False},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password2': 'Passwords do not match.'})
        validate_password(attrs['password'])
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        worker_fields = {
            'license_number': validated_data.pop('license_number'),
            'specialization': validated_data.pop('specialization', ''),
            'health_center': validated_data.pop('health_center', ''),
            'years_experience': validated_data.pop('years_experience', None),
        }
        user = User(role=User.Role.DOCTOR, **validated_data)
        user.set_password(password)
        user.save()
        HealthcareWorkerProfile.objects.create(user=user, **worker_fields)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs['username'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError({'detail': 'Invalid username or password.'})
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'phone_number', 'role', 'language_preference', 'is_verified', 'created_at')
        read_only_fields = ('id', 'created_at', 'is_verified')


class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')


class LanguagePreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('language_preference',)


class MedicalDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalDocument
        fields = ('id', 'document_type', 'title', 'notes', 'file', 'uploaded_at')
        read_only_fields = ('id', 'uploaded_at')

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['patient'] = request.user
        validated_data['uploaded_by'] = request.user
        return super().create(validated_data)


class HealthcareWorkerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthcareWorkerProfile
        fields = (
            'license_number', 'specialization', 'health_center',
            'years_experience', 'is_approved', 'created_at', 'updated_at',
        )
        read_only_fields = ('is_approved', 'created_at', 'updated_at')


class HealthContentSerializer(serializers.ModelSerializer):
    published_by_name = serializers.CharField(source='published_by.username', read_only=True)

    class Meta:
        model = HealthContent
        fields = (
            'id', 'title', 'content_type', 'body', 'media_url', 'category',
            'language', 'is_published', 'published_by', 'published_by_name', 'created_at',
        )
        read_only_fields = ('id', 'published_by', 'published_by_name', 'created_at')

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['published_by'] = request.user
        return super().create(validated_data)


class PatientHistorySerializer(serializers.ModelSerializer):
    """Aggregated Patient History Management view: profile + document timeline."""

    patient_profile = PatientProfileSerializer(read_only=True)
    documents = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'phone_number', 'patient_profile', 'documents')

    def get_documents(self, obj):
        docs = obj.medical_documents.all()
        return MedicalDocumentSerializer(docs, many=True, context=self.context).data
class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Translation
        fields = (
            'id', 'document', 'source_type', 'source_text',
            'target_language', 'translated_text', 'simplified_explanation', 'created_at',
        )
        read_only_fields = ('id', 'translated_text', 'simplified_explanation', 'created_at')
class MedicalEntityExtractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalEntityExtraction
        fields = (
            'id', 'document', 'source_text', 'diseases',
            'medications', 'treatment_instructions', 'other_entities', 'created_at',
        )
        read_only_fields = ('id', 'diseases', 'medications', 'treatment_instructions', 'other_entities', 'created_at')
class SymptomQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = SymptomQuery
        fields = (
            'id', 'query', 'language', 'symptom_information',
            'possible_related_conditions', 'disease_awareness',
            'preventive_care', 'when_to_see_a_doctor', 'created_at',
        )
        read_only_fields = (
            'id', 'symptom_information', 'possible_related_conditions',
            'disease_awareness', 'preventive_care', 'when_to_see_a_doctor', 'created_at',
        )                