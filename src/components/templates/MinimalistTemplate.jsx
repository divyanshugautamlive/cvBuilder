import React from 'react';

const MinimalistTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [] } = data;

    return (
        <div className="p-8 text-slate-800 font-sans" style={{ fontFamily: 'Georgia, serif', maxWidth: '100%', wordWrap: 'break-word' }}>

            {/* Header */}
            <header className="mb-8">
                <h1 className="text-4xl text-slate-900 mb-2 font-normal">
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm text-slate-500 space-y-1">
                    {personalInfo.email && <div>Email: {personalInfo.email}</div>}
                    {personalInfo.phone && <div>Phone: {personalInfo.phone}</div>}

                    {personalInfo.location && <div>Location: {personalInfo.location}</div>}
                </div>
            </header>

            <div className="grid grid-cols-[1fr_3fr] gap-8">

                {/* Sidebar: Education & Skills */}
                <aside>
                    {/* Education */}
                    {education.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index} className="break-inside-avoid">
                                        <div className="font-bold text-slate-800">{edu.school}</div>
                                        <div className="text-sm text-slate-600 mb-1">{edu.degree}</div>
                                        <div className="text-xs text-slate-400">{edu.startDate} - {edu.endDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Skills</h2>
                            <ul className="text-sm text-slate-700 space-y-2">
                                {skills.map((skill, i) => (
                                    <li key={i} className="border-b border-gray-100 pb-1 last:border-0 break-inside-avoid">{skill.name}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>

                {/* Main Content: Summary & Experience */}
                <main>
                    {/* Summary */}
                    {summary && (
                        <section className="mb-8 break-inside-avoid">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Profile</h2>
                            <p className="text-sm leading-relaxed text-slate-700">{summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Work History</h2>
                            <div className="space-y-6">
                                {experience.map((job, index) => (
                                    <div key={index} className="break-inside-avoid">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="font-bold text-slate-800 text-lg">{job.title}</h3>
                                            <span className="text-xs text-slate-400 font-mono">{job.startDate} — {job.endDate || 'Present'}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-600 mb-2">{job.company}</div>
                                        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                            {job.description}
                                        </p>
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

export default MinimalistTemplate;
