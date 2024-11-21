// pages/CaseConverterPage.js
import React, { useState, useEffect } from 'react';
import SplitButton from '../../utils/SplitButton/SplitButton';
import TextInput from "../../utils/TextInput";
import { getFileName, saveAsTxt } from '../../utils/FileUtils';
import jsPDF from 'jspdf';
import '../CaseConvertor/CaseConverterPage.css';
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner"
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty } from '../../validation/validation';
function CaseConverterPage() {
    const [text, setText] = useState('');
    const [convertedText, setConvertedText] = useState('');
    const [selectedOption, setSelectedOption] = useState(0);
    const [loading, setLoading] = useState(false);
    const [txtSave, setTxtSave] = useState(false);
    const [pdfSave, setPdfSave] = useState(false);
    const [resultLoading, setResultLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const options = ['UPPERCASE', 'lowercase', 'Capitalize Each Word'];
    useEffect(() => {
        logAction("Opened Case Convertor Page");
    }, []);
    const handleConvertText = async () => {
        const isValid = validateInput({
            value: text,
            validations: [isNotEmpty],
            setErrorMessage,
        });

        if (!isValid) return;

        try {
            setLoading(true);
            setResultLoading(true);
            const response = await fetch('http://localhost:5000/text/case-convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, conversionType: options[selectedOption] }),
            });

            if (response.ok) {
                const data = await response.json();
                const cleanText = data.convertedText.replace(/<\/?pre>/g, '');
                setConvertedText(cleanText);
                logAction("Case conversion operation performed");
            } else {
                console.error('Failed to convert text.');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setResultLoading(false);
        }
    };

    //save as Text
    const saveText = () => {
        setTxtSave(true);
        setTimeout(() => {
            saveAsTxt(convertedText, 'texter.io-case-convertor')
            logAction("Saved as Text from Case Convertor Page");
            setTxtSave(false);
        }, 1000);

    }


    // Save as PDF
    const saveAsPdf = () => {
        setPdfSave(true);
        setTimeout(() => {
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 15;
            const textWidth = pageWidth - 2 * margin;
            const lineHeight = 10; // Adjust for spacing between lines

            // Split text into lines that fit within the text width
            const wrappedText = pdf.splitTextToSize(convertedText, textWidth);

            // Add text line by line, handling page overflow
            let y = margin;
            wrappedText.forEach((line, index) => {
                if (y + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
                    pdf.addPage(); // Add new page if line exceeds page height
                    y = margin; // Reset y to top of new page
                }
                pdf.text(line, margin, y);
                y += lineHeight;
            });

            pdf.save(getFileName('texter.io-case-convertor', 'pdf'));
            logAction("Saved PDF from Case Convertor Page");
            setPdfSave(false);
        }, 1000);

    };

    return (
        <div className="case-convertor-operation-page">
            <h2>Case Converter</h2>
            <TextInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert case"
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <SplitButton
                options={options}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
            />
            <button className='case-convertor-button' onClick={handleConvertText} disabled={loading}>{loading ? <LoadingSpinner /> : 'Convert Text'}</button>
            <div className="case-convertor-result" disabled={resultLoading}>{resultLoading ? <LoadingSpinner /> : convertedText}</div>

            <div className="save-buttons">
                <button className='case-convertor-button' onClick={saveText} disabled={txtSave}>{txtSave ? <LoadingSpinner /> : 'Save as TXT'}</button>
                <button className='case-convertor-button' onClick={saveAsPdf} disabled={pdfSave}>{pdfSave ? <LoadingSpinner /> : 'Save as PDF'}</button>
            </div>
        </div>
    );
}

export default CaseConverterPage;
