import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './auth/Login/LoginPage';
import SignupPage from './auth/Signup/SignupPage';

import TextOperations from './components/HomePage/TextOperations';

import NavBar from './utils/NavBar/NavBar';

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
function App() {

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const token = localStorage.getItem('refreshToken'); // Save refreshToken when logging in
        const response = await fetch('http://localhost:5000/auth/refresh', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.access_token);
          console.log("token fetched");
        } else {
          console.error('Failed to refresh token:', response.statusText);
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    };

    // Call refreshToken periodically or just before token expiration
    const interval = setInterval(refreshToken, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const scrollToOperations = () => {
    const section = document.querySelector('.operation-cards');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const scrollToHeader = () => {
    const footer = document.querySelector('header');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <Router>
      <NavBar scrollToOperations={scrollToOperations} scrollToFooter={scrollToFooter} scrollToHeader={scrollToHeader} />
      <Routes>
        <Route path="/" element={<TextOperations />} />
        <Route path="/features" element={<TextOperations />} />
        <Route path="/contact" element={<TextOperations />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path="/case-converter" element={<CaseConverterPage />} />
        <Route path="/change-font" element={<ChangeFontPage />} />
        <Route path="/text-to-image" element={<TextToImagePage />} />
        <Route path="/text-to-word" element={<TextToWordPage />} />
        <Route path="/password-generator" element={<PasswordGeneratorPage />} />
        <Route path="/whitespace-remover" element={<WhitespaceRemoverPage />} />
        <Route path="/counter-analyzer" element={<CounterAnalyzer />} />
        <Route path="/bionic-reading" element={<BionicReadingPage />} />
        <Route path="/text-to-audio" element={<TextToAudioPage />} />
        <Route path="/text-encrypter" element={<EncryptTextPage />} />
        <Route path="/text-decrypter" element={<DecryptTextPage />} />
        <Route path="/summary-generate" element={<SummaryGeneratorPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
