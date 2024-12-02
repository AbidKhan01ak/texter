import React from 'react';
import './HeaderGradient.css';

const HeaderGradient = ({ children }) => {
    return (
        <div className="gradient-wrapper">
            <div className="gradient"></div>
            <div className="content">{children}</div>
        </div>
    );
};

export default HeaderGradient;
