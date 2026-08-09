from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView


from .views import (
    ExtractEntitiesView,
    GenerateKnowledgeContentView,
    HealthContentDetailView,
    HealthContentListCreateView,
    HealthcareWorkerProfileView,
    HealthcareWorkerRegisterView,
    JWTLoginView,
    LanguagePreferenceView,
    LoginView,
    MedicalDocumentDetailView,
    MedicalDocumentListCreateView,
    PatientHistoryView,
    PatientProfileView,
    ProfileView,
    RegisterView,
    SimplifyView,
    SymptomExplanationView,
    TranslateView,
)

app_name = 'accounts'


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('register/worker/', HealthcareWorkerRegisterView.as_view(), name='register-worker'),
    path('login/', LoginView.as_view(), name='login'),

    # JWT authentication
    path('login/jwt/', JWTLoginView.as_view(), name='login-jwt'),
    path('login/jwt/refresh/', TokenRefreshView.as_view(), name='login-jwt-refresh'),
    path('login/jwt/verify/', TokenVerifyView.as_view(), name='login-jwt-verify'),

    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/patient/', PatientProfileView.as_view(), name='patient-profile'),
    path('profile/worker/', HealthcareWorkerProfileView.as_view(), name='worker-profile'),
    path('profile/language/', LanguagePreferenceView.as_view(), name='language-preference'),
    path('documents/', MedicalDocumentListCreateView.as_view(), name='documents-list-create'),
    path('documents/<uuid:pk>/', MedicalDocumentDetailView.as_view(), name='documents-detail'),
    path('history/', PatientHistoryView.as_view(), name='patient-history'),
    path('content/', HealthContentListCreateView.as_view(), name='content-list-create'),
    path('content/<int:pk>/', HealthContentDetailView.as_view(), name='content-detail'),
    path('translate/', TranslateView.as_view(), name='translate'),
    path('simplify/', SimplifyView.as_view(), name='simplify'),
    path('extract-entities/', ExtractEntitiesView.as_view(), name='extract-entities'),
    path('symptom-explain/', SymptomExplanationView.as_view(), name='symptom-explain'),
    path('knowledge/generate/', GenerateKnowledgeContentView.as_view(), name='knowledge-generate'),
]