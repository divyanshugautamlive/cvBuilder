import React from 'react';

const BoldTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, certifications, selectedThemeColor } = data;
    const themeColor = selectedThemeColor || '#2C3E50';

    return (
        <div className="font-sans text-gray-800 leading-relaxed min-h-[inherit]">
            {/* Header */}
            <header className="text-white p-8 mb-8" style={{ backgroundColor: themeColor }}>
                <h1 className="text-5xl font-extrabold tracking-tight mb-2 uppercase">{personalInfo.name}</h1>
                <div className="text-xl font-medium opacity-90 mb-4">{personalInfo.jobTitle}</div>
                <div className="flex flex-wrap gap-4 text-sm opacity-80">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                    {personalInfo.location && <span>• {personalInfo.location}</span>}
                </div>
            </header>

            <div className="px-8">
                {/* Summary */}
                {summary && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-3 uppercase tracking-wider" style={{ color: themeColor, borderBottom: `4px solid ${themeColor}` }}>Profile</h2>
                        <p className="text-gray-700">{summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider" style={{ color: themeColor, borderBottom: `4px solid ${themeColor}` }}>Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={index} className="relative pl-4 border-l-4" style={{ borderColor: `${themeColor}40` }}>
                                    <h3 className="text-lg font-bold">{exp.title}</h3>
                                    <div className="text-md font-semibold text-gray-600 mb-1">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider" style={{ color: themeColor, borderBottom: `4px solid ${themeColor}` }}>Education</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {education.map((edu, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-r-lg border-l-4" style={{ borderColor: themeColor }}>
                                    <h3 className="font-bold">{edu.school}</h3>
                                    <div className="text-sm text-gray-600">{edu.degree}</div>
                                    <div className="text-sm text-gray-500 italic">{edu.graduationDate}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills & Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {skills?.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-3 uppercase tracking-wider" style={{ color: themeColor, borderBottom: `4px solid ${themeColor}` }}>Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 font-medium text-sm rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {certifications?.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold mb-3 uppercase tracking-wider" style={{ color: themeColor, borderBottom: `4px solid ${themeColor}` }}>Certifications</h2>
                            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                {certifications.map((cert, index) => (
                                    <li key={index}>{cert}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BoldTemplate;
