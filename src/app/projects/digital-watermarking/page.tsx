"use client";

import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';
import ImageViewer from '@/components/ImageViewer';
import GitHubLink from '@/components/GitHubLink';

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
const ImageBox = ({ title, imageUrl, onImageUpload, id, fileName }: { title: string, imageUrl: string | null, onImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void, id?: string, fileName?: string }) => (
  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 text-center flex flex-col">
    <h3 className="text-lg font-semibold text-accent mb-2">{title}</h3>
    <div className="w-full h-48 bg-gray-900 rounded-md flex items-center justify-center relative overflow-hidden flex-grow">
      {imageUrl ? (
        <Image src={imageUrl} alt={title} layout="fill" objectFit="contain" />
      ) : (
        <span className="text-gray-500">Image Preview</span>
      )}
    </div>
    <div className="mt-4 flex justify-center gap-4">
      {onImageUpload && (
        <label htmlFor={id} className="cursor-pointer bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">
          Upload Image
        </label>
      )}
      {imageUrl && (
        <a 
          href={imageUrl} 
          download={fileName || 'image.png'}
          className="cursor-pointer bg-green-600/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-600/40 transition-colors"
        >
          Download
        </a>
      )}
    </div>
    <input type="file" id={id} accept="image/png" className="hidden" onChange={onImageUpload} />
  </div>
);

export default function WatermarkingPage() {
  // --- STATE MANAGEMENT ---
  const [hostFile, setHostFile] = useState<File | null>(null);
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  const [hostImagePreview, setHostImagePreview] = useState<string | null>(null);
  const [watermarkImagePreview, setWatermarkImagePreview] = useState<string | null>(null);
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [extractedImage, setExtractedImage] = useState<string | null>(null);
  const [embedKey, setEmbedKey] = useState<string>('demo-key');
  const [extractKey, setExtractKey] = useState<string>('demo-key');
  const [channels, setChannels] = useState<string>('BGR');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewerImageUrl, setViewerImageUrl] = useState<string | null>(null);

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
    setStatusMessage('Embedding watermark...');
    setError(null);
    setStegoImage(null);
    setExtractedImage(null);
    const formData = new FormData();
    formData.append('hostImage', hostFile);
    formData.append('watermarkImage', watermarkFile);
    formData.append('key', embedKey);
    formData.append('channels', channels);
    formData.append('action', 'embed');
    try {
      const response = await fetch('/api/watermark', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong during embedding.');
      setStegoImage(result.stegoImage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  // handleExtract
  const handleExtract = async () => {
    if (!stegoImage || !extractKey) {
      alert("Please embed a watermark first and provide a key.");
      return;
    }
    setIsLoading(true);
    setStatusMessage('Extracting watermark...');
    setError(null);
    setExtractedImage(null);
    const stegoFile = dataURLtoFile(stegoImage, 'stego.png');
    const formData = new FormData();
    formData.append('stegoImage', stegoFile);
    formData.append('key', extractKey);
    formData.append('channels', channels);
    formData.append('action', 'extract');
    try {
      const response = await fetch('/api/watermark', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong during extraction.');
      setExtractedImage(result.extractedImage);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  const openImageViewer = (imageUrl: string) => {
    setViewerImageUrl(imageUrl);
  };

  return (
    <div>
      {/* --- Image Viewer Component --- */}
      <ImageViewer 
        isOpen={!!viewerImageUrl} 
        onClose={() => setViewerImageUrl(null)} 
        imageUrl={viewerImageUrl || ''} 
      />

      {/* --- Explanation Modal Component --- */}
      <Modal title="About This Demo" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="space-y-4 text-on-background prose prose-invert prose-lg max-w-none">
          <h3 className="text-accent">How It Works</h3>
          <p>
            This demo is a live implementation of a block-based, LSB (Least Significant Bit) digital watermarking algorithm. Actual Python code from the <code>watermarking.py</code> script is executed on the server via a Next.js API Route.
          </p>
          <ul>
            <li>When you click "Embed," the browser securely uploads the host and watermark images to the server.</li>
            <li>A serverless function runs your Python script, which uses a keyed HMAC-SHA256 mask to embed the watermark data into the LSBs of the host image's pixels.</li>
            <li>The resulting "stego" image is sent back to your browser and displayed.</li>
          </ul>
          <h3 className="text-accent">How to Use</h3>
          <ol>
            <li><strong>Embed:</strong> Upload a Host PNG image and a smaller Watermark PNG. Enter a secret key and click "Embed Watermark." The watermarked stego image will appear.</li>
            <li><strong>Extract:</strong> Use the generated stego image and enter the same secret key. Click "Extract Watermark" to recover the original watermark.</li>
            <li><strong>Verify:</strong> If you use the wrong key during extraction, you will get a noisy, garbled result, proving the keyed mask works.</li>
          </ol>
           <h3 className="text-accent">Use Cases & Limitations</h3>
           <p>
              LSB watermarking is a high-capacity method for proving ownership or detecting tampering in digital media. However, it is <strong>not robust</strong> against transformations like JPEG compression, resizing, or heavy filtering. It is best suited for workflows where you need to verify the integrity of a lossless image like a PNG.
            </p>

            {/* --- Diagram Buttons --- */}
          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-accent">Algorithm Flow Diagrams</h3>
            <p>Click to view a detailed diagram of each process in a zoomable, pannable viewer.</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button onClick={() => openImageViewer('/diagrams/embedding-pipeline.png')} className="flex-1 bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors">
                Embedding Pipeline
              </button>
              <button onClick={() => openImageViewer('/diagrams/extraction-pipeline.png')} className="flex-1 bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors">
                Extraction & Majority Vote
              </button>
              <button onClick={() => openImageViewer('/diagrams/tamper-analysis.png')} className="flex-1 bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors">
                Tamper Analysis
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* --- Page Header with Explanation and GitHub Buttons --- */}
<div className="mb-8 relative pt-12 md:pt-0">
  {/* Container for the buttons */}
  <div className="absolute top-0 left-0 right-0 flex justify-between items-start">
    {/* Left Button */}
    <button 
      onClick={() => setIsModalOpen(true)}
      className="bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition-colors"
    >
      Explanation
    </button>
    {/* Right Button */}
    <GitHubLink href="https://github.com/devrugu/digital-watermarking" />
  </div>

  {/* Centered Text Content */}
  <div className="text-center">
    <h1 className="text-4xl font-bold text-primary">Live Digital Watermarking Demo</h1>
    <p className="text-on-background mt-2 max-w-3xl mx-auto">
      An interactive demo of a block-based, LSB watermarking algorithm, running your Python script on the server.
    </p>
  </div>
</div>
      
      {isLoading && (
        <div className="flex items-center justify-center my-4">
          <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-accent"></div>
          <p className="ml-4 text-on-background">{statusMessage}</p>
        </div>
      )}
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 space-y-6">
          <h2 className="text-3xl font-bold text-primary text-center">Embed Watermark</h2>
          <ImageBox title="1. Host Image" imageUrl={hostImagePreview} onImageUpload={(e) => handleImageUpload(e, 'host')} id="host-upload" fileName="host.png" />
          <ImageBox title="2. Watermark Image" imageUrl={watermarkImagePreview} onImageUpload={(e) => handleImageUpload(e, 'watermark')} id="wm-upload" fileName="watermark.png" />
          <div>
            <label htmlFor="embed-key" className="block text-on-background font-semibold mb-2">3. Secret Key</label>
            <input id="embed-key" type="text" value={embedKey} onChange={(e) => setEmbedKey(e.target.value)} className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"/>
          </div>
          <div>
            <label htmlFor="channels" className="block text-on-background font-semibold mb-2">4. Channels</label>
            <select id="channels" value={channels} onChange={(e) => setChannels(e.target.value)} className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="B">Blue Only</option>
              <option value="G">Green Only</option>
              <option value="R">Red Only</option>
              <option value="BGR">BGR (Redundant)</option>
            </select>
          </div>
          <button onClick={handleEmbed} disabled={isLoading} className="w-full bg-accent text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-accent-hover transition-colors text-lg disabled:bg-gray-600">
            {isLoading ? statusMessage : 'Embed Watermark'}
          </button>
          <ImageBox title="Result: Stego Image" imageUrl={stegoImage} fileName="stego.png" />
        </div>

        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 space-y-6">
          <h2 className="text-3xl font-bold text-primary text-center">Extract Watermark</h2>
          <ImageBox title="1. Stego Image (from embed)" imageUrl={stegoImage} fileName="stego.png" />
          <div>
            <label htmlFor="extract-key" className="block text-on-background font-semibold mb-2">2. Secret Key</label>
            <input id="extract-key" type="text" value={extractKey} onChange={(e) => setExtractKey(e.target.value)} placeholder="Enter the same secret key..." className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"/>
          </div>
          <div>
            <label htmlFor="channels-extract" className="block text-on-background font-semibold mb-2">3. Channels</label>
            <select id="channels-extract" value={channels} onChange={(e) => setChannels(e.target.value)} className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent">
              <option value="B">Blue Only</option>
              <option value="G">Green Only</option>
              <option value="R">Red Only</option>
              <option value="BGR">BGR (Redundant)</option>
            </select>
          </div>
          <button onClick={handleExtract} disabled={isLoading || !stegoImage} className="w-full bg-accent text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-accent-hover transition-colors text-lg disabled:bg-gray-600">
            {isLoading ? statusMessage : 'Extract Watermark'}
          </button>
          <ImageBox title="Result: Extracted Watermark" imageUrl={extractedImage} fileName="extracted_watermark.png" />
        </div>
      </div>
    </div>
  );
}