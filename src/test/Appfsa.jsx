/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [base64Image, setBase64Image] = useState('');
  const [ocrResult, setOcrResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idType, setIdType] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setBase64Image(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const extractNames = (text) => {
    const regex = /([A-Z]+)\s*,\s*([A-Z]+)/;
    const match = regex.exec(text);
    if (match && match.length === 3) {
      return { firstName: match[1], lastName: match[2] };
    }
    return { firstName: '', lastName: '' };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3000/api/ocr/${idType}`, { base64Image });
      const ocrText = response.data.ParsedResults[0].ParsedText;
      setOcrResult(ocrText);
      const { firstName, lastName } = extractNames(ocrText);
      setFirstName(firstName);
      setLastName(lastName);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>OCR App</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <label>Select ID Type:</label>
          <select value={idType} onChange={(e) => setIdType(e.target.value)}>
            <option value="">Select ID Type</option>
            <option value="passport">Passport</option>
            <option value="driver_license">Driver's License</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <button type="submit" disabled={loading || !base64Image || !idType}>Submit</button>
      </form>
      {loading && <p>Loading...</p>}
      {ocrResult && <div>
        <h2>OCR Result:</h2>
        <p>{ocrResult}</p>
      </div>}
      {firstName && (
        <div>
          <h2>First Name:</h2>
          <p>{firstName}</p>
        </div>
      )}
      {lastName && (
        <div>
          <h2>Last Name:</h2>
          <p>{lastName}</p>
        </div>
      )}
    </div>
  );
}

export default App;
