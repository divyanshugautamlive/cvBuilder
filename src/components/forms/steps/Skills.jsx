import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';

const Skills = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { skills = [] } = resumeData;
    const [inputValue, setInputValue] = useState("");

    const handleAddSkill = (e) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (trimmed && !skills.some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === trimmed.toLowerCase())) {
            // Store as string or object? Let's use string based on new simple logic, 
            // but keep object compatibility if parser uses it. 
            // We'll normalize to object { name: string } for consistency if complex, but simple string is easier for tags.
            // Let's stick to simple strings or {name} objects.
            // The template renderer handles both. Let's start storing as strings for simplicity if new input.
            // Or {name: string, level: 'Expert'} if we want levels.
            // Let's stick to Objects for consistency with existing seed data
            updateSection('skills', [...skills, { name: trimmed }]);
            setInputValue("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddSkill(e);
        }
    };

    const removeSkill = (index) => {
        const newSkills = skills.filter((_, i) => i !== index);
        updateSection('skills', newSkills);
    };

    const getSkillName = (skill) => typeof skill === 'string' ? skill : skill.name;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Skills & Expertise</h2>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Type a skill and press Enter (e.g. React, Project Management)"
                    />
                    <button
                        onClick={handleAddSkill}
                        disabled={!inputValue.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px] content-start bg-gray-50 p-4 rounded-xl border border-gray-200">
                    {skills.length === 0 && (
                        <p className="text-gray-400 w-full text-center py-4">Add skills to show your expertise</p>
                    )}

                    {skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center gap-1 bg-white border border-gray-300 px-3 py-1.5 rounded-full text-sm text-gray-800 shadow-sm animate-in zoom-in duration-200">
                            {getSkillName(skill)}
                            <button
                                onClick={() => removeSkill(index)}
                                className="text-gray-400 hover:text-red-500 transition ml-1"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                    <p className="font-semibold mb-1">Tip:</p>
                    <p>Include a mix of hard skills (tools, languages) and soft skills (leadership, communication).</p>
                </div>
            </div>
        </div>
    );
};

export default Skills;
