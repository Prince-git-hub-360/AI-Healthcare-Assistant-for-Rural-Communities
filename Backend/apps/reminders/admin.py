from django.contrib import admin

from .models import Reminder


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ['title', 'patient', 'medication', 'active', 'next_run', 'delivery_method', 'created_at']
    search_fields = ['title', 'notes', 'patient__user__username']
    list_filter = ['active', 'delivery_method', 'frequency']
