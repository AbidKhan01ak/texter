#backend/logic/counter_analyzer.py
import re

def count_letters(text):
    # Count only alphabetic letters and ignore spaces or punctuation
    return sum(1 for char in text if char.isalpha())

def count_words(text):
    # Split by whitespace to count words
    return len(re.findall(r'\b\w+\b', text))

def count_sentences(text):
    # Use regex to count sentence-ending punctuation
    return len(re.findall(r'[.!?]', text))

def count_paragraphs(text):
    # Count paragraphs by splitting at two or more newlines
    return len(re.findall(r'\n{2,}', text)) + 1

def count_spaces(text):
    # Count spaces
    return text.count(' ')

def count_punctuation(text):
    # Count punctuation using regex
    return len(re.findall(r'[^\w\s]', text))

def analyze_text(text):
    # Return all counts in a dictionary
    return {
        'letters': count_letters(text),
        'words': count_words(text),
        'sentences': count_sentences(text),
        'paragraphs': count_paragraphs(text),
        'spaces': count_spaces(text),
        'punctuation': count_punctuation(text)
    }
