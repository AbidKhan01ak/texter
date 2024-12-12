from docx import Document
import os


def convert_text_to_word(text: str, output_dir: str = 'generated_files') -> str:
    """
    Converts the given text into a Word document and saves it.

    Args:
        text (str): Text to be converted into a Word document.
        output_dir (str): Directory where the Word file will be saved.

    Returns:
        str: Path to the generated Word document.

    Raises:
        ValueError: If the input text is empty or None.
        OSError: If the output directory cannot be created.
    """
    if not text or not text.strip():
        raise ValueError("Input text must not be empty or only whitespace.")

    # Ensure the output directory exists
    try:
        os.makedirs(output_dir, exist_ok=True)
    except OSError as e:
        raise OSError(f"Failed to create output directory '{output_dir}': {e}")

    # Use a timestamp to generate a unique file name
    output_file_path = os.path.join(output_dir, "text.docx")

    # Create a Word document
    document = Document()
    document.add_paragraph(text)
    document.save(output_file_path)

    return output_file_path
