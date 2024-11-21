import React, { forwardRef, useState } from 'react';
import '../Footer/Footer.css';
import Button from '../../utils/Button/Button';

const Footer = forwardRef((props, ref) => {
    const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeedback({ ...feedback, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Feedback submitted:', feedback);
        // Add any additional handling here
    };

    return (
        <footer ref={ref} className="footer">
            <div className="footer-left">
                <p className="developer-name">Developed by <span>Ak S</span>tudios</p>
                <p className="info">
                    Explore the power of words with texTer – enhancing and customizing your text effortlessly.
                </p>

                <p className="portfolio-link"><a href='https://www.google.com'>Visit my Portfolio <span>here!</span><img src='/assets/SocialLogo/Link.svg' alt='Portfolio' /></a></p>
                <div className="social-icons">
                    <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="icon-link">
                        <img src='/assets/socialLogo/github.svg' alt='GitHub' />
                    </a>
                    <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="icon-link">
                        <img src='/assets/socialLogo/linkedin.svg' alt='LinkedIn' />
                    </a>
                </div>
            </div>
            <div className="footer-right">
                <form className="feedback-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={feedback.name}
                        onChange={handleChange}
                        className="feedback-input"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={feedback.email}
                        onChange={handleChange}
                        className="feedback-input"
                    />
                    <textarea
                        name="message"
                        placeholder="Your Feedback"
                        value={feedback.message}
                        onChange={handleChange}
                        className="feedback-textArea"
                    />
                    <Button label="Submit Feedback" onClick={handleSubmit} />
                </form>
            </div>
        </footer>
    );
});

export default Footer;
