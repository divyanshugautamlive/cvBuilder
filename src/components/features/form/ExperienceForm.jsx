import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const ExperienceForm = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { experience } = resumeData;

    const addExperience = () => {
        const newExp = {
            id: Date.now(),
            company: '',
            title: '',
            location: '',
            startDate: '',
            endDate: '',
            description: ''
        };
        updateSection('experience', [...experience, newExp]);
    };

    const removeExperience = (index) => {
        const newExp = [...experience];
        newExp.splice(index, 1);
        updateSection('experience', newExp);
    };

    const handleChange = (index, field, value) => {
        const newExp = [...experience];
        newExp[index][field] = value;
        updateSection('experience', newExp);
    };

    return (
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                    Work Experience
                </div>
                <button
                    onClick={addExperience}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 font-medium flex items-center gap-1 transition-colors"
                >
                    <Plus size={16} /> Add Position
                </button>
            </h2>

            <div className="space-y-6">
                {experience.map((exp, index) => (
                    <div key={exp.id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                        <button
                            onClick={() => removeExperience(index)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Remove Position"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Company</label>
                                <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    placeholder="Company Name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Job Title</label>
                                <input
                                    type="text"
                                    value={exp.title}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    placeholder="Software Engineer"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Start Date</label>
                                <input
                                    type="text"
                                    value={exp.startDate}
                                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    placeholder="MMM YYYY"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">End Date</label>
                                <input
                                    type="text"
                                    value={exp.endDate}
                                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    placeholder="MMM YYYY or Present"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                            <textarea
                                rows={4}
                                value={exp.description}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white resize-y text-sm"
                                placeholder="• Achievements and responsibilities..."
                            />
                        </div>
                    </div>
                ))}

                {experience.length === 0 && (
                    <div className="text-center py-8 text-gray-400 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                        No experience added yet. Click "Add Position" to get started.
                    </div>
                )}
            </div>
        </section>
    );
};

export default ExperienceForm;
