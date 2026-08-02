"""
accounts.serializers

Serializers for User authentication, profile management, registration, and login.
Includes gender, date_of_birth, and calculated_age for rural healthcare demographics.
"""
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import UserProfile, RoleChoices, LanguageChoices, GenderChoices


class UserProfileSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    language_display = serializers.CharField(source='get_preferred_language_display', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    calculated_age = serializers.IntegerField(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'role',
            'role_display',
            'gender',
            'gender_display',
            'date_of_birth',
            'age',
            'calculated_age',
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
            'organization',
            'is_phone_verified',
            'created_at',
            'updated_at',
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(
        choices=RoleChoices.choices,
        default=RoleChoices.PATIENT,
        write_only=True,
        required=False,
    )
    gender = serializers.ChoiceField(
        choices=GenderChoices.choices,
        write_only=True,
        required=True,
    )
    date_of_birth = serializers.DateField(write_only=True, required=True, allow_null=False)
    age = serializers.IntegerField(write_only=True, required=True, allow_null=False)
    preferred_language = serializers.ChoiceField(
        choices=LanguageChoices.choices,
        write_only=True,
        required=True,
    )
    email = serializers.EmailField(required=True, allow_blank=False)
    first_name = serializers.CharField(max_length=150, required=True, allow_blank=False)
    last_name = serializers.CharField(max_length=150, required=True, allow_blank=False)
    phone_number = serializers.CharField(max_length=20, required=True, allow_blank=False, write_only=True)
    village_or_town = serializers.CharField(max_length=100, required=False, allow_blank=True, write_only=True)
    district = serializers.CharField(max_length=100, required=True, allow_blank=False, write_only=True)
    state = serializers.CharField(max_length=100, required=True, allow_blank=False, write_only=True)
    pincode = serializers.CharField(max_length=10, required=True, allow_blank=False, write_only=True)
    address = serializers.CharField(required=False, allow_blank=True, write_only=True)
    emergency_contact_name = serializers.CharField(max_length=100, required=False, allow_blank=True, write_only=True)
    emergency_contact_phone = serializers.CharField(max_length=20, required=False, allow_blank=True, write_only=True)
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
            'gender',
            'date_of_birth',
            'age',
            'preferred_language',
            'phone_number',
            'village_or_town',
            'district',
            'state',
            'pincode',
            'address',
            'emergency_contact_name',
            'emergency_contact_phone',
            'organization',
            'profile',
        ]

    def validate(self, data):
        role = data.get('role', RoleChoices.PATIENT)
        if role == RoleChoices.PATIENT:
            if not data.get('village_or_town'):
                raise serializers.ValidationError({'village_or_town': 'Village / Gram Panchayat is required for Patients.'})
            if not data.get('emergency_contact_name'):
                raise serializers.ValidationError({'emergency_contact_name': 'Emergency Relative Name is required for Patients.'})
            if not data.get('emergency_contact_phone'):
                raise serializers.ValidationError({'emergency_contact_phone': 'Emergency Relative Phone is required for Patients.'})
        elif role == RoleChoices.HEALTHCARE_WORKER:
            if not data.get('organization'):
                raise serializers.ValidationError({'organization': 'Hospital / PHC Name is required for Healthcare Workers.'})
        return data

    def create(self, validated_data):
        role = validated_data.pop('role', RoleChoices.PATIENT)
        gender = validated_data.pop('gender', GenderChoices.MALE)
        date_of_birth = validated_data.pop('date_of_birth', None)
        age = validated_data.pop('age', None)
        preferred_language = validated_data.pop('preferred_language', LanguageChoices.HINDI)
        phone_number = validated_data.pop('phone_number', '')
        village_or_town = validated_data.pop('village_or_town', '')
        district = validated_data.pop('district', '')
        state = validated_data.pop('state', '')
        pincode = validated_data.pop('pincode', '')
        address = validated_data.pop('address', '')
        emergency_contact_name = validated_data.pop('emergency_contact_name', '')
        emergency_contact_phone = validated_data.pop('emergency_contact_phone', '')
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
            gender=gender,
            date_of_birth=date_of_birth,
            age=age,
            preferred_language=preferred_language,
            phone_number=phone_number,
            village_or_town=village_or_town,
            district=district,
            state=state,
            pincode=pincode,
            address=address,
            emergency_contact_name=emergency_contact_name,
            emergency_contact_phone=emergency_contact_phone,
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
                    'age': age or 50,
                    'gender': gender,
                }
            )

        # Auto-create domain HealthcareWorker model if role is healthcare worker
        if role == RoleChoices.HEALTHCARE_WORKER:
            from healthcare_workers.models import HealthcareWorker
            HealthcareWorker.objects.get_or_create(user=user)

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
            'gender',
            'date_of_birth',
            'age',
            'preferred_language',
            'phone_number',
            'village_or_town',
            'district',
            'state',
            'pincode',
            'address',
            'emergency_contact_name',
            'emergency_contact_phone',
            'organization',
        ]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    expected_role = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        expected_role = data.get('expected_role')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid username or password credentials.')
        else:
            raise serializers.ValidationError('Username and password are required.')

        if expected_role and hasattr(user, 'profile'):
            user_role = user.profile.role
            if user_role != expected_role:
                role_display = user.profile.get_role_display()
                raise serializers.ValidationError(
                    f'This account is registered as "{role_display}". Please select the matching login tab.'
                )

        data['user'] = user
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, style={'input_type': 'password'})
