import os
import pyttsx3
import re

def remove_brackets_content(text):
    """
    Removes any content inside parentheses, square brackets, or curly braces.

    Args:
        text (str): The input text.

    Returns:
        str: The text with content inside brackets removed.
    """
    # Regular expression to match content inside (), [], {}
    cleaned_text = re.sub(r'[\(\[\{].*?[\)\]\}]', '', text)
    return cleaned_text

def convert_text_to_audio(text, voice="male", rate=180):
    """
    Converts the given text to an audio file with specified voice.

    Args:
        text (str): The text to convert to audio.
        voice (str): "male" or "female".

    Returns:
        str: Path to the generated audio file.
    """
    if not text.strip():
        raise ValueError("Text input is empty.")

    # Remove content inside brackets
    text = remove_brackets_content(text)

    # Initialize the pyttsx3 engine
    engine = pyttsx3.init()

    # List available voices
    voices = engine.getProperty('voices')
    selected_voice = None

    # Select the appropriate voice based on the gender (male/female)
    if voice == "male":
        selected_voice = voices[0]  # Typically male voice is at index 0
    elif voice == "female":
        selected_voice = voices[1]  # Typically female voice is at index 1

    # Set the engine's voice property
    engine.setProperty('voice', selected_voice.id if selected_voice else voices[0].id)

    # Set the speech volume
    engine.setProperty('volume', 1.0)
    engine.setProperty('rate', rate)
    
    # Save the generated audio to a file
    audio_dir = "generated_audio"
    os.makedirs(audio_dir, exist_ok=True)
    audio_path = os.path.join(audio_dir, "texter-io-audio-convertor.mp3")

    # Use pyttsx3 to save the speech to a file
    engine.save_to_file(text, audio_path)
    engine.runAndWait()

    return audio_path
