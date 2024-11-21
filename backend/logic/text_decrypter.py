#backend/logic.text_decrpyter.py
import logging
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

def decrypt_text(encrypted_file):
    try:
        # Read the encrypted file
        with open(encrypted_file, 'rb') as f:
            encrypted_data = f.read()
        
        # Ensure encrypted data is not empty
        if not encrypted_data:
            raise ValueError("Encrypted file is empty.")

        # Extract the IV (first 16 bytes) and encrypted text (rest)
        iv = encrypted_data[:16]
        encrypted_text = encrypted_data[16:]

        # The same key used for encryption
        key = b'Sixteen byte key'

        # Initialize AES cipher with the same key and IV
        cipher = AES.new(key, AES.MODE_CBC, iv)

        # Decrypt the text and remove padding
        decrypted_text = unpad(cipher.decrypt(encrypted_text), AES.block_size)

        return decrypted_text.decode()

    except Exception as e:
        logging.error(f"Decryption error: {e}")
        raise  # Re-raise the error to trigger a 500 status
