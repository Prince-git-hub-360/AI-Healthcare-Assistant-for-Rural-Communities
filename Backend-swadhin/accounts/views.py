from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    HealthContent,
    HealthcareWorkerProfile,
    MedicalDocument,
    MedicalEntityExtraction,
    PatientProfile,
    SymptomQuery,
    Translation,
)
from .serializers import (
    HealthContentSerializer,
    HealthcareWorkerProfileSerializer,
    HealthcareWorkerRegistrationSerializer,
    LanguagePreferenceSerializer,
    LoginSerializer,
    MedicalDocumentSerializer,
    MedicalEntityExtractionSerializer,
    PatientHistorySerializer,
    PatientProfileSerializer,
    RegistrationSerializer,
    SymptomQuerySerializer,
    TranslationSerializer,
    UserProfileSerializer,
)
from .translation_service import (
    explain_symptom,
    extract_medical_entities,
    generate_knowledge_content,
    simplify_medical_text,
    translate_and_simplify,
)

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserProfileSerializer(user).data}, status=status.HTTP_201_CREATED)


class HealthcareWorkerRegisterView(APIView):
    """Healthcare Worker Registration — separate flow that collects license/credential info."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = HealthcareWorkerRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserProfileSerializer(user).data}, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(username=request.data['username'])
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserProfileSerializer(user).data})


class JWTLoginView(APIView):
    """Authentication (JWT) — returns access + refresh tokens instead of a single permanent token."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(username=request.data['username'])
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserProfileSerializer(user).data,
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class PatientProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = PatientProfile.objects.get_or_create(user=self.request.user)
        return profile


class LanguagePreferenceView(generics.UpdateAPIView):
    serializer_class = LanguagePreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class HealthcareWorkerProfileView(generics.RetrieveUpdateAPIView):
    """Profile Management for doctors / health workers."""

    serializer_class = HealthcareWorkerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = HealthcareWorkerProfile.objects.get_or_create(user=self.request.user)
        return profile


class MedicalDocumentListCreateView(generics.ListCreateAPIView):
    """Upload Medical Documents / Store Healthcare Records.

    Doubles as Prescription Management and Medical Report Management by
    filtering on ?document_type=prescription|lab_report|discharge_summary|scan|id_proof|other
    """

    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = MedicalDocument.objects.filter(patient=self.request.user)
        document_type = self.request.query_params.get('document_type')
        if document_type:
            qs = qs.filter(document_type=document_type)
        return qs


class MedicalDocumentDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MedicalDocument.objects.filter(patient=self.request.user)


class PatientHistoryView(generics.RetrieveAPIView):
    """Patient History Management — aggregated profile + document timeline for the logged-in patient."""

    serializer_class = PatientHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class HealthContentListCreateView(generics.ListCreateAPIView):
    """Healthcare Content Repository — browse published content, or publish new content (doctor/staff)."""

    serializer_class = HealthContentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = HealthContent.objects.filter(is_published=True)
        category = self.request.query_params.get('category')
        language = self.request.query_params.get('language')
        if category:
            qs = qs.filter(category__iexact=category)
        if language:
            qs = qs.filter(language=language)
        return qs


class HealthContentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = HealthContentSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = HealthContent.objects.all()


class TranslateView(generics.ListCreateAPIView):
    """Medical Language Translation — translates prescriptions, discharge summaries,
    and healthcare instructions into the patient's preferred Indian language."""

    serializer_class = TranslationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Translation.objects.filter(patient=self.request.user)

    def create(self, request, *args, **kwargs):
        source_type = request.data.get('source_type', 'other')
        target_language = request.data.get('target_language', request.user.language_preference or 'en')
        document_id = request.data.get('document')

        source_text = request.data.get('source_text', '')
        document = None
        if document_id:
            try:
                document = MedicalDocument.objects.get(id=document_id, patient=request.user)
                if not source_text:
                    source_text = document.notes or document.title
            except MedicalDocument.DoesNotExist:
                return Response({'detail': 'Document not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not source_text:
            return Response(
                {'detail': 'Provide source_text, or a document that has notes/title to translate.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = translate_and_simplify(source_text, target_language)
        except Exception as exc:
            return Response({'detail': f'Translation failed: {exc}'}, status=status.HTTP_502_BAD_GATEWAY)

        translation = Translation.objects.create(
            document=document,
            patient=request.user,
            source_type=source_type,
            source_text=source_text,
            target_language=target_language,
            translated_text=result.get('translated_text', ''),
            simplified_explanation=result.get('simplified_explanation', ''),
        )
        serializer = self.get_serializer(translation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SimplifyView(APIView):
    """Medical Terminology Simplification — converts medical jargon into plain language
    with key-term definitions and general context-based guidance."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        source_text = request.data.get('source_text', '')
        language = request.data.get('language', request.user.language_preference or 'en')

        if not source_text:
            return Response(
                {'detail': 'Provide source_text to simplify.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = simplify_medical_text(source_text, language)
        except Exception as exc:
            return Response({'detail': f'Simplification failed: {exc}'}, status=status.HTTP_502_BAD_GATEWAY)

        return Response(result, status=status.HTTP_200_OK)


class ExtractEntitiesView(generics.ListCreateAPIView):
    """NLP Processing Engine — extracts diseases, medications, and treatment
    instructions from medical text as structured data."""

    serializer_class = MedicalEntityExtractionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MedicalEntityExtraction.objects.filter(patient=self.request.user)

    def create(self, request, *args, **kwargs):
        source_text = request.data.get('source_text', '')
        document_id = request.data.get('document')

        document = None
        if document_id:
            try:
                document = MedicalDocument.objects.get(id=document_id, patient=request.user)
                if not source_text:
                    source_text = document.notes or document.title
            except MedicalDocument.DoesNotExist:
                return Response({'detail': 'Document not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not source_text:
            return Response(
                {'detail': 'Provide source_text, or a document that has notes/title.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = extract_medical_entities(source_text)
        except Exception as exc:
            return Response({'detail': f'Extraction failed: {exc}'}, status=status.HTTP_502_BAD_GATEWAY)

        extraction = MedicalEntityExtraction.objects.create(
            document=document,
            patient=request.user,
            source_text=source_text,
            diseases=result.get('diseases', []),
            medications=result.get('medications', []),
            treatment_instructions=result.get('treatment_instructions', []),
            other_entities=result.get('other_entities', []),
        )
        serializer = self.get_serializer(extraction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SymptomExplanationView(generics.ListCreateAPIView):
    """Symptom Explanation Module — symptom info, disease awareness, and
    preventive care guidance. Not a diagnosis."""

    serializer_class = SymptomQuerySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SymptomQuery.objects.filter(patient=self.request.user)

    def create(self, request, *args, **kwargs):
        query = request.data.get('query', '')
        language = request.data.get('language', request.user.language_preference or 'en')

        if not query:
            return Response(
                {'detail': 'Provide a query describing the symptom or health question.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = explain_symptom(query, language)
        except Exception as exc:
            return Response({'detail': f'Symptom explanation failed: {exc}'}, status=status.HTTP_502_BAD_GATEWAY)

        symptom_query = SymptomQuery.objects.create(
            patient=request.user,
            query=query,
            language=language,
            symptom_information=result.get('symptom_information', ''),
            possible_related_conditions=result.get('possible_related_conditions', []),
            disease_awareness=result.get('disease_awareness', ''),
            preventive_care=result.get('preventive_care', []),
            when_to_see_a_doctor=result.get('when_to_see_a_doctor', ''),
        )
        serializer = self.get_serializer(symptom_query)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
class GenerateKnowledgeContentView(APIView):
    """Multilingual Knowledge Base — auto-generates Healthcare FAQs, Common Disease
    Information, or Health Awareness Content and saves it into the Content Repository."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        topic = request.data.get('topic', '')
        content_type = request.data.get('content_type', 'faq')
        language = request.data.get('language', 'en')

        if not topic:
            return Response(
                {'detail': 'Provide a topic to generate content about.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = generate_knowledge_content(topic, content_type, language)
        except Exception as exc:
            return Response({'detail': f'Content generation failed: {exc}'}, status=status.HTTP_502_BAD_GATEWAY)

        content = HealthContent.objects.create(
            title=result.get('title', topic),
            content_type=content_type if content_type in dict(HealthContent.ContentType.choices) else 'article',
            body=result.get('body', ''),
            category=result.get('category', ''),
            language=language,
            published_by=request.user,
            is_published=True,
        )
        serializer = HealthContentSerializer(content)
        return Response(serializer.data, status=status.HTTP_201_CREATED)    