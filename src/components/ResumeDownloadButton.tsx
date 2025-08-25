"use client";

import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// The component takes an 'elementId' prop, which is the ID of the HTML element we want to print.
export default function ResumeDownloadButton({ elementId, fileName }: { elementId: string, fileName: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    const resumeElement = document.getElementById(elementId);
    if (!resumeElement) {
      console.error("Resume element not found!");
      return;
    }

    setLoading(true);

    try {
      // Use html2canvas to capture the element as an image (canvas)
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Increase scale for better resolution
        backgroundColor: '#121212', // Match our dark theme background
        useCORS: true, // Important for external images like your profile photo
      });

      const imageData = canvas.toDataURL('image/png');

      // Use jsPDF to create a PDF from the image
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height], // Set PDF size to match the captured image
      });

      pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(fileName);

    } catch (error) {
      console.error("Could not generate PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-block bg-accent text-on-primary font-bold py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors disabled:bg-gray-600"
    >
      {loading ? 'Generating...' : 'Download PDF Version'}
    </button>
  );
}