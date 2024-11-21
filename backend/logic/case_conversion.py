import re

# backend/logic/case_conversion.py
def convert_case(text, conversion_type):
    if conversion_type == 'UPPERCASE':
        result = text.upper()
    elif conversion_type == 'lowercase':
        result = text.lower()
    elif conversion_type == 'Capitalize Each Word':
        result = text.title()
    else:
        raise ValueError("Invalid conversion type")
    
    # Wrap in <pre> tags to preserve formatting
    return result
