import re

def convert_case(text: str, conversion_type: str) -> str:
    """
    Converts the case of the input text based on the specified conversion type.

    Args:
        text (str): The input text to be converted.
        conversion_type (str): The type of conversion. It can be one of:
            - 'UPPERCASE'
            - 'lowercase'
            - 'Capitalize Each Word'
    
    Returns:
        str: The text after applying the specified case conversion.
    
    Raises:
        ValueError: If an invalid conversion type is provided.
    """
    # Check if the input text is empty or not a string
    if not isinstance(text, str) or not text.strip():
        raise ValueError("Input text must be a non-empty string.")

    # Normalize the conversion type to uppercase to make the check case-insensitive
    conversion_type = conversion_type.strip().lower()

    # Perform the case conversion based on the type
    if conversion_type == 'uppercase':
        result = text.upper()
    elif conversion_type == 'lowercase':
        result = text.lower()
    elif conversion_type == 'capitalize each word':
        result = text.title()
    else:
        raise ValueError("Invalid conversion type. Must be one of: 'UPPERCASE', 'lowercase', 'Capitalize Each Word'.")

    return result
