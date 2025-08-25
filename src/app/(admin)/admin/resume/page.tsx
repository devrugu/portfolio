"use client";

import { useState, useEffect } from "react";
import { Resume, Experience, Education, Skill } from "@/types/resume";
import FormInput from "@/components/FormInput";

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

  // Handles changes to a specific field within a specific experience item
  const handleExperienceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!resumeData) return;
    const { name, value } = e.target;
    const updatedExperience = [...resumeData.experience];
    
    // If the field is 'description', we need to split it by newline to save it as an array
    if (name === 'description') {
      updatedExperience[index] = { ...updatedExperience[index], [name]: value.split('\n') };
    } else {
      updatedExperience[index] = { ...updatedExperience[index], [name]: value };
    }

    setResumeData({ ...resumeData, experience: updatedExperience });
  };

  // Adds a new, blank experience item to the array
  const handleAddExperience = () => {
    if (!resumeData) return;
    const newExperience: Experience = {
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: [],
    };
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, newExperience],
    });
  };

  // Removes an experience item from the array at a specific index
  const handleRemoveExperience = (index: number) => {
    if (!resumeData) return;
    const updatedExperience = resumeData.experience.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, experience: updatedExperience });
  };

  // --- Handlers for Education ---
  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!resumeData) return;
    const { name, value } = e.target;
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = { ...updatedEducation[index], [name]: value };
    setResumeData({ ...resumeData, education: updatedEducation });
  };

  const handleAddEducation = () => {
    if (!resumeData) return;
    const newEducation: Education = { degree: "", institution: "", location: "", graduationYear: "" };
    setResumeData({ ...resumeData, education: [...resumeData.education, newEducation] });
  };

  const handleRemoveEducation = (index: number) => {
    if (!resumeData) return;
    const updatedEducation = resumeData.education.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, education: updatedEducation });
  };

  // --- Handlers for Skills ---
  const handleSkillChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!resumeData) return;
    const { name, value } = e.target;
    const updatedSkills = [...resumeData.skills];
    updatedSkills[index] = { ...updatedSkills[index], [name]: value as any };
    setResumeData({ ...resumeData, skills: updatedSkills });
  };

  const handleAddSkill = () => {
    if (!resumeData) return;
    const newSkill: Skill = { name: "", category: "Language" };
    setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkill] });
  };

  const handleRemoveSkill = (index: number) => {
    if (!resumeData) return;
    const updatedSkills = resumeData.skills.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, skills: updatedSkills });
  };

  // Loading and error states remain the same
  if (loading) return <div>Loading resume editor...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!resumeData) return <div>No resume data found.</div>;

  // --- UPDATED: The main return with the form ---
  return (
    <div>
      <div className="flex items-center justify-between mb-8 sticky top-4 z-10 bg-gray-900 py-4">
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

      {/* --- Experience Section --- */}
      <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-accent">Work Experience</h2>
          <button
            onClick={handleAddExperience}
            className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add Experience
          </button>
        </div>
        <div className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 relative">
              <button
                onClick={() => handleRemoveExperience(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400 font-bold text-xl"
                title="Remove Experience"
              >
                &times;
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Job Title" name="jobTitle" value={exp.jobTitle} onChange={(e) => handleExperienceChange(index, e)} />
                <FormInput label="Company" name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} />
                <FormInput label="Location" name="location" value={exp.location} onChange={(e) => handleExperienceChange(index, e)} />
                <FormInput label="Start Date" name="startDate" value={exp.startDate} onChange={(e) => handleExperienceChange(index, e)} />
                <FormInput label="End Date" name="endDate" value={exp.endDate} onChange={(e) => handleExperienceChange(index, e)} />
                <div className="md:col-span-2">
                  <FormInput
                    label="Description (one point per line)"
                    name="description"
                    as="textarea"
                    value={exp.description.join('\n')}
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- NEW: Education Section --- */}
        <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-accent">Education</h2>
            <button onClick={handleAddEducation} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              + Add Education
            </button>
          </div>
          <div className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 relative">
                <button onClick={() => handleRemoveEducation(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-400 font-bold text-xl" title="Remove Education">&times;</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput label="Degree" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} />
                  <FormInput label="Institution" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, e)} />
                  <FormInput label="Location" name="location" value={edu.location} onChange={(e) => handleEducationChange(index, e)} />
                  <FormInput label="Graduation Year" name="graduationYear" value={edu.graduationYear} onChange={(e) => handleEducationChange(index, e)} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- NEW: Skills Section --- */}
        <section className="bg-gray-900/50 p-6 rounded-lg border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-accent">Skills</h2>
            <button onClick={handleAddSkill} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              + Add Skill
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {resumeData.skills.map((skill, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 flex items-center space-x-2 flex-grow md:flex-grow-0 md:min-w-[300px]">
                <div className="flex-grow">
                  <FormInput label="Skill Name" name="name" value={skill.name} onChange={(e) => handleSkillChange(index, e)} />
                </div>
                <div>
                  <label htmlFor={`skill-category-${index}`} className="block text-on-background mb-1">Category</label>
                  <select
                    id={`skill-category-${index}`}
                    name="category"
                    value={skill.category}
                    onChange={(e) => handleSkillChange(index, e)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option>Language</option>
                    <option>Framework</option>
                    <option>Tool</option>
                    <option>Database</option>
                    <option>Other</option>
                  </select>
                </div>
                <button onClick={() => handleRemoveSkill(index)} className="text-red-500 hover:text-red-400 font-bold text-2xl self-end mb-1">&times;</button>
              </div>
            ))}
          </div>
        </section>

      {/* Education, and Skills sections will go here later */}
    </div>
  );
}