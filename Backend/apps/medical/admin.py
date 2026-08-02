from django.contrib import admin

from .models import MedicalDocument


@admin.register(MedicalDocument)
class MedicalDocumentAdmin(admin.ModelAdmin):
    list_display = ['title', 'document_type', 'patient', 'uploaded_by', 'language', 'created_at']
    list_filter = ['document_type', 'language', 'created_at']
    search_fields = ['title', 'patient__username', 'uploaded_by__username', 'text_content']
