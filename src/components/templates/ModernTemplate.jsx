import React from 'react';

const ModernTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [], certifications = [] } = data;

    return (
        <div className="p-8 font-sans text-gray-800" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '100%', wordWrap: 'break-word' }}>

            {/* Header */}
            <header className="border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-2">
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm flex flex-wrap gap-3 text-gray-600">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo.location && <span>• {personalInfo.location}</span>}

                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Professional Summary</h2>
                    <p className="text-sm leading-relaxed">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Work Experience</h2>
                    <div className="space-y-4">
                        {experience.map((job, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                                    <span className="text-sm text-gray-600">{job.startDate} - {job.endDate || 'Present'}</span>
                                </div>
                                <div className="text-sm italic text-gray-700 mb-2">{job.company}, {job.location}</div>
                                <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                                    {job.description && job.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Education</h2>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold">{edu.school}</h3>
                                    <span className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</span>
                                </div>
                                <div className="text-sm">{edu.degree}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1">Skills</h2>
                    <p className="text-sm leading-relaxed">
                        {skills.map((skill, i) => (
                            <span key={i} className="inline-block mr-1">
                                {skill.name}{i < skills.length - 1 ? ' • ' : ''}
                            </span>
                        ))}
                    </p>
                </section>
            )}

        </div>
    );
};

export default ModernTemplate;
