import React from 'react';

const ModernTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [] } = data;

    return (
        <div className="p-8 font-sans text-gray-800" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '100%', wordWrap: 'break-word' }}>

            {/* Header */}
            <header className="border-b-2 border-gray-800 pb-4 mb-6">
                {/* Name */}
                <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-2 name">
                    {personalInfo.fullName || 'Your Name'}
                </h1>

                {/* Contact Info */}
                <div className="text-sm flex flex-wrap gap-3 text-gray-600">
                    <span className="email">{personalInfo.email || 'email@example.com'}</span>

                    {personalInfo.phone && (
                        <>
                            <span>•</span>
                            <span className="phone">{personalInfo.phone}</span>
                        </>
                    )}

                    {personalInfo.location && (
                        <>
                            <span>•</span>
                            <span className="location">{personalInfo.location}</span>
                        </>
                    )}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6 break-inside-avoid summary" data-section="summary">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Professional Summary</h2>
                    <p className="text-sm leading-relaxed">
                        {summary}
                    </p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-6 experience" data-section="experience">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Work Experience</h2>
                    <div className="space-y-4">
                        {experience.map((job, index) => {
                            const isHtml = job.description && job.description.trim().startsWith('<');
                            const descriptionContent = isHtml
                                ? job.description
                                : (job.description ? `<ul class="list-disc list-outside ml-4 text-sm space-y-1">${job.description.split('\n').filter(line => line.trim()).map(line => `<li>${line.replace(/^[•-]\s*/, '')}</li>`).join('')}</ul>` : '');

                            return (
                                <div key={index} className="break-inside-avoid job-entry" data-job={index}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900 job-title">
                                            {job.title}
                                        </h3>
                                        <div className="text-sm text-gray-600 flex gap-1">
                                            <span className="start-date">{job.startDate}</span>
                                            <span>-</span>
                                            <span className="end-date">{job.endDate || 'Present'}</span>
                                        </div>
                                    </div>
                                    <div className="text-sm italic text-gray-700 mb-2 flex gap-1">
                                        <span className="company">{job.company}</span>
                                        <span>,</span>
                                        <span className="location">{job.location}</span>
                                    </div>

                                    <div className="text-sm space-y-1 description" dangerouslySetInnerHTML={{ __html: descriptionContent }} />
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-6 education" data-section="education">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Education</h2>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index} className="break-inside-avoid education-item" data-education={index}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold school">
                                        {edu.school}
                                    </h3>
                                    <div className="text-sm text-gray-600 flex gap-1">
                                        <span className="start-date">{edu.startDate}</span>
                                        <span>-</span>
                                        <span className="end-date">{edu.endDate}</span>
                                    </div>
                                </div>
                                <div className="text-sm degree">
                                    {edu.degree}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section className="mb-6 break-inside-avoid skills" data-section="skills">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Skills</h2>
                    <p className="text-sm leading-relaxed skills-list">
                        {skills.map((skill, i) => (
                            <span key={i} className="inline-block mr-1 skill-item">
                                <span className="skill-name">{skill.name}</span>
                                {i < skills.length - 1 ? ' • ' : ''}
                            </span>
                        ))}
                    </p>
                </section>
            )}

        </div>
    );
};

export default ModernTemplate;
