"""
translations.urls

URL routing configuration for the translations app including voice endpoints.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import TranslationViewSet, TranslateTextAPIView
from .voice_views import SpeechToTextAPIView, TextToSpeechAPIView, VoiceHealthQueryAPIView

router = DefaultRouter()
router.register(r'translations', TranslationViewSet, basename='translation')

urlpatterns = [
    path('', include(router.urls)),

    # Real-time Prescription Translation & Voice endpoints
    path('translate/', TranslateTextAPIView.as_view({'post': 'create'}), name='translate-text'),
    path('voice/speech-to-text/', SpeechToTextAPIView.as_view(), name='voice-stt'),
    path('voice/text-to-speech/', TextToSpeechAPIView.as_view(), name='voice-tts'),
    path('voice/query/', VoiceHealthQueryAPIView.as_view(), name='voice-query'),
]


