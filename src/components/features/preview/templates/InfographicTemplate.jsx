import React from 'react';

const InfographicTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, certifications, selectedThemeColor } = data;
    const themeColor = selectedThemeColor || '#2C3E50';

    return (
        <div className="font-sans text-gray-700 min-h-[inherit] bg-white">
            {/* Header with Metrics style */}
            <header className="flex justify-between items-start p-10 border-b-2" style={{ borderColor: themeColor }}>
                <div className="flex-1">
                    <h1 className="text-4xl font-bold uppercase tracking-tight mb-1" style={{ color: themeColor }}>{personalInfo.name}</h1>
                    <p className="text-xl font-light text-gray-500">{personalInfo.jobTitle}</p>
                </div>
                <div className="text-right text-sm space-y-1">
                    <div className="font-medium text-gray-900">{personalInfo.email}</div>
                    <div className="font-medium text-gray-900">{personalInfo.phone}</div>
                    <div className="text-gray-500">{personalInfo.location}</div>
                </div>
            </header>

            <div className="p-10 grid grid-cols-12 gap-8">
                {/* Main Content Column (8 cols) */}
                <div className="col-span-8 space-y-8">
                    {summary && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="text-2xl">⚡</span> Professional Profile
                            </h2>
                            <p className="text-gray-600 leading-relaxed border-l-4 pl-4" style={{ borderColor: `${themeColor}30` }}>
                                {summary}
                            </p>
                        </section>
                    )}

                    {experience?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="text-2xl">📈</span> Work History
                            </h2>
                            <div className="space-y-8">
                                {experience.map((exp, index) => (
                                    <div key={index} className="relative">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-lg font-bold" style={{ color: themeColor }}>{exp.title}</h3>
                                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{exp.startDate} - {exp.current ? 'Now' : exp.endDate}</span>
                                        </div>
                                        <div className="text-md font-semibold text-gray-800 mb-3">{exp.company}</div>
                                        <p className="text-sm text-gray-600">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Sidebar Column (4 cols) */}
                <div className="col-span-4 space-y-8 bg-gray-50 p-6 rounded-lg">
                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-2">Technical Skills</h2>
                            <div className="space-y-3">
                                {skills.map((skill, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between text-xs font-semibold mb-1">
                                            <span>{skill}</span>
                                            {/* Simulated level for visual knowing it's just a list */}
                                            <span className="text-gray-400">High</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: `${Math.floor(Math.random() * 30) + 70}%`, backgroundColor: themeColor }} // Random for visual demo, ideally from data
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-2">Education</h2>
                            {education.map((edu, index) => (
                                <div key={index} className="mb-4 last:mb-0">
                                    <div className="font-bold text-sm">{edu.degree}</div>
                                    <div className="text-xs text-gray-600">{edu.school}</div>
                                    <div className="text-xs text-gray-400 mt-0.5">{edu.graduationDate}</div>
                                </div>
                            ))}
                        </section>
                    )}

                    {certifications?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-2">Credentials</h2>
                            <div className="flex flex-wrap gap-2">
                                {certifications.map((cert, index) => (
                                    <span key={index} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded shadow-sm">
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfographicTemplate;
