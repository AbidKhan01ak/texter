import React, { forwardRef } from 'react';
import '../Header/Header.css';
import HeaderGradient from '../../utils/HeaderGradient/HeaderGradient';

const Header = forwardRef((props, ref) => {
    return (
        <HeaderGradient>
            <header className="header">
                <div className="header-content">
                    <h1>texTer</h1>
                    <div className="logo-placeholder">
                        <img src="/assets/appLogo/appLogo.svg" alt="Logo" />
                    </div>
                </div>
                <p className="header-intro">
                    texTer is your go-to tool for a range of text operations, from conversion and formatting to analysis
                    and generation. Transform and enhance your text with ease.
                </p>
                <p className="header-catchphrase">"Unleash the power of words with texTer."</p>
            </header>
        </HeaderGradient>
    );
});

export default Header;
