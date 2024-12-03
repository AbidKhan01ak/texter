import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Authentication Pages
import LoginPage from './auth/Login/LoginPage';
import SignupPage from './auth/Signup/SignupPage';

// Home and Navigation Components
import NavBar from './utils/NavBar/NavBar';
import TextOperations from './components/HomePage/TextOperations';

// Feature Pages
import CaseConverterPage from './pages/CaseConvertor/CaseConverterPage';
import ChangeFontPage from './pages/ChangeFont/ChangeFontPage';
import TextToImagePage from './pages/TextToImage/TextToImagePage';
import TextToWordPage from './pages/TextToWord/TextToWordPage';
import PasswordGeneratorPage from './pages/PasswordGenerator/PasswordGeneratorPage';
import WhitespaceRemoverPage from './pages/WhitespaceRemover/WhitespaceRemoverPage';
import CounterAnalyzer from './pages/CounterAnalyzer/CounterAnalyzerPage';
import BionicReadingPage from './pages/BionicReading/BionicReadingPage';
import TextToAudioPage from './pages/TextToAudio/TextToAudioPage';
import EncryptTextPage from './pages/EncryptText/EncryptTextPage';
import DecryptTextPage from './pages/DecryptText/DecryptTextPage';
import SummaryGeneratorPage from './pages/SummaryGenerator/SummaryGeneratorPage';
import HistoryPage from './pages/HistoryPage/HistoryPage';


// Popup functionality
import Popup from './utils/Popup/Popup';

function App() {
  const [popup, setPopup] = useState({ message: '', type: '' });

  // Function to show the popup
  const showPopup = (message, type) => {
    setPopup({ message, type });
  };

  // Function to hide the popup
  const closePopup = () => {
    setPopup({ message: '', type: '' });
  };

  /**
   * Refreshes the access token periodically.
   */
  useEffect(() => {
    const refreshToken = async () => {
      const token = localStorage.getItem('refreshToken'); // Retrieve refresh token
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/auth/refresh', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.access_token);
          console.log('Token refreshed successfully');
        } else {
          console.error('Failed to refresh token:', response.statusText);
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    };

    // Refresh token every 5 minutes
    const interval = setInterval(refreshToken, 5 * 60 * 1000);
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  /**
   * Scroll to specific sections of the page.
   */
  const scrollToSection = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Router>
      <NavBar
        scrollToOperations={() => scrollToSection('.operation-cards')}
        scrollToFooter={() => scrollToSection('footer')}
        scrollToHeader={() => scrollToSection('header')}
      />
      <Routes>
        {/* Home and Navigation Routes */}
        <Route path="/" element={<TextOperations />} />
        <Route path="/features" element={<TextOperations />} />
        <Route path="/contact" element={<TextOperations />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage showPopup={showPopup} />} />
        <Route path="/signup" element={<SignupPage showPopup={showPopup} />} />

        {/* Feature Routes */}
        <Route path="/case-converter" element={<CaseConverterPage showPopup={showPopup} />} />
        <Route path="/change-font" element={<ChangeFontPage showPopup={showPopup} />} />
        <Route path="/text-to-image" element={<TextToImagePage showPopup={showPopup} />} />
        <Route path="/text-to-word" element={<TextToWordPage showPopup={showPopup} />} />
        <Route path="/password-generator" element={<PasswordGeneratorPage showPopup={showPopup} />} />
        <Route path="/whitespace-remover" element={<WhitespaceRemoverPage showPopup={showPopup} />} />
        <Route path="/counter-analyzer" element={<CounterAnalyzer showPopup={showPopup} />} />
        <Route path="/bionic-reading" element={<BionicReadingPage showPopup={showPopup} />} />
        <Route path="/text-to-audio" element={<TextToAudioPage showPopup={showPopup} />} />
        <Route path="/text-encrypter" element={<EncryptTextPage showPopup={showPopup} />} />
        <Route path="/text-decrypter" element={<DecryptTextPage showPopup={showPopup} />} />
        <Route path="/summary-generate" element={<SummaryGeneratorPage showPopup={showPopup} />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      {/* Popup Component */}
      {popup.message && (
        <Popup message={popup.message} type={popup.type} onClose={closePopup} />
      )}
    </Router>
  );
}

export default App;
