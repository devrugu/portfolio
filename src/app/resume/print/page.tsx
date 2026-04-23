import PrintButton from "@/components/PrintButton";
import dbConnect from "@/lib/mongodb";
import ResumeModel from "@/models/Resume";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";

export const dynamic = 'force-dynamic';

async function getResumeData() {
  try { await dbConnect(); } catch (e) { return null; }
  const resume = await ResumeModel.findOne({ userId: "admin_user_01" }).lean();
  if (!resume) return null;
  const authorData = await client.fetch(`*[_type == "author"][0] { image }`);
  return { ...resume, authorImage: authorData?.image };
}

export default async function ResumePrintPage() {
  const resume = await getResumeData();
  if (!resume) return <div>Resume not found.</div>;

  const { personalInfo, experience, education, skills, authorImage } = resume as any;
  const photoUrl = authorImage ? urlFor(authorImage).width(120).height(120).url() : null;

  const skillGroups = (skills || []).reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: white !important; color: #1a1a1a; font-family: 'Inter', sans-serif; font-size: 10pt; line-height: 1.5; }
        .page { max-width: 800px; margin: 0 auto; padding: 40px 48px; background: white; }
        .header { display: flex; align-items: center; gap: 24px; margin-bottom: 28px; padding-bottom: 24px; border-bottom: 2px solid #f0a500; }
        .photo { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 3px solid #f0a500; }
        .header-info h1 { font-size: 22pt; font-weight: 700; color: #111; margin-bottom: 2px; }
        .job-title { font-size: 11pt; color: #f0a500; font-weight: 600; margin-bottom: 8px; }
        .contact-row { display: flex; flex-wrap: wrap; gap: 12px; font-size: 8.5pt; color: #555; }
        .section { margin-bottom: 22px; }
        .section-title { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #f0a500; margin-bottom: 10px; padding-bottom: 4px; border-bottom: 1px solid #e8e8e8; }
        .summary-text { color: #333; font-size: 9.5pt; line-height: 1.6; }
        .exp-item { margin-bottom: 14px; }
        .exp-item:last-child { margin-bottom: 0; }
        .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px; }
        .exp-title { font-size: 10.5pt; font-weight: 700; color: #111; }
        .exp-date { font-size: 8.5pt; color: #777; white-space: nowrap; }
        .exp-company { font-size: 9.5pt; color: #555; margin-bottom: 5px; }
        .exp-list { list-style: none; padding: 0; }
        .exp-list li { position: relative; padding-left: 14px; margin-bottom: 3px; color: #333; font-size: 9pt; line-height: 1.5; }
        .exp-list li::before { content: "\\25B8"; position: absolute; left: 0; color: #f0a500; font-size: 8pt; top: 1px; }
        .edu-item { margin-bottom: 10px; }
        .edu-item:last-child { margin-bottom: 0; }
        .edu-header { display: flex; justify-content: space-between; align-items: baseline; }
        .edu-degree { font-size: 10.5pt; font-weight: 700; color: #111; }
        .edu-date { font-size: 8.5pt; color: #777; }
        .edu-school { font-size: 9.5pt; color: #555; }
        .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 32px; }
        .skill-category-title { font-size: 8.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #999; margin-bottom: 8px; }
        .skill-item { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
        .skill-name { font-size: 9pt; color: #333; }
        .skill-bar-bg { width: 80px; height: 5px; background: #eeeeee; border-radius: 3px; overflow: hidden; }
        .skill-bar-fill { height: 100%; background: #f0a500; border-radius: 3px; }
        .lang-row { display: flex; gap: 24px; }
        .lang-item { font-size: 9.5pt; color: #333; }
        .lang-item strong { color: #111; }
        /* Toolbar */
        .print-bar { position: fixed; top: 0; left: 0; right: 0; background: #1a1a1a; color: white; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; z-index: 100; font-family: 'Inter', sans-serif; font-size: 14px; gap: 12px; }
        .print-btn { background: #f0a500; color: #111; border: none; padding: 8px 20px; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .back-btn { color: #aaa; text-decoration: none; font-size: 13px; white-space: nowrap; }
        .hint { color: #aaa; font-size: 12px; text-align: center; flex: 1; }
        .page-wrapper { padding-top: 52px; }
        @media print {
          .print-bar { display: none !important; }
          .page-wrapper { padding-top: 0 !important; }
          .page { padding: 20px 32px; max-width: 100%; }
        }
      `}} />

      {/* Toolbar */}
      <div className="print-bar">
        <a href="/resume" className="back-btn">← Back</a>
        <span className="hint">In the print dialog → select <strong style={{color:'white'}}>"Save as PDF"</strong> → set margins to <strong style={{color:'white'}}>"None"</strong></span>
        <PrintButton />
      </div>


      <div className="page-wrapper">
        <div className="page">

          {/* Header */}
          <div className="header">
            {photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={personalInfo.name}
                className="photo"
                crossOrigin="anonymous"
              />
            )}
            <div className="header-info">
              <h1>{personalInfo.name}</h1>
              <div className="job-title">Software Engineer</div>
              <div className="contact-row">
                <span>📍 {personalInfo.location}</span>
                <span>✉ {personalInfo.email}</span>
                <span>📞 {personalInfo.phone}</span>
                <span>🌐 {personalInfo.website?.replace('https://', '')}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          {personalInfo.summary && (
            <div className="section">
              <div className="section-title">Summary</div>
              <p className="summary-text">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience?.length > 0 && (
            <div className="section">
              <div className="section-title">Experience</div>
              {experience.map((exp: any, i: number) => (
                <div key={i} className="exp-item">
                  <div className="exp-header">
                    <span className="exp-title">{exp.jobTitle}</span>
                    <span className="exp-date">{exp.startDate} – {exp.endDate || 'Present'}</span>
                  </div>
                  <div className="exp-company">{exp.company} · {exp.location}</div>
                  {exp.description?.length > 0 && (
                    <ul className="exp-list">
                      {exp.description.map((pt: string, j: number) => <li key={j}>{pt}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education?.length > 0 && (
            <div className="section">
              <div className="section-title">Education</div>
              {education.map((edu: any, i: number) => (
                <div key={i} className="edu-item">
                  <div className="edu-header">
                    <span className="edu-degree">{edu.degree}</span>
                    <span className="edu-date">{edu.graduationYear}</span>
                  </div>
                  <div className="edu-school">{edu.institution} · {edu.location}</div>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {Object.keys(skillGroups).length > 0 && (
            <div className="section">
              <div className="section-title">Skills</div>
              <div className="skills-grid">
                {Object.entries(skillGroups).map(([cat, items]: [string, any]) => (
                  <div key={cat}>
                    <div className="skill-category-title">{cat}</div>
                    {items.sort((a: any, b: any) => b.proficiency - a.proficiency).map((s: any, i: number) => (
                      <div key={i} className="skill-item">
                        <span className="skill-name">{s.name}</span>
                        <div className="skill-bar-bg">
                          <div className="skill-bar-fill" style={{ width: `${s.proficiency}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          <div className="section">
            <div className="section-title">Languages</div>
            <div className="lang-row">
              <div className="lang-item"><strong>Turkish</strong> — Native</div>
              <div className="lang-item"><strong>English</strong> — B2 (YDS: 76)</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}