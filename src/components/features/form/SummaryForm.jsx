import React from 'react';
import useResumeStore from '../../../store/useResumeStore';

const SummaryForm = () => {
    const { resumeData, updateSection } = useResumeStore();
    const { summary } = resumeData;

    const handleChange = (e) => {
        updateSection('summary', e.target.value);
    };

    return (
        <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Professional Summary
            </h2>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Summary
                    <span className="text-gray-400 font-normal ml-2 text-xs">Briefly describe your career highlights and value proposition.</span>
                </label>
                <textarea
                    rows={5}
                    value={summary || ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-y"
                    placeholder="Experienced Software Engineer with 5+ years of experience..."
                />
                <div className="flex justify-end mt-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
                        ✨ AI Suggestions
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SummaryForm;
