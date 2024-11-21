#backedn/logic/text_encrypter.py
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import os
import base64

def encrypt_text(text):
    # Define the directory and file path where the encrypted text will be saved
    encrypted_dir = 'C/downloads'
    encrypted_file_path = os.path.join(encrypted_dir, 'encrypted_file.txt')

    # Ensure the directory exists
    if not os.path.exists(encrypted_dir):
        os.makedirs(encrypted_dir)  # Create the directory if it doesn't exist

    # Encryption key (must be 16, 24, or 32 bytes long)
    key = b'Sixteen byte key'  # 16-byte key for AES

    # Initialize AES cipher with CBC mode and a random initialization vector (IV)
    cipher = AES.new(key, AES.MODE_CBC)
    iv = cipher.iv  # Get the initialization vector

    # Pad the text to be a multiple of AES block size (16 bytes)
    padded_text = pad(text.encode(), AES.block_size)

    # Encrypt the text
    encrypted_text = cipher.encrypt(padded_text)

    # Combine the IV and the encrypted text to store them together
    encrypted_data = iv + encrypted_text

    # Ensure the directory exists
    if not os.path.exists(encrypted_dir):
        os.makedirs(encrypted_dir)

    # Write the encrypted data to the file
    with open(encrypted_file_path, 'wb') as f:
        f.write(encrypted_data)

    return encrypted_file_path
