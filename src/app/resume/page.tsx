import dbConnect from "@/lib/mongodb";
import ResumeModel from "@/models/Resume";
import { Resume } from "@/types/resume";
import Image from "next/image";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";
import ResumeDownloadButton from "@/components/ResumeDownloadButton";

// This function fetches the resume data from the database.
async function getResumeData() {
  // Connect to MongoDB
  await dbConnect();
  const resume = await ResumeModel.findOne({ userId: "admin_user_01" }).lean();
  if (!resume) return null;

  // ALSO, connect to Sanity to get the author image
  const authorQuery = `*[_type == "author"][0] { image }`; // Get the first author's image
  const authorData = await client.fetch(authorQuery);

  // Combine the data
  return { ...resume, authorImage: authorData?.image } as Resume & { authorImage?: any };
}

// The page is now an async component
export default async function ResumePage() {
  const resume = await getResumeData();

  // Handle the case where the resume hasn't been created yet
  if (!resume) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-8">Resume Not Found</h1>
        <p className="text-lg text-on-background">
          The resume has not been created in the admin panel yet.
        </p>
      </div>
    );
  }

  const { personalInfo, experience, education, skills, authorImage } = resume;

  const fileName = `${resume.personalInfo.name.replace(' ', '_')}_Resume.pdf`;

  return (
    <div>
      <div className="mb-8 text-center md:text-right">
        <ResumeDownloadButton elementId="resume-to-print" fileName={fileName} />
      </div>
      <div id="resume-to-print">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12">
        {/* Profile Image */}
        {authorImage && (
          <div className="md:order-2 mb-6 md:mb-0">
            <Image
              src={urlFor(authorImage).width(200).height(200).url()}
              alt={personalInfo.name}
              width={200}
              height={200}
              className="rounded-full border-4 border-gray-700/50 object-cover"
              priority // Helps the image load faster
            />
          </div>
        )}
        {/* Personal Details */}
        <div className="text-center md:text-left md:order-1">
          <h1 className="text-5xl font-bold text-primary">{personalInfo.name}</h1>
          <p className="text-lg text-gray-400 mt-2">
            {personalInfo.location} | {personalInfo.phone}
          </p>
          <p className="text-lg text-gray-400 mt-1">
            {personalInfo.email} |
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">
              {personalInfo.website}
            </a>
          </p>
        </div>
      </div>

      {/* Summary Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold text-accent mb-4 border-b-2 border-gray-700 pb-2">Summary</h2>
        <p className="text-lg text-on-background">{personalInfo.summary}</p>
      </section>

      {/* Experience Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold text-accent mb-4 border-b-2 border-gray-700 pb-2">Experience</h2>
        <div className="space-y-6">
          {experience.map((exp) => (
            <div key={exp._id}>
              <h3 className="text-2xl font-bold text-primary">{exp.jobTitle}</h3>
              <p className="text-lg font-medium text-gray-400">{exp.company} | {exp.location}</p>
              <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-on-background">
                {exp.description.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-semibold text-accent mb-4 border-b-2 border-gray-700 pb-2">Education</h2>
        {education.map((edu) => (
          <div key={edu._id}>
            <h3 className="text-2xl font-bold text-primary">{edu.degree}</h3>
            <p className="text-lg font-medium text-gray-400">{edu.institution} | {edu.location}</p>
            <p className="text-sm text-gray-500">Graduated: {edu.graduationYear}</p>
          </div>
        ))}
      </section>

      {/* Skills Section */}
      <section>
        <h2 className="text-3xl font-semibold text-accent mb-4 border-b-2 border-gray-700 pb-2">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={skill._id} className="bg-gray-700/50 text-primary text-sm font-medium px-3 py-1 rounded-full">
              {skill.name}
            </span>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}