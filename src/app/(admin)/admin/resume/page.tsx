"use client";

import { useState, useEffect } from "react";
import { Resume } from "@/types/resume";
import FormInput from "@/components/FormInput"; // Import our new component

export default function ResumeEditorPage() {
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch function remains the same
  const fetchResumeData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/resume");
      if (!response.ok) throw new Error("Failed to fetch resume data.");
      const data = await response.json();
      setResumeData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, []);

  // --- NEW: Handle form input changes ---
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!resumeData) return;
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [name]: value,
      },
    });
  };

  // --- NEW: Handle form submission ---
  const handleSave = async () => {
    if (!resumeData) return;
    try {
      setSaving(true);
      const response = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });
      if (!response.ok) throw new Error("Failed to save resume data.");
      alert("Resume saved successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Loading and error states remain the same
  if (loading) return <div>Loading resume editor...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!resumeData) return <div>No resume data found.</div>;

  // --- UPDATED: The main return with the form ---
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary">Resume Editor</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent text-on-primary font-bold py-2 px-4 rounded-lg hover:bg-accent-hover transition-colors disabled:bg-gray-600"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Personal Info Section */}
      <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50">
        <h2 className="text-2xl font-semibold text-accent mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput label="Full Name" name="name" value={resumeData.personalInfo.name} onChange={handlePersonalInfoChange} />
          <FormInput label="Email" name="email" type="email" value={resumeData.personalInfo.email} onChange={handlePersonalInfoChange} />
          <FormInput label="Phone Number" name="phone" type="tel" value={resumeData.personalInfo.phone} onChange={handlePersonalInfoChange} />
          <FormInput label="Website/Portfolio" name="website" value={resumeData.personalInfo.website} onChange={handlePersonalInfoChange} />
          <div className="md:col-span-2">
            <FormInput label="Location" name="location" value={resumeData.personalInfo.location} onChange={handlePersonalInfoChange} />
          </div>
          <div className="md:col-span-2">
            <FormInput label="Summary" name="summary" as="textarea" value={resumeData.personalInfo.summary} onChange={handlePersonalInfoChange} />
          </div>
        </div>
      </section>

      {/* Experience, Education, and Skills sections will go here later */}
    </div>
  );
}