import React from 'react';

const TechTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [], certifications = [] } = data;

    return (
        <div className="p-8 font-mono text-gray-800 bg-slate-50 relative" style={{ fontFamily: '"Courier New", Courier, monospace', maxWidth: '100%', wordWrap: 'break-word' }}>

            {/* Decimal Grid Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden"
                style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="mb-8 border-b-2 border-gray-400 pb-6">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2 name">
                        {`> ${personalInfo.fullName || 'User_Name'}`} <span className="animate-pulse">_</span>
                    </h1>
                    <div className="text-sm font-semibold text-gray-600 flex flex-wrap gap-4 items-center">
                        {personalInfo.jobTitle && (
                            <span className="bg-gray-200 px-2 py-1 rounded job-title-header">{personalInfo.jobTitle}</span>
                        )}
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

                <div className="grid grid-cols-[2fr_1fr] gap-8">
                    {/* Left Column */}
                    <main className="space-y-8">

                        {/* Summary */}
                        {summary && (
                            <section className="break-inside-avoid summary" data-section="summary">
                                <h2 className="text-lg font-bold text-blue-900 uppercase mb-3 flex items-center">
                                    <span className="mr-2">#</span>
                                    <span>Summary</span>
                                </h2>
                                <p className="text-sm leading-relaxed border-l-4 border-gray-300 pl-4">
                                    {summary}
                                </p>
                            </section>
                        )}

                        {/* Experience */}
                        {experience.length > 0 && (
                            <section className="experience" data-section="experience">
                                <h2 className="text-lg font-bold text-blue-900 uppercase mb-4 flex items-center">
                                    <span className="mr-2">#</span>
                                    <span>Experience_Log</span>
                                </h2>
                                <div className="space-y-6">
                                    {experience.map((job, index) => {
                                        const isHtml = job.description && job.description.trim().startsWith('<');
                                        const descriptionContent = isHtml
                                            ? job.description
                                            : (job.description ? `<ul class="list-none space-y-1 ml-4 border-l border-dashed border-gray-400 pl-2 mt-2">${job.description.split('\n').filter(line => line.trim()).map(line => `<li><span class="text-blue-600 mr-2">$</span>${line.replace(/^[•-]\s*/, '')}</li>`).join('')}</ul>` : '');

                                        return (
                                            <div key={index} className="break-inside-avoid job-entry" data-job={index}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="text-lg font-bold text-gray-900 job-title">
                                                        {job.title}
                                                    </h3>
                                                    <div className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded border border-gray-300 flex gap-1">
                                                        <span className="start-date">{job.startDate}</span>
                                                        <span>TO</span>
                                                        <span className="end-date">{job.endDate || 'Ongoing'}</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-semibold text-blue-800 mb-2 flex gap-1">
                                                    <span className="hover:underline cursor-pointer company">{job.company}</span>
                                                    <span>@</span>
                                                    <span className="location">{job.location}</span>
                                                </div>
                                                <div className="text-sm text-gray-700 leading-relaxed description" dangerouslySetInnerHTML={{ __html: descriptionContent }} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                    </main>

                    {/* Right Column */}
                    <aside className="space-y-8">

                        {/* Skills */}
                        {skills.length > 0 && (
                            <section className="break-inside-avoid skills" data-section="skills">
                                <h2 className="text-lg font-bold text-blue-900 uppercase mb-3 flex items-center">
                                    <span className="mr-2">#</span>
                                    <span>Tech_Stack</span>
                                </h2>
                                <div className="flex flex-wrap gap-2 skills-list">
                                    {skills.map((skill, i) => (
                                        <span key={i} className="bg-white border border-gray-400 px-2 py-1 text-xs font-bold text-blue-900 rounded shadow-sm flex items-center skill-item">
                                            <span className="skill-name">{skill.name}</span>
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education */}
                        {education.length > 0 && (
                            <section className="education" data-section="education">
                                <h2 className="text-lg font-bold text-blue-900 uppercase mb-3 flex items-center">
                                    <span className="mr-2">#</span>
                                    <span>Education</span>
                                </h2>
                                <div className="space-y-4">
                                    {education.map((edu, index) => (
                                        <div key={index} className="break-inside-avoid education-item" data-education={index}>
                                            <div className="font-bold text-gray-900 border-b border-dashed border-gray-400 pb-1 mb-1 school">
                                                {edu.school}
                                            </div>
                                            <div className="text-xs text-gray-600 mb-1 degree">
                                                {edu.degree}
                                            </div>
                                            <div className="text-xs font-mono text-gray-500 flex gap-1">
                                                <span className="start-date">{edu.startDate}</span>
                                                <span>-</span>
                                                <span className="end-date">{edu.endDate}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certifications */}
                        {certifications && certifications.length > 0 && (
                            <section className="break-inside-avoid certifications" data-section="certifications">
                                <h2 className="text-lg font-bold text-blue-900 uppercase mb-3 flex items-center">
                                    <span className="mr-2">#</span>
                                    <span>Certs</span>
                                </h2>
                                <ul className="space-y-2 text-sm text-gray-700 font-mono">
                                    {certifications.map((cert, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-green-600 mr-2">✓</span>
                                            <span>{cert}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                    </aside>
                </div>
            </div>
        </div>
    );
};

export default TechTemplate;
