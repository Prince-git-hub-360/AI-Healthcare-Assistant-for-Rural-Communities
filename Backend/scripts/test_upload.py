from rest_framework.test import APIClient
from django.core.wsgi import get_wsgi_application
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.files.uploadedfile import SimpleUploadedFile

client = APIClient()
client.defaults['HTTP_HOST'] = 'testserver'
# login as hwuser
l = client.post('/api/auth/login/', {'username':'hwuser', 'password':'hwpass123'}, format='json')
access = l.json().get('access')
client.credentials(HTTP_AUTHORIZATION='Bearer ' + access)
pl = client.get('/api/patients/')
if pl.status_code != 200:
    print('failed to get patients', pl.status_code, pl.content)
    exit(1)
patient_id = pl.json()[0]['id']
# create small PDF-like file
file_content = b'%PDF-1.4 test pdf content'
pdf_file = SimpleUploadedFile('report.pdf', file_content, content_type='application/pdf')
payload = {'patient': patient_id, 'title': 'Uploaded Report', 'document_type': 'medical_report', 'original_file': pdf_file}
resp = client.post('/api/medical-documents/', payload, format='multipart')
print('hw upload file', resp.status_code, resp.content.decode('utf-8'))
# attempt to upload large file exceeding limit
large_content = b'a' * (6 * 1024 * 1024)
large_file = SimpleUploadedFile('big.jpg', large_content, content_type='image/jpeg')
payload2 = {'patient': patient_id, 'title': 'Big File', 'document_type': 'medical_report', 'original_file': large_file}
resp2 = client.post('/api/medical-documents/', payload2, format='multipart')
print('hw upload big file', resp2.status_code, resp2.content.decode('utf-8'))
