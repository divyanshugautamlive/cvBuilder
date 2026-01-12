import React from 'react';

const ClassicTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [], certifications = [] } = data;

    return (
        <div className="p-8 text-gray-900" style={{ fontFamily: '"Times New Roman", Times, serif', maxWidth: '100%', wordWrap: 'break-word', lineHeight: '1.4' }}>

            {/* Header */}
            <header className="text-center mb-6 pb-2 border-b-2 border-black">
                <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider">
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="flex justify-center flex-wrap gap-4 text-md">
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.email && <span>{personalInfo.email}</span>}

                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase text-center mb-3">Professional Summary</h2>
                    <p className="text-justify">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase text-center mb-4">Experience</h2>
                    <div className="space-y-5">
                        {experience.map((job, index) => (
                            <div key={index}>
                                <div className="flex justify-between font-bold text-lg mb-1">
                                    <span>{job.company}</span>
                                    <span>{job.startDate} - {job.endDate || 'Present'}</span>
                                </div>
                                <div className="italic mb-2">{job.title}, {job.location}</div>
                                <ul className="list-disc list-outside ml-5 space-y-1">
                                    {job.description && job.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase text-center mb-4">Education</h2>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index} className="flex justify-between">
                                <div>
                                    <div className="font-bold text-lg">{edu.school}</div>
                                    <div className="italic">{edu.degree}</div>
                                </div>
                                <div className="font-bold">
                                    {edu.startDate} - {edu.endDate}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-lg font-bold uppercase text-center mb-3">Skills</h2>
                    <div className="text-center">
                        {skills.map((skill, i) => (
                            <span key={i}>
                                {skill.name}{i < skills.length - 1 ? ' | ' : ''}
                            </span>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
};

export default ClassicTemplate;
