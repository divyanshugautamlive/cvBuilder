import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';

const Experience = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { experience = [] } = resumeData;

    const addExperience = () => {
        const newExp = {
            id: Date.now(),
            company: "",
            title: "",
            startDate: "",
            endDate: "",
            location: "",
            description: ""
        };
        updateSection('experience', [...experience, newExp]);
    };

    const removeExperience = (index) => {
        const newExp = experience.filter((_, i) => i !== index);
        updateSection('experience', newExp);
    };

    const handleChange = (index, field, value) => {
        const newExp = [...experience];
        newExp[index] = { ...newExp[index], [field]: value };
        updateSection('experience', newExp);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
                <button
                    onClick={addExperience}
                    className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition font-medium"
                >
                    <Plus size={16} /> Add Position
                </button>
            </div>

            {experience.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">No experience listed yet.</p>
                    <button onClick={addExperience} className="text-blue-500 font-medium hover:underline">Add your first role</button>
                </div>
            )}

            <div className="space-y-6">
                {experience.map((exp, index) => (
                    <div key={exp.id || index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group transition hover:shadow-md">
                        <button
                            onClick={() => removeExperience(index)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition p-1"
                            title="Remove"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Job Title</label>
                                <input
                                    type="text"
                                    value={exp.title}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Senior Developer"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Company</label>
                                <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Google"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Location</label>
                                <input
                                    type="text"
                                    value={exp.location}
                                    onChange={(e) => handleChange(index, 'location', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Mountain View, CA"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Start Date</label>
                                <input
                                    type="text"
                                    value={exp.startDate}
                                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="MM/YYYY"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">End Date</label>
                                <input
                                    type="text"
                                    value={exp.endDate}
                                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="MM/YYYY or Present"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Description</label>
                                <textarea
                                    value={exp.description}
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                    rows={4}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="• Achieved X by doing Y..."
                                />
                                <p className="text-xs text-gray-400 text-right">Use • for bullets</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Experience;
