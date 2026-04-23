import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import dbConnect from '@/lib/mongodb';
import ResumeModel from '@/models/Resume';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';

export async function GET(req: NextRequest) {
  let browser;
  try {
    // 1. Fetch resume data directly from DB
    await dbConnect();
    const resume = await ResumeModel.findOne({ userId: 'admin_user_01' }).lean() as any;
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    const authorData = await client.fetch(`*[_type == "author"][0] { image }`);
    const photoUrl = authorData?.image ? urlFor(authorData.image).width(120).height(120).url() : null;

    const { personalInfo, experience, education, skills } = resume;

    // 2. Group skills by category
    const skillGroups = (skills || []).reduce((acc: any, skill: any) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {});

    // 3. Build HTML string directly
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${personalInfo.name} — Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; font-size: 10pt; color: #1a1a1a; background: white; line-height: 1.5; }
    .page { max-width: 100%; padding: 36px 48px; background: white; }
    .header { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 2px solid #f0a500; }
    .photo { width: 84px; height: 84px; border-radius: 50%; object-fit: cover; border: 3px solid #f0a500; }
    .header-info h1 { font-size: 20pt; font-weight: 700; color: #111; margin-bottom: 2px; }
    .job-title { font-size: 10pt; color: #f0a500; font-weight: 600; margin-bottom: 6px; }
    .contact-row { display: flex; flex-wrap: wrap; gap: 12px; font-size: 8pt; color: #555; }
    .section { margin-bottom: 18px; }
    .section-title { font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #f0a500; margin-bottom: 8px; padding-bottom: 3px; border-bottom: 1px solid #e8e8e8; }
    .summary-text { color: #333; font-size: 9pt; line-height: 1.6; }
    .exp-item { margin-bottom: 12px; }
    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px; }
    .exp-title { font-size: 9.5pt; font-weight: 700; color: #111; }
    .exp-date { font-size: 8pt; color: #777; }
    .exp-company { font-size: 8.5pt; color: #555; margin-bottom: 4px; }
    .exp-list { list-style: none; }
    .exp-list li { position: relative; padding-left: 12px; margin-bottom: 2px; color: #333; font-size: 8.5pt; line-height: 1.5; }
    .exp-list li::before { content: "▸"; position: absolute; left: 0; color: #f0a500; font-size: 7pt; top: 1px; }
    .edu-item { margin-bottom: 8px; }
    .edu-header { display: flex; justify-content: space-between; align-items: baseline; }
    .edu-degree { font-size: 9.5pt; font-weight: 700; color: #111; }
    .edu-date { font-size: 8pt; color: #777; }
    .edu-school { font-size: 8.5pt; color: #555; }
    .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 28px; }
    .skill-cat-title { font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #999; margin-bottom: 6px; }
    .skill-item { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .skill-name { font-size: 8.5pt; color: #333; }
    .skill-bar-bg { width: 75px; height: 4px; background: #eeeeee; border-radius: 3px; }
    .skill-bar-fill { height: 100%; background: #f0a500; border-radius: 3px; }
    .lang-row { display: flex; gap: 24px; }
    .lang-item { font-size: 9pt; color: #333; }
    .lang-item strong { color: #111; }
  </style>
</head>
<body>
  <div class="page">

    <div class="header">
      ${photoUrl ? `<img src="${photoUrl}" class="photo" alt="${personalInfo.name}" />` : ''}
      <div class="header-info">
        <h1>${personalInfo.name}</h1>
        <div class="job-title">Software Engineer</div>
        <div class="contact-row">
          <span>📍 ${personalInfo.location}</span>
          <span>✉ ${personalInfo.email}</span>
          <span>📞 ${personalInfo.phone}</span>
          <span>🌐 ${personalInfo.website?.replace('https://', '')}</span>
        </div>
      </div>
    </div>

    ${personalInfo.summary ? `
    <div class="section">
      <div class="section-title">Summary</div>
      <p class="summary-text">${personalInfo.summary}</p>
    </div>` : ''}

    ${experience?.length ? `
    <div class="section">
      <div class="section-title">Experience</div>
      ${experience.map((exp: any) => `
        <div class="exp-item">
          <div class="exp-header">
            <span class="exp-title">${exp.jobTitle}</span>
            <span class="exp-date">${exp.startDate} – ${exp.endDate || 'Present'}</span>
          </div>
          <div class="exp-company">${exp.company} · ${exp.location}</div>
          ${exp.description?.length ? `
          <ul class="exp-list">
            ${exp.description.map((pt: string) => `<li>${pt}</li>`).join('')}
          </ul>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${education?.length ? `
    <div class="section">
      <div class="section-title">Education</div>
      ${education.map((edu: any) => `
        <div class="edu-item">
          <div class="edu-header">
            <span class="edu-degree">${edu.degree}</span>
            <span class="edu-date">${edu.graduationYear}</span>
          </div>
          <div class="edu-school">${edu.institution} · ${edu.location}</div>
        </div>
      `).join('')}
    </div>` : ''}

    ${Object.keys(skillGroups).length ? `
    <div class="section">
      <div class="section-title">Skills</div>
      <div class="skills-grid">
        ${Object.entries(skillGroups).map(([cat, items]: [string, any]) => `
          <div>
            <div class="skill-cat-title">${cat}</div>
            ${items.sort((a: any, b: any) => b.proficiency - a.proficiency).map((s: any) => `
              <div class="skill-item">
                <span class="skill-name">${s.name}</span>
                <div class="skill-bar-bg">
                  <div class="skill-bar-fill" style="width:${s.proficiency}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    </div>` : ''}

    <div class="section">
      <div class="section-title">Languages</div>
      <div class="lang-row">
        <div class="lang-item"><strong>Turkish</strong> — Native</div>
        <div class="lang-item"><strong>English</strong> — B2 (YDS: 76)</div>
      </div>
    </div>

  </div>
</body>
</html>`;

    // 4. Launch puppeteer, render HTML directly (no URL visit)
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 1000));

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await browser.close();

    // Sanitize filename — remove non-ASCII characters for HTTP header compatibility
    const name = (personalInfo.name || 'Resume')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')  // remove diacritics
      .replace(/[^a-zA-Z0-9_\- ]/g, '')  // remove remaining non-ASCII
      .replace(/\s+/g, '_');

    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${name}_CV.pdf"`,
      },
    });

  } catch (err: any) {
    if (browser) await browser.close();
    console.error('PDF generation error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate PDF.' }, { status: 500 });
  }
}