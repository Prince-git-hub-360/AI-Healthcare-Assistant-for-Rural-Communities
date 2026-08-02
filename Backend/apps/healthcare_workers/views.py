"""
healthcare_workers.views

Provides a HealthcareWorkerViewSet to manage healthcare worker profiles.

Behavior:
- list/retrieve: authenticated users (patients, healthcare workers) can view directory
- create/update/destroy: only staff or the worker themselves (via object permission) can write

Where: healthcare_workers/views.py
"""
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response

from drf_spectacular.utils import extend_schema

from .models import HealthcareWorker
from .serializers import HealthcareWorkerSerializer
from .permissions import IsAdminOrHealthcareWorkerOrReadOnly


@extend_schema(tags=['03. Healthcare Worker & Caregiver Management'])
class HealthcareWorkerViewSet(viewsets.ModelViewSet):
    serializer_class = HealthcareWorkerSerializer
    permission_classes = [IsAdminOrHealthcareWorkerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return HealthcareWorker.objects.all()
        # authenticated users can view active workers only
        return HealthcareWorker.objects.filter(is_active=True)

    def perform_create(self, serializer):
        # If a healthcare worker is creating their own profile, link to their user
        user = self.request.user
        # Admins may create records for others in future (payload could include user id handling)
        # For now, if user already has a healthcare_worker record, return that - otherwise create for request.user
        serializer.save(user=user)
