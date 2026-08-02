"""
patients.views

Viewset for Patient model exposing CRUD operations.
Configured for Version 1 development (AllowAny) so endpoints can be tested unauthenticated.
Automatically creates an associated User record if created by an unauthenticated request.
"""
from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from drf_spectacular.utils import extend_schema

from .models import Patient, PatientCaregiver
from .serializers import CaregiverAssignmentSerializer, PatientSerializer


@extend_schema(tags=['02. Patient Management'])
class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Patient.objects.all()
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'healthcare_worker':
            return Patient.objects.all()
        if profile and profile.role == 'caregiver':
            return Patient.objects.filter(caregiver_assignments__caregiver=user).distinct()
        return Patient.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'patient':
            serializer.save(user=user)
        else:
            raise PermissionDenied('Only authenticated patient users may create their own Patient profile.')


@extend_schema(tags=['03. Healthcare Worker & Caregiver Management'])
class CaregiverAssignmentViewSet(viewsets.ModelViewSet):
    queryset = PatientCaregiver.objects.all()
    serializer_class = CaregiverAssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return PatientCaregiver.objects.all()
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'healthcare_worker':
            return PatientCaregiver.objects.all()
        if profile and profile.role == 'caregiver':
            return PatientCaregiver.objects.filter(caregiver=user)
        return PatientCaregiver.objects.filter(patient__user=user)

    def get_serializer(self, *args, **kwargs):
        if self.request and self.request.user.is_authenticated:
            profile = getattr(self.request.user, 'profile', None)
            if profile and profile.role == 'caregiver' and self.action == 'create':
                data = kwargs.get('data')
                if data is not None and isinstance(data, dict):
                    data = data.copy()
                    data.setdefault('caregiver', self.request.user.pk)
                    kwargs['data'] = data
        return super().get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile and profile.role == 'caregiver':
            serializer.save(caregiver=user)
            return
        if profile and profile.role == 'healthcare_worker':
            serializer.save()
            return
        if user.is_staff:
            serializer.save()
            return
        raise PermissionDenied('Only caregiver, healthcare worker, or staff users may assign caregivers to patients.')
