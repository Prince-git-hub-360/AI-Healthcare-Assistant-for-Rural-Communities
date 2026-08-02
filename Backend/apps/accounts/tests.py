from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import RoleChoices


class AccountAuthTests(APITestCase):
    def test_patient_registration_and_login(self):
        registration_url = '/api/v1/auth/register/'
        login_url = '/api/v1/auth/login/'
        payload = {
            'username': 'lakshmi',
            'email': 'lakshmi@example.com',
            'first_name': 'Lakshmi',
            'last_name': 'Devi',
            'password': 'StrongPass123',
            'role': RoleChoices.PATIENT,
            'preferred_language': 'hi',
        }

        register_response = self.client.post(registration_url, payload, format='json')
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        user_data = register_response.data['user']
        self.assertEqual(user_data['profile']['role'], RoleChoices.PATIENT)
        self.assertEqual(user_data['profile']['preferred_language'], 'hi')

        login_response = self.client.post(login_url, {
            'username': payload['username'],
            'password': payload['password'],
        }, format='json')

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', login_response.data)
        self.assertIn('access', login_response.data['tokens'])
        self.assertIn('refresh', login_response.data['tokens'])
        self.assertEqual(login_response.data['user']['profile']['role'], RoleChoices.PATIENT)

    def test_healthcare_worker_registration(self):
        registration_url = '/api/v1/auth/register/'
        payload = {
            'username': 'drsharma',
            'email': 'drsharma@example.com',
            'first_name': 'Dr.',
            'last_name': 'Sharma',
            'password': 'SecurePass456',
            'role': RoleChoices.HEALTHCARE_WORKER,
            'preferred_language': 'en',
        }

        response = self.client.post(registration_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['profile']['role'], RoleChoices.HEALTHCARE_WORKER)
        self.assertEqual(get_user_model().objects.get(username='drsharma').profile.role, RoleChoices.HEALTHCARE_WORKER)
