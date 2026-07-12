import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';
import { FormInput } from '../../core/FormInputs';
import SortableList from '../../core/SortableList';
import CustomDatePicker from '../../core/CustomDatePicker';

const EducationStep = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { education } = resumeData;
    const [activePicker, setActivePicker] = useState(null);

    const addEducation = () => {
        updateSection('education', [
            { id: Date.now(), school: '', degree: '', startDate: '', endDate: '', current: false, gpa: '' },
            ...education
        ]);
    };

    const removeEducation = (id) => {
        updateSection('education', education.filter(edu => edu.id !== id));
    };

    const updateEducation = (id, field, value) => {
        updateSection('education', education.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        ));
    };

    const handleReorder = (newOrder) => {
        updateSection('education', newOrder);
    };

    const renderEducationItem = (edu) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => removeEducation(edu.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="School / University"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder="e.g. University of California"
                />
                <FormInput
                    label="Degree / Major"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="e.g. BS Computer Science"
                />
                <CustomDatePicker
                    label="Start Date"
                    value={edu.startDate || ''}
                    onChange={(val) => {
                        updateEducation(edu.id, 'startDate', val);
                        if (!edu.current) {
                            setActivePicker(`end-${edu.id}`);
                        }
                    }}
                    isOpen={activePicker === `start-${edu.id}`}
                    onOpen={() => setActivePicker(`start-${edu.id}`)}
                    onClose={() => setActivePicker(null)}
                />
                <div className="flex flex-col">
                    <CustomDatePicker
                        label="End Date (or Expected)"
                        value={edu.endDate || ''}
                        onChange={(val) => updateEducation(edu.id, 'endDate', val)}
                        disabled={edu.current}
                        isOpen={activePicker === `end-${edu.id}`}
                        onOpen={() => setActivePicker(`end-${edu.id}`)}
                        onClose={() => setActivePicker(null)}
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-600 mt-1 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={edu.current || false}
                            onChange={(e) => {
                                updateEducation(edu.id, 'current', e.target.checked);
                                if (e.target.checked) {
                                    updateEducation(edu.id, 'endDate', '');
                                }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        I currently study here
                    </label>
                </div>
                <FormInput
                    label="GPA (Optional)"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="e.g. 3.8"
                />
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                    <p className="text-gray-500">List your academic background. Drag to reorder.</p>
                </div>
                <button
                    onClick={addEducation}
                    className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-md hover:bg-blue-100 font-medium transition-colors"
                >
                    <Plus size={18} /> Add School
                </button>
            </div>

            {education.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-400">No education listed.</p>
                    <button onClick={addEducation} className="mt-2 text-blue-500 hover:underline">Add your degree</button>
                </div>
            )}

            <SortableList
                items={education}
                onDragEnd={handleReorder}
                renderItem={renderEducationItem}
            />
        </div>
    );
};

export default EducationStep;
