from rest_framework import permissions


class IsReminderOwnerOrHealthcareOrAdmin(permissions.BasePermission):
    """Permission for Reminder objects.

    - Staff and roles admin/healthcare_worker can manage any reminder
    - Patients can manage reminders belonging to their own Patient
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user
        if getattr(user, 'is_staff', False):
            return True
        profile = getattr(user, 'profile', None)
        role = getattr(profile, 'role', None) if profile else None
        if role in ('admin', 'healthcare_worker'):
            return True
        if role == 'patient':
            return obj.patient.user == user
        return False