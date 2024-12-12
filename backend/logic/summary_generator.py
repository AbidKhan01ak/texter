import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from collections import Counter
import logging

# Ensure required NLTK resources are downloaded
nltk.download('punkt')
nltk.download('stopwords')

# Configure logging for better error tracking and debugging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

def generate_summary(text: str, max_sentences: int = 100) -> str:
    """
    Generates a summary of the provided text by selecting the most important sentences based on word frequency.

    Args:
        text (str): The input text to summarize.
        max_sentences (int): The maximum number of sentences to include in the summary.

    Returns:
        str: The summarized text or an error message if summarization fails.
    """
    if not text or text.strip() == "":
        logging.warning("Empty text provided for summarization.")
        return "No text provided to summarize."

    try:
        # Tokenize the text into sentences
        sentences = sent_tokenize(text)

        # Set of English stopwords for filtering out common words
        stop_words = set(stopwords.words('english'))

        # Tokenize words and filter out stopwords and non-alphanumeric characters
        words = word_tokenize(text.lower())
        filtered_words = [word for word in words if word.isalnum() and word not in stop_words]
        word_freq = Counter(filtered_words)

        # Score each sentence based on the frequency of the words it contains
        sentence_scores = {}
        for sentence in sentences:
            sentence_words = word_tokenize(sentence.lower())
            sentence_scores[sentence] = sum(word_freq[word] for word in sentence_words if word in word_freq)

        # Sort sentences by score and select the top 'max_sentences' ones
        top_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:max_sentences]

        # Join the top sentences to form the summary
        summary = ' '.join(top_sentences)

        logging.info("Summary successfully generated.")
        return summary

    except Exception as e:
        logging.error(f"Error occurred while generating summary: {e}")
        return "An error occurred while generating the summary."
