import React from 'react';

const TechTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills, certifications } = data;

    return (
        <div className="font-sans text-gray-800" style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-light text-blue-700 mb-1">{personalInfo.fullName}</h1>
                <p className="text-xl font-bold mb-3">{personalInfo.jobTitle}</p>
                <div className="text-sm text-gray-600 flex flex-wrap gap-4 border-t border-gray-200 pt-3">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                </div>
            </div>

            {/* Skills - Prominent for Tech */}
            {skills?.length > 0 && (
                <div className="mb-8 p-4 bg-gray-50 rounded">
                    <h2 className="text-md font-bold text-blue-700 uppercase mb-3">Technical Skills</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                        {skills.map((s, i) => (
                            <span key={i} className="text-gray-800">{typeof s === 'string' ? s : s.name}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-md font-bold text-blue-700 uppercase mb-4 border-b border-gray-200 pb-1">Experience</h2>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-6">
                            <div className="flex justify-between font-bold text-gray-900 mb-1">
                                <div>{exp.title}</div>
                                <div className="text-sm">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
                            </div>
                            <div className="text-blue-600 font-medium mb-2 text-sm">{exp.company}</div>
                            {exp.description && (
                                <ul className="list-square ml-5 text-sm space-y-1 text-gray-700">
                                    {exp.description.split('\n').map((line, i) => (
                                        line.trim() && <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-md font-bold text-blue-700 uppercase mb-4 border-b border-gray-200 pb-1">Education</h2>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between font-bold">
                                <div>{edu.school}</div>
                                <div className="text-sm font-normal">{edu.graduationDate}</div>
                            </div>
                            <div className="text-sm">{edu.degree}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TechTemplate;
