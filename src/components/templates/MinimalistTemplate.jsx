import React from 'react';

const MinimalistTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [] } = data;

    return (
        <div className="p-8 text-slate-800 font-sans" style={{ fontFamily: 'Georgia, serif', maxWidth: '100%', wordWrap: 'break-word' }}>

            {/* Header */}
            <header className="mb-8">
                <h1 className="text-4xl text-slate-900 mb-2 font-normal name">
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm text-slate-500 space-y-1">
                    {personalInfo.email && (
                        <div>Email: <span className="email">{personalInfo.email}</span></div>
                    )}
                    {personalInfo.phone && (
                        <div>Phone: <span className="phone">{personalInfo.phone}</span></div>
                    )}

                    {personalInfo.location && (
                        <div>Location: <span className="location">{personalInfo.location}</span></div>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-[1fr_3fr] gap-8">

                {/* Sidebar: Education & Skills */}
                <aside>
                    {/* Education */}
                    {education.length > 0 && (
                        <section className="mb-8 education" data-section="education">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index} className="break-inside-avoid education-item" data-education={index}>
                                        <div className="font-bold text-slate-800 school">
                                            {edu.school}
                                        </div>
                                        <div className="text-sm text-slate-600 mb-1 degree">
                                            {edu.degree}
                                        </div>
                                        <div className="text-xs text-slate-400 flex gap-1">
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
                        <section className="skills" data-section="skills">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Skills</h2>
                            <ul className="text-sm text-slate-700 space-y-2 skills-list">
                                {skills.map((skill, i) => (
                                    <li key={i} className="border-b border-gray-100 pb-1 last:border-0 break-inside-avoid skill-item">
                                        <span className="skill-name">{skill.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* Main Content: Summary & Experience */}
                <main>
                    {/* Summary */}
                    {summary && (
                        <section className="mb-8 break-inside-avoid summary" data-section="summary">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Profile</h2>
                            <p className="text-sm leading-relaxed text-slate-700">
                                {summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <section className="experience" data-section="experience">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Work History</h2>
                            <div className="space-y-6">
                                {experience.map((job, index) => {
                                    const isHtml = job.description && job.description.trim().startsWith('<');
                                    // Minimalist usually simple text, but assume HTML possible
                                    const initialDec = isHtml ? job.description : (job.description ? job.description.replace(/\n/g, '<br/>') : '');

                                    return (
                                        <div key={index} className="break-inside-avoid job-entry" data-job={index}>
                                            <div className="flex justify-between items-baseline mb-2">
                                                <h3 className="font-bold text-slate-800 text-lg job-title">
                                                    {job.title}
                                                </h3>
                                                <div className="text-xs text-slate-400 font-mono flex gap-1">
                                                    <span className="start-date">{job.startDate}</span>
                                                    <span>—</span>
                                                    <span className="end-date">{job.endDate || 'Present'}</span>
                                                </div>
                                            </div>
                                            <div className="text-sm font-semibold text-slate-600 mb-2 company">
                                                {job.company}
                                            </div>
                                            <div className="text-sm text-slate-700 leading-relaxed description" dangerouslySetInnerHTML={{ __html: initialDec }} />
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}
                </main>

            </div>

        </div>
    );
};

export default MinimalistTemplate;
