from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

def home(request):
    endpoints = [
        {'name': 'Register (Patient)', 'path': '/api/accounts/register/', 'method': 'POST'},
        {'name': 'Register (Healthcare Worker)', 'path': '/api/accounts/register/worker/', 'method': 'POST'},
        {'name': 'Login', 'path': '/api/accounts/login/', 'method': 'POST'},
        {'name': 'Profile', 'path': '/api/accounts/profile/', 'method': 'GET/PUT'},
        {'name': 'Patient Profile', 'path': '/api/accounts/profile/patient/', 'method': 'GET/PUT'},
        {'name': 'Healthcare Worker Profile', 'path': '/api/accounts/profile/worker/', 'method': 'GET/PUT'},
        {'name': 'Language Preference', 'path': '/api/accounts/profile/language/', 'method': 'PUT'},
        {'name': 'Medical Documents (Prescriptions/Reports/Discharge Summaries)', 'path': '/api/accounts/documents/?document_type=', 'method': 'GET/POST'},
        {'name': 'Patient History', 'path': '/api/accounts/history/', 'method': 'GET'},
        {'name': 'Healthcare Content Repository', 'path': '/api/accounts/content/', 'method': 'GET/POST'},
    ]
    return render(request, 'index.html', {'endpoints': endpoints})


urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('register-page/', TemplateView.as_view(template_name='register.html'), name='register-page'),
    path('login-page/', TemplateView.as_view(template_name='login.html'), name='login-page'),
    path('dashboard/', TemplateView.as_view(template_name='dashboard.html'), name='dashboard'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
