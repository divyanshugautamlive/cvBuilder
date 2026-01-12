import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import { FormTextArea } from '../../core/FormInputs';
import AIAssistButton from '../../ai/AIAssistButton';

const SummaryStep = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { summary } = resumeData;

    return (
        <div className="animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Professional Summary</h2>
            <p className="text-gray-500 mb-6">Write a short, engaging summary of your career.</p>

            <div className="relative">
                <FormTextArea
                    label="Summary"
                    name="summary"
                    value={summary}
                    onChange={(e) => updateSection('summary', e.target.value)}
                    placeholder="Experienced professional with a proven track record..."
                    rows={8}
                    maxLength={500}
                />

                {/* AI Assist Button */}
                <div className="mt-3 flex items-center gap-3">
                    <AIAssistButton
                        context={`Generate a professional summary for ${resumeData.personalInfo?.fullName || 'a professional'} with skills in ${resumeData.skills?.slice(0, 3).map(s => typeof s === 'string' ? s : s.name).join(', ') || 'their field'}.`}
                        onGenerate={(text) => updateSection('summary', text)}
                        fieldName="professional summary"
                        placeholder="E.g., Focus on leadership, Add metrics, Make it more technical..."
                    />
                    <span className="text-xs text-gray-400">Let AI help write your summary</span>
                </div>
            </div>

            <p className="text-sm text-gray-400 mt-4">
                Tip: Keep it between 50-500 characters for optimal ATS scoring.
            </p>
        </div>
    );
};

export default SummaryStep;
