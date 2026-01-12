import React from 'react';

const GradientTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, certifications, selectedThemeColor } = data;
    const themeColor = selectedThemeColor || '#16A085';

    return (
        <div className="font-sans text-gray-700 min-h-[inherit]" style={{ background: `linear-gradient(to bottom right, #f8f9fa, ${themeColor}10)` }}>
            {/* Header Card */}
            <header className="p-8 mb-6 rounded-b-3xl shadow-sm bg-white border-t-8" style={{ borderColor: themeColor }}>
                <h1 className="text-4xl font-light tracking-wide text-gray-900 mb-2">{personalInfo.name}</h1>
                <div className="text-lg font-medium mb-4" style={{ color: themeColor }}>{personalInfo.jobTitle}</div>
                <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                    {personalInfo.email && <span className="flex items-center gap-1">✉ {personalInfo.email}</span>}
                    {personalInfo.phone && <span className="flex items-center gap-1">📞 {personalInfo.phone}</span>}
                    {personalInfo.location && <span className="flex items-center gap-1">📍 {personalInfo.location}</span>}
                </div>
            </header>

            <div className="px-8 pb-8 space-y-6">
                {/* Summary Card */}
                {summary && (
                    <section className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-lg font-bold mb-3 flex items-center gap-2 uppercase text-gray-400 text-xs tracking-widest">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                            Professional Summary
                        </h2>
                        <p className="leading-relaxed">{summary}</p>
                    </section>
                )}

                {/* Experience Card */}
                {experience?.length > 0 && (
                    <section className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase text-gray-400 text-xs tracking-widest">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                            Experience
                        </h2>
                        <div className="space-y-8">
                            {experience.map((exp, index) => (
                                <div key={index} className="relative pl-6 border-l-2 border-gray-100">
                                    <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold text-gray-800">{exp.title}</h3>
                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-50 text-gray-500">
                                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-500 mb-2">{exp.company}</div>
                                    <p className="text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Education Card */}
                    {education?.length > 0 && (
                        <section className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase text-gray-400 text-xs tracking-widest">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                                Education
                            </h2>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index}>
                                        <h3 className="font-bold text-gray-800">{edu.school}</h3>
                                        <div className="text-sm text-gray-600">{edu.degree}</div>
                                        <div className="text-xs text-gray-400 mt-1">{edu.graduationDate}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills Card */}
                    {skills?.length > 0 && (
                        <section className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 uppercase text-gray-400 text-xs tracking-widest">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
                                Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-100">
                                        {skill}
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

export default GradientTemplate;
