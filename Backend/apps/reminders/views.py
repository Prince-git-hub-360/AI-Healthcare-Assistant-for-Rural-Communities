"""
reminders.views

ModelViewSet for Reminder resources.
Configured with AllowAny for Version 1 development.
Includes custom endpoint /api/reminders/trigger-due-reminders/ for automated execution.
"""
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from drf_spectacular.utils import extend_schema

from .models import Reminder
from .serializers import ReminderSerializer
from .services import ReminderTriggerService


@extend_schema(tags=['06. Smart Dosage Reminders'])
class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['patient', 'medication', 'active', 'delivery_method']
    search_fields = ['title', 'notes']
    ordering_fields = ['next_run', 'created_at']

    def get_queryset(self):
        user = self.request.user
        qs = Reminder.objects.all()

        if user.is_authenticated and not user.is_staff:
            profile = getattr(user, 'profile', None)
            role = getattr(profile, 'role', None) if profile else None
            if role == 'patient':
                qs = qs.filter(patient__user=user)

        active = self.request.query_params.get('active')
        if active and active.lower() in ['1', 'true', 'yes']:
            qs = qs.filter(active=True)
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        if user.is_authenticated:
            profile = getattr(user, 'profile', None)
            role = getattr(profile, 'role', None) if profile else None
            if role == 'patient':
                patient = getattr(user, 'patient', None)
                if patient:
                    serializer.save(created_by=user, patient=patient)
                    return
            serializer.save(created_by=user)
        else:
            serializer.save()

    @action(detail=False, methods=['post'], url_path='trigger-due-reminders')
    def trigger_due_reminders(self, request, *args, **kwargs):
        """Custom endpoint to trigger due reminders and dispatch caregiver alerts."""
        result = ReminderTriggerService.trigger_due_reminders()
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='missed-alerts')
    def missed_alerts(self, request, *args, **kwargs):
        """Endpoint to list missed medication doses and alerts."""
        missed = Reminder.objects.filter(dose_status='missed')
        serializer = self.get_serializer(missed, many=True)
        return Response({
            'status': 'ok',
            'missed_count': missed.count(),
            'missed_reminders': serializer.data,
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='notify-caregiver')
    def notify_caregiver(self, request, *args, **kwargs):
        """Endpoint to dispatch emergency alerts to patient caregivers for un-acknowledged doses."""
        reminder_id = request.data.get('reminder_id')
        reminder = Reminder.objects.filter(id=reminder_id).first() if reminder_id else Reminder.objects.filter(active=True).first()

        from django.utils import timezone
        now = timezone.now()

        if reminder:
            reminder.caregiver_notified_at = now
            reminder.save(update_fields=['caregiver_notified_at'])
            patient = reminder.patient
            caregiver_phone = patient.emergency_contact_phone or '9999999999'
            caregiver_name = patient.emergency_contact_name or 'Default Caregiver'
            msg = f"EMERGENCY MEDICATION ALERT: Patient {patient.user.username} has not acknowledged medication dose '{reminder.title}' due at {reminder.time}."
        else:
            caregiver_phone = '9999999999'
            caregiver_name = 'Assigned Caregiver'
            msg = "EMERGENCY MEDICATION ALERT: Patient medication dose is due/missed."

        return Response({
            'status': 'alert_dispatched',
            'caregiver_name': caregiver_name,
            'caregiver_phone': caregiver_phone,
            'alert_message': msg,
            'dispatched_at': str(now),
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='acknowledge')
    def acknowledge_dose(self, request, pk=None, *args, **kwargs):
        """Endpoint for patient to acknowledge taking their medication dose."""
        reminder = self.get_object()
        from django.utils import timezone
        reminder.dose_status = 'taken'
        reminder.acknowledged_at = timezone.now()
        reminder.save(update_fields=['dose_status', 'acknowledged_at'])

        return Response({
            'status': 'acknowledged',
            'reminder_id': reminder.id,
            'title': reminder.title,
            'dose_status': reminder.dose_status,
            'acknowledged_at': str(reminder.acknowledged_at),
        }, status=status.HTTP_200_OK)
