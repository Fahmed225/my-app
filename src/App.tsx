import React, { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const App = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const webcamRef = useRef(null);

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const sendToFlorence2 = useCallback(async () => {
    if (!capturedImage) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/replicate',
        {
          task_input: "Caption",
          image: capturedImage,
        }
      );

      setCaption(response.data.output || 'No caption generated');
    } catch (err) {
      setError('Failed to process image with Florence 2. Please try again.');
    }
  }, [capturedImage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Camera App with Florence 2</h1>
      
      <div className="mb-4">
        <button
          onClick={captureImage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Capture Image
        </button>
      </div>

      <div className="relative mb-4">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full max-w-md"
        />
      </div>

      {capturedImage && (
        <div className="mb-4">
          <img src={capturedImage} alt="Captured" className="w-full max-w-md" />
          <button
            onClick={sendToFlorence2}
            className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Send to Florence 2
          </button>
        </div>
      )}

      {caption && (
        <div className="mb-4 max-w-md bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg">Florence 2 Caption</h2>
          <p>{caption}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 max-w-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default App;
