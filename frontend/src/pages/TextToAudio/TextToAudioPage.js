import React, { useState, useEffect } from 'react';
import TextInput from '../../utils/TextInput';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';
import SplitButton from '../../utils/SplitButton/SplitButton';
import './TextToAudioPage.css';
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty } from '../../validation/validation';

function TextToAudioPage() {
    const [text, setText] = useState('');
    const [audioSrc, setAudioSrc] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        logAction("Opened Text to Audio Convertor Page");
    }, []);
    // State for voice options
    const [voice, setVoice] = useState(0);
    const voiceOptions = ['Male', 'Female'];

    const handleTextToAudio = async () => {
        const isValid = validateInput({
            value: text,
            validations: [isNotEmpty],
            setErrorMessage: setError,
        });
        if (!isValid) return;

        setLoading(true);
        setAudioSrc('');
        try {

            const response = await fetch('http://localhost:5000/text/text-to-audio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    voice: voiceOptions[voice].toLowerCase()
                }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setTimeout(() => {
                    setAudioSrc(url);
                    setLoading(false);
                }, 1000);
                logAction("Text converted to Audio");
            } else {
                console.error('Failed to convert text to audio.', response.status);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
        }
    };

    return (
        <div className="tta-operation-page">
            <h2>Text to Audio</h2>
            <p>Transform your written text into high-quality <strong>audio speech</strong> with just one click.</p>
            <TextInput
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert to audio"
            />
            {error && <p className="error-message">{error}</p>}
            <div className="audio-options">
                <SplitButton
                    options={voiceOptions}
                    selectedOption={voice}
                    setSelectedOption={setVoice}
                />
            </div>
            <button className='tta-button' onClick={handleTextToAudio} disabled={loading}>
                {loading ? <LoadingSpinner /> : 'Convert to Audio'}
            </button>
            {audioSrc && (
                <>
                    <audio controls src={audioSrc}></audio>
                    <a className='tta-link' href={audioSrc} download="texter-io-audio-convertor.mp3">
                        Download Audio
                    </a>
                </>
            )}
        </div>
    );
}

export default TextToAudioPage;
