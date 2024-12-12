import React, { forwardRef, useReducer } from 'react';
import '../Footer/Footer.css';
import Button from '../../utils/Button/Button';
import Popup from '../../utils/Popup/Popup';
import { validateInput, isNotEmpty, isEmail } from '../../validation/validation';

const initialState = {
    feedback: { name: '', email: '', message: '' },
    errors: { name: '', email: '', message: '' },
    popup: { message: '', type: '' },
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_FEEDBACK':
            return { ...state, feedback: { ...state.feedback, [action.field]: action.value } };
        case 'SET_ERROR':
            return { ...state, errors: { ...state.errors, [action.field]: action.error } };
        case 'CLEAR_FEEDBACK':
            return { ...state, feedback: { name: '', email: '', message: '' } };
        case 'CLEAR_ERRORS':
            return { ...state, errors: { name: '', email: '', message: '' } };
        case 'SET_POPUP':
            return { ...state, popup: { message: action.message, type: action.popupType } };
        case 'CLEAR_POPUP':
            return { ...state, popup: { message: '', type: '' } };
        default:
            return state;
    }
};

const Footer = forwardRef((props, ref) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: 'SET_FEEDBACK', field: name, value });
    };

    // Generic validation function
    const validateForm = () => {
        const fields = ['name', 'email', 'message'];
        let isValid = true;

        fields.forEach((field) => {
            let isFieldValid = validateInput({
                value: state.feedback[field],
                validations: field === 'email' ? [isNotEmpty, isEmail] : [isNotEmpty],
                setErrorMessage: (error) => dispatch({ type: 'SET_ERROR', field, error }),
            });
            if (!isFieldValid) isValid = false;
        });

        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: 'CLEAR_ERRORS' });

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('https://openformstack.com/f/cm4ksi6lq0000b3vpc7mk1e0n', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.feedback),
            });

            const data = await response.json();
            if (response.ok) {
                dispatch({ type: 'SET_POPUP', message: 'Feedback submitted successfully!', popupType: 'success' });
            } else {
                dispatch({ type: 'SET_POPUP', message: data.error || 'Failed to submit feedback', popupType: 'error' });
            }
        } catch (error) {
            dispatch({ type: 'SET_POPUP', message: 'Feedback submitted successfully!.', popupType: 'success' });
        }

        dispatch({ type: 'CLEAR_FEEDBACK' });
    };

    // Close popup
    const handlePopupClose = () => {
        dispatch({ type: 'CLEAR_POPUP' });
    };

    // Render error messages dynamically
    const renderError = (field) => {
        return state.errors[field] && <div className="footer-error">{state.errors[field]}</div>;
    };

    return (
        <footer ref={ref} className="footer">
            <div className="footer-left">
                <p className="developer-name">
                    Developed by <span>Ak S</span>tudios
                </p>
                <p className="info">
                    Explore the power of words with texTer – enhancing and customizing your text effortlessly.
                </p>
                <p className="portfolio-link">
                    <a href="https://www.google.com">
                        Visit my Portfolio <span>here!</span>
                        <img src="/assets/SocialLogo/Link.svg" alt="Portfolio" />
                    </a>
                </p>
                <div className="social-icons">
                    <a href="https://github.com/AbidKhan01ak" target="_blank" rel="noopener noreferrer" className="icon-link">
                        <img src="/assets/socialLogo/github.svg" alt="GitHub" />
                    </a>
                    <a href="https://linkedin.com/in/abid-khan-ak" target="_blank" rel="noopener noreferrer" className="icon-link">
                        <img src="/assets/socialLogo/linkedin.svg" alt="LinkedIn" />
                    </a>
                </div>
            </div>

            <div className="footer-right">
                <form className="feedback-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={state.feedback.name}
                        onChange={handleChange}
                        className="feedback-input"
                    />
                    {renderError('name')}
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={state.feedback.email}
                        onChange={handleChange}
                        className="feedback-input"
                    />
                    {renderError('email')}
                    <textarea
                        name="message"
                        placeholder="Your Feedback"
                        value={state.feedback.message}
                        onChange={handleChange}
                        className="feedback-textArea"
                    />
                    {renderError('message')}
                    <Button label="Submit Feedback" onClick={handleSubmit} />
                </form>
            </div>

            <Popup message={state.popup.message} type={state.popup.type} onClose={handlePopupClose} />
        </footer>
    );
});

export default Footer;
