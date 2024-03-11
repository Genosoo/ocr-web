import { useState } from 'react';
import axios from 'axios';
import "./App.css"

const apiKey = import.meta.env.VITE_APIKEY;

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [generatedText, setGeneratedText] = useState("");
  const [fieldData, setFieldData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sex, setSex] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [address, setAddress] = useState("");


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const extractInfoFromText = (text) => {
    let nameRegex = /(?:Last Name: )?(\w+),\s*(\w+)\s*(\w+)?/;
    let dateRegex = /\b\d{4}\/\d{2}\/\d{2}\b/;
    let sexRegex = /\b[M|F]\b/;
    let licenseRegex = /\bN\d{2}-\d{2}-\d{6}\b/;
    let addressRegex = /^(?!.*REPUBLIC\sOF\sTHE\sPHILIPPINES).*?(\b[A-Za-z0-9\s-.,Å]+\b)/ ;


    let nameMatch = text.match(nameRegex);
    let dateMatch = text.match(dateRegex);
    let sexMatch = text.match(sexRegex);
    let licenseMatch = text.match(licenseRegex);
    let addressMatch = text.match(addressRegex);

    let firstName = nameMatch ? nameMatch[2] : 'None';
    let middleName = nameMatch ? nameMatch[3] || 'None' : 'None';
    let lastName = nameMatch ? nameMatch[1] : 'None';
    let birthDate = dateMatch ? dateMatch[0] : 'None';
    let sex = sexMatch ? sexMatch[0] : 'None';
    let licenseNo = licenseMatch ? licenseMatch[0] : 'None';
    let address = addressMatch ? addressMatch[0] : 'None';

    return { firstName, middleName, lastName, birthDate, sex, licenseNo, address };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('file', file);
    form.append('language', 'eng');
    form.append('IsCreateSearchablePDF', 'true');
    form.append('isSearchablePdfHideTextLayer', 'false');
    form.append('apikey', apiKey);

    try {
      const response = await axios.post(
        'https://api.ocr.space/parse/image',
        form,
        {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
          },
        }
      );

      console.log(response.data);

      // Extract the generated text from the OCR response
      const generatedText = response.data.ParsedResults.map(result => result.ParsedText).join('\n');
      setGeneratedText(generatedText);

      // Extract information using regex
      const { 
        firstName, 
        middleName, 
        lastName, 
        birthDate,
        sex, 
        licenseNo, 
        address
       } = extractInfoFromText(generatedText);

      setFirstName(firstName);
      setMiddleName(middleName);
      setLastName(lastName);
      setBirthDate(birthDate);
      setSex(sex);
      setLicenseNo(licenseNo);
      setAddress(address);
      // Set the field data
      const extractedFieldData = response.data.ParsedResults.map(result => result.TextOverlay.Lines.flatMap(line => line.Words.map(word => word.WordText)));
      setFieldData(extractedFieldData);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Image Upload</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      <div>
        <p>Generated Text:</p>
        <p>{generatedText}</p>
      </div>

      <div>
        <p>First Name: {firstName}</p>
        <p>Middle Name: {middleName}</p>
        <p>Last Name: {lastName}</p>
        <p>Birth Date: {birthDate}</p>
        <p>Sex: {sex}</p>
        <p>License No: {licenseNo}</p>
        <p>Address: {address}</p>
      </div>

      <div>
        <p>Field Data:</p>
        <ul>
          {fieldData.map((line, lineIndex) => (
            <li key={lineIndex}>
              {line.map((word, wordIndex) => (
                <input key={wordIndex} type="text" value={word} readOnly />
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;
