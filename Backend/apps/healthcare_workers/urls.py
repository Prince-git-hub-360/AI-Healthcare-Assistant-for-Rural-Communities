"""
healthcare_workers.urls

Registers HealthcareWorkerViewSet under /api/v1/healthcare-workers/.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import HealthcareWorkerViewSet

router = DefaultRouter()
router.register(r'healthcare-workers', HealthcareWorkerViewSet, basename='healthcareworker')

urlpatterns = [
    path('', include(router.urls)),
]

