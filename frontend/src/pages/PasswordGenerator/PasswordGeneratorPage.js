import React, { useState, useEffect } from 'react';
import './PasswordGeneratorPage.css';
import PasswordHistoryTable from '../../utils/PasswordHistoryTable';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty, minLength } from '../../validation/validation';

function PasswordGeneratorPage() {
    const [inputText, setInputText] = useState('');
    const [length, setLength] = useState(12); // Default length
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [passwordHistory, setPasswordHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        logAction("Opened Password Generator Page");
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoadingHistory(true);
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/text/password-history', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setPasswordHistory(data);
                    setLoadingHistory(false);
                }
            } catch (error) {
                console.error('Error fetching password history:', error);
            } finally {
                setLoadingHistory(false);
            }
        };

        if (showHistory) {
            fetchHistory();
        }
    }, [showHistory]);

    const handleGeneratePassword = async () => {

        const isValid = validateInput({
            value: inputText,
            validations: [isNotEmpty],
            setErrorMessage,
        });

        const isLengthValid = validateInput({
            value: length,
            validations: [minLength(2)],
            setErrorMessage,
        });

        if (!isValid || !isLengthValid) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/text/password-generator', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ inputText, length }),
            });

            if (response.ok) {
                const data = await response.json();
                setGeneratedPassword(data.password);
                setPasswordHistory([...passwordHistory, { generated_at: new Date().toLocaleString(), password: data.password }]);
                logAction("Generated Password");
            } else {
                console.error('Failed to generate password from the server.');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="password-generator-operation-page">
            <h2>Password Generator</h2>
            <label>
                Enter Text:
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter base text for password"
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </label>
            <label>
                Password Length:
                <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(parseInt(e.target.value, 10))}
                    min="1"
                />
            </label>
            <button className='password-generate-button' onClick={handleGeneratePassword} disabled={loading}>{loading ? <LoadingSpinner /> : 'Generate Password'}</button>
            <div className="password-generator-result">{generatedPassword}</div>

            <button className='password-generate-button' onClick={() => setShowHistory(!showHistory)} disabled={loadingHistory}>
                {loadingHistory ? <LoadingSpinner /> : showHistory ? 'Hide History' : 'Show History'}
            </button>

            {showHistory && (
                <div className="history">
                    <h3>Password History</h3>
                    <PasswordHistoryTable className="history-table" passwordHistory={passwordHistory} />
                </div>
            )}
        </div>
    );
}

export default PasswordGeneratorPage;
