import re

def count_letters(text: str) -> int:
    """
    Counts the number of alphabetic letters in the given text.

    Args:
        text (str): The input text to analyze.

    Returns:
        int: The count of alphabetic letters.
    """
    return sum(1 for char in text if char.isalpha())

def count_words(text: str) -> int:
    """
    Counts the number of words in the given text.

    Args:
        text (str): The input text to analyze.

    Returns:
        int: The count of words.
    """
    return len(re.findall(r'\b\w+\b', text))

def count_sentences(text: str) -> int:
    """
    Counts the number of sentences in the given text by identifying sentence-ending punctuation.

    Args:
        text (str): The input text to analyze.

    Returns:
        int: The count of sentences.
    """
    return len(re.findall(r'[.!?]', text))

def count_paragraphs(text: str) -> int:
    """
    Counts the number of paragraphs in the given text. Paragraphs are considered to be separated by two or more newlines.

    Args:
        text (str): The input text to analyze.

    Returns:
        int: The count of paragraphs.
    """
    # Ensure to count paragraphs even if there is no double newline at the end.
    return len(re.findall(r'\n{2,}', text)) + 1 if text.strip() else 0

def count_spaces(text: str) -> int:
    """
    Counts the number of spaces in the given text.

    Args:
        text (str): The input text to analyze.

    Returns:
        int: The count of spaces.
    """
    return text.count(' ')

def count_punctuation(text: str) -> int:
    """
    Counts the number of punctuation marks in the given text.

    Args:
        text (str): The input text to analyze.

    Returns:
        int: The count of punctuation marks.
    """
    return len(re.findall(r'[^\w\s]', text))

def analyze_text(text: str) -> dict:
    """
    Analyzes the given text and returns a dictionary with counts of letters, words, sentences, paragraphs, spaces, and punctuation.

    Args:
        text (str): The input text to analyze.

    Returns:
        dict: A dictionary with the count of letters, words, sentences, paragraphs, spaces, and punctuation.
    """
    if not text:
        raise ValueError("Input text cannot be empty or None")

    # Return all counts in a dictionary
    return {
        'letters': count_letters(text),
        'words': count_words(text),
        'sentences': count_sentences(text),
        'paragraphs': count_paragraphs(text),
        'spaces': count_spaces(text),
        'punctuation': count_punctuation(text)
    }

