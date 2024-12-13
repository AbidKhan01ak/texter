import React, { useState, useEffect } from 'react';
import '../SummaryGenerator/SummaryGeneratorPage.css';
import TextInput from '../../utils/TextInput';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty } from '../../validation/validation';

function SummaryGeneratorPage() {
    const [inputText, setInputText] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');  // For handling errors

    useEffect(() => {
        logAction("Opened Summary Generator Page");
    }, [])
    const handleGenerateSummary = async () => {
        const isValid = validateInput({
            value: inputText,
            validations: [isNotEmpty],
            setErrorMessage: setError,
        });

        if (!isValid) return;

        setLoading(true);
        setError(''); // Clear any previous errors
        try {
            const response = await fetch('http://localhost:5000/text/generate-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: inputText }),
            });

            if (response.ok) {
                const data = await response.json();
                setSummary(data.summary);
                logAction("Text Summarization done");
            } else {
                setError('Failed to generate summary from the server.');
                console.error('Failed to generate summary from the server.');
            }
        } catch (error) {
            setError('An error occurred while generating the summary.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="summary-generator-operation-page">
            <h2>Summary Generator</h2>
            <p>Transform your long text into <strong>concise summaries</strong> effortlessly with Texter’s Summary Generator.</p>
            <TextInput
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to summarize"
                className="summary-text-input"
            />
            {error && <p className="error-message">{error}</p>}
            <button className='summary-generator-button' onClick={handleGenerateSummary} disabled={loading}>
                Generate Summary
            </button>
            {loading ? <LoadingSpinner /> : (
                summary && (
                    <div className="summary-generator-result">
                        <h3>Summary:</h3>
                        <p>{summary}</p>
                    </div>
                )
            )}
        </div>
    );
}

export default SummaryGeneratorPage;
