from django.test import SimpleTestCase
from django.urls import reverse


class HomePageTests(SimpleTestCase):
    host = '127.0.0.1'
    def test_home_page_renders_healthcare_platform_content(self):
        response = self.client.get(reverse('home'))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Healthcare Platform')
        self.assertContains(response, 'Available API endpoints')
