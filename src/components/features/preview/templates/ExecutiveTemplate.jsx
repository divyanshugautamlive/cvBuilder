import React from 'react';

const ExecutiveTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills } = data;

    return (
        <div className="text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            <div className="flex justify-between items-end border-b-4 border-gray-900 pb-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold uppercase">{personalInfo.fullName}</h1>
                    <p className="text-lg italic mt-1">{personalInfo.jobTitle}</p>
                </div>
                <div className="text-right text-sm leading-relaxed">
                    <div>{personalInfo.email}</div>
                    <div>{personalInfo.phone}</div>
                    <div>{personalInfo.location}</div>
                </div>
            </div>

            {summary && (
                <div className="mb-8">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 text-gray-700">Executive Profile</h2>
                    <p className="leading-relaxed">{summary}</p>
                </div>
            )}

            {experience?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 text-gray-700">Professional Experience</h2>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-6">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-lg">{exp.company}</h3>
                                <span className="font-bold text-sm">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <div className="italic mb-2">{exp.title}</div>
                            {exp.description && (
                                <ul className="list-disc ml-5 text-sm space-y-1">
                                    {exp.description.split('\n').map((line, i) => (
                                        line.trim() && <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {education?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 text-gray-700">Education</h2>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between">
                                <span className="font-bold">{edu.school}</span>
                                <span>{edu.graduationDate}</span>
                            </div>
                            <div>{edu.degree}</div>
                        </div>
                    ))}
                </div>
            )}

            {skills?.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 text-gray-700">Core Competencies</h2>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        {skills.map((s, i) => (
                            <div key={i}>• {typeof s === 'string' ? s : s.name}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExecutiveTemplate;
