def remove_extra_whitespace(text: str) -> str:
    """
    Removes extra whitespace from the input text. Ensures:
    - Consecutive spaces within a paragraph are reduced to a single space.
    - Multiple paragraphs have exactly one blank line between them.

    Args:
        text (str): The input text to clean.

    Returns:
        str: The cleaned text with standardized whitespace.
    """
    if not text or not text.strip():
        return ""  # Handle edge case for empty or whitespace-only input

    # Split into paragraphs based on newline characters
    paragraphs = text.split('\n')
    cleaned_paragraphs = []

    for paragraph in paragraphs:
        # Remove extra spaces between words in the paragraph
        stripped_paragraph = ' '.join(paragraph.split())
        if stripped_paragraph:  # Include only non-empty paragraphs
            cleaned_paragraphs.append(stripped_paragraph)

    # Rejoin paragraphs with exactly one blank line (two newlines) in between
    return '\n\n'.join(cleaned_paragraphs)
