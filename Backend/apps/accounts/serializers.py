"""
accounts.serializers

Serializers for User authentication, profile management, registration, and login.
"""
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import UserProfile, RoleChoices, LanguageChoices


class UserProfileSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    language_display = serializers.CharField(source='get_preferred_language_display', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'role',
            'role_display',
            'gender',
            'gender_display',
            'date_of_birth',
            'age',
            'preferred_language',
            'language_display',
            'phone_number',
            'village_or_town',
            'district',
            'state',
            'pincode',
            'address',
            'emergency_contact_name',
            'emergency_contact_phone',
            'emergency_contact_relationship',
            'caregiver_name',
            'caregiver_mobile',
            'profile_photo',
            'voice_guidance',
            'voice_speed',
            'text_size',
            'high_contrast',
            'medication_reminders',
            'missed_medication_alerts',
            'caregiver_notifications',
            'healthcare_followup_reminders',
            'important_healthcare_updates',
            'is_phone_verified',
        ]




class UserRegistrationSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=RoleChoices.choices,
        default=RoleChoices.PATIENT,
        write_only=True,
        required=False,
    )
    preferred_language = serializers.ChoiceField(
        choices=LanguageChoices.choices,
        default=LanguageChoices.ENGLISH,
        write_only=True,
        required=False,
    )
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True, write_only=True)
    address = serializers.CharField(required=False, allow_blank=True, write_only=True)
    gender = serializers.CharField(max_length=20, required=False, allow_blank=True, write_only=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True, write_only=True)
    age = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    village_or_town = serializers.CharField(max_length=100, required=False, allow_blank=True, write_only=True)
    district = serializers.CharField(max_length=100, required=False, allow_blank=True, write_only=True)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True, write_only=True)
    pincode = serializers.CharField(max_length=10, required=False, allow_blank=True, write_only=True)
    emergency_contact_name = serializers.CharField(max_length=100, required=False, allow_blank=True, write_only=True)
    emergency_contact_phone = serializers.CharField(max_length=20, required=False, allow_blank=True, write_only=True)

    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'role',
            'preferred_language',
            'phone_number',
            'address',
            'gender',
            'date_of_birth',
            'age',
            'village_or_town',
            'district',
            'state',
            'pincode',
            'emergency_contact_name',
            'emergency_contact_phone',
            'profile',
        ]

    def create(self, validated_data):
        role = validated_data.pop('role', RoleChoices.PATIENT)
        preferred_language = validated_data.pop('preferred_language', LanguageChoices.ENGLISH)
        phone_number = validated_data.pop('phone_number', '')
        address = validated_data.pop('address', '')
        gender = validated_data.pop('gender', 'PREFER_NOT_TO_SAY')
        date_of_birth = validated_data.pop('date_of_birth', None)
        age = validated_data.pop('age', None)
        village_or_town = validated_data.pop('village_or_town', '')
        district = validated_data.pop('district', '')
        state = validated_data.pop('state', '')
        pincode = validated_data.pop('pincode', '')
        emergency_contact_name = validated_data.pop('emergency_contact_name', '')
        emergency_contact_phone = validated_data.pop('emergency_contact_phone', '')
        password = validated_data.pop('password')

        # Create base User account
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Create associated UserProfile
        UserProfile.objects.create(
            user=user,
            role=role,
            preferred_language=preferred_language,
            phone_number=phone_number,
            address=address,
            gender=gender,
            date_of_birth=date_of_birth,
            age=age,
            village_or_town=village_or_town,
            district=district,
            state=state,
            pincode=pincode,
            emergency_contact_name=emergency_contact_name,
            emergency_contact_phone=emergency_contact_phone,
        )

        # Auto-create domain Patient model if role is patient
        if role == RoleChoices.PATIENT:
            from patients.models import Patient
            Patient.objects.get_or_create(
                user=user,
                defaults={
                    'phone': phone_number,
                    'address': address,
                    'preferred_language': preferred_language,
                }
            )
        elif role in (RoleChoices.HEALTHCARE_WORKER, 'doctor'):
            from healthcare_workers.models import HealthcareWorker
            HealthcareWorker.objects.get_or_create(
                user=user,
                defaults={
                    'role': 'doctor' if role == 'doctor' else 'health_worker',
                    'phone': phone_number,
                    'address': address,
                }
            )

        return user



class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    patient_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'patient_id',
            'profile',
        ]

    def get_patient_id(self, obj):
        patient = getattr(obj, 'patient', None)
        return patient.id if patient else None


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False, allow_blank=True)
    last_name = serializers.CharField(source='user.last_name', required=False, allow_blank=True)
    email = serializers.EmailField(source='user.email', required=False, allow_blank=True)
    phone_number = serializers.CharField(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'gender',
            'date_of_birth',
            'age',
            'preferred_language',
            'village_or_town',
            'district',
            'state',
            'pincode',
            'address',
            'emergency_contact_name',
            'emergency_contact_phone',
            'emergency_contact_relationship',
            'caregiver_name',
            'caregiver_mobile',
            'profile_photo',
            'voice_guidance',
            'voice_speed',
            'text_size',
            'high_contrast',
            'medication_reminders',
            'missed_medication_alerts',
            'caregiver_notifications',
            'healthcare_followup_reminders',
            'important_healthcare_updates',
        ]


    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        if 'first_name' in user_data:
            user.first_name = user_data['first_name']
        if 'last_name' in user_data:
            user.last_name = user_data['last_name']
        if 'email' in user_data:
            user.email = user_data['email']
        user.save()

        # Update UserProfile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Sync with domain Patient model if role is patient
        patient = getattr(user, 'patient', None)
        if patient:
            if 'address' in validated_data:
                patient.address = validated_data['address']
            if 'preferred_language' in validated_data:
                patient.preferred_language = validated_data['preferred_language']
            patient.save()

        return instance



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid username or password credentials.')
        else:
            raise serializers.ValidationError('Username and password are required.')

        attrs['user'] = user
        return attrs


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
