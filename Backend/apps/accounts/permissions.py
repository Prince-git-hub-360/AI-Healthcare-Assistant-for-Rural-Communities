from rest_framework import permissions


class IsHealthcareWorker(permissions.BasePermission):
    """Allow access only to users with role healthcare_worker or staff."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        profile = getattr(user, 'profile', None)
        if user.is_staff:
            return True
        return profile and profile.role == 'healthcare_worker'


class IsPatient(permissions.BasePermission):
    """Allow access only to users with role patient."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        profile = getattr(user, 'profile', None)
        return profile and profile.role == 'patient'


class IsAdmin(permissions.BasePermission):
    """Allow access only to admin (is_staff)."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
