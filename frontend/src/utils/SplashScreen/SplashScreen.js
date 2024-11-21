import React, { useEffect } from 'react';
import '../SplashScreen/SplashScreen.css';

function SplashScreen() {
    useEffect(() => {
        // Effect to handle any animation side effects if needed
    }, []);

    return (
        <div className="splash-screen">
            <h1 className="splash-text">Welcome!</h1>
            <p className='splash-message'>Great to have you onboard!</p>
        </div>
    );
}

export default SplashScreen;
