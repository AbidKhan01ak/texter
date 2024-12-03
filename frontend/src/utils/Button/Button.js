import React from 'react';
import '../Button/Button.css';

const Button = ({ label, onClick, type = 'button', disabled = false }) => {
    return (
        <button
            className={`custom-button ${disabled ? 'disabled' : ''}`}
            onClick={onClick}
            type={type}
            disabled={disabled}
        >
            <span className="button-label">{label}</span>
        </button>
    );
};

export default Button;
