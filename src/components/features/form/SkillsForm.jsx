import React, { useState } from 'react';
import useResumeStore from '../../../store/useResumeStore';
import { X, Plus } from 'lucide-react';

const SkillsForm = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { skills } = resumeData;
    const [newSkill, setNewSkill] = useState('');

    const addSkill = (e) => {
        e.preventDefault();
        if (newSkill.trim()) {
            const skillObj = { name: newSkill.trim(), level: 'Expert' }; // Default level
            updateSection('skills', [...skills, skillObj]);
            setNewSkill('');
        }
    };

    const removeSkill = (index) => {
        const newSkills = [...skills];
        newSkills.splice(index, 1);
        updateSection('skills', newSkills);
    };

    return (
        <section className="mb-20 bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                Skills
            </h2>

            <form onSubmit={addSkill} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Add a skill (e.g. React, Python)"
                />
                <button
                    type="submit"
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition flex items-center gap-2"
                >
                    <Plus size={18} /> Add
                </button>
            </form>

            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border border-blue-100">
                        {skill.name}
                        <button onClick={() => removeSkill(index)} className="hover:text-red-500 transition-colors">
                            <X size={14} />
                        </button>
                    </span>
                ))}
                {skills.length === 0 && (
                    <div className="text-gray-400 text-sm italic">
                        No skills added yet.
                    </div>
                )}
            </div>
        </section>
    );
};

export default SkillsForm;
