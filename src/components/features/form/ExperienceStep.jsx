import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';
import { FormInput, FormTextArea } from '../../core/FormInputs';
import SortableList from '../../core/SortableList';
import AIAssistButton from '../../ai/AIAssistButton';
import CustomDatePicker from '../../core/CustomDatePicker';

const ExperienceStep = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { experience } = resumeData;
    const [activePicker, setActivePicker] = useState(null);

    const addExperience = () => {
        const newExp = {
            id: Date.now(),
            company: '',
            title: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        };
        updateSection('experience', [newExp, ...experience]);
    };

    const removeExperience = (id) => {
        updateSection('experience', experience.filter(exp => exp.id !== id));
    };

    const updateExperience = (id, fieldOrUpdates, value) => {
        const updates = typeof fieldOrUpdates === 'object' ? fieldOrUpdates : { [fieldOrUpdates]: value };
        const currentExperience = useResumeStore.getState().resumeData.experience;
        const updated = currentExperience.map(exp =>
            exp.id === id ? { ...exp, ...updates } : exp
        );
        updateSection('experience', updated);
    };

    const handleReorder = (newOrder) => {
        updateSection('experience', newOrder);
    };

    // Render Function for Sortable List
    const renderExperienceItem = (exp, index) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Remove Position"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                <span className="bg-gray-100 text-gray-500 w-6 h-6 rounded-full flex items-center justify-center text-xs">{index + 1}</span>
                {exp.title || 'Untitled'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Job Title"
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    placeholder="e.g. Project Manager"
                />
                <FormInput
                    label="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="e.g. Acme Corp"
                />
                <CustomDatePicker
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(val) => {
                        updateExperience(exp.id, 'startDate', val);
                    }}
                    isOpen={activePicker === `start-${exp.id}`}
                    onOpen={() => setActivePicker(`start-${exp.id}`)}
                    onClose={() => setActivePicker(null)}
                />
                <CustomDatePicker
                    label="End Date"
                    value={exp.current ? '' : exp.endDate}
                    placeholder={exp.current ? "Present" : "Select Date"}
                    onChange={(val) => updateExperience(exp.id, 'endDate', val)}
                    disabled={exp.current}
                    isOpen={activePicker === `end-${exp.id}`}
                    onOpen={() => setActivePicker(`end-${exp.id}`)}
                    onClose={() => setActivePicker(null)}
                    headerRight={
                        <label htmlFor={`current-exp-${exp.id}`} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
                            <input
                                id={`current-exp-${exp.id}`}
                                type="checkbox"
                                checked={!!exp.current}
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setActivePicker(null);
                                    updateExperience(exp.id, {
                                        current: isChecked,
                                        ...(isChecked ? { endDate: '' } : {})
                                    });
                                }}
                                aria-label="I am currently working here"
                                className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            I currently work here
                        </label>
                    }
                />
            </div>
            <div className="mt-4">
                <FormTextArea
                    label="Description / Bullet Points"
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="• Led a team of 10 developers&#10;• Increased revenue by 20%"
                    rows={5}
                />

                {/* AI Assist Button for Experience */}
                <div className="mt-2 flex items-center gap-2">
                    <AIAssistButton
                        context={`Generate impactful achievement bullets for a ${exp.title || 'professional'} role at ${exp.company || 'a company'}. Focus on quantifiable results.`}
                        onGenerate={(text) => updateExperience(exp.id, 'description', text)}
                        fieldName="job description"
                        placeholder="E.g., Add metrics, Focus on leadership impact, More technical details..."
                    />
                    <span className="text-xs text-gray-400">AI-powered bullet points</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
                    <p className="text-gray-500">Add your relevant work history. Drag to reorder.</p>
                </div>
                <button
                    onClick={addExperience}
                    className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-md hover:bg-blue-100 font-medium transition-colors"
                >
                    <Plus size={18} /> Add Position
                </button>
            </div>

            {experience.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-400">No experience added yet.</p>
                    <button onClick={addExperience} className="mt-2 text-blue-500 hover:underline">Add your first job</button>
                </div>
            )}

            <SortableList
                items={experience}
                onDragEnd={handleReorder}
                renderItem={renderExperienceItem}
            />
        </div>
    );
};

export default ExperienceStep;
