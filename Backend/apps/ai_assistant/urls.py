from django.urls import path
from .views import MedicineAssistantView

urlpatterns = [
    path('medicine/', MedicineAssistantView.as_view(), name='ai-medicine-assistant'),
    path('medicine', MedicineAssistantView.as_view(), name='ai-medicine-assistant-no-slash'),
]
