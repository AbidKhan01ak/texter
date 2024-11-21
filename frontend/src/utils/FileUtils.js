// src/utils/fileUtils.js

/**
 * Generates a timestamped file name with the given prefix and extension.
 * @param {string} prefix - The prefix for the file name.
 * @param {string} extension - The file extension.
 * @returns {string} - The generated file name.
 */
export const getFileName = (prefix, extension) => {
    const timeStamp = new Date().toISOString().replace(/[-:.]/g, '');
    return `${prefix}-${timeStamp}.${extension}`;
};

/**
 * Saves text content as a .txt file.
 * @param {string} content - The text content to save.
 * @param {string} prefix - The prefix for the file name.
 */
export const saveAsTxt = (content, prefix) => {
    const fileName = getFileName(prefix, 'txt');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
};
