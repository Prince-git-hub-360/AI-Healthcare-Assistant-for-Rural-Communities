import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medicaldocument',
            name='document_type',
            field=models.CharField(
                choices=[
                    ('prescription', 'Prescription'),
                    ('lab_report', 'Lab Report'),
                    ('discharge_summary', 'Discharge Summary'),
                    ('scan', 'Scan / Imaging'),
                    ('id_proof', 'ID Proof'),
                    ('other', 'Other'),
                ],
                default='other',
                max_length=20,
            ),
        ),
        migrations.CreateModel(
            name='HealthcareWorkerProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('license_number', models.CharField(blank=True, max_length=100)),
                ('specialization', models.CharField(blank=True, max_length=150)),
                ('health_center', models.CharField(blank=True, max_length=150)),
                ('years_experience', models.PositiveIntegerField(blank=True, null=True)),
                ('is_approved', models.BooleanField(
                    default=False,
                    help_text='Set true once staff/admin verifies license credentials.'
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='worker_profile',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
        ),
        migrations.CreateModel(
            name='HealthContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('content_type', models.CharField(
                    choices=[
                        ('article', 'Article'),
                        ('video', 'Video'),
                        ('faq', 'FAQ'),
                        ('advisory', 'Health Advisory'),
                    ],
                    default='article',
                    max_length=20,
                )),
                ('body', models.TextField(blank=True, help_text='Article text or FAQ answer.')),
                ('media_url', models.URLField(blank=True, help_text='External link for videos or attachments.')),
                ('category', models.CharField(
                    blank=True, max_length=100,
                    help_text='e.g. Maternal Health, Nutrition, First Aid'
                )),
                ('language', models.CharField(
                    default='en', max_length=10,
                    help_text='ISO language code, see settings.LANGUAGES'
                )),
                ('is_published', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('published_by', models.ForeignKey(
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='published_content',
                    to=settings.AUTH_USER_MODEL,
                )),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
