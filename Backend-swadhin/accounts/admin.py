from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (
    HealthContent,
    HealthcareWorkerProfile,
    MedicalDocument,
    MedicalEntityExtraction,
    PatientProfile,
    Translation,
    User,
)


class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'phone_number', 'role', 'language_preference', 'is_verified')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Platform Info', {'fields': ('role', 'phone_number', 'language_preference', 'is_verified')}),
    )


class HealthcareWorkerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'license_number', 'specialization', 'health_center', 'is_approved')
    list_filter = ('is_approved', 'specialization')


class MedicalDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'document_type', 'patient', 'uploaded_by', 'uploaded_at')
    list_filter = ('document_type',)


class HealthContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'content_type', 'category', 'language', 'is_published', 'published_by')
    list_filter = ('content_type', 'language', 'is_published')


class TranslationAdmin(admin.ModelAdmin):
    list_display = ('patient', 'source_type', 'target_language', 'created_at')
    list_filter = ('source_type', 'target_language')


class MedicalEntityExtractionAdmin(admin.ModelAdmin):
    list_display = ('patient', 'created_at')


admin.site.register(User, UserAdmin)
admin.site.register(PatientProfile)
admin.site.register(HealthcareWorkerProfile, HealthcareWorkerProfileAdmin)
admin.site.register(MedicalDocument, MedicalDocumentAdmin)
admin.site.register(HealthContent, HealthContentAdmin)
admin.site.register(Translation, TranslationAdmin)
admin.site.register(MedicalEntityExtraction, MedicalEntityExtractionAdmin)