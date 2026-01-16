import React from 'react';

const ClassicTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [] } = data;

    return (
        <div className="p-8 text-gray-900" style={{ fontFamily: '"Times New Roman", Times, serif', maxWidth: '100%', wordWrap: 'break-word', lineHeight: '1.4' }}>

            {/* Header */}
            <header className="text-center mb-6 pb-2 border-b-2 border-black">
                <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider name">
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="flex justify-center flex-wrap gap-4 text-md">
                    {personalInfo.location && (
                        <span className="location">{personalInfo.location}</span>
                    )}
                    {personalInfo.phone && (
                        <span className="phone">{personalInfo.phone}</span>
                    )}
                    {personalInfo.email && (
                        <span className="email">{personalInfo.email}</span>
                    )}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6 break-inside-avoid summary" data-section="summary">
                    <h2 className="text-lg font-bold uppercase text-center mb-3">Professional Summary</h2>
                    <p className="text-justify">
                        {summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-6 experience" data-section="experience">
                    <h2 className="text-lg font-bold uppercase text-center mb-4">Experience</h2>
                    <div className="space-y-5">
                        {experience.map((job, index) => {
                            const isHtml = job.description && job.description.trim().startsWith('<');
                            const descriptionContent = isHtml
                                ? job.description
                                : (job.description ? `<ul class="list-disc list-outside ml-5 space-y-1">${job.description.split('\n').filter(line => line.trim()).map(line => `<li>${line.replace(/^[•-]\s*/, '')}</li>`).join('')}</ul>` : '');

                            return (
                                <div key={index} className="break-inside-avoid job-entry" data-job={index}>
                                    <div className="flex justify-between font-bold text-lg mb-1">
                                        <span className="company">{job.company}</span>
                                        <div className="flex gap-1">
                                            <span className="start-date">{job.startDate}</span>
                                            <span>-</span>
                                            <span className="end-date">{job.endDate || 'Present'}</span>
                                        </div>
                                    </div>
                                    <div className="italic mb-2 flex gap-1">
                                        <span className="job-title">{job.title}</span>
                                        <span>,</span>
                                        <span className="location">{job.location}</span>
                                    </div>
                                    <div className="description" dangerouslySetInnerHTML={{ __html: descriptionContent }} />
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-6 education" data-section="education">
                    <h2 className="text-lg font-bold uppercase text-center mb-4">Education</h2>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index} className="flex justify-between break-inside-avoid education-item" data-education={index}>
                                <div>
                                    <div className="font-bold text-lg school">
                                        {edu.school}
                                    </div>
                                    <div className="italic degree">
                                        {edu.degree}
                                    </div>
                                </div>
                                <div className="font-bold flex gap-1">
                                    <span className="start-date">{edu.startDate}</span>
                                    <span>-</span>
                                    <span className="end-date">{edu.endDate}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section className="mb-6 break-inside-avoid skills" data-section="skills">
                    <h2 className="text-lg font-bold uppercase text-center mb-3">Skills</h2>
                    <div className="text-center skills-list">
                        {skills.map((skill, i) => (
                            <span key={i} className="skill-item">
                                <span className="skill-name">{skill.name}</span>
                                {i < skills.length - 1 ? ' | ' : ''}
                            </span>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
};

export default ClassicTemplate;
