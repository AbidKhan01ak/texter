# backend/logic/password_generator.py
import random
import string

def generate_password_from_text(input_text, length=12):
    if not input_text:
        raise ValueError("Input text cannot be empty")
    
    # Create a base password using the input text with alternating case
    password = ''.join(
        char.upper() if i % 2 == 0 else char.lower()
        for i, char in enumerate(input_text)
    )
    
    # Fill in with additional characters to reach the desired length
    if len(password) < length:
        additional_chars = string.ascii_letters + string.digits + string.punctuation
        password += ''.join(random.choice(additional_chars) for _ in range(length - len(password)))
    
    # Shuffle characters to enhance randomness
    password = list(password)
    random.shuffle(password)
    return ''.join(password)
