/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { MdOutlineCheck } from "react-icons/md";
import './App.css'
import axios from 'axios'

const FormStepper = () => {
  const [step, setStep] = useState(1);
  const [idPhoto, setIdPhoto] = useState(null);
  const [selectedIdType, setSelectedIdType] = useState('philhealthID');
  const [fileImage, setFileImage] = useState(null)

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const isStepCompleted = (stepNumber) => {
    return step >= stepNumber;
  };


  const handleImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setFileImage(file)

    reader.onloadend = async () => {
      setIdPhoto(reader.result);
      console.log(reader.result)
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }


  const handleImageUpload = async () => {
  
      try {
        const formData = new FormData();
        formData.append('file', fileImage); // Use 'file' as the key

        // Construct the API endpoint URL with the id_type query parameter
        const apiUrl = `https://9131-122-3-167-3.ngrok-free.app/SubmitID?id_type=${selectedIdType}`;

        // Send a POST request to the constructed API endpoint URL with the FormData containing the image
        const response = await axios.post(apiUrl, formData);

        console.log(response.data); // Handle the response from the API as needed

        // Proceed to the next step after successful image upload
        nextStep();
      } catch (error) {
        console.error('Error uploading image:', error);
      }


   
  };



  return (
    <div className="form-container">
      <div className="stepper-wrapper">
        
       <div className='stepper-box-container'>
          <div className={`stepper-box ${isStepCompleted(1) ? 'active-line' : 'disable'}`}>
              <div className={`stepper-circle ${isStepCompleted(1) ? 'active-circle' : 'bg-white'}`}>
                {isStepCompleted(1) ? <MdOutlineCheck className="h-5 w-5" /> : 1}
              </div>
              <div className={`stepper-line ${step > 1 ? '' : 'bg-gray-300'}`}></div>
              
            </div>
            <div className='flex flex-col items-center  absolute -left-14 mt-3'>
               <p className="">Step 1</p>
               <p className="">Personal Information</p>
            </div>
       </div>


       <div className='stepper-box-container'>
        <div className={`stepper-box ${isStepCompleted(2) ? 'active-line' : 'disable'}`}>
          <div className={`stepper-circle ${isStepCompleted(2) ? 'active-circle' : 'bg-white'}`}>
            {isStepCompleted(2) ? <MdOutlineCheck className="h-5 w-5" /> : 2}
          </div>
          <div className={`stepper-line ${step > 2 ? '' : 'bg-gray-300'}`}></div>
        </div>
           <div className='flex flex-col items-center  absolute top-10  mt-2 -left-20 ml-2'>
               <p className="">Step 2</p>
               <p className="">Review Extracted Details</p>
            </div>
        </div>

        <div className='stepper-box-container'>
          <div className={`stepper-box ${isStepCompleted(3) ? 'active-line' : 'disable'}`}>
            <div className={`stepper-circle ${isStepCompleted(3) ? 'active-circle' : 'bg-white'}`}>
              {isStepCompleted(3) ? <MdOutlineCheck className="h-5 w-5" /> : 3}
            </div>
          </div>
          <div className='flex flex-col items-center  absolute top-10  mt-2 -left-8'>
               <p className="">Step 3</p>
               <p className="">Confirmation</p>
            </div>
        </div>
      
      </div>


      <div className="page-container">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Capture/Upload ID Photo</h2>
            <select value={selectedIdType} onChange={(e) => setSelectedIdType(e.target.value)} className="selection">
                <option value="philhealthID">Philhealth ID</option>
                <option value="tinID">TIN ID</option>
                <option value="nationalID">National ID</option>
                <option value="driversLicenseID">Driver's License ID</option>
              </select>
            <div className="mb-4 flex justify-between items-center">
              
              <div className="image-box">
                <label htmlFor="idPhoto" className="block text-gray-700">Capture/Upload ID Photo</label>
              {idPhoto && <img src={idPhoto} alt="ID Photo" className="w-40 h-auto" />}

                <input type="file" id="idPhoto" onChange={handleImage}  accept="image/*" style={{ display: 'none' }} />
                <button onClick={() => document.getElementById('idPhoto').click()} className="upload-btn">Upload Photo</button>
              </div>
            
            </div>


              <button onClick={handleImageUpload}  disabled={!idPhoto} 
              className={`submit-btn ${!idPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Submit
              </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 2: Contact Information</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700">Phone:</label>
                <input type="text" id="phone" className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700">Address:</label>
                <input type="text" id="address" className="mt-1 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex justify-between">
                <button onClick={prevStep} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Previous
                </button>
                <button onClick={nextStep} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Next
                </button>
              </div>
            </form>
          </div>
        )}
        
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 3: Confirmation</h2>
            <p className="text-lg mb-4">Please review your information before submitting:</p>
            <ul className="list-disc pl-8">
              <li>Name: John Doe</li>
              <li>Email: johndoe@example.com</li>
              <li>Phone: 123-456-7890</li>
              <li>Address: 123 Main St, City, Country</li>
            </ul>
            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Previous
              </button>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormStepper;
