// frontend/src/DecryptTextPage.js
import React, { useState, useEffect } from 'react';
import '../DecryptText/DecryptTextPage.css';
import { saveAsTxt } from '../../utils/FileUtils';
import FilePickerIcon from '../../assets/FilePicker.svg'; // Importing SVG
import { logAction } from '../../utils/logAction';
import { validateInput, isFileValid } from '../../validation/validation';
function DecryptTextPage() {
    const [decryptedText, setDecryptedText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    useEffect(() => {
        logAction("Opened Text Decrypter Page");
    }, [])
    const handleDecrypt = async (event) => {
        const file = event.target.files[0];

        const isValid = validateInput({
            value: file,
            validations: [isFileValid],
            setErrorMessage,
        });

        if (!isValid) return;
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        // console.log('file', event.target.files[0]);

        try {
            const response = await fetch('http://localhost:5000/text/decrypt-text', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                if (data.decryptedText) {
                    setDecryptedText(data.decryptedText);
                    setErrorMessage('');
                    logAction("Text Decryption done");
                } else {
                    setErrorMessage('Decryption failed. No decrypted text returned.');
                }
            } else {
                console.error('Error during decryption:', response.statusText);
            }
        } catch (error) {
            console.error('Error during decryption:', error);
        }
    };

    const handleDownload = () => {
        if (decryptedText) {
            saveAsTxt(decryptedText, 'texter-io-decrypted-text');
            logAction("Saved Text file from text Decrypter Page");
        }
    };

    return (
        <div className="text-decrypt-operation-page">
            <h2>Decrypt Text</h2>
            <p>Upload the <strong>encrypted text file</strong>, and Texter will decrypt it for you.</p>
            <div className="file-input-wrapper">
                <input
                    type="file"
                    id="fileInput"
                    onChange={handleDecrypt}
                />
                <label htmlFor="fileInput" className="file-input-label">
                    <span>Select Encrypted File</span>
                    <img className='file-picker' src={FilePickerIcon} alt='File picker' />
                </label>
            </div>
            {errorMessage && (
                <div className="error-message">
                    <p>{errorMessage}</p>
                </div>
            )}
            {decryptedText && (
                <div className="text-decrypt-result">
                    <h5>Decrypted Text:</h5>
                    <p>{decryptedText}</p>
                    <button className='decrypt-button' onClick={handleDownload}>Download Decrypted Text</button>
                </div>
            )}
        </div>
    );
}

export default DecryptTextPage;
