import React from 'react';
import useResumeStore from '../../../store/useResumeStore';

const Summary = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { summary } = resumeData;

    const handleChange = (e) => {
        updateSection('summary', e.target.value);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Professional Summary</h2>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                    Summary
                    <span className="text-xs font-normal text-gray-500 ml-2">({summary?.length || 0} characters)</span>
                </label>
                <textarea
                    value={summary || ''}
                    onChange={handleChange}
                    rows={8}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                    placeholder="Briefly describe your professional background, key achievements, and career goals..."
                />
                <p className="text-xs text-gray-500 text-right">Recommended: 200-500 characters</p>
            </div>
        </div>
    );
};

export default Summary;
