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

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'caregiver-assignments', CaregiverAssignmentViewSet, basename='caregiverassignment')

urlpatterns = [
    path('', include(router.urls)),

    # AI Recommendation Engine (patient-scoped endpoints)
    path('ai/personalized-recommendations/', PersonalizedRecommendationsAPIView.as_view(), name='ai-personalized'),
    path('ai/awareness-tips/', HealthAwarenessTipsAPIView.as_view(), name='ai-awareness-tips'),
    path('ai/follow-up-suggestions/', FollowUpSuggestionsAPIView.as_view(), name='ai-follow-up'),
]

