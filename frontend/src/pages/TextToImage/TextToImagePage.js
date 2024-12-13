import React, { useState, useEffect } from 'react';
import './TextToImagePage.css';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';
import MediaSkeleton from '../../utils/MediaSkeleton/MediaSkeleton';
import { getFileName } from '../../utils/FileUtils'; // Import the utility function
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty } from '../../validation/validation';

function TextToImagePage() {
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); // State for modal
    const [modalOpen, setModalOpen] = useState(false); // State for modal visibility

    useEffect(() => {
        logAction("Opened Text To Image Page")
    }, []);

    const handleTextToImage = async () => {
        const isValid = validateInput({
            value: text,
            validations: [isNotEmpty],
            setErrorMessage, // Set error message if validation fails
        });

        if (!isValid) return;

        if (!text.trim()) return;

        setLoading(true);
        setError(null);
        // setImages([]); // Clear previous images while new ones load
        try {
            const response = await fetch('http://localhost:5000/text/text-to-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, numImages: 6 }), // Request 6 images
            });

            if (response.ok) {
                const data = await response.json();
                setImages(data.images);
                logAction("Images Generated")
            } else {
                setError('Failed to fetch images from the server.');
            }
        } catch (error) {
            setError('Error fetching data from server');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (src) => {
        setSelectedImage(src);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedImage(null);
        setModalOpen(false);
    };

    const saveImageToLocal = () => {
        const fileName = getFileName('text-to-image', 'jpg');
        const link = document.createElement('a');
        link.href = selectedImage; // Use the direct image URL
        link.download = fileName; // Force `.jpg` extension
        document.body.appendChild(link);
        link.click(); // Trigger download
        document.body.removeChild(link);
        logAction("Image donwloaded to Local")
    };




    return (
        <div className="tti-operation-page">
            <h2>Text to Image</h2>
            <p>Turn your <strong>text descriptions</strong> into stunning <strong>images</strong>. Simply type your text and let Texter generate multiple images for you to choose from.</p>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to convert to images"
                className="text-input"
            />
            <p>Image Generation may take some time, please wait</p>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button onClick={handleTextToImage} disabled={loading} className="generate-button">
                {loading ? <LoadingSpinner /> : 'Generate Images'}
            </button>

            {error && <div className="error">{error}</div>}

            <div className="image-grid">
                {loading
                    ? Array.from({ length: 6 }).map((_, index) => (
                        <MediaSkeleton key={index} loading />
                    ))
                    : images.map((src, index) => (
                        <div key={index} onClick={() => openModal(src)} className="clickable-image">
                            <MediaSkeleton
                                loading={false}
                                image={{
                                    src,
                                    alt: `Generated ${index + 1}`,
                                }}
                            />
                        </div>
                    ))}
            </div>

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <img src={selectedImage} alt="Generated Preview" className="modal-image" />
                        <button onClick={saveImageToLocal} className="save-button">Save</button>
                        <button onClick={closeModal} className="close-button">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TextToImagePage;
