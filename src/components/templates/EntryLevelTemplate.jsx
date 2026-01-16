import React from 'react';

const EntryLevelTemplate = ({ data }) => {
    const { personalInfo = {}, summary, experience = [], education = [], skills = [] } = data;
    const getSkillName = (skill) => typeof skill === 'string' ? skill : skill.name;

    return (
        <div className="p-8 font-sans text-gray-800" style={{ fontFamily: 'Calibri, Arial, sans-serif', maxWidth: '100%', wordWrap: 'break-word' }}>

            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold text-teal-700 mb-2 uppercase">
                    {personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.location && <span>{personalInfo.location}</span>}

                </div>
            </header>

            {/* Content ordered for Entry Level: Summary > Education > Skills > Experience */}

            {summary && (
                <section className="mb-6 bg-gray-50 p-4 rounded-lg break-inside-avoid">
                    <h2 className="text-md font-bold text-teal-800 uppercase mb-2 border-b border-teal-200 pb-1">Objective</h2>
                    <p className="text-sm text-gray-700">{summary}</p>
                </section>
            )}

            {education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-md font-bold text-teal-800 uppercase mb-3 border-b border-teal-200 pb-1">Education</h2>
                    <div className="grid gap-4">
                        {education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start break-inside-avoid">
                                <div>
                                    <div className="font-bold text-gray-900">{edu.school}</div>
                                    <div className="text-teal-700 font-medium">{edu.degree}</div>
                                    {edu.gpa && <div className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</div>}
                                </div>
                                <div className="text-sm text-gray-600 text-right">
                                    {edu.startDate} - {edu.endDate}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {skills.length > 0 && (
                <section className="mb-6 break-inside-avoid">
                    <h2 className="text-md font-bold text-teal-800 uppercase mb-3 border-b border-teal-200 pb-1">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, i) => (
                            <span key={i} className="border border-teal-200 bg-teal-50 px-3 py-1 rounded-full text-sm text-teal-800">
                                {getSkillName(skill)}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-md font-bold text-teal-800 uppercase mb-3 border-b border-teal-200 pb-1">Experience</h2>
                    <div className="space-y-4">
                        {experience.map((job, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between font-bold text-gray-900 mb-1">
                                    <span>{job.title}</span>
                                    <span className="text-sm font-normal text-gray-600">{job.startDate} - {job.endDate || 'Present'}</span>
                                </div>
                                <div className="text-sm text-teal-700 italic mb-2">{job.company}</div>
                                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                                    {job.description && job.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                        <li key={i}>{line.replace(/^[•-]\s*/, '')}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
};

export default EntryLevelTemplate;
