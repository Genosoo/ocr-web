/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';

function ImageUploader() {
  const [result, setResult] = useState([]);

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadImages = async () => {
    try {
      const frontImage = document.getElementById('front-image').files[0];

      const frontBase64 = await convertImageToBase64(frontImage);

      const data = {
        documents: [frontBase64]
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'ApiKey genolauzureta@gmail.com:585106b0-16e3-4a2f-95ad-a4c0b86fef6a',
      };

      const response = await axios.post('https://base64.ai/api/scan', data, { headers });
      setResult(response.data);
      console.log(response.data[0])
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div>
        <input type="file" id="front-image" accept="image/*" />
      </div>
   
      <button onClick={uploadImages}>Upload Images</button>
  
    </div>
  );
}

export default ImageUploader;
