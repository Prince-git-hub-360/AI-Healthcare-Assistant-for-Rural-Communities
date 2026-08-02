"""
medical.filters

Provides FilterSet for MedicalDocument to support filtering by patient, document_type,
created_at date range and a general text query.
"""
import django_filters
from django.db.models import Q

from .models import MedicalDocument


class MedicalDocumentFilter(django_filters.FilterSet):
    patient = django_filters.NumberFilter(field_name='patient__id')
    document_type = django_filters.CharFilter(field_name='document_type')
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    q = django_filters.CharFilter(method='filter_by_all', label='Search')

    class Meta:
        model = MedicalDocument
        fields = ['patient', 'document_type', 'created_after', 'created_before']

    def filter_by_all(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(text_content__icontains=value) |
            Q(translated_text__icontains=value)
        )
