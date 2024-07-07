import React, { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const App = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);

  const captureImage = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setError('');
      } else {
        throw new Error('Failed to capture image');
      }
    } catch (err) {
      setError('Failed to capture image. Please try again.');
    }
  }, []);

  const sendToFlorence2 = useCallback(async () => {
    if (!capturedImage) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:5000/replicate',
        {
          image: capturedImage,
        }
      );

      if (response.data.output && typeof response.data.output === 'object') {
        if ('<CAPTION>' in response.data.output) {
          setCaption(response.data.output['<CAPTION>'].replace(/['']/g, ''));
        } else {
          setCaption(JSON.stringify(response.data.output));
        }
      } else if (typeof response.data.output === 'string') {
        setCaption(response.data.output);
      } else {
        setCaption('No caption generated');
      }
    } catch (err) {
      setError('Failed to process image with Florence 2. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [capturedImage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Camera App with Florence 2</h1>
      
      <div className="mb-4">
        <button
          onClick={captureImage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Capture Image'}
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
          <img src={capturedImage} alt="Captured" className="w-full max-w-md mb-2" />
          <button
            onClick={sendToFlorence2}
            className={`w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Send to Florence 2'}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="mb-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-2">Processing image...</p>
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