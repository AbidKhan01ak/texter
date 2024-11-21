import React, { useState, useEffect } from 'react';
import './BionicReadingPage.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import TextInput from '../../utils/TextInput';
import { getFileName } from '../../utils/FileUtils';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty } from '../../validation/validation';

function BionicReadingPage() {
    const [text, setText] = useState('');
    const [formattedText, setFormattedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        logAction("Opened Bionic Reading Page");
    }, []);
    const handleBionicReading = async () => {
        const isValid = validateInput({
            value: text,
            validations: [isNotEmpty],
            setErrorMessage,
        });

        if (!isValid) return;
        try {
            const response = await fetch('http://localhost:5000/text/bionic-reading', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (response.ok) {
                const data = await response.json();
                setFormattedText(data.formattedText); // Backend returns HTML string in `formattedText`
                logAction("Formatted text for Bionic Reading");
            } else {
                console.error('Failed to fetch formatted text from the server.');
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };

    // Save as PDF by converting formatted HTML to an image first
    const handleSaveAsPDF = () => {
        setLoading(true);
        setTimeout(async () => {
            const pdf = new jsPDF('p', 'pt', 'a4');
            const element = document.getElementById('bionic-reading-result'); // Target element

            if (element) {
                html2canvas(element, { scale: 2 }).then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const imgWidth = pageWidth - 40;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;

                    pdf.addImage(imgData, 'PNG', 20, 40, imgWidth, imgHeight);
                    pdf.save(getFileName('bionic-reading-output', 'pdf'));
                }).catch((error) => {
                    console.error('Error generating PDF:', error);
                });
            } else {
                console.error('Element not found for PDF conversion.');
            }
            setLoading(false);
            logAction("Saved PDF from Bionic Reading Page");
        }, 500);
    };

    return (
        <div className="bionic-reading-operation-page">
            <h2>Bionic Reading</h2>
            <TextInput
                className='br-text-input'
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text for bionic reading"
                rows={5}
                cols={50}
            />
            {errorMessage && (
                <p className="error-message">{errorMessage}</p>)}
            <button className='br-button' onClick={handleBionicReading}>Apply Bionic Reading</button>
            <div
                id="bionic-reading-result"
                className="bionic-reading-result"
                dangerouslySetInnerHTML={{ __html: formattedText }}
                style={{ fontSize: '1.1em', lineHeight: '1.6em' }}
            />
            <button className='br-button' onClick={handleSaveAsPDF} disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Save as PDF'}
            </button>
        </div>
    );
}

export default BionicReadingPage;
