"use client";

import { useState } from 'react';
import Image from 'next/image';

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
  // We will add state for images, keys, and results here later
  const [hostImage, setHostImage] = useState<string | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [extractedImage, setExtractedImage] = useState<string | null>(null);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary">Live Digital Watermarking Demo</h1>
        <p className="text-on-background mt-2 max-w-3xl mx-auto">
          An interactive demo of a block-based, LSB watermarking algorithm running your Python code directly in the browser via Pyodide and WebAssembly.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: EMBED WORKFLOW */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 space-y-6">
          <h2 className="text-3xl font-bold text-primary text-center">Embed Watermark</h2>
          <ImageBox title="1. Host Image" imageUrl={hostImage} onImageUpload={() => {}} id="host-upload" />
          <ImageBox title="2. Watermark Image" imageUrl={watermarkImage} onImageUpload={() => {}} id="wm-upload" />
          
          <div>
            <label htmlFor="embed-key" className="block text-on-background font-semibold mb-2">3. Secret Key</label>
            <input id="embed-key" type="text" placeholder="Enter your secret key..." className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>

          <button className="w-full bg-accent text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-accent-hover transition-colors text-lg">
            Embed Watermark
          </button>

          <ImageBox title="Result: Stego Image" imageUrl={stegoImage} />
        </div>

        {/* Right Column: EXTRACT WORKFLOW */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50 space-y-6">
          <h2 className="text-3xl font-bold text-primary text-center">Extract Watermark</h2>
          <ImageBox title="1. Stego Image (from embed)" imageUrl={stegoImage} />

          <div>
            <label htmlFor="extract-key" className="block text-on-background font-semibold mb-2">2. Secret Key</label>
            <input id="extract-key" type="text" placeholder="Enter the same secret key..." className="w-full font-mono bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>

          <button className="w-full bg-accent text-on-primary font-bold py-3 px-4 rounded-lg hover:bg-accent-hover transition-colors text-lg">
            Extract Watermark
          </button>

          <ImageBox title="Result: Extracted Watermark" imageUrl={extractedImage} />
        </div>
      </div>
    </div>
  );
}