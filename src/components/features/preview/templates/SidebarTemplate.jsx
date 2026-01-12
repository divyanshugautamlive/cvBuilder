import React from 'react';

const SidebarTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, certifications, selectedThemeColor } = data;
    const themeColor = selectedThemeColor || '#1E3A5F';

    return (
        <div className="font-sans text-gray-800 min-h-[inherit] flex bg-white">
            {/* Sidebar (Left, 30%) */}
            <div className="w-[30%] text-white p-8 flex flex-col gap-8 shrink-0" style={{ backgroundColor: themeColor }}>
                {/* Contact */}
                <div className="space-y-4 text-sm opacity-90">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 border-b border-white/20 pb-2">Contact</h3>
                    {personalInfo.email && <div className="break-words">{personalInfo.email}</div>}
                    {personalInfo.phone && <div>{personalInfo.phone}</div>}
                    {personalInfo.location && <div>{personalInfo.location}</div>}
                </div>

                {/* Skills */}
                {skills?.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 border-b border-white/20 pb-2 mb-4">Areas of Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span key={index} className="text-sm px-2 py-1 bg-white/10 rounded">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {education?.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 border-b border-white/20 pb-2 mb-4">Education</h3>
                        <div className="space-y-4">
                            {education.map((edu, index) => (
                                <div key={index}>
                                    <div className="font-bold text-white text-sm">{edu.degree}</div>
                                    <div className="text-xs text-white/80">{edu.school}</div>
                                    <div className="text-xs text-white/60">{edu.graduationDate}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications (Sidebar) */}
                {certifications?.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 border-b border-white/20 pb-2 mb-4">Certifications</h3>
                        <ul className="text-sm space-y-2">
                            {certifications.map((cert, index) => (
                                <li key={index} className="opacity-90">• {cert}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Main Content (Right, 70%) */}
            <div className="w-[70%] p-10">
                <header className="mb-8 pb-8 border-b border-gray-100">
                    <h1 className="text-4xl font-serif text-gray-900 mb-2" style={{ color: themeColor }}>{personalInfo.name}</h1>
                    <div className="text-xl font-light text-gray-500 uppercase tracking-wide">{personalInfo.jobTitle}</div>
                </header>

                {summary && (
                    <section className="mb-10">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Executive Summary</h2>
                        <p className="text-gray-700 leading-relaxed text-lg">{summary}</p>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Professional Experience</h2>
                        <div className="space-y-8">
                            {experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-xl font-bold text-gray-800">{exp.title}</h3>
                                        <span className="text-sm text-gray-500 font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                    </div>
                                    <div className="text-md  mb-3" style={{ color: themeColor }}>{exp.company}</div>
                                    <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default SidebarTemplate;
