from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema


@extend_schema(tags=['10. Health Education & AI Recommendations'])
class RootView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        return Response({
            'status': 'ok',
            'message': 'AI-Powered Healthcare Communication Assistant API is running.',
            'version': 'v1',
            'api_root': '/api/v1/',
            'routes': {
                'auth_register': '/api/v1/auth/register/',
                'auth_login': '/api/v1/auth/login/',
                'auth_profile': '/api/v1/auth/profile/',
                'patients': '/api/v1/patients/',
                'medical_documents': '/api/v1/medical-documents/',
                'medications': '/api/v1/medications/',
                'reminders': '/api/v1/reminders/',
                'translations': '/api/v1/translations/',
            },
        })
