import React from 'react';

const ExecutiveTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [], certifications = [] } = data;

    return (
        <div className="p-10 font-serif text-slate-800" style={{ fontFamily: '"Palatino Linotype", "Book Antiqua", Palatino, serif', maxWidth: '100%', wordWrap: 'break-word' }}>

            {/* Header */}
            <header className="border-b-4 border-slate-700 pb-6 mb-8 text-center">
                <h1 className="text-4xl font-bold uppercase tracking-widest text-slate-900 mb-3 name">
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm font-semibold text-slate-600 flex justify-center flex-wrap gap-4 uppercase tracking-wider">
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

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-8">

                {/* Summary */}
                {summary && (
                    <section className="break-inside-avoid summary" data-section="summary">
                        <h2 className="text-xl font-bold uppercase border-b-2 border-slate-300 mb-4 pb-1 text-slate-800">
                            Executive Profile
                        </h2>
                        <p className="text-md leading-relaxed text-justify">
                            {summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {experience.length > 0 && (
                    <section className="experience" data-section="experience">
                        <h2 className="text-xl font-bold uppercase border-b-2 border-slate-300 mb-4 pb-1 text-slate-800">
                            Professional Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((job, index) => {
                                const isHtml = job.description && job.description.trim().startsWith('<');
                                const descriptionContent = isHtml
                                    ? job.description
                                    : (job.description ? `<ul class="list-disc list-outside ml-5 space-y-2 mt-2">${job.description.split('\n').filter(line => line.trim()).map(line => `<li>${line.replace(/^[•-]\s*/, '')}</li>`).join('')}</ul>` : '');

                                return (
                                    <div key={index} className="break-inside-avoid job-entry" data-job={index}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-xl font-bold text-slate-900 job-title">{job.title}</h3>
                                            <div className="text-sm font-bold text-slate-600 uppercase tracking-wide flex gap-1">
                                                <span className="start-date">{job.startDate}</span>
                                                <span>-</span>
                                                <span className="end-date">{job.endDate || 'Present'}</span>
                                            </div>
                                        </div>
                                        <div className="text-md font-semibold text-slate-700 italic mb-2 flex gap-1">
                                            <span className="company">{job.company}</span>
                                            <span>|</span>
                                            <span className="location">{job.location}</span>
                                        </div>
                                        <div className="text-md leading-relaxed text-slate-800 description" dangerouslySetInnerHTML={{ __html: descriptionContent }} />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <section className="education" data-section="education">
                        <h2 className="text-xl font-bold uppercase border-b-2 border-slate-300 mb-4 pb-1 text-slate-800">
                            Education
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {education.map((edu, index) => (
                                <div key={index} className="break-inside-avoid education-item" data-education={index}>
                                    <div className="flex justify-between items-baseline font-bold text-lg">
                                        <span className="school">{edu.school}</span>
                                        <div className="flex gap-1">
                                            <span className="start-date">{edu.startDate}</span>
                                            <span>-</span>
                                            <span className="end-date">{edu.endDate}</span>
                                        </div>
                                    </div>
                                    <div className="text-md italic text-slate-700 degree">
                                        {edu.degree}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {skills.length > 0 && (
                        <section className="break-inside-avoid skills" data-section="skills">
                            <h2 className="text-xl font-bold uppercase border-b-2 border-slate-300 mb-4 pb-1 text-slate-800">
                                Core Competencies
                            </h2>
                            <ul className="grid grid-cols-1 gap-2 text-md font-semibold text-slate-700 skills-list">
                                {skills.map((skill, i) => (
                                    <li key={i} className="flex items-center skill-item">
                                        <span className="mr-2 text-slate-400">■</span>
                                        <span className="skill-name">{skill.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {certifications && certifications.length > 0 && (
                        <section className="break-inside-avoid certifications" data-section="certifications">
                            <h2 className="text-xl font-bold uppercase border-b-2 border-slate-300 mb-4 pb-1 text-slate-800">
                                Certifications
                            </h2>
                            <ul className="list-none space-y-2 text-md text-slate-700">
                                {certifications.map((cert, i) => (
                                    <li key={i} className="flex items-start">
                                        <span className="mr-2 text-slate-400 mt-1">♦</span>
                                        <span>{cert}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ExecutiveTemplate;
