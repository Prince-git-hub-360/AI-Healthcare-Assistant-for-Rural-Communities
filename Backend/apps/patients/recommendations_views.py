"""
patients.recommendations_views

AI Recommendation Engine System Views:
1. Personalized Health Content (/api/v1/ai/personalized-recommendations/)
2. Relevant Health Awareness Tips (/api/v1/ai/awareness-tips/)
3. Follow-Up Recommendations (/api/v1/ai/follow-up-suggestions/)
"""
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta


from drf_spectacular.utils import extend_schema


@extend_schema(tags=['10. Health Education & AI Recommendations'])
class PersonalizedRecommendationsAPIView(APIView):
    """Personalized Health Content Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        age = int(request.query_params.get('age', 55))
        language = request.query_params.get('language', 'hi')

        # Tailored recommendations based on patient age profile & region
        recommendations = []
        if age >= 50:
            recommendations.append({
                'title': 'Senior Heart & Joint Care Tip',
                'priority': 'HIGH',
                'recommendation': 'Have your blood pressure and fasting blood sugar checked at the nearest PHC NCD clinic this week.',
                'action_url': '/api/v1/education/elderly/'
            })
            recommendations.append({
                'title': 'Medication Adherence Guidance',
                'priority': 'HIGH',
                'recommendation': 'Set daily morning & night reminders for your active prescriptions to prevent missed doses.',
                'action_url': '/api/v1/reminders/'
            })
        else:
            recommendations.append({
                'title': 'Active Lifestyle & Immunity Guidance',
                'priority': 'MEDIUM',
                'recommendation': 'Maintain clean drinking water habits and ensure annual preventive health checkups.',
                'action_url': '/api/v1/education/preventive/'
            })

        return Response({
            'status': 'success',
            'patient_profile': {'age': age, 'language': language},
            'recommendations_count': len(recommendations),
            'personalized_recommendations': recommendations,
            'timestamp': str(timezone.now()),
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['10. Health Education & AI Recommendations'])
class HealthAwarenessTipsAPIView(APIView):
    """Relevant Health Awareness Tips Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        tips = [
            {
                'id': 101,
                'category': 'Seasonal Alert',
                'title': 'Monsoon Dengue & Malaria Prevention Bulletin',
                'tip': 'Avoid stagnant water accumulation around your house. Use mosquito nets and report high fever with body pain immediately to ASHA worker.',
                'published_date': str(timezone.localdate())
            },
            {
                'id': 102,
                'category': 'Nutrition Awareness',
                'title': 'Anemia Prevention & Iron Rich Foods',
                'tip': 'Include dark leafy vegetables, drumstick leaves, sesame seeds, and jaggery in your daily diet to keep hemoglobin levels healthy.',
                'published_date': str(timezone.localdate())
            },
            {
                'id': 103,
                'category': 'Hygiene Tip',
                'title': 'Proper Hand Washing Routine',
                'tip': 'Scrub hands with soap for at least 20 seconds before preparing food, eating, or feeding children.',
                'published_date': str(timezone.localdate())
            }
        ]
        return Response({
            'status': 'success',
            'awareness_bulletins_count': len(tips),
            'awareness_tips': tips,
            'timestamp': str(timezone.now()),
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['10. Health Education & AI Recommendations'])
class FollowUpSuggestionsAPIView(APIView):
    """Follow-Up Recommendations Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        today = timezone.localdate()
        suggestions = [
            {
                'id': 201,
                'title': 'Post-Prescription Doctor Review',
                'due_date': str(today + timedelta(days=7)),
                'days_remaining': 7,
                'status': 'UPCOMING',
                'facility': 'Primary Health Centre (PHC)',
                'doctor_note': 'Follow-up visit recommended to re-evaluate blood pressure and medication tolerance.'
            },
            {
                'id': 202,
                'title': 'Routine Diagnostic Lab Checkup',
                'due_date': str(today + timedelta(days=14)),
                'days_remaining': 14,
                'status': 'RECOMMENDED',
                'facility': 'Community Health Centre (CHC) Lab',
                'doctor_note': 'Complete Blood Count (CBC) and Blood Glucose test.'
            }
        ]

        return Response({
            'status': 'success',
            'suggestions_count': len(suggestions),
            'follow_up_recommendations': suggestions,
            'timestamp': str(timezone.now()),
        }, status=status.HTTP_200_OK)
