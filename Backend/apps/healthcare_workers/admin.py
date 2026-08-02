from django.contrib import admin

from .models import HealthcareWorker


@admin.register(HealthcareWorker)
class HealthcareWorkerAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'organization', 'is_active', 'created_at']
    search_fields = ['user__username', 'user__email', 'organization', 'specialties', 'registration_number']
    list_filter = ['role', 'organization', 'is_active']
