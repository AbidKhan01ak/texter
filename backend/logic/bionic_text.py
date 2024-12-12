def bionic_reading_format(text: str) -> str:
    """
    Format the input text for Bionic Reading by bolding the first part of each word.

    Bionic reading style bolds the first 1-2 characters or 50% of the word, whichever is greater.
    It ensures that the word is split and only the first portion is bolded.

    Args:
        text (str): The input text to be formatted for Bionic Reading.

    Returns:
        str: The formatted text with HTML tags for bolding the first part of each word.

    Raises:
        ValueError: If the input text is not a valid string.
    """
    # Input validation: Ensure the text is a valid non-empty string
    if not isinstance(text, str) or not text.strip():
        raise ValueError("Input text must be a non-empty string.")

    words = text.split()  # Split the text into individual words
    formatted_words = []

    for word in words:
        # Handle words that are single characters or less than 2 characters long
        if len(word) < 2:
            formatted_words.append(f"<b>{word}</b>")
            continue
        
        # Calculate the split point for bolding part of the word
        split_point = max(1, len(word) // 2)  # Bold first half or 1 character, whichever is greater
        bold_part = f"<b>{word[:split_point]}</b>"
        remaining_part = word[split_point:]

        # Concatenate bold part with the remaining part of the word
        formatted_words.append(bold_part + remaining_part)

    # Join the words with spaces to form the final formatted text with HTML
    formatted_text = ' '.join(formatted_words)
    return formatted_text
