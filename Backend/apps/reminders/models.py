"""
reminders.models

Reminder model stores medication reminder schedules and status.
"""
from django.conf import settings
from django.db import models
from django.utils import timezone


class FrequencyChoices(models.TextChoices):
    DAILY = 'daily', 'Daily'
    WEEKLY = 'weekly', 'Weekly'
    MONTHLY = 'monthly', 'Monthly'
    CUSTOM = 'custom', 'Custom'


class DoseStatusChoices(models.TextChoices):
    PENDING = 'pending', 'Pending'
    TAKEN = 'taken', 'Taken'
    MISSED = 'missed', 'Missed'


class DeliveryMethodChoices(models.TextChoices):
    PUSH = 'push', 'Push Notification'
    SMS = 'sms', 'SMS'
    PHONE_CALL = 'phone_call', 'Phone Call'
    VOICE = 'voice', 'Voice (TTS)'


class Reminder(models.Model):
    patient = models.ForeignKey('patients.Patient', on_delete=models.CASCADE, related_name='reminders')
    medication = models.ForeignKey('medications.Medication', on_delete=models.SET_NULL, null=True, blank=True, related_name='reminders')

    title = models.CharField(max_length=255)
    notes = models.TextField(blank=True)

    # When to trigger the reminder - allow time-of-day and optional custom cron-like spec
    time = models.TimeField(null=True, blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    frequency = models.CharField(max_length=32, choices=FrequencyChoices.choices, default=FrequencyChoices.DAILY)
    # For CUSTOM frequency, store a simple JSON or text rule (e.g. 'every 2 days')
    custom_rule = models.TextField(blank=True)

    delivery_method = models.CharField(max_length=32, choices=DeliveryMethodChoices.choices, default=DeliveryMethodChoices.PUSH)

    active = models.BooleanField(default=True)
    last_sent = models.DateTimeField(null=True, blank=True)
    next_run = models.DateTimeField(null=True, blank=True)

    # Dose Tracking & Caregiver Alerts
    dose_status = models.CharField(max_length=16, choices=DoseStatusChoices.choices, default=DoseStatusChoices.PENDING)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    missed_alert_sent = models.BooleanField(default=False)
    caregiver_notified_at = models.DateTimeField(null=True, blank=True)

    timezone = models.CharField(max_length=50, blank=True, default='UTC')

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_reminders')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Reminder: {self.title} for {self.patient.user.username}"

    def schedule_next_run(self):
        """Basic next_run computation stub. In production, a scheduler or Celery beat will compute exact times.
        This method updates next_run to the next plausible datetime based on frequency and time.
        """
        now = timezone.now()
        # If no time specified, set next_run to now + 1 minute as placeholder
        if not self.time:
            self.next_run = now + timezone.timedelta(minutes=1)
            self.save(update_fields=['next_run'])
            return self.next_run

        # Combine date part
        base_date = now.date() if not self.start_date else max(now.date(), self.start_date)
        run_dt = timezone.datetime.combine(base_date, self.time)
        run_dt = timezone.make_aware(run_dt, timezone.get_current_timezone())
        if run_dt <= now:
            # naive increment based on frequency
            if self.frequency == FrequencyChoices.DAILY:
                run_dt = run_dt + timezone.timedelta(days=1)
            elif self.frequency == FrequencyChoices.WEEKLY:
                run_dt = run_dt + timezone.timedelta(weeks=1)
            elif self.frequency == FrequencyChoices.MONTHLY:
                # crude monthly increment: add 30 days
                run_dt = run_dt + timezone.timedelta(days=30)
            else:
                run_dt = now + timezone.timedelta(days=1)
        self.next_run = run_dt
        self.save(update_fields=['next_run'])
        return self.next_run
