// src/types/resume.ts

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  summary: string;
}

export interface Experience {
  _id?: string; // Mongoose will add this
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  _id?: string;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
}

export interface Skill {
  _id?: string;
  name: string;
  category: 'Language' | 'Framework' | 'Tool' | 'Database' | 'Other';
  proficiency: number; // 0-100 scale
}

// This is the main interface for the entire Resume document
export interface Resume {
  _id: string;
  userId: string; // To associate the resume with the admin user
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  createdAt: Date;
  updatedAt: Date;
}