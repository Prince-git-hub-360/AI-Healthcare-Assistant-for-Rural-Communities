"""
common.validators

Reusable validators for document uploads, MIME checks, and phone numbers.
"""
from django.core.exceptions import ValidationError
from django.conf import settings


def validate_file_size(file_obj):
    """Validates that document file upload does not exceed MAX_DOCUMENT_UPLOAD_SIZE."""
    max_size = getattr(settings, 'MAX_DOCUMENT_UPLOAD_SIZE', 5 * 1024 * 1024)
    if file_obj.size > max_size:
        raise ValidationError(f"File size exceeds the maximum limit of {max_size / (1024*1024):.1f} MB.")
    return file_obj


def validate_document_mime(file_obj):
    """Validates that document MIME type is allowed."""
    allowed_types = getattr(settings, 'ALLOWED_DOCUMENT_MIME_TYPES', ['application/pdf', 'image/jpeg', 'image/png'])
    content_type = getattr(file_obj, 'content_type', '')
    if content_type and content_type not in allowed_types:
        raise ValidationError(f"File type '{content_type}' is not supported. Allowed types: {', '.join(allowed_types)}")
    return file_obj
