from django.contrib import admin

from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['user', 'age', 'gender', 'blood_group', 'phone', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone', 'emergency_contact_name']
    list_filter = ['gender', 'blood_group', 'created_at']
