// pages/CaseConverterPage.js
import React, { useReducer, useEffect } from 'react';
import SplitButton from '../../utils/SplitButton/SplitButton';
import TextInput from "../../utils/TextInput";
import { getFileName, saveAsTxt } from '../../utils/FileUtils';
import jsPDF from 'jspdf';
import '../CaseConvertor/CaseConverterPage.css';
import LoadingSpinner from "../../utils/LoadingSpinner/LoadingSpinner"
import { logAction } from '../../utils/logAction';
import { validateInput, isNotEmpty } from '../../validation/validation';
import Popup from '../../utils/Popup/Popup';

const initialState = {
    text: '',
    convertedText: '',
    selectedOption: 0,
    loading: false,
    txtSave: false,
    pdfSave: false,
    resultLoading: false,
    popupMessage: '',
    popupType: 'success',
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_TEXT':
            return { ...state, text: action.payload };
        case 'SET_CONVERTED_TEXT':
            return { ...state, convertedText: action.payload };
        case 'SET_SELECTED_OPTION':
            return { ...state, selectedOption: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_TXT_SAVE':
            return { ...state, txtSave: action.payload };
        case 'SET_PDF_SAVE':
            return { ...state, pdfSave: action.payload };
        case 'SET_RESULT_LOADING':
            return { ...state, resultLoading: action.payload };
        case 'SET_POPUP':
            return { ...state, popupMessage: action.payload.message, popupType: action.payload.type };
        default:
            return state;
    }
};
function CaseConverterPage() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const options = ['UPPERCASE', 'lowercase', 'Capitalize Each Word'];

    useEffect(() => {
        logAction("Opened Case Convertor Page");
    }, []);

    const handleConvertText = async () => {
        const isValid = validateInput({
            value: state.text,
            validations: [isNotEmpty],
            onValidationFail: (error) => {
                dispatch({ type: 'SET_POPUP', payload: { message: error, type: 'error' } });
            },
        });

        if (!isValid) return;

        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'SET_RESULT_LOADING', payload: true });

            const response = await fetch('http://localhost:5000/text/case-convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: state.text,
                    conversionType: options[state.selectedOption]
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const cleanText = data.convertedText.replace(/<\/?pre>/g, '');
                dispatch({ type: 'SET_CONVERTED_TEXT', payload: cleanText });
                logAction("Case conversion operation performed");
                dispatch({ type: 'SET_POPUP', payload: { message: 'Text successfully converted!', type: 'success' } });
            } else {
                dispatch({ type: 'SET_POPUP', payload: { message: 'Failed to convert text. Please try again.', type: 'error' } });
            }
        } catch (error) {
            dispatch({ type: 'SET_POPUP', payload: { message: 'An error occurred. Please try again.', type: 'error' } });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
            dispatch({ type: 'SET_RESULT_LOADING', payload: false });
        }
    };

    //save as Text
    const saveText = () => {
        dispatch({ type: 'SET_TXT_SAVE', payload: true });
        setTimeout(() => {
            saveAsTxt(state.convertedText, 'texter.io-case-convertor')
            logAction("Saved as Text from Case Convertor Page");
            dispatch({ type: 'SET_TXT_SAVE', payload: false });
            dispatch({ type: 'SET_POPUP', payload: { message: 'Text saved as TXT successfully!', type: 'success' } });
        }, 1000);

    }

    // Save as PDF
    const saveAsPdf = () => {
        dispatch({ type: 'SET_PDF_SAVE', payload: true });
        setTimeout(() => {
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 15;
            const textWidth = pageWidth - 2 * margin;
            const lineHeight = 10; // Adjust for spacing between lines

            // Split text into lines that fit within the text width
            const wrappedText = pdf.splitTextToSize(state.convertedText, textWidth);

            // Add text line by line, handling page overflow
            let y = margin;
            wrappedText.forEach((line, index) => {
                if (y + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
                    pdf.addPage(); // Add new page if line exceeds page height
                    y = margin; // Reset y to top of new page
                }
                pdf.text(line, margin, y);
                y += lineHeight;
            });

            pdf.save(getFileName('texter.io-case-convertor', 'pdf'));
            logAction("Saved PDF from Case Convertor Page");
            dispatch({ type: 'SET_PDF_SAVE', payload: false });
            dispatch({ type: 'SET_POPUP', payload: { message: 'PDF saved successfully!', type: 'success' } });
        }, 1000);

    };

    return (
        <div className="case-convertor-operation-page">
            <h2>Case Converter</h2>
            <TextInput
                value={state.text}
                onChange={(e) => dispatch({ type: 'SET_TEXT', payload: e.target.value })}
                placeholder="Enter text to convert case"
            />
            <SplitButton
                options={options}
                selectedOption={state.selectedOption}
                setSelectedOption={(index) => dispatch({ type: 'SET_SELECTED_OPTION', payload: index })}
            />
            <button className='case-convertor-button' onClick={handleConvertText} disabled={state.loading}>{state.loading ? <LoadingSpinner /> : 'Convert Text'}
            </button>

            <div className="case-convertor-result" disabled={state.resultLoading}>{state.resultLoading ? <LoadingSpinner /> : state.convertedText}</div>

            <div className="save-buttons">
                <button className='case-convertor-button' onClick={saveText} disabled={state.txtSave || state.loading || state.resultLoading || !state.convertedText.trim()}>{state.txtSave ? <LoadingSpinner /> : 'Save as TXT'}</button>
                <button className='case-convertor-button' onClick={saveAsPdf} disabled={state.pdfSave || state.loading || state.resultLoading || !state.convertedText.trim()}>{state.pdfSave ? <LoadingSpinner /> : 'Save as PDF'}</button>
            </div>
            {/* Add the Popup component here */}
            <Popup
                message={state.popupMessage}
                type={state.popupType}
                onClose={() =>
                    dispatch({ type: 'SET_POPUP', payload: { message: '', type: 'success' } })
                }
            />
        </div>
    );
}

export default CaseConverterPage;
