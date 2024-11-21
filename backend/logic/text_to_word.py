from docx import Document
import os

def convert_text_to_word(text, output_dir='generated_files'):
    """
    Converts the given text into a Word document and saves it.

    :param text: Text to be converted into a Word document.
    :param output_dir: Directory where the Word file will be saved.
    :return: Path to the generated Word document.
    """
    # Ensure the output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Define the output file path
    output_file_path = os.path.join(output_dir, 'text.docx')

    # Create a Word document
    document = Document()
    document.add_paragraph(text)
    document.save(output_file_path)

    return output_file_path
