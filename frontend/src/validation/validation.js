export const validateInput = ({ value, validations, setErrorMessage }) => {
    for (const validation of validations) {
        const error = validation(value);
        if (error) {
            setErrorMessage(error);
            setTimeout(() => {
                setErrorMessage(""); // Clear error after a short period
            }, 5000);
            return false;
        }
    }
    setErrorMessage(""); // Clear any previous error messages
    return true;
};

// Predefined validation rules
export const isNotEmpty = (value) =>
    !value.trim() ? "This field cannot be empty." : null;

export const minLength = (min) => (value) =>
    value.length < min ? `Must be at least ${min} characters.` : null;

export const maxLength = (max) => (value) =>
    value.length > max ? `Cannot exceed ${max} characters.` : null;

export const isEmail = (value) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email address." : null;

export const isFileValid = (file) => {
    if (!file) return "No file selected.";
    const allowedTypes = ['text/plain']; // Add more MIME types if needed
    const maxSize = 5 * 1024 * 1024; // 5MB size limit

    if (!allowedTypes.includes(file.type)) {
        return "Invalid file type. Only .txt files are allowed.";
    }

    if (file.size > maxSize) {
        return "File size exceeds the 5MB limit.";
    }

    return null; // No error
};
