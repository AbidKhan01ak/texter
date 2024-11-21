def remove_extra_whitespace(text):
    """
    Removes extra whitespace from the input text. If the input contains multiple paragraphs,
    ensures there is exactly one blank line between paragraphs.
    """
    if not text.strip():
        return ""  # Handle edge case where the input is empty or just whitespace

    paragraphs = text.split('\n')  # Split into paragraphs based on newline characters
    cleaned_paragraphs = []

    for paragraph in paragraphs:
        stripped_paragraph = ' '.join(paragraph.split())  # Remove extra spaces between words in each paragraph
        if stripped_paragraph:  # Skip empty paragraphs
            cleaned_paragraphs.append(stripped_paragraph)

    # Join paragraphs with one blank line in between
    return '\n\n'.join(cleaned_paragraphs)
