"""
medical.education_views

Health Education Services Views:
1. Preventive Healthcare Guidance (/api/v1/education/preventive/)
2. Maternal Health Information (/api/v1/education/maternal/)
3. Child Healthcare Guidance (/api/v1/education/child/)
4. Elderly Care Information (/api/v1/education/elderly/)
"""
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone


from drf_spectacular.utils import extend_schema


@extend_schema(tags=['10. Health Education & AI Recommendations'])
class PreventiveHealthAPIView(APIView):
    """Preventive Healthcare Guidance Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        guidance = [
            {
                'topic': 'Clean Water & Sanitation',
                'category': 'Preventive',
                'summary': 'Boil drinking water for 10 minutes or use halogen tablets to prevent waterborne diseases like Cholera and Typhoid.',
                'action_points': [
                    'Store drinking water in narrow-necked covered vessels.',
                    'Wash hands thoroughly with soap before meals and after toilet use.',
                    'Keep surroundings free from stagnant water to prevent mosquito breeding.'
                ]
            },
            {
                'topic': 'Vector-Borne Disease Prevention (Dengue & Malaria)',
                'category': 'Preventive',
                'summary': 'Protect family members from mosquito bites during monsoon and harvest seasons.',
                'action_points': [
                    'Use Insecticide-Treated Mosquito Nets (ITMNs) while sleeping.',
                    'Apply neem oil or mosquito repellent creams on exposed skin.',
                    'Clear water accumulation in old tires, coconut shells, and water coolers weekly.'
                ]
            }
        ]
        return Response({
            'status': 'success',
            'category': 'Preventive Healthcare',
            'articles_count': len(guidance),
            'articles': guidance,
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['10. Health Education & AI Recommendations'])
class MaternalHealthAPIView(APIView):
    """Maternal Health Information Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        guidance = [
            {
                'topic': 'Antenatal Care (ANC) & Nutrition',
                'category': 'Maternal Health',
                'summary': 'Essential healthcare guidance for expectant mothers in rural communities.',
                'action_points': [
                    'Register pregnancy early at nearby Anganwadi or PHC within 12 weeks.',
                    'Take 1 Iron Folic Acid (IFA) tablet daily starting from second trimester for 180 days.',
                    'Ensure minimum 4 Antenatal visits with ASHA worker or doctor.',
                    'Consume protein-rich foods: lentils, green leafy vegetables, milk, and jaggery.'
                ]
            },
            {
                'topic': 'Pregnancy Danger Signs',
                'category': 'Maternal Health',
                'summary': 'Warning signs requiring immediate emergency medical evaluation.',
                'action_points': [
                    'Severe headache or blurred vision.',
                    'Vaginal bleeding or sudden gush of fluid.',
                    'High fever with chills or severe abdominal pain.',
                    'Reduced or absent fetal movement.'
                ]
            }
        ]
        return Response({
            'status': 'success',
            'category': 'Maternal Health',
            'articles_count': len(guidance),
            'articles': guidance,
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['10. Health Education & AI Recommendations'])
class ChildHealthAPIView(APIView):
    """Child Healthcare Guidance Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        guidance = [
            {
                'topic': 'Essential Universal Immunization Schedule',
                'category': 'Child Health',
                'summary': 'Complete vaccination timetable for infants and young children.',
                'action_points': [
                    'At Birth: BCG, OPV-0, Hepatitis B birth dose.',
                    'At 6, 10, 14 Weeks: Pentavalent, Rotavirus, IPV, OPV doses.',
                    'At 9 Months: MR (Measles-Rubella) 1st dose, Vitamin A solution.',
                    'At 16-24 Months: DPT booster, MR 2nd dose.'
                ]
            },
            {
                'topic': 'Diarrhea & Dehydration Care (ORS & Zinc)',
                'category': 'Child Health',
                'summary': 'Life-saving home management for childhood diarrhea.',
                'action_points': [
                    'Mix 1 packet ORS in 1 liter clean drinking water; give after every loose stool.',
                    'Give Zinc tablet (20mg daily) for 14 days to rebuild gut lining.',
                    'Continue breastfeeding and normal feeding uninterrupted.'
                ]
            }
        ]
        return Response({
            'status': 'success',
            'category': 'Child Health',
            'articles_count': len(guidance),
            'articles': guidance,
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['10. Health Education & AI Recommendations'])
class ElderlyCareAPIView(APIView):
    """Elderly Care Information Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        guidance = [
            {
                'topic': 'Hypertension & Diabetes Management in Elderly',
                'category': 'Elderly Care',
                'summary': 'Long-term chronic disease care and health monitoring.',
                'action_points': [
                    'Check Blood Pressure (BP) and Blood Sugar monthly at PHC NCD clinic.',
                    'Never stop prescribed BP/Diabetes medications without doctor approval.',
                    'Reduce daily salt intake (< 5g daily) and avoid fried foods.',
                    'Perform light 20-minute morning walking daily.'
                ]
            },
            {
                'topic': 'Joint Care & Fall Prevention',
                'category': 'Elderly Care',
                'summary': 'Maintaining mobility and preventing accidental injuries in rural homes.',
                'action_points': [
                    'Keep walkways clean and well-lit at night.',
                    'Use supportive walking stick for balance if experiencing knee pain.',
                    'Ensure adequate Calcium & Vitamin D intake through sunlight exposure and dairy.'
                ]
            }
        ]
        return Response({
            'status': 'success',
            'category': 'Elderly Care',
            'articles_count': len(guidance),
            'articles': guidance,
        }, status=status.HTTP_200_OK)
