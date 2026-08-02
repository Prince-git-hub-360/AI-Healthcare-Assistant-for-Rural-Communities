from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import RoleChoices
from patients.models import Patient


class CaregiverAssignmentTests(APITestCase):
    def setUp(self):
        self.patient_data = {
            'username': 'lakshmi',
            'email': 'lakshmi@example.com',
            'first_name': 'Lakshmi',
            'last_name': 'Devi',
            'password': 'StrongPass123',
            'role': RoleChoices.PATIENT,
            'preferred_language': 'hi',
        }
        self.caregiver_data = {
            'username': 'ram',
            'email': 'ram@example.com',
            'first_name': 'Ram',
            'last_name': 'Kumar',
            'password': 'CaregiverPass123',
            'role': RoleChoices.CAREGIVER,
            'preferred_language': 'hi',
        }
        self.healthcare_worker_data = {
            'username': 'drsharma',
            'email': 'drsharma@example.com',
            'first_name': 'Dr.',
            'last_name': 'Sharma',
            'password': 'SecurePass456',
            'role': RoleChoices.HEALTHCARE_WORKER,
            'preferred_language': 'en',
        }

        self.client.post('/api/v1/auth/register/', self.patient_data, format='json')
        self.client.post('/api/v1/auth/register/', self.caregiver_data, format='json')
        self.client.post('/api/v1/auth/register/', self.healthcare_worker_data, format='json')

    def authenticate(self, username, password):
        response = self.client.post('/api/v1/auth/login/', {
            'username': username,
            'password': password,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def test_caregiver_can_assign_self_to_patient(self):
        patient = Patient.objects.get(user__username=self.patient_data['username'])
        self.authenticate(self.caregiver_data['username'], self.caregiver_data['password'])

        response = self.client.post('/api/v1/caregiver-assignments/', {
            'patient': patient.id
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['patient'], patient.id)
        self.assertEqual(response.data['caregiver_username'], self.caregiver_data['username'])

        patients_response = self.client.get('/api/v1/patients/')
        self.assertEqual(patients_response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(item['id'] == patient.id for item in patients_response.data['results']))

    def test_healthcare_worker_can_assign_caregiver_to_patient(self):
        patient = Patient.objects.get(user__username=self.patient_data['username'])
        caregiver = get_user_model().objects.get(username=self.caregiver_data['username'])
        self.authenticate(self.healthcare_worker_data['username'], self.healthcare_worker_data['password'])

        response = self.client.post('/api/v1/caregiver-assignments/', {
            'patient': patient.id,
            'caregiver': caregiver.id,
            'relationship': 'son'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['patient'], patient.id)
        self.assertEqual(response.data['caregiver_username'], caregiver.username)

        # Verifies the caregiver can now access the assigned patient
        self.authenticate(self.caregiver_data['username'], self.caregiver_data['password'])
        patients_response = self.client.get('/api/v1/patients/')
        self.assertEqual(patients_response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(item['id'] == patient.id for item in patients_response.data['results']))
