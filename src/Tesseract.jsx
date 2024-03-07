import { useState } from 'react';
import Tesseract from 'tesseract.js';

const OCRComponent = () => {
  const [ocrResult, setOCRResult] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const performOCR = async (image) => {
    const { data: { text } } = await Tesseract.recognize(
      image,
      'eng',
      { logger: m => console.log(m) }
    );
    setOCRResult(text);
    extractNames(text);
  };

  const extractNames = (text) => {
    // Regular expressions to match patterns for first name and last name
    const firstNameRegex = /\b(?:first\s*name|given\s*name)\s*:\s*([^\n]+)/gi;
    const lastNameRegex = /\b(?:last\s*name|surname)\s*:\s*([^\n]+)/gi;

    const firstNameMatch = text.match(firstNameRegex);
    const lastNameMatch = text.match(lastNameRegex);

    // Extracting first name
    if (firstNameMatch && firstNameMatch.length > 0) {
      const firstNameText = firstNameMatch[0].replace(firstNameRegex, '$1');
      setFirstName(firstNameText);
    } else {
      setFirstName('First name not found.');
    }

    // Extracting last name
    if (lastNameMatch && lastNameMatch.length > 0) {
      const lastNameText = lastNameMatch[0].replace(lastNameRegex, '$1');
      setLastName(lastNameText);
    } else {
      setLastName('Last name not found.');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        performOCR(img);
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {ocrResult && (
        <div>
          <h2>OCR Result:</h2>
          <pre>{ocrResult}</pre>
        </div>
      )}
      <div>
        <h2>First Name:</h2>
        <p>{firstName}</p>
      </div>
      <div>
        <h2>Last Name:</h2>
        <p>{lastName}</p>
      </div>
    </div>
  );
};

export default OCRComponent;
