import React, { useState, useEffect } from 'react';
import './TextToWordPage.css';
import TextInput from '../../utils/TextInput';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';
import { getFileName } from '../../utils/FileUtils';
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty } from '../../validation/validation';

function TextToWordPage() {
    const [text, setText] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState(''); // State to store the generated file name
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        logAction("Opened Text to Word Page");
    }, []);

    const handleTextToWord = async () => {

        const isValid = validateInput({
            value: text,
            validations: [isNotEmpty],
            setErrorMessage, // Set error message if validation fails
        });

        if (!isValid) return;

        setLoading(true); // Show loading spinner
        try {
            const response = await fetch('http://localhost:5000/text/text-to-word', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setFileUrl(url); // Set URL for download link

                // Generate and set the file name
                const generatedFileName = getFileName('texter-io-text-to-word', 'docx');
                setFileName(generatedFileName);
                logAction("Word file generated");
            } else {
                console.error('Failed to create Word document.');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Hide loading spinner
        }
        logAction("Word file downloaded");
    };

    return (
        <div className="ttw-operation-page">
            <h2>Text to Word</h2>
            <p>Convert your text into a professional <strong>Word document</strong> in just a few clicks with Texter’s easy-to-use tool.</p>
            <TextInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert to Word document"
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button onClick={handleTextToWord} disabled={loading} className='ttw-button'>
                {loading ? <LoadingSpinner /> : 'Convert to Word'}
            </button>
            {fileUrl && (
                <a href={fileUrl} download={fileName} className='ttw-link'>
                    Download Word Document
                </a>
            )}
        </div>
    );
}

export default TextToWordPage;
