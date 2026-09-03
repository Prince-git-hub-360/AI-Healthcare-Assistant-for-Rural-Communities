"""
patients.urls

This file registers Patient-related viewsets and additional patient-specific endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PatientViewSet, CaregiverAssignmentViewSet
from .recommendations_views import (
    PersonalizedRecommendationsAPIView,
    HealthAwarenessTipsAPIView,
    FollowUpSuggestionsAPIView,
)
from .abha_views import (
    AbhaPatientLookupView,
    AbhaClinicalNotesView,
    AbhaDirectoryView,
)

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'caregiver-assignments', CaregiverAssignmentViewSet, basename='caregiverassignment')

urlpatterns = [
    path('', include(router.urls)),

    # ABDM ABHA Digital Health Card & Clinical Dossier API
    path('abha/directory/', AbhaDirectoryView.as_view(), name='abha-directory'),
    path('abha/<str:abha_id>/', AbhaPatientLookupView.as_view(), name='abha-lookup'),
    path('abha/<str:abha_id>/notes/', AbhaClinicalNotesView.as_view(), name='abha-notes'),

    # AI Recommendation Engine (patient-scoped endpoints)
    path('ai/personalized-recommendations/', PersonalizedRecommendationsAPIView.as_view(), name='ai-personalized'),
    path('ai/awareness-tips/', HealthAwarenessTipsAPIView.as_view(), name='ai-awareness-tips'),
    path('ai/follow-up-suggestions/', FollowUpSuggestionsAPIView.as_view(), name='ai-follow-up'),
]

