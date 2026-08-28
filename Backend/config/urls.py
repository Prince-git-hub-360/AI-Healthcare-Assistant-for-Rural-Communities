"""
URL configuration for config project.

This file now includes per-app url modules to keep routing clean and maintainable.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from .views import RootView
from .sync_views import OfflineBatchSyncView, HealthCheckView

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('', RootView.as_view(), name='root'),
    path('admin/', admin.site.urls),

    # Authentication Endpoints
    path('api/v1/auth/', include('accounts.urls')),

    # Offline Data Synchronization & Health Check
    path('api/v1/sync/offline-batch/', OfflineBatchSyncView.as_view(), name='offline-batch-sync'),
    path('api/v1/sync/health-check/', HealthCheckView.as_view(), name='health-check'),

    # OpenAPI 3 Swagger & ReDoc Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Include app-level URLs (keeps config clean and lets each app own its routes)
    path('api/v1/', include('patients.urls')),
    path('api/v1/', include('medical.urls')),
    path('api/v1/', include('medications.urls')),
    path('api/v1/', include('reminders.urls')),
    path('api/v1/', include('translations.urls')),
    path('api/v1/', include('healthcare_workers.urls')),
    path('api/v1/ai-assistant/', include('ai_assistant.urls')),
    path('api/ai-assistant/', include('ai_assistant.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

