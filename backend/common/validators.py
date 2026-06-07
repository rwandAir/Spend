import re
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from decimal import Decimal

def validate_email_format(email):
    try:
        validate_email(email)
    except ValidationError:
        return False
    return True

def validate_positive_amount(amount):
    try:
        val = Decimal(str(amount))
        if val <= 0:
            return False
    except (ValueError, TypeError):
        return False
    return True

def validate_date(date_str):
    # Match YYYY-MM-DD
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', str(date_str)):
        return False
    return True
