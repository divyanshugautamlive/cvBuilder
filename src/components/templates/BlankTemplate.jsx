import React from 'react';

const BlankTemplate = ({ data, templateSettings = {} }) => {
    return (
        <div
            className="tpl-blank"
            style={{
                fontFamily: '"Segoe UI", "Inter", system-ui, -apple-system, sans-serif',
                minHeight: '100%',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#1a202c',
                outline: 'none'
            }}
        >
            {/* Subtle guide text shown when empty */}
            <p style={{
                color: '#a0aec0',
                fontSize: '13px',
                fontStyle: 'italic',
                margin: '0 0 16px',
                borderBottom: '1px dashed #e2e8f0',
                paddingBottom: '12px'
            }}>
                Start typing your resume below — this is a blank canvas. Format freely like a word document.
            </p>

            {/* Editable content area */}
            <div
                contentEditable="true"
                suppressContentEditableWarning={true}
                style={{
                    minHeight: '800px',
                    outline: 'none',
                    cursor: 'text',
                    lineHeight: '1.7',
                    fontSize: '14px'
                }}
                data-placeholder="Type here..."
            >
                {data?.personalInfo?.fullName && (
                    <h1 className="name" style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        margin: '0 0 4px',
                        color: '#1a202c'
                    }}>
                        {data.personalInfo.fullName}
                    </h1>
                )}

                {(data?.personalInfo?.email || data?.personalInfo?.phone || data?.personalInfo?.location) && (
                    <p style={{
                        fontSize: '12px',
                        color: '#718096',
                        margin: '0 0 16px'
                    }}>
                        {[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location]
                            .filter(Boolean)
                            .join(' | ')}
                    </p>
                )}

                {data?.summary && (
                    <section className="summary" data-section="summary">
                        <p style={{ margin: '0 0 16px' }}>{data.summary}</p>
                    </section>
                )}

                {data?.experience?.length > 0 && (
                    <section className="experience" data-section="experience">
                        <h2 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            borderBottom: '1px solid #e2e8f0',
                            paddingBottom: '4px',
                            margin: '16px 0 8px'
                        }}>Experience</h2>
                        {data.experience.map((job, index) => {
                            const isHtml = job.description && job.description.trim().startsWith('<');
                            const descriptionContent = isHtml
                                ? job.description
                                : (job.description
                                    ? `<ul style="margin:4px 0 0 18px;padding:0;list-style:disc"><li>${job.description.split('\n').filter(l => l.trim()).map(l => l.replace(/^[•\-]\s*/, '')).join('</li><li>')}</li></ul>`
                                    : '');
                            return (
                                <div key={index} className="job-entry break-inside-avoid" data-job={index} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong className="job-title">{job.title}</strong>
                                        <span style={{ fontSize: '12px', color: '#718096' }}>
                                            <span className="start-date">{job.startDate}</span> - <span className="end-date">{job.endDate || 'Present'}</span>
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#4a5568' }}>
                                        <span className="company">{job.company}</span>
                                        {job.location && <span className="location"> — {job.location}</span>}
                                    </div>
                                    <div className="description" dangerouslySetInnerHTML={{ __html: descriptionContent }} />
                                </div>
                            );
                        })}
                    </section>
                )}

                {data?.education?.length > 0 && (
                    <section className="education" data-section="education">
                        <h2 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            borderBottom: '1px solid #e2e8f0',
                            paddingBottom: '4px',
                            margin: '16px 0 8px'
                        }}>Education</h2>
                        {data.education.map((edu, index) => (
                            <div key={index} className="education-item break-inside-avoid" data-education={index} style={{ marginBottom: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong className="school">{edu.school}</strong>
                                    <span style={{ fontSize: '12px', color: '#718096' }}>
                                        <span className="start-date">{edu.startDate}</span> - <span className="end-date">{edu.endDate}</span>
                                    </span>
                                </div>
                                <div className="degree" style={{ fontSize: '13px', color: '#4a5568' }}>{edu.degree}</div>
                            </div>
                        ))}
                    </section>
                )}

                {data?.skills?.length > 0 && (
                    <section className="skills" data-section="skills">
                        <h2 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            borderBottom: '1px solid #e2e8f0',
                            paddingBottom: '4px',
                            margin: '16px 0 8px'
                        }}>Skills</h2>
                        <p className="skills-list" style={{ margin: 0 }}>
                            {data.skills.map((skill, i) => (
                                <span key={i} className="skill-item" style={{ display: 'inline' }}>
                                    <span className="skill-name">{skill.name}</span>
                                    {i < data.skills.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </p>
                    </section>
                )}

                {data?.certifications?.length > 0 && (
                    <section className="certifications" data-section="certifications" style={{ marginTop: '16px' }}>
                        <h2 style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            borderBottom: '1px solid #e2e8f0',
                            paddingBottom: '4px',
                            margin: '0 0 8px'
                        }}>Certifications</h2>
                        <ul style={{ margin: 0, paddingLeft: '18px' }}>
                            {data.certifications.map((cert, i) => (
                                <li key={i}>{cert}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
};

export default BlankTemplate;
