import logging
import traceback
import sys
import os
from typing import Any, Callable, Dict, List, Optional, Tuple, TypeVar
from functools import wraps
from datetime import datetime
from enum import Enum

LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
os.makedirs(LOG_DIR, exist_ok=True)

logger = logging.getLogger('ats_resume_scorer')
logger.setLevel(logging.DEBUG)

# File handler — full detail in rotating daily log files
_file_handler = logging.FileHandler(
    os.path.join(LOG_DIR, f"ats_scorer_{datetime.now().strftime('%Y%m%d')}.log")
)
_file_handler.setLevel(logging.DEBUG)
_file_handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(module)s:%(lineno)d - %(message)s'
))

# Console handler — only warnings and errors visible during development
_console_handler = logging.StreamHandler(sys.stdout)
_console_handler.setLevel(logging.WARNING)
_console_handler.setFormatter(logging.Formatter('%(levelname)s: %(message)s'))

if not logger.handlers:
    logger.addHandler(_file_handler)
    logger.addHandler(_console_handler)

class ErrorSeverity(Enum):

    LOW      = 'low'
    MEDIUM   = 'medium'
    HIGH     = 'high'
    CRITICAL = 'critical'


class ErrorCategory(Enum):

    FILE_UPLOAD        = 'file_upload'
    FILE_PARSING       = 'file_parsing'
    TEXT_EXTRACTION    = 'text_extraction'
    NLP_PROCESSING     = 'nlp_processing'
    MODEL_LOADING      = 'model_loading'
    GRAMMAR_CHECK      = 'grammar_check'
    SKILL_VALIDATION   = 'skill_validation'
    LOCATION_DETECTION = 'location_detection'
    SCORING            = 'scoring'
    JD_COMPARISON      = 'jd_comparison'
    REPORT_GENERATION  = 'report_generation'
    AUTHENTICATION     = 'authentication'
    UNKNOWN            = 'unknown'

class ATSBaseError(Exception):
    """Base class for all ATS application errors — logs itself on creation."""

    def __init__(
        self,
        message: str,
        user_message: Optional[str] = None,
        category: ErrorCategory = ErrorCategory.UNKNOWN,
        severity: ErrorSeverity = ErrorSeverity.MEDIUM,
        suggestions: Optional[List[str]] = None,
        original_error: Optional[Exception] = None
    ):
        super().__init__(message)
        self.message       = message
        self.user_message  = user_message or 'An error occurred. Please try again.'
        self.category      = category
        self.severity      = severity
        self.suggestions   = suggestions or []
        self.original_error = original_error
        self.timestamp     = datetime.now()
        self._log_error()

    def _log_error(self):
        """Auto-log the error when it's created."""
        msg = f'{self.category.value}: {self.message}'
        if self.original_error:
            msg += f' | Caused by: {type(self.original_error).__name__}: {self.original_error}'
        if self.severity == ErrorSeverity.CRITICAL:
            logger.critical(msg)
        elif self.severity == ErrorSeverity.HIGH:
            logger.error(msg)
        elif self.severity == ErrorSeverity.MEDIUM:
            logger.warning(msg)
        else:
            logger.info(msg)


class FileUploadError(ATSBaseError):
    """Raised when there's a problem with the uploaded file itself."""
    def __init__(self, message: str, user_message: Optional[str] = None,
                 suggestions: Optional[List[str]] = None,
                 original_error: Optional[Exception] = None):
        super().__init__(
            message=message,
            user_message=user_message or (
                'There was a problem with your uploaded file. '
                'Please check the file format and try again.'
            ),
            category=ErrorCategory.FILE_UPLOAD,
            severity=ErrorSeverity.MEDIUM,
            suggestions=suggestions or [
                'Ensure your file is in PDF, DOC, or DOCX format',
                'Check that the file size is under 5MB',
                'Try re-saving the document and uploading again',
            ],
            original_error=original_error
        )

class FileParsingError(ATSBaseError):
    """Raised when the file is valid but text cannot be extracted from it."""
    def __init__(self, message: str, user_message: Optional[str] = None,
                 suggestions: Optional[List[str]] = None,
                 original_error: Optional[Exception] = None):
        super().__init__(
            message=message,
            user_message=user_message or (
                'Could not extract text from your file. '
                'The document may be corrupted or in an unsupported format.'
            ),
            category=ErrorCategory.FILE_PARSING,
            severity=ErrorSeverity.MEDIUM,
            suggestions=suggestions or [
                'Try converting your document to PDF format',
                'Ensure the document is not password-protected',
                'Check that the document contains selectable text (not scanned images)',
            ],
            original_error=original_error
        )


class TextExtractionError(ATSBaseError):
    """Raised when text extraction returns nothing usable."""
    def __init__(self, message: str, user_message: Optional[str] = None,
                 suggestions: Optional[List[str]] = None,
                 original_error: Optional[Exception] = None):
        super().__init__(
            message=message,
            user_message=user_message or (
                'No text could be extracted from your document. '
                'Please ensure it contains readable text.'
            ),
            category=ErrorCategory.TEXT_EXTRACTION,
            severity=ErrorSeverity.MEDIUM,
            suggestions=suggestions or [
                'Ensure your PDF contains selectable text, not scanned images',
                'Try converting the document to DOCX format',
            ],
            original_error=original_error
        )

def log_error(
    error: Exception,
    context: Optional[str] = None,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    include_traceback: bool = True
) -> None:
    """Log an exception with optional context and traceback."""
    msg = f"Error in {context or 'unknown'}: {type(error).__name__}: {error}"
    if include_traceback:
        logger.error(f'{msg}\nTraceback:\n{traceback.format_exc()}')
    else:
        logger.error(msg)


def log_warning(message: str, context: Optional[str] = None) -> None:
    """Log a warning with optional context."""
    logger.warning(f'{context}: {message}' if context else message)


def log_info(message: str, context: Optional[str] = None) -> None:
    """Log an informational message with optional context."""
    logger.info(f'{context}: {message}' if context else message)

T = TypeVar('T')


def with_fallback(
    primary_func: Callable[..., T],
    fallback_func: Callable[..., T],
    *args,
    error_category: ErrorCategory = ErrorCategory.UNKNOWN,
    log_fallback: bool = True,
    **kwargs
) -> Tuple[T, bool]:
    
    try:
        return primary_func(*args, **kwargs), False
    except Exception as primary_error:
        if log_fallback:
            log_warning(
                f'Primary method failed, trying fallback: {primary_error}',
                context=error_category.value
            )
        try:
            return fallback_func(*args, **kwargs), True
        except Exception as fallback_error:
            log_error(fallback_error, context=f'{error_category.value}_fallback',
                      category=error_category)
            raise

def get_default_grammar_results() -> Dict:
    """Return a safe default when grammar checking is unavailable."""
    return {
        'total_errors':         0,
        'critical_errors':      [],
        'moderate_errors':      [],
        'minor_errors':         [],
        'grammar_score':        100,
        'penalty_applied':      0,
        'error_free_percentage': 100,
        '_component_status':    'unavailable',
        '_note': 'Grammar checking was unavailable. Results may be incomplete.'
    }


def get_default_location_results() -> Dict:
    """Return a safe default when location detection is unavailable."""
    return {
        'location_found':     False,
        'detected_locations': [],
        'privacy_risk':       'unknown',
        'recommendations':    ['Location detection was unavailable.'],
        'penalty_applied':    0,
        '_component_status':  'unavailable',
        '_note': 'Location detection was unavailable. Results may be incomplete.'
    }


def get_default_skill_validation_results() -> Dict:
    """Return a safe default when skill validation is unavailable."""
    return {
        'validated_skills':     [],
        'unvalidated_skills':   [],
        'validation_percentage': 0.0,
        'skill_project_mapping': {},
        'validation_score':     0.0,
        '_component_status':    'unavailable',
        '_note': 'Skill validation was unavailable. Results may be incomplete.'
    }


def get_default_jd_comparison_results() -> Dict:
    """Return a safe default when JD comparison is unavailable."""
    return {
        'semantic_similarity': 0.0,
        'matched_keywords':    [],
        'missing_keywords':    [],
        'skills_gap':          [],
        'match_percentage':    0.0,
        '_component_status':   'unavailable',
        '_note': 'Job description comparison was unavailable.'
    }
    
