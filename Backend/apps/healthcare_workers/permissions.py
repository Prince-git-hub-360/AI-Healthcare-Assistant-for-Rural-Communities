"""
healthcare_workers.permissions

Contains permission classes specific to healthcare worker endpoints.

- IsAdminOrHealthcareWorkerOrReadOnly: Read allowed for authenticated users; writes allowed for staff or the healthcare worker itself.
"""
from rest_framework import permissions


class IsAdminOrHealthcareWorkerOrReadOnly(permissions.BasePermission):
    """Allow read-only access for authenticated users. Create/update/delete allowed for staff or the healthcare worker owner."""

    def has_permission(self, request, view):
        # allow any authenticated user to read
        if request.method in permissions.SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        # write actions require authentication
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # Safe methods already allowed
        if request.method in permissions.SAFE_METHODS:
            return True
        # staff can do any action
        if request.user and request.user.is_staff:
            return True
        # the healthcare worker owner can update their own record
        return bool(hasattr(request.user, 'healthcare_worker') and obj.user == request.user)
