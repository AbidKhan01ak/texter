import React, { useState, useEffect } from 'react';
import TextInput from '../../utils/TextInput';
import './WhitespaceRemoverPage.css';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';
import jsPDF from 'jspdf';
import { getFileName } from '../../utils/FileUtils';
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty } from '../../validation/validation';

function WhitespaceRemoverPage() {
    const [text, setText] = useState('');
    const [cleanedText, setCleanedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        logAction("Opened Whitespace Remover Page");
    }, []);

    const handleRemoveWhitespace = async () => {
        const isValid = validateInput({
            value: text,
            validations: [isNotEmpty],
            setErrorMessage, // Display error message if validation fails
        });

        if (!isValid) return;
        setLoading(true);
        setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:5000/text/remove-whitespace', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setCleanedText(data.cleanedText);
                    logAction("Extra Whitespaces Removed from provided Text");
                } else {
                    console.error('Failed to remove whitespace from the server.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
            finally {
                setLoading(false);
            }
        }, 500);
    };

    // Save as PDF
    const saveAsPdf = () => {
        if (!cleanedText) {
            console.error("No text available to save as PDF.");
            return;
        }
        setPdfLoading(true);
        setTimeout(() => {
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 15;
            const textWidth = pageWidth - 2 * margin;
            const lineHeight = 10;

            const wrappedText = pdf.splitTextToSize(cleanedText, textWidth);

            let y = margin;
            wrappedText.forEach((line, index) => {
                if (y + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.text(line, margin, y);
                y += lineHeight;
            });

            pdf.save(getFileName('texter.io-whitespace-remover', 'pdf'));
            setPdfLoading(false);
        }, 1000);
        logAction("Saved PDF from  Whitespace Remover Page");
    };

    return (
        <div className="whitespace-remover-operation-page">
            <h2>Whitespace Remover</h2>
            <TextInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to remove extra whitespace"
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button onClick={handleRemoveWhitespace} className='wsr-button' disabled={loading}>{loading ? <LoadingSpinner /> : 'Remove Whitespace'}</button>
            {cleanedText && (
                <div className="whitespace-remover-result">
                    <pre>{cleanedText}</pre>
                </div>
            )}
            <div className="save-buttons">

                <button className='wsr-button' onClick={saveAsPdf} disabled={pdfLoading}>{pdfLoading ? <LoadingSpinner /> : 'Save as PDF'}</button>

            </div>
        </div>
    );
}

export default WhitespaceRemoverPage;
