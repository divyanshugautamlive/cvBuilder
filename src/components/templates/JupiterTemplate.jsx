import React from 'react';

const DENSITY_SCALE = {
    compact: { section: '14px', gap: '10px', headerPad: '20px 28px 16px', bodyPad: '16px 28px 24px', itemGap: '12px' },
    normal: { section: '24px', gap: '18px', headerPad: '28px 32px 24px', bodyPad: '24px 32px 32px', itemGap: '18px' },
    relaxed: { section: '32px', gap: '24px', headerPad: '36px 36px 30px', bodyPad: '32px 36px 40px', itemGap: '24px' },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'certifications'];

const JupiterTemplate = ({ data, templateSettings = {}, sectionOrder }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [], certifications = [] } = data;
    const order = sectionOrder || DEFAULT_ORDER;

    const accent = templateSettings.accentColor || '#1e6bb8';
    const density = templateSettings.density || 'normal';
    const ds = DENSITY_SCALE[density] || DENSITY_SCALE.normal;
    const accentLight = accent + '18';

    const SectionHeading = ({ children, style = {} }) => (
        <h2 style={{ display: 'flex', gap: '10px', marginBottom: style.marginBottom || '14px', alignItems: 'center' }}>
            <span style={{ width: '3px', height: '17px', backgroundColor: accent, flexShrink: 0 }} />
            <span style={{
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accent,
                display: 'block',
                lineHeight: '1',
                paddingTop: '1px',
                ...style
            }}>{children}</span>
        </h2>
    );

    // ── Section renderers ──
    const sections = {
        summary: () => summary ? (
            <section key="summary" className="summary" data-section="summary" style={{ marginBottom: ds.section }}>
                <SectionHeading style={{ marginBottom: '10px' }}>Professional Summary</SectionHeading>
                <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#4a5568', margin: 0 }}>{summary}</p>
            </section>
        ) : null,

        experience: () => experience.length > 0 ? (
            <section key="experience" className="experience" data-section="experience" style={{ marginBottom: ds.section }}>
                <SectionHeading>Work Experience</SectionHeading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: ds.itemGap }}>
                    {experience.map((job, index) => {
                        const isHtml = job.description && job.description.trim().startsWith('<');
                        const descriptionContent = isHtml
                            ? job.description
                            : (job.description
                                ? `<ul style="margin:6px 0 0 16px;padding:0;list-style:disc">${job.description.split('\n').filter(l => l.trim()).map(l => `<li style="margin-bottom:3px;font-size:12.5px;line-height:1.6;color:#4a5568">${l.replace(/^[•\-]\s*/, '')}</li>`).join('')}</ul>`
                                : '');
                        return (
                            <div key={index} className="job-entry" data-job={index} style={{ breakInside: 'avoid' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                                    <h3 className="job-title" style={{ fontSize: '15px', fontWeight: '700', color: '#1a202c', margin: 0 }}>{job.title}</h3>
                                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#718096', whiteSpace: 'nowrap', display: 'flex', gap: '3px' }}>
                                        {job.startDate && <span className="start-date">{job.startDate}</span>}
                                        {job.startDate && <span>–</span>}
                                        {(job.startDate || job.endDate) && <span className="end-date">{job.endDate || 'Present'}</span>}
                                    </div>
                                </div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: accent, marginBottom: '4px', display: 'flex', gap: '6px' }}>
                                    <span className="company">{job.company}</span>
                                    {job.location && (<><span style={{ color: '#a0aec0' }}>·</span><span className="location" style={{ color: '#718096', fontWeight: '400' }}>{job.location}</span></>)}
                                </div>
                                <div className="description" dangerouslySetInnerHTML={{ __html: descriptionContent }} />
                            </div>
                        );
                    })}
                </div>
            </section>
        ) : null,

        education: () => education.length > 0 ? (
            <section key="education" className="education" data-section="education" style={{ marginBottom: ds.section }}>
                <SectionHeading>Education</SectionHeading>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {education.map((edu, index) => (
                        <div key={index} className="education-item" data-education={index} style={{ breakInside: 'avoid' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <h3 className="school" style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', margin: 0 }}>{edu.school}</h3>
                                <div style={{ fontSize: '11px', color: '#718096', display: 'flex', gap: '3px' }}>
                                    {edu.startDate && <span className="start-date">{edu.startDate}</span>}
                                    {edu.startDate && edu.endDate && <span>–</span>}
                                    {edu.endDate && <span className="end-date">{edu.endDate}</span>}
                                </div>
                            </div>
                            <div className="degree" style={{ fontSize: '13px', color: '#4a5568', fontStyle: 'italic' }}>{edu.degree}</div>
                        </div>
                    ))}
                </div>
            </section>
        ) : null,

        skills: () => skills.length > 0 ? (
            <section key="skills" className="skills" data-section="skills" style={{ breakInside: 'avoid', marginBottom: ds.section }}>
                <SectionHeading style={{ marginBottom: '10px' }}>Skills</SectionHeading>
                <div className="skills-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {skills.map((skill, i) => (
                        <span key={i} className="skill-item" style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '5px 12px',
                            fontSize: '11px', fontWeight: '600', color: accent, lineHeight: '1',
                            background: accentLight, borderRadius: '20px', border: `1px solid ${accent}30`
                        }}>
                            <span className="skill-name">{skill.name}</span>
                        </span>
                    ))}
                </div>
            </section>
        ) : null,

        certifications: () => certifications && certifications.length > 0 ? (
            <section key="certifications" className="certifications" data-section="certifications" style={{ breakInside: 'avoid', marginBottom: ds.section }}>
                <SectionHeading style={{ marginBottom: '10px' }}>Certifications</SectionHeading>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {certifications.map((cert, i) => (
                        <li key={i} style={{ fontSize: '12.5px', color: '#4a5568', padding: '3px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: accent, fontWeight: '700', fontSize: '11px' }}>✓</span>
                            <span>{cert}</span>
                        </li>
                    ))}
                </ul>
            </section>
        ) : null,
    };

    return (
        <div
            className="tpl-jupiter font-sans text-gray-800"
            style={{
                '--accent': accent,
                '--accent-light': accentLight,
                fontFamily: '"DM Sans", "Inter", system-ui, sans-serif',
                maxWidth: '100%',
                wordWrap: 'break-word'
            }}
        >
            {/* Accent bar */}
            <div style={{ height: '5px', background: accent, borderRadius: '3px 3px 0 0' }} />

            {/* Light header */}
            <header style={{ background: '#f7fafc', borderBottom: `2px solid ${accent}`, padding: ds.headerPad }}>
                <h1 className="name" style={{
                    fontSize: '26px', fontWeight: '800', letterSpacing: '0.01em',
                    margin: '0 0 2px', lineHeight: '1.2', color: '#1a202c',
                    fontFamily: '"Playfair Display", "Georgia", serif'
                }}>
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                {personalInfo.jobTitle && (
                    <div className="job-title-header" style={{
                        fontSize: '13px', fontWeight: '600', color: accent,
                        letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '10px'
                    }}>
                        {personalInfo.jobTitle}
                    </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '12px', color: '#4a5568', alignItems: 'center' }}>
                    {personalInfo.email && <span className="email" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>✉ {personalInfo.email}</span>}
                    {personalInfo.phone && <span className="phone" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>☎ {personalInfo.phone}</span>}
                    {personalInfo.location && <span className="location" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⌂ {personalInfo.location}</span>}
                    {personalInfo.linkedin && <span className="linkedin" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⬡ {personalInfo.linkedin}</span>}
                </div>
            </header>

            {/* Body — sections rendered in user-defined order */}
            <div style={{ padding: ds.bodyPad }}>
                {order.map(sectionId => sections[sectionId] ? sections[sectionId]() : null)}
            </div>
        </div>
    );
};

export default JupiterTemplate;
