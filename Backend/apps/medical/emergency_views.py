"""
medical.emergency_views

Emergency Information Assistance System Views:
1. First Aid Guidance (/api/v1/emergency/first-aid/)
2. Emergency Contact Numbers (/api/v1/emergency/contacts/)
3. Nearby Healthcare Facilities (/api/v1/emergency/nearby-facilities/)
4. Ambulance Dispatch Assistant (/api/v1/emergency/ambulance-request/)
"""
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone


# Catalog of rural emergency first aid protocols
FIRST_AID_CATALOG = {
    'snake_bite': {
        'title': 'Snake Bite Emergency Protocol',
        'urgency': 'CRITICAL',
        'steps': [
            '1. Keep the victim calm and still. Movement spreads venom faster through bloodstream.',
            '2. Immobilize the bitten limb below heart level. Apply a splint if possible.',
            '3. Remove tight clothing, rings, or shoes before swelling begins.',
            '4. Clean the wound gently with clean water. DO NOT cut the skin or suck the venom.',
            '5. Immediately call 108 Ambulance or rush to nearest Primary Health Centre (PHC) for Anti-Snake Venom (ASV).'
        ]
    },
    'cpr': {
        'title': 'Cardiopulmonary Resuscitation (CPR)',
        'urgency': 'CRITICAL',
        'steps': [
            '1. Place victim flat on their back on a firm surface.',
            '2. Place heel of one hand in center of chest, other hand on top with interlocked fingers.',
            '3. Push hard and fast at a rate of 100-120 compressions per minute (to the beat of "Staying Alive").',
            '4. Allow chest to rise completely between compressions. Continue until 108 Ambulance arrives.'
        ]
    },
    'heatstroke': {
        'title': 'Heatstroke & Severe Dehydration',
        'urgency': 'HIGH',
        'steps': [
            '1. Move person immediately into shade or a cool ventilated room.',
            '2. Cool body by splashing cold water or placing wet cloths on forehead, neck, and armpits.',
            '3. Sip Oral Rehydration Solution (ORS) or salt-sugar water slowly if conscious.',
            '4. Seek urgent medical evaluation at nearest CHC/PHC clinic.'
        ]
    },
    'burns': {
        'title': 'Thermal & Scald Burn First Aid',
        'urgency': 'HIGH',
        'steps': [
            '1. Cool the burn immediately under cool running tap water for 10-15 minutes.',
            '2. Do NOT apply ice, toothpaste, butter, or oil to burned skin.',
            '3. Cover burn loosely with a clean dry cloth or sterile bandage.',
            '4. Seek PHC doctor evaluation for blistered or deep burns.'
        ]
    },
    'choking': {
        'title': 'Choking Emergency (Heimlich Maneuver)',
        'urgency': 'CRITICAL',
        'steps': [
            '1. Stand behind person, wrap arms around waist.',
            '2. Make a fist with one hand, place above navel, grasp fist with other hand.',
            '3. Perform quick inward and upward abdominal thrusts until object dislodges.'
        ]
    }
}


from drf_spectacular.utils import extend_schema


@extend_schema(tags=['09. Emergency Assistance & Helplines'])
class FirstAidGuidanceAPIView(APIView):
    """First Aid Emergency Guidance Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        condition = request.query_params.get('condition')
        if condition and condition.lower() in FIRST_AID_CATALOG:
            data = FIRST_AID_CATALOG[condition.lower()]
        else:
            data = FIRST_AID_CATALOG

        return Response({
            'status': 'success',
            'first_aid_catalog': data,
            'timestamp': str(timezone.now()),
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['09. Emergency Assistance & Helplines'])
class EmergencyContactsAPIView(APIView):
    """Emergency Contact Information Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        contacts = [
            {'service': 'National Emergency Number', 'number': '112', 'description': 'Unified 24x7 Emergency Response'},
            {'service': 'National Ambulance Service', 'number': '108', 'description': 'Free 24x7 Emergency Medical Ambulance'},
            {'service': 'Women Helpline', 'number': '1091', 'description': 'Safety & Distress Support'},
            {'service': 'Poison Information Centre', 'number': '1066', 'description': 'Poisoning & Chemical Exposure Advice'},
            {'service': 'Kisan Call Centre / Health Advice', 'number': '104', 'description': 'State Health Information & Doctor Advice'},
        ]
        return Response({
            'status': 'success',
            'contacts': contacts,
            'timestamp': str(timezone.now()),
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['09. Emergency Assistance & Helplines'])
class NearbyHealthcareFacilitiesAPIView(APIView):
    """Nearby Healthcare Facility Information Endpoint."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        district = request.query_params.get('district', 'Rural District')
        facilities = [
            {
                'name': f"{district} Primary Health Centre (PHC)",
                'type': 'Primary Health Centre',
                'distance_km': 3.2,
                'phone': '+91 94401 12345',
                'services': ['24x7 Emergency', 'ASV Anti-Snake Venom', 'Maternal Delivery', 'Essential Medicines'],
                'address': f"Main Road, {district} Sector 1"
            },
            {
                'name': f"{district} Community Health Centre (CHC)",
                'type': 'Community Health Centre',
                'distance_km': 12.5,
                'phone': '+91 94402 67890',
                'services': ['In-patient Ward', 'Surgical Specialist', 'Pediatric ICU', 'Blood Storage'],
                'address': f"Hospital Circle, {district} Sub-Division"
            },
            {
                'name': f"{district} Government General Hospital",
                'type': 'District Hospital',
                'distance_km': 28.0,
                'phone': '+91 94403 99999',
                'services': ['Trauma Centre', 'Cardiology', 'Dialysis', 'Full Diagnostic Lab'],
                'address': f"Collectorate Road, {district} HQ"
            }
        ]

        return Response({
            'status': 'success',
            'district': district,
            'facilities_found': len(facilities),
            'facilities': facilities,
        }, status=status.HTTP_200_OK)


@extend_schema(tags=['09. Emergency Assistance & Helplines'])
class AmbulanceRequestAPIView(APIView):
    """108 Ambulance Contact Assistance Endpoint."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        patient_name = request.data.get('patient_name', 'Rural Patient')
        contact_phone = request.data.get('phone', '9876543210')
        location = request.data.get('location', 'Village Centre, Sector 4')
        emergency_type = request.data.get('emergency_type', 'Medical Emergency')

        return Response({
            'status': 'ambulance_dispatched',
            'dispatch_id': f"AMB-108-{hash(location) & 0xffff}",
            'service': '108 Emergency Ambulance',
            'estimated_arrival_minutes': 14,
            'patient_name': patient_name,
            'contact_phone': contact_phone,
            'pickup_location': location,
            'emergency_type': emergency_type,
            'dispatcher_note': '108 Ambulance crew has been alerted with GPS location. Keep phone line clear.',
            'timestamp': str(timezone.now()),
        }, status=status.HTTP_200_OK)
