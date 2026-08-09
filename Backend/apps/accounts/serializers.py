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

    class Meta:
        model = UserProfile
        fields = [
            'role',
            'role_display',
            'preferred_language',
            'language_display',
            'phone_number',
            'address',
            'organization',
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
    organization = serializers.CharField(max_length=255, required=False, allow_blank=True, write_only=True)

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
            'organization',
            'profile',
        ]

    def create(self, validated_data):
        role = validated_data.pop('role', RoleChoices.PATIENT)
        preferred_language = validated_data.pop('preferred_language', LanguageChoices.ENGLISH)
        phone_number = validated_data.pop('phone_number', '')
        address = validated_data.pop('address', '')
        organization = validated_data.pop('organization', '')
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
            organization=organization,
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
    class Meta:
        model = UserProfile
        fields = [
            'role',
            'preferred_language',
            'phone_number',
            'address',
            'organization',
        ]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid username or password credentials.')
        else:
            raise serializers.ValidationError('Username and password are required.')

        data['user'] = user
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
