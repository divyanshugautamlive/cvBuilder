import React from 'react';

const EntryLevelTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [] } = data;

    return (
        <div className="p-8 font-sans text-gray-700" style={{ fontFamily: 'Verdana, sans-serif', maxWidth: '100%', wordWrap: 'break-word' }}>

            {/* Centered Header */}
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wide name">
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm text-gray-500 flex justify-center flex-wrap gap-4">
                    {personalInfo.email && (
                        <span className="email">{personalInfo.email}</span>
                    )}
                    {personalInfo.phone && (
                        <span className="phone">{personalInfo.phone}</span>
                    )}
                    {personalInfo.location && (
                        <span className="location">{personalInfo.location}</span>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">

                {/* Summary */}
                {summary && (
                    <section className="bg-gray-50 p-4 rounded-lg border border-gray-100 summary" data-section="summary">
                        <h2 className="text-lg font-bold text-teal-600 uppercase mb-2">Objective</h2>
                        <p className="text-sm leading-relaxed">
                            {summary}
                        </p>
                    </section>
                )}

                {/* Education - Top Priority for Entry Level */}
                {education.length > 0 && (
                    <section className="education" data-section="education">
                        <h2 className="text-lg font-bold text-teal-600 uppercase mb-3 border-b border-gray-200 pb-1">Education</h2>
                        <div className="space-y-4">
                            {education.map((edu, index) => (
                                <div key={index} className="flex justify-between items-start break-inside-avoid education-item" data-education={index}>
                                    <div>
                                        <div className="font-bold text-gray-800 school">{edu.school}</div>
                                        <div className="text-sm text-gray-600 degree">{edu.degree}</div>
                                    </div>
                                    <div className="text-sm text-gray-500 font-semibold flex gap-1">
                                        <span className="start-date">{edu.startDate}</span>
                                        <span>-</span>
                                        <span className="end-date">{edu.endDate}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills used as "Core Strengths" */}
                {skills.length > 0 && (
                    <section className="skills" data-section="skills">
                        <h2 className="text-lg font-bold text-teal-600 uppercase mb-3 border-b border-gray-200 pb-1">Core Strengths</h2>
                        <div className="flex flex-wrap gap-3 skills-list">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold border border-teal-100 skill-item">
                                    <span className="skill-name">{skill.name}</span>
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Experience (Internships/Part-time) */}
                {experience.length > 0 && (
                    <section className="experience" data-section="experience">
                        <h2 className="text-lg font-bold text-teal-600 uppercase mb-3 border-b border-gray-200 pb-1">Experience</h2>
                        <div className="space-y-6">
                            {experience.map((job, index) => {
                                const descriptionContent = (job.description && job.description.trim().startsWith('<'))
                                    ? job.description
                                    : (job.description ? `<p class="text-sm mt-1">${job.description.replace(/\n/g, '<br/>')}</p>` : '');

                                return (
                                    <div key={index} className="break-inside-avoid job-entry" data-job={index}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-bold text-gray-800 job-title">{job.title}</h3>
                                            <div className="text-xs text-gray-500 flex gap-1">
                                                <span className="start-date">{job.startDate}</span>
                                                <span>-</span>
                                                <span className="end-date">{job.endDate || 'Present'}</span>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-teal-600 mb-2 company">
                                            {job.company}
                                        </div>
                                        <div className="text-gray-600 leading-relaxed description" dangerouslySetInnerHTML={{ __html: descriptionContent }} />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
};

export default EntryLevelTemplate;
