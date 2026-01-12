import React from 'react';

const CreativeTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, certifications, selectedThemeColor } = data;
    const themeColor = selectedThemeColor || '#8E44AD';

    return (
        <div className="font-sans text-gray-800 min-h-[inherit] bg-white relative overflow-hidden">
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-32 -translate-y-32 rotate-45 opacity-10" style={{ backgroundColor: themeColor }}></div>

            <div className="p-10 relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-black mb-3" style={{ color: themeColor }}>{personalInfo.name}</h1>
                    <div className="inline-block px-4 py-1 bg-gray-900 text-white text-sm font-bold uppercase tracking-widest rounded-full mb-6">
                        {personalInfo.jobTitle}
                    </div>
                    <div className="flex justify-center gap-6 text-sm font-medium text-gray-500">
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                    </div>
                </header>

                <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-12 md:col-span-4 space-y-8 text-right md:text-right border-r pr-10 border-gray-100">
                        {/* Summary side */}
                        {summary && (
                            <section>
                                <h2 className="text-lg font-bold mb-3" style={{ color: themeColor }}>About Me</h2>
                                <p className="text-gray-600 text-sm leading-relaxed">{summary}</p>
                            </section>
                        )}

                        {/* Skills side */}
                        {skills?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold mb-3" style={{ color: themeColor }}>My Toolkit</h2>
                                <div className="flex flex-wrap justify-end gap-2">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="text-xs font-bold px-2 py-1 bg-gray-50 rounded text-gray-600 border border-gray-100">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Education side */}
                        {education?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-bold mb-3" style={{ color: themeColor }}>Education</h2>
                                {education.map((edu, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="font-bold text-gray-800">{edu.school}</div>
                                        <div className="text-sm text-gray-500">{edu.degree}</div>
                                        <div className="text-xs text-gray-400">{edu.graduationDate}</div>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>

                    <div className="col-span-12 md:col-span-8 space-y-10 pl-2">
                        {/* Experience Main */}
                        {experience?.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-black mb-8 opacity-10 uppercase tracking-tighter" style={{ color: themeColor }}>Works</h2>
                                <div className="space-y-10">
                                    {experience.map((exp, index) => (
                                        <div key={index} className="group">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg text-xl font-bold text-gray-300 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                                                    <div className="text-sm font-medium" style={{ color: themeColor }}>{exp.company}</div>
                                                </div>
                                                <div className="ml-auto text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                    {exp.startDate} — {exp.current ? 'Now' : exp.endDate}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 pl-16 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certs Main */}
                        {certifications?.length > 0 && (
                            <section className="pt-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Certifications & Awards</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {certifications.map((cert, index) => (
                                        <div key={index} className="p-3 bg-gray-50 rounded border border-gray-100 text-sm font-medium text-gray-700">
                                            {cert}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreativeTemplate;
