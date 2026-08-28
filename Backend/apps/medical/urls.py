from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import MedicalDocumentViewSet
from .emergency_views import (
    FirstAidGuidanceAPIView,
    EmergencyContactsAPIView,
    NearbyHealthcareFacilitiesAPIView,
    AmbulanceRequestAPIView,
    StartEmergencySessionAPIView,
    UpdateEmergencyLocationAPIView,
    StopEmergencySessionAPIView,
    GetEmergencySessionCardAPIView,
    NotifyTrustedContactsAPIView,
)
from .education_views import (
    PreventiveHealthAPIView,
    MaternalHealthAPIView,
    ChildHealthAPIView,
    ElderlyCareAPIView,
)
from .nlp_simplification_views import (
    TerminologySimplificationAPIView,
    NLPEntityExtractionAPIView,
    SymptomExplanationAPIView,
    MultilingualKnowledgeBaseAPIView,
)

router = DefaultRouter()
router.register(r'medical-documents', MedicalDocumentViewSet, basename='medicaldocument')

urlpatterns = [
    path('', include(router.urls)),

    # NLP & Simplification
    path('simplification/simplify-terms/', TerminologySimplificationAPIView.as_view(), name='simplify-terms'),
    path('nlp/extract-entities/', NLPEntityExtractionAPIView.as_view(), name='nlp-extract-entities'),
    path('symptoms/explain/', SymptomExplanationAPIView.as_view(), name='symptoms-explain'),
    path('knowledge-base/faqs/', MultilingualKnowledgeBaseAPIView.as_view(), name='knowledge-base-faqs'),

    # Emergency Assistance & Care Navigation System
    path('emergency/first-aid/', FirstAidGuidanceAPIView.as_view(), name='emergency-first-aid'),
    path('emergency/contacts/', EmergencyContactsAPIView.as_view(), name='emergency-contacts'),
    path('emergency/nearby-facilities/', NearbyHealthcareFacilitiesAPIView.as_view(), name='emergency-facilities'),
    path('emergency/ambulance-request/', AmbulanceRequestAPIView.as_view(), name='emergency-ambulance'),
    path('emergency/start/', StartEmergencySessionAPIView.as_view(), name='emergency-start'),
    path('emergency/location/', UpdateEmergencyLocationAPIView.as_view(), name='emergency-location-update'),
    path('emergency/stop/', StopEmergencySessionAPIView.as_view(), name='emergency-stop'),
    path('emergency/session/<str:token>/', GetEmergencySessionCardAPIView.as_view(), name='emergency-session-card'),
    path('emergency/notify-contacts/', NotifyTrustedContactsAPIView.as_view(), name='emergency-notify-contacts'),

    # Health Education
    path('education/preventive/', PreventiveHealthAPIView.as_view(), name='education-preventive'),
    path('education/maternal/', MaternalHealthAPIView.as_view(), name='education-maternal'),
    path('education/child/', ChildHealthAPIView.as_view(), name='education-child'),
    path('education/elderly/', ElderlyCareAPIView.as_view(), name='education-elderly'),
]

