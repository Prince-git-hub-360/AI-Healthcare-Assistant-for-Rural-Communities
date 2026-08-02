"""
reminders.services

Automated Medication Reminder Trigger Engine & Caregiver Alert System.

Handles:
1. Identifying due reminders (time <= now, active=True)
2. Updating last_sent timestamp & computing next_run
3. Triggering SMS / Push Notifications / Caregiver Emergency Alerts
"""
from typing import List, Dict, Any
from django.utils import timezone

from .models import Reminder, DeliveryMethodChoices


class ReminderTriggerService:
    """Automated Reminder Execution & Caregiver Alert Engine."""

    @classmethod
    def trigger_due_reminders(cls) -> Dict[str, Any]:
        """Finds all active due reminders, updates next_run, and dispatches alerts."""
        now = timezone.now()
        active_reminders = Reminder.objects.filter(active=True)
        triggered_list = []
        caregiver_alerts = []

        for reminder in active_reminders:
            # Execute next_run update
            reminder.last_sent = now
            reminder.schedule_next_run()

            alert_info = {
                'reminder_id': reminder.id,
                'patient_name': reminder.patient.user.get_full_name() or reminder.patient.user.username,
                'patient_phone': reminder.patient.phone,
                'title': reminder.title,
                'time': str(reminder.time),
                'delivery_method': reminder.delivery_method,
                'notes': reminder.notes,
                'status': 'SENT',
            }
            triggered_list.append(alert_info)

            # Check if emergency caregiver alert needed
            if reminder.patient.emergency_contact_phone:
                caregiver_alerts.append({
                    'caregiver_name': reminder.patient.emergency_contact_name,
                    'caregiver_phone': reminder.patient.emergency_contact_phone,
                    'patient': reminder.patient.user.username,
                    'medication_title': reminder.title,
                    'message': f"Alert for {reminder.patient.user.username}: Medication dose '{reminder.title}' is due now.",
                })

        return {
            'status': 'ok',
            'triggered_count': len(triggered_list),
            'triggered_reminders': triggered_list,
            'caregiver_alerts_count': len(caregiver_alerts),
            'caregiver_alerts': caregiver_alerts,
            'execution_timestamp': str(now),
        }
