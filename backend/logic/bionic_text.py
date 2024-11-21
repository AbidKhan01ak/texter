# backend/logic/bionic_text.py
def bionic_reading_format(text):
    """
    Format text for Bionic Reading by bolding the first part of each word.
    Bionic reading style bolds the first 1-2 characters or 50% of the word, whichever is greater.
    """
    words = text.split()
    formatted_words = []

    for word in words:
        split_point = max(1, len(word) // 2)
        bold_part = f"<b>{word[:split_point]}</b>"
        remaining_part = word[split_point:]
        formatted_words.append(bold_part + remaining_part)

    # Join the words with spaces to form the final formatted text with HTML
    formatted_text = ' '.join(formatted_words)
    return formatted_text
