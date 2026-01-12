import React from 'react';

const ExecutiveTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [], certifications = [] } = data;

    // Helper to safely get skill name
    const getSkillName = (skill) => typeof skill === 'string' ? skill : skill.name;

    return (
        <div className="p-10 font-serif text-slate-900" style={{ fontFamily: 'Georgia, serif', maxWidth: '100%', wordWrap: 'break-word', lineHeight: '1.5' }}>

            {/* Header */}
            <header className="border-b-4 border-slate-900 pb-6 mb-8">
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-3 text-center">
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm flex justify-center items-center gap-6 font-sans text-slate-600 uppercase tracking-wider">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}

                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">Executive Summary</h2>
                    <p className="text-justify text-slate-800 leading-relaxed font-sans">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-slate-200 pb-1">Professional Experience</h2>
                    <div className="space-y-6">
                        {experience.map((job, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                                    <span className="font-sans text-sm font-semibold text-slate-500">{job.startDate} – {job.endDate || 'Present'}</span>
                                </div>
                                <div className="text-md font-semibold text-slate-700 italic mb-2">{job.company}, {job.location}</div>
                                <ul className="list-disc list-outside ml-5 space-y-2 text-slate-800 font-sans text-sm">
                                    {job.description && job.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {/* Education */}
                {education.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-slate-200 pb-1">Education</h2>
                        <div className="space-y-4">
                            {education.map((edu, index) => (
                                <div key={index}>
                                    <div className="font-bold text-lg">{edu.school}</div>
                                    <div className="text-slate-700">{edu.degree}</div>
                                    <div className="text-sm text-slate-500 font-sans">{edu.startDate} – {edu.endDate}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills & Certifications */}
                {(skills.length > 0 || certifications.length > 0) && (
                    <section>
                        {skills.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b border-slate-200 pb-1">Core Competencies</h2>
                                <div className="flex flex-wrap gap-x-2 gap-y-1 font-sans text-sm text-slate-800">
                                    {skills.map((skill, i) => (
                                        <span key={i} className="bg-slate-100 px-2 py-1 rounded">
                                            {getSkillName(skill)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>

        </div>
    );
};

export default ExecutiveTemplate;
