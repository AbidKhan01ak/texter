from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from collections import Counter

def generate_summary(text, max_sentences=100):
    if not text:
        return "No text provided to summarize."

    try:
        # Tokenize text and perform summarization
        sentences = sent_tokenize(text)
        stop_words = set(stopwords.words('english'))
        words = word_tokenize(text.lower())
        filtered_words = [word for word in words if word.isalnum() and word not in stop_words]
        word_freq = Counter(filtered_words)

        sentence_scores = {}
        for sentence in sentences:
            sentence_words = word_tokenize(sentence.lower())
            sentence_scores[sentence] = sum(word_freq[word] for word in sentence_words if word in word_freq)

        top_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:max_sentences]
        summary = ' '.join(top_sentences)
        return summary

    except Exception as e:
        print(f"Error in generate_summary: {e}")
        return "An error occurred while generating the summary."
