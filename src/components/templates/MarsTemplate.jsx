import React from 'react';

const DENSITY_SCALE = {
    compact: { section: '10px', gap: '8px', headerMb: '10px' },
    normal: { section: '16px', gap: '14px', headerMb: '16px' },
    relaxed: { section: '24px', gap: '20px', headerMb: '24px' },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'certifications'];

const MarsTemplate = ({ data, templateSettings = {}, sectionOrder }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [], certifications = [] } = data;
    const order = sectionOrder || DEFAULT_ORDER;

    const accent = templateSettings.accentColor || '#2d3748';
    const density = templateSettings.density || 'normal';
    const ds = DENSITY_SCALE[density] || DENSITY_SCALE.normal;

    const sectionHeadingStyle = {
        fontSize: '11px',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: accent,
        borderBottom: '1px solid #cbd5e0',
        paddingBottom: '4px',
        marginBottom: '8px'
    };

    const sections = {
        summary: () => summary ? (
            <section key="summary" className="summary" data-section="summary" style={{ marginBottom: ds.section }}>
                <h2 style={sectionHeadingStyle}>Summary</h2>
                <p style={{ fontSize: '12.5px', lineHeight: '1.65', color: '#2d3748', margin: 0 }}>{summary}</p>
            </section>
        ) : null,

        experience: () => experience.length > 0 ? (
            <section key="experience" className="experience" data-section="experience" style={{ marginBottom: ds.section }}>
                <h2 style={{ ...sectionHeadingStyle, marginBottom: '10px' }}>Experience</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: ds.gap }}>
                    {experience.map((job, index) => {
                        const isHtml = job.description && job.description.trim().startsWith('<');
                        const descriptionContent = isHtml
                            ? job.description
                            : (job.description
                                ? `<ul style="margin:4px 0 0 14px;padding:0;list-style:disc">${job.description.split('\n').filter(l => l.trim()).map(l => `<li style="margin-bottom:2px;font-size:12px;line-height:1.6;color:#2d3748">${l.replace(/^[•\-]\s*/, '')}</li>`).join('')}</ul>`
                                : '');
                        return (
                            <div key={index} className="job-entry" data-job={index} style={{ breakInside: 'avoid' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <h3 className="job-title" style={{ fontSize: '13.5px', fontWeight: '700', color: '#1a202c', margin: 0 }}>{job.title}</h3>
                                    <span style={{ fontSize: '11px', color: '#718096', whiteSpace: 'nowrap', display: 'flex', gap: '3px' }}>
                                        <span className="start-date">{job.startDate}</span><span>-</span><span className="end-date">{job.endDate || 'Present'}</span>
                                    </span>
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#4a5568', marginBottom: '2px', display: 'flex', gap: '4px' }}>
                                    <span className="company">{job.company}</span>
                                    {job.location && (<><span style={{ color: '#a0aec0' }}>-</span><span className="location">{job.location}</span></>)}
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
                <h2 style={{ ...sectionHeadingStyle, marginBottom: '10px' }}>Education</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {education.map((edu, index) => (
                        <div key={index} className="education-item" data-education={index} style={{ breakInside: 'avoid' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <h3 className="school" style={{ fontSize: '13px', fontWeight: '700', color: '#1a202c', margin: 0 }}>{edu.school}</h3>
                                <span style={{ fontSize: '11px', color: '#718096', display: 'flex', gap: '3px' }}>
                                    <span className="start-date">{edu.startDate}</span><span>-</span><span className="end-date">{edu.endDate}</span>
                                </span>
                            </div>
                            <div className="degree" style={{ fontSize: '12.5px', color: '#4a5568' }}>{edu.degree}</div>
                        </div>
                    ))}
                </div>
            </section>
        ) : null,

        skills: () => skills.length > 0 ? (
            <section key="skills" className="skills" data-section="skills" style={{ marginBottom: ds.section, breakInside: 'avoid' }}>
                <h2 style={sectionHeadingStyle}>Skills</h2>
                <p className="skills-list" style={{ fontSize: '12.5px', color: '#2d3748', margin: 0, lineHeight: '1.7' }}>
                    {skills.map((skill, i) => (
                        <span key={i} className="skill-item" style={{ display: 'inline' }}>
                            <span className="skill-name">{skill.name}</span>
                            {i < skills.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </p>
            </section>
        ) : null,

        certifications: () => certifications && certifications.length > 0 ? (
            <section key="certifications" className="certifications" data-section="certifications" style={{ breakInside: 'avoid', marginBottom: ds.section }}>
                <h2 style={sectionHeadingStyle}>Certifications</h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '16px', margin: 0 }}>
                    {certifications.map((cert, i) => (
                        <li key={i} style={{ fontSize: '12.5px', color: '#2d3748', marginBottom: '2px' }}>{cert}</li>
                    ))}
                </ul>
            </section>
        ) : null,
    };

    return (
        <div
            className="tpl-mars font-sans text-gray-900"
            style={{
                fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
                maxWidth: '100%', wordWrap: 'break-word', fontSize: '13px', lineHeight: '1.5'
            }}
        >
            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: ds.headerMb, paddingBottom: '14px', borderBottom: `2px solid ${accent}` }}>
                <h1 className="name" style={{
                    fontSize: '24px', fontWeight: '700', color: '#1a202c',
                    margin: '0 0 6px', letterSpacing: '0.01em', lineHeight: '1.2'
                }}>
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div style={{ fontSize: '12px', color: '#4a5568', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px' }}>
                    {personalInfo.email && <span className="email">{personalInfo.email}</span>}
                    {personalInfo.email && personalInfo.phone && <span style={{ color: '#a0aec0' }}>|</span>}
                    {personalInfo.phone && <span className="phone">{personalInfo.phone}</span>}
                    {(personalInfo.email || personalInfo.phone) && personalInfo.location && <span style={{ color: '#a0aec0' }}>|</span>}
                    {personalInfo.location && <span className="location">{personalInfo.location}</span>}
                    {(personalInfo.email || personalInfo.phone || personalInfo.location) && personalInfo.linkedin && <span style={{ color: '#a0aec0' }}>|</span>}
                    {personalInfo.linkedin && <span className="linkedin">{personalInfo.linkedin}</span>}
                </div>
            </header>

            {/* Sections in user-defined order */}
            {order.map(sectionId => sections[sectionId] ? sections[sectionId]() : null)}
        </div>
    );
};

export default MarsTemplate;
