import React from 'react';

const TechTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [], certifications = [] } = data;
    const getSkillName = (skill) => typeof skill === 'string' ? skill : skill.name;

    return (
        <div className="p-8 font-sans text-gray-800" style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: '100%', wordWrap: 'break-word' }}>

            {/* Header */}
            <header className="flex justify-between items-start mb-8 pb-4 border-b border-gray-200">
                <div className="flex-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-blue-700 mb-2">
                        {personalInfo.fullName || 'Your Name'}
                    </h1>
                    <div className="text-lg text-gray-600 font-medium">
                        {personalInfo.jobTitle || 'Software Engineer'}
                    </div>
                </div>
                <div className="text-right text-sm text-gray-500 space-y-1">
                    {personalInfo.email && <div>{personalInfo.email}</div>}
                    {personalInfo.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo.location && <div>{personalInfo.location}</div>}

                    {personalInfo.website && <div className="text-blue-600">{personalInfo.website}</div>}
                </div>
            </header>

            <div className="grid grid-cols-[1fr_2fr] gap-8">

                {/* Left Column: Skills & Education */}
                <aside className="space-y-8">
                    {skills.length > 0 && (
                        <section className="break-inside-avoid">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Technical Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded pointer-events-none">
                                        {getSkillName(skill)}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {education.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index} className="break-inside-avoid">
                                        <div className="font-bold text-gray-800">{edu.school}</div>
                                        <div className="text-sm text-gray-600">{edu.degree}</div>
                                        <div className="text-xs text-gray-400 mt-1">{edu.startDate} - {edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {certifications.length > 0 && (
                        <section className="break-inside-avoid">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Certifications</h2>
                            <ul className="text-sm text-gray-600 space-y-2">
                                {certifications.map((cert, i) => (
                                    <li key={i}>{cert}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* Right Column: Summary & Experience */}
                <main className="space-y-8">
                    {summary && (
                        <section className="break-inside-avoid">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">About Me</h2>
                            <p className="text-gray-600 leading-relaxed text-sm">{summary}</p>
                        </section>
                    )}

                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Experience</h2>
                            <div className="space-y-8 relative border-l-2 border-gray-100 pl-6 ml-2">
                                {experience.map((job, index) => (
                                    <div key={index} className="relative break-inside-avoid">
                                        <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                                            <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{job.startDate} — {job.endDate || 'Present'}</span>
                                        </div>
                                        <div className="text-blue-600 font-medium text-sm mb-3">{job.company}</div>
                                        <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-2">
                                            {job.description && job.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                                <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

            </div>
        </div>
    );
};

export default TechTemplate;
