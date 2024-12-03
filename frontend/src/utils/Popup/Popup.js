import React, { useEffect } from 'react';
import './Popup.css';

const Popup = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000); // Close after 8 seconds
        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, [onClose]);

    if (!message) return null; // Don't render if no message

    return (
        <div className={`popup ${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="popup-close">✖</button>
        </div>
    );
};

export default Popup;
