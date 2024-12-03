import React, { useRef, useEffect } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import OperationCard from '../OperationCard';
import '../HomePage/TextOperations.css'

function TextOperations() {
    const operationsRef = useRef(null);
    const headerRef = useRef(null);
    const footerRef = useRef(null);

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        if (headerRef.current && operationsRef.current && footerRef.current) {
            scrollToSection(headerRef);
            scrollToSection(operationsRef);
            scrollToSection(footerRef);
        }
    }, [])
    const operationsLogoPath = "/assets/operationsLogo/"
    const operations = [
        { name: "Case Converter", image: `${operationsLogoPath}caseConvertor.svg`, path: "/case-converter" },
        { name: "Change Font", image: `${operationsLogoPath}fontChanger.svg`, path: "/change-font" },
        { name: "Counter Analyzer", image: `${operationsLogoPath}CounterAnalyzer.svg`, path: "/counter-analyzer" },
        { name: "Generate Password", image: `${operationsLogoPath}passwordGenerator.svg`, path: "/password-generator" },
        { name: "Generate Summary", image: `${operationsLogoPath}summaryGenerator.svg`, path: "/summary-generate" },
        { name: "Remove Whitespace", image: `${operationsLogoPath}whitespaceRemover.svg`, path: "/whitespace-remover" },
        { name: "Encrypt Text", image: `${operationsLogoPath}textEncrypter.svg`, path: "/text-encrypter" },
        { name: "Decrypt Text", image: `${operationsLogoPath}textDecrypter.svg`, path: "/text-decrypter" },
        { name: "Bionic Reading", image: `${operationsLogoPath}bionicReading.svg`, path: "/bionic-reading" },
        { name: "Text to Word", image: `${operationsLogoPath}textToWord.svg`, path: "/text-to-word" },
        { name: "Text to Audio", image: `${operationsLogoPath}textToAudio.svg`, path: "/text-to-audio" },
        { name: "Text to Image", image: `${operationsLogoPath}textToImage.svg`, path: "/text-to-image" },
        // Add other operations here
    ];

    return (
        <div className="text-operations-home">
            <Header ref={headerRef} />
            <div ref={operationsRef} className="operation-cards">
                {operations.map((op, index) => (
                    <OperationCard key={index} name={op.name} image={op.image} path={op.path} />
                ))}
            </div>
            <Footer ref={footerRef} />
        </div>
    );
}

export default TextOperations;
