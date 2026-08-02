from django.contrib import admin

from .models import Medication


@admin.register(Medication)
class MedicationAdmin(admin.ModelAdmin):
    list_display = ['name', 'patient', 'document', 'start_date', 'end_date', 'source', 'created_at']
    search_fields = ['name', 'generic_name', 'dosage_text', 'patient__user__username']
    list_filter = ['source', 'frequency']
