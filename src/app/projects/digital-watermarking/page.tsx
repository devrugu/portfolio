"use client";

import { useState } from 'react';
import Image from 'next/image';

// Helper function to convert a Base64 string back to a File object
const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]); 
    let n = bstr.length; 
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

// A reusable component for our image display boxes
const ImageBox = ({ title, imageUrl, onImageUpload, id }: { title: string, imageUrl: string | null, onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void, id?: string }) => (
  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 text-center">
    <h3 className="text-lg font-semibold text-accent mb-2">{title}</h3>
    <div className="w-full h-48 bg-gray-900 rounded-md flex items-center justify-center relative overflow-hidden">
      {imageUrl ? (
        <Image src={imageUrl} alt={title} layout="fill" objectFit="contain" />
      ) : (
        <span className="text-gray-500">Image Preview</span>
      )}
    </div>
    {onImageUpload && (
      <div className="mt-4">
        <label htmlFor={id} className="cursor-pointer bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">
          Upload Image
        </label>
        <input type="file" id={id} accept="image/png" className="hidden" onChange={onImageUpload} />
      </div>
    )}
  </div>
);

export default function WatermarkingPage() {
  // --- STATE MANAGEMENT ---
  const [hostFile, setHostFile] = useState<File | null>(null);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  
  const [hostImagePreview, setHostImagePreview] = useState<string | null>(null);
  const [watermarkImagePreview, setWatermarkImagePreview] = useState<string | null>(null);
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [extractedImage, setExtractedImage] = useState<string | null>(null); // State for extracted image
  
  const [embedKey, setEmbedKey] = useState<string>('demo-key');
  const [extractKey, setExtractKey] = useState<string>('demo-key'); // Separate state for extract key
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- EVENT HANDLERS ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'host' | 'watermark') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'host') {
        setHostFile(file);
        setHostImagePreview(previewUrl);
      } else {
        setWatermarkFile(file);
        setWatermarkImagePreview(previewUrl);
      }
    }
  };

  const handleEmbed = async () => {
    if (!hostFile || !watermarkFile || !embedKey) {
      alert("Please upload both a host and watermark image, and provide a key.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStegoImage(null); // Clear previous results
    setExtractedImage(null);

    const formData = new FormData();
    formData.append('hostImage', hostFile);
    formData.append('watermarkImage', watermarkFile);
    formData.append('key', embedKey);
    formData.append('action', 'embed'); // Tell the API what to do

    try {
      const response = await fetch('/api/watermark', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong during embedding.');
      }

      setStegoImage(result.stegoImage);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExtract = async () => {
    if (!stegoImage || !extractKey) {
      alert("Please embed a watermark first and provide a key.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedImage(null);

    // We need to convert the Base64 stegoImage back into a File to upload it
    const stegoFile = dataURLtoFile(stegoImage, 'stego.png');

    const formData = new FormData();
    formData.append('stegoImage', stegoFile);
    formData.append('key', extractKey);
    formData.append('action', 'extract'); // Tell the API what to do

    try {
      const response = await fetch('/api/watermark', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong during extraction.');
      }

      setExtractedImage(result.extractedImage);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">Live Digital Watermarking Demo</h1>
        <p className="text-on-background mt-2 max-w-3xl mx-auto">
          An interactive demo of a block-based, LSB watermarking algorithm, running your Python script on the server.
        </p>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center my-4">
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-accent"></div>
          <p className="ml-4 text-on-background">Processing on server...</p>
        </div>
      )}

      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: EMBED WORKFLOW */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 space-y-6">
          <h2 className="text-3xl font-bold text-primary text-center">Embed Watermark</h2>
          <ImageBox title="1. Host Image" imageUrl={hostImagePreview} onImageUpload={(e) => handleImageUpload(e, 'host')} id="host-upload" />
          <ImageBox title="2. Watermark Image" imageUrl={watermarkImagePreview} onImageUpload={(e) => handleImageUpload(e, 'watermark')} id="wm-upload" />
          <div>
            <label htmlFor="embed-key" className="block text-on-background font-semibold mb-2">3. Secret Key</label>
            <input id="embed-key" type="text" value={embedKey} onChange={(e) => setEmbedKey(e.target.value)} className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"/>
          </div>
          <button onClick={handleEmbed} disabled={isLoading} className="w-full bg-accent text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-accent-hover transition-colors text-lg disabled:bg-gray-600">
            {isLoading ? 'Processing...' : 'Embed Watermark'}
          </button>
          <ImageBox title="Result: Stego Image" imageUrl={stegoImage} />
        </div>

        {/* Right Column: EXTRACT WORKFLOW */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 space-y-6">
          <h2 className="text-3xl font-bold text-primary text-center">Extract Watermark</h2>
          <ImageBox title="1. Stego Image (from embed)" imageUrl={stegoImage} />
          <div>
            <label htmlFor="extract-key" className="block text-on-background font-semibold mb-2">2. Secret Key</label>
            <input id="extract-key" type="text" value={extractKey} onChange={(e) => setExtractKey(e.target.value)} placeholder="Enter the same secret key..." className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"/>
          </div>
          <button onClick={handleExtract} disabled={isLoading || !stegoImage} className="w-full bg-accent text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-accent-hover transition-colors text-lg disabled:bg-gray-600">
            {isLoading ? 'Processing...' : 'Extract Watermark'}
          </button>
          <ImageBox title="Result: Extracted Watermark" imageUrl={extractedImage} />
        </div>
      </div>
    </div>
  );
}