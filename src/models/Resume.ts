// src/models/Resume.ts

import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { Resume } from '@/types/resume'; // We import our TypeScript type

// These are sub-schemas for the arrays in our main Resume schema
const ExperienceSchema = new Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String },
  description: [{ type: String }],
});

const EducationSchema = new Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String },
  graduationYear: { type: String, required: true },
});

const SkillSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  proficiency: { type: Number, required: true, min: 0, max: 100 }, // 0-100 scale
});

// This is the main schema that enforces the structure in MongoDB
const ResumeSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    personalInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      website: { type: String },
      location: { type: String },
      summary: { type: String, required: true },
    },
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [SkillSchema],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// This is a bit of boilerplate to prevent Mongoose from redefining the model
// every time the code is hot-reloaded in development.
const ResumeModel = (models.Resume as Model<Resume & Document>) || mongoose.model<Resume & Document>('Resume', ResumeSchema);

export default ResumeModel;