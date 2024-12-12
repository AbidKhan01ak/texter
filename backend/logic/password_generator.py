import random
import string
import re

def generate_password_from_text(input_text: str, length: int = 12) -> str:
    """
    Generates a secure password using the input text and random characters to meet a specified length.

    Args:
        input_text (str): The base text from which to generate the password.
        length (int): The desired length of the generated password (default is 12).

    Returns:
        str: The generated password.

    Raises:
        ValueError: If the input text is empty or too short to create a meaningful password.
    """
    if not input_text or len(input_text.strip()) == 0:
        raise ValueError("Input text cannot be empty or just whitespace")

    if length < 8:
        raise ValueError("Password length should be at least 8 characters for security")

    # Create a base password using the input text with alternating case
    password = ''.join(
        char.upper() if i % 2 == 0 else char.lower()
        for i, char in enumerate(input_text)
    )

    # Fill in with additional characters to reach the desired length
    if len(password) < length:
        additional_chars = string.ascii_letters + string.digits + string.punctuation
        password += ''.join(random.choice(additional_chars) for _ in range(length - len(password)))

    # Convert the password to a list and shuffle it to enhance randomness
    password = list(password)
    random.shuffle(password)

    # Ensure that the password contains at least one character from each category: 
    # uppercase, lowercase, digits, and special characters
    if not any(c.islower() for c in password):
        password.append(random.choice(string.ascii_lowercase))
    if not any(c.isupper() for c in password):
        password.append(random.choice(string.ascii_uppercase))
    if not any(c.isdigit() for c in password):
        password.append(random.choice(string.digits))
    if not any(c in string.punctuation for c in password):
        password.append(random.choice(string.punctuation))

    # Shuffle again to maintain randomness
    random.shuffle(password)

    # Join the list back into a string and return
    return ''.join(password[:length])

