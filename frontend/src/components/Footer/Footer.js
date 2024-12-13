import React, { forwardRef } from 'react';
import '../Footer/Footer.css';




const Footer = forwardRef((props, ref) => {

    return (
        <footer ref={ref} className="footer">
            <div className="footer-data">
                <p className="developer-name">
                    © Developed by <span>Ak S</span>tudios
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
        </footer>
    );
});

export default Footer;
