//src/pages/CounterAnalyzer/CounterAnalyzerPages.js

import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';
import { logAction } from '../../utils/logAction';
import TextInput from '../../utils/TextInput';
import './CounterAnalyzerPage.css';
import { validateInput, isNotEmpty } from '../../validation/validation';

function CounterAnalyzerPage() {
    const [text, setText] = useState('');
    const [analysis, setAnalysis] = useState({
        letters: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        spaces: 0,
        punctuation: 0,
    });
    const [loading, setLoading] = useState(false); // Track loading state
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        window.scrollTo(0, 0);
        logAction("Opened Counter Analyzer Page");
    }, []);

    const handleAnalyzeText = async () => {
        const isValid = validateInput({
            value: text,
            validations: [isNotEmpty],
            setErrorMessage,
        });

        if (!isValid) return;
        setLoading(true);

        setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:5000/text/counter-analyzer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text }),
                });

                if (response.ok) {
                    const data = await response.json();
                    // console.log('Analysis Data:', data);
                    setAnalysis(data);
                    logAction("Text Analysis Completed");
                } else {
                    console.error('Failed to analyze text from the server.');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="counter-analyzer-operation-page">
            <h2>Text Analyzer</h2>
            <p>Unlock valuable <strong>insights</strong> from your text with Texter's Text Analyzer — track word count, sentence count, and more!</p>
            <TextInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to analyze"
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="counter-analyzer-button" onClick={handleAnalyzeText} disabled={loading}>{loading ? <LoadingSpinner /> : 'Analyze Text'}</button>

            <div className="counter-analyzer-result">
                {loading ? (
                    <div className="spinner-container">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <p>Letter Count: {analysis.letters}</p>
                        <p>Word Count: {analysis.words}</p>
                        <p>Sentence Count: {analysis.sentences}</p>
                        <p>Paragraph Count: {analysis.paragraphs}</p>
                        <p>Space Count: {analysis.spaces}</p>
                        <p>Punctuation Count: {analysis.punctuation}</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default CounterAnalyzerPage;
