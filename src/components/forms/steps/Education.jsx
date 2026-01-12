import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';

const Education = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { education = [] } = resumeData;

    const addEducation = () => {
        const newEdu = {
            id: Date.now(),
            school: "",
            degree: "",
            startDate: "",
            endDate: "",
            location: ""
        };
        updateSection('education', [...education, newEdu]);
    };

    const removeEducation = (index) => {
        const newEdu = education.filter((_, i) => i !== index);
        updateSection('education', newEdu);
    };

    const handleChange = (index, field, value) => {
        const newEdu = [...education];
        newEdu[index] = { ...newEdu[index], [field]: value };
        updateSection('education', newEdu);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                <button
                    onClick={addEducation}
                    className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition font-medium"
                >
                    <Plus size={16} /> Add Education
                </button>
            </div>

            {education.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">No education listed yet.</p>
                    <button onClick={addEducation} className="text-blue-500 font-medium hover:underline">Add your education</button>
                </div>
            )}

            <div className="space-y-6">
                {education.map((edu, index) => (
                    <div key={edu.id || index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group transition hover:shadow-md">
                        <button
                            onClick={() => removeEducation(index)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition p-1"
                            title="Remove"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">School / University</label>
                                <input
                                    type="text"
                                    value={edu.school}
                                    onChange={(e) => handleChange(index, 'school', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Stanford University"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Degree</label>
                                <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => handleChange(index, 'degree', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Bachelor of Science in Computer Science"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">Start Date</label>
                                <input
                                    type="text"
                                    value={edu.startDate}
                                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="YYYY"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600 uppercase">End Date</label>
                                <input
                                    type="text"
                                    value={edu.endDate}
                                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="YYYY or Present"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Education;
