//frontend/src/EncryptTextPage.js

import React, { useState, useEffect } from 'react';
import '../EncryptText/EncryptTextPage.css';
import TextInput from '../../utils/TextInput';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty, minLength } from '../../validation/validation';
function EncryptTextPage() {
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        logAction("Opened Text Encrypter Page");
    }, [])
    const handleEncrypt = async () => {
        const isValid = validateInput({
            value: inputText,
            validations: [isNotEmpty, minLength(5)],
            setErrorMessage,
        });

        if (!isValid) return;

        setLoading(true);
        setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:5000/text/encrypt-text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: inputText }),
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'texter-io-encrypted.txt';
                    document.body.appendChild(a);
                    a.click();
                    setDownloaded(true);
                    setTimeout(() => setDownloaded(false), 3000);
                    logAction("Text Encrypter Done, file saved");
                } else {
                    console.error('Error during encryption:', response.statusText);
                }
            } catch (error) {
                console.error('Error during encryption:', error);
            } finally {
                setLoading(false);
            }
        }, 500);
    };


    return (
        <div className="encrypt-text-operation-page">
            <h2>Encrypt Text</h2>
            <p>Encrypt your text <strong>securely</strong> with Texter and download the encrypted result!</p>

            <TextInput
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to encrypt"
                className="encrypt-text-input"
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={handleEncrypt} className='encrypted-button'>{loading ? <LoadingSpinner /> : 'Encrypt'}</button>
            {downloaded && <p className="download-message">Your text is now encrypted!</p>}
        </div>
    );
}

export default EncryptTextPage;
