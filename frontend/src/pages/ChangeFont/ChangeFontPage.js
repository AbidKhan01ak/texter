import React, { useReducer, useEffect } from 'react';
import TextInput from '../../utils/TextInput';
import SplitButton from '../../utils/SplitButton/SplitButton';
import { getFileName } from '../../utils/FileUtils';
import jsPDF from 'jspdf';
import debounce from 'lodash.debounce';
import LoadingSpinner from '../../utils/LoadingSpinner/LoadingSpinner';
import './ChangeFontPage.css';
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty } from '../../validation/validation';
import Popup from '../../utils/Popup/Popup';

const initialState = {
    text: '',
    selectedOption: 0,
    styledText: '',
    loading: false,
    resultLoading: false,
    popup: { message: '', type: '' },
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_TEXT':
            return { ...state, text: action.payload };
        case 'SET_SELECTED_OPTION':
            return { ...state, selectedOption: action.payload };
        case 'SET_STYLED_TEXT':
            return { ...state, styledText: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_RESULT_LOADING':
            return { ...state, resultLoading: action.payload };
        case 'SET_POPUP':
            return { ...state, popup: action.payload };
        default:
            return state;
    }
};

function ChangeFontPage() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { text, selectedOption, styledText, loading, resultLoading, popup } = state;
    const fontOptions = [
        'Arial', 'Roboto', 'Poppins', 'Lobster', 'Georgia', 'Times New Roman',
        'Montserrat', 'Playfair Display', 'Noto Sans', 'Oswald'
    ];
    const fontStyle = fontOptions[selectedOption];
    useEffect(() => {
        logAction("Opened Font Changer Page");
    }, []);

    useEffect(() => {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontStyle.replace(/ /g, '+')}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, [fontStyle]);

    // Debounce text and fontStyle changes
    useEffect(() => {
        if (!text.trim()) return;
        dispatch({ type: 'SET_RESULT_LOADING', payload: true });
        const fetchStyledText = debounce(async () => {
            try {
                const response = await fetch('http://localhost:5000/text/change-font', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, fontStyle }),
                });
                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: 'SET_STYLED_TEXT', payload: data.styledText });
                    logAction("Font styled Applied");
                    dispatch({ type: 'SET_POPUP', payload: { message: 'Font styled applied successfully!', type: 'success' } });
                } else {
                    dispatch({ type: 'SET_POPUP', payload: { message: 'Failed to fetch styled text from the server.', type: 'error' } });
                }
            } catch (error) {
                dispatch({ type: 'SET_POPUP', payload: { message: 'Error occurred while fetching styled text.', type: 'error' } });
            } finally {
                dispatch({ type: 'SET_RESULT_LOADING', payload: false });
            }
        }, 1000);

        fetchStyledText();

        // Cleanup debounce function on unmount or dependency change
        return () => fetchStyledText.cancel();
    }, [text, fontStyle]);

    const saveAsPdf = async () => {
        const isValid = validateInput({
            value: text,
            validations: [isNotEmpty],
            onValidationFail: (error) => {
                dispatch({ type: 'SET_POPUP', payload: { message: error, type: 'error' } });
            },
        });

        if (!isValid) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        setTimeout(async () => {
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const fontSize = 4.5;
            const lineHeight = fontSize * 1.2;
            const canvasWidth = pageWidth - 2 * margin;
            const canvasHeight = pageHeight - 2 * margin;

            const createStyledTextCanvas = (text, width, height, scale = 6) => {
                const canvas = document.createElement('canvas');
                canvas.width = width * scale;
                canvas.height = height * scale;
                const context = canvas.getContext('2d');
                context.scale(scale, scale);
                context.font = `${fontSize}px ${fontStyle}`;
                context.fillStyle = 'black';
                context.textBaseline = 'top';
                const lines = text.split('\n');
                lines.forEach((line, i) => {
                    context.fillText(line, 0, i * lineHeight);
                });
                return canvas;
            };

            const lines = pdf.splitTextToSize(styledText, canvasWidth);
            let currentHeight = 0;
            let pageContent = '';
            const pages = [];

            lines.forEach(line => {
                if (currentHeight + lineHeight > canvasHeight) {
                    pages.push(pageContent);
                    pageContent = '';
                    currentHeight = 0;
                }
                pageContent += line + '\n';
                currentHeight += lineHeight;
            });
            if (pageContent) pages.push(pageContent);

            for (let i = 0; i < pages.length; i++) {
                if (i > 0) pdf.addPage();
                const canvas = createStyledTextCanvas(pages[i], canvasWidth, canvasHeight);
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', margin, margin, canvasWidth, canvasHeight);
            }

            pdf.save(getFileName('texter.io-change-font', 'pdf'));
            dispatch({ type: 'SET_LOADING', payload: false });
            logAction("Saved PDF from Font Changer Page");
            dispatch({ type: 'SET_POPUP', payload: { message: 'PDF saved successfully!', type: 'success' } });
        }, 1000);
    };
    return (
        <div className="change-font-operation-page">
            <h2>Change Font</h2>
            <p>Transform your text with ease using Texter's Font Changer — <strong>change fonts</strong> in just a few clicks!</p>
            <TextInput
                value={text}
                onChange={(e) => dispatch({ type: 'SET_TEXT', payload: e.target.value })}
                placeholder="Enter text to apply font style"
            />
            <SplitButton
                options={fontOptions}
                selectedOption={selectedOption}
                setSelectedOption={(option) => dispatch({ type: 'SET_SELECTED_OPTION', payload: option })}
            />

            <div className="change-font-result"
                style={{ fontFamily: fontStyle }} disabled={resultLoading}>{resultLoading ? <LoadingSpinner /> : styledText}
            </div>

            <div className="change-font-save-buttons">
                <button className='change-font-button' onClick={saveAsPdf} disabled={loading}>{loading ?
                    <LoadingSpinner /> : 'Save as PDF'}
                </button>
            </div>
            {/* Render the Popup if there's a message */}
            <Popup message={popup.message} type={popup.type} onClose={() => dispatch({ type: 'SET_POPUP', payload: { message: '', type: '' } })} />
        </div>
    );
}

export default ChangeFontPage;
