import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import { Plus, Trash2 } from 'lucide-react';

const EducationForm = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { education } = resumeData;

    const addEducation = () => {
        const newEdu = {
            id: Date.now(),
            school: '',
            degree: '',
            startDate: '',
            endDate: ''
        };
        updateSection('education', [...education, newEdu]);
    };

    const removeEducation = (index) => {
        const newEdu = [...education];
        newEdu.splice(index, 1);
        updateSection('education', newEdu);
    };

    const handleChange = (index, field, value) => {
        const newEdu = [...education];
        newEdu[index][field] = value;
        updateSection('education', newEdu);
    };

    return (
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                    Education
                </div>
                <button
                    onClick={addEducation}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-100 font-medium flex items-center gap-1 transition-colors"
                >
                    <Plus size={16} /> Add School
                </button>
            </h2>

            <div className="space-y-4">
                {education.map((edu, index) => (
                    <div key={edu.id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                        <button
                            onClick={() => removeEducation(index)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Remove Education"
                        >
                            <Trash2 size={18} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">School / University</label>
                                <input
                                    type="text"
                                    value={edu.school}
                                    onChange={(e) => handleChange(index, 'school', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    placeholder="Harvard University"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Degree</label>
                                <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => handleChange(index, 'degree', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    placeholder="Bachelor of Science in Computer Science"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Start Date</label>
                                <input
                                    type="text"
                                    value={edu.startDate}
                                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    placeholder="2018"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">End Date</label>
                                <input
                                    type="text"
                                    value={edu.endDate}
                                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    placeholder="2022"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                {education.length === 0 && (
                    <div className="text-center py-6 text-gray-400 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-sm">
                        No education added yet.
                    </div>
                )}
            </div>
        </section>
    );
};

export default EducationForm;
