import os
import sys
import django

# Setup Django environment
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from patients.models import Patient
from medical.models import MedicalDocument
from medications.models import Medication
from reminders.models import Reminder
from medications.services import PrescriptionParserService

User = get_user_model()

def test_prescription_lifecycle():
    print("--- STARTING PRESCRIPTION REMINDER LIFECYCLE TEST ---")
    user = User.objects.filter(profile__role='patient').first() or User.objects.first()
    patient, _ = Patient.objects.get_or_create(user=user)

    # 1. Create a test MedicalDocument
    doc = MedicalDocument.objects.create(
        patient=patient,
        uploaded_by=user,
        title="Test Prescription Rx",
        document_type="prescription",
        text_content="Rx: Tab Metformin 500mg 1-0-1 PC\nTab Paracetamol 650mg 1-1-1 AC"
    )
    print(f"Created MedicalDocument id={doc.id}, title='{doc.title}'")

    # 2. Process prescription document
    ocr_meds = [
        {'name': 'Metformin', 'dosage': '1-0-1', 'form': 'Tablet', 'strength': '500mg'},
        {'name': 'Paracetamol', 'dosage': '1-1-1', 'form': 'Tablet', 'strength': '650mg'}
    ]
    res = PrescriptionParserService.process_prescription_document(doc, ocr_medications=ocr_meds)
    print(f"Pipeline result: {res}")

    med_count = Medication.objects.filter(document=doc).count()
    rem_count = Reminder.objects.filter(medication__document=doc).count()
    print(f"Medications created for doc: {med_count}")
    print(f"Reminders created for doc: {rem_count}")
    assert med_count > 0, "Medications should be created"
    assert rem_count > 0, "Reminders should be created"

    reminders = Reminder.objects.filter(medication__document=doc)
    for r in reminders:
        print(f"  -> Reminder ID={r.id}, title='{r.title}', time={r.time}")

    # 3. Test Cascade Deletion using MedicalDocumentViewSet perform_destroy logic
    doc_id = doc.id
    from medical.views import MedicalDocumentViewSet
    viewset = MedicalDocumentViewSet()
    viewset.perform_destroy(doc)

    med_after = Medication.objects.filter(document_id=doc_id).count()
    rem_after = Reminder.objects.filter(medication__document_id=doc_id).count()
    print(f"Medications after deletion: {med_after}")
    print(f"Reminders after deletion: {rem_after}")

    assert med_after == 0, "Medications must be deleted"
    assert rem_after == 0, "Reminders must be deleted"
    print("SUCCESS: Prescription reminder auto-creation and cascade deletion verified!")

if __name__ == '__main__':
    test_prescription_lifecycle()
