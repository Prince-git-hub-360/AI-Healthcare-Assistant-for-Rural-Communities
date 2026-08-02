from rest_framework import permissions


class IsMedicationOwnerOrHealthcareOrAdmin(permissions.BasePermission):
    """Object-level permission for Medication.

    - Admin and healthcare_worker roles (or Django staff) can do anything.
    - Patients can only access/modify medications that belong to their own Patient record.
    """

    def has_permission(self, request, view):
        # Require authentication for any action other than safe read if project required;
        # for V1 we require authentication here because we want role-aware behavior.
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user
        # Staff users are allowed
        if getattr(user, 'is_staff', False):
            return True

        # Access user profile role; default to deny if no profile
        profile = getattr(user, 'profile', None)
        role = getattr(profile, 'role', None) if profile else None

        if role in ('admin', 'healthcare_worker'):
            return True

        if role == 'patient':
            # obj.patient is a Patient instance linked to User
            return obj.patient.user == user

        # Default deny
        return False
