import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import { TagsInput } from '../../core/TagsInput';

const SkillsStep = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { skills, certifications } = resumeData;

    // Helper to extract name property if skills are objects, or use raw string
    const skillNames = skills.map(s => typeof s === 'string' ? s : s.name);
    // Helper to format back to store structure (keeping it simple for now)
    const setSkills = (newSkills) => {
        // If store expects objects, map back
        const skillObjects = newSkills.map(s => ({ name: s, level: 'Intermediate' }));
        updateSection('skills', skillObjects);
    };

    const setCerts = (newCerts) => {
        updateSection('certifications', newCerts);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Skills & Certifications</h2>
            <p className="text-gray-500 mb-6">Highlight your technical strengths and credentials.</p>

            <div className="mb-8">
                <TagsInput
                    label="Technical Skills"
                    values={skillNames}
                    onChange={setSkills}
                    placeholder="Type skill & press Enter (e.g. React, Python)"
                    maxTags={30}
                />
            </div>

            <div>
                <TagsInput
                    label="Certifications & Licenses"
                    values={certifications || []}
                    onChange={setCerts}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    maxTags={10}
                />
            </div>
        </div>
    );
};

export default SkillsStep;
