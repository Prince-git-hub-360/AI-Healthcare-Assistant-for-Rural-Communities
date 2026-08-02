"""
translations.admin

Admin registration for the Translation model.
"""
from django.contrib import admin
from .models import Translation


@admin.register(Translation)
class TranslationAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'patient',
        'target_language',
        'document',
        'medication',
        'created_at',
    ]
    list_filter = ['target_language', 'created_at']
    search_fields = [
        'original_text',
        'simplified_text',
        'translated_text',
        'patient__user__username',
    ]
    raw_id_fields = ['patient', 'document', 'medication']
    readonly_fields = ['created_at', 'updated_at']
