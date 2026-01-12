import React, { useState } from 'react';
import { Target, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import useResumeStore from '../../store/useResumeStore';

const JobMatcher = () => {
    const { resumeData, updateSection } = useResumeStore();
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const analyzeJob = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            // Simplified keyword extraction logic
            const commonKeywords = ["javascript", "react", "node", "python", "sql", "communication", "leadership", "agile", "scrum", "design", "teamwork", "management", "sales", "marketing", "customer", "project", "analysis"];

            const jdLower = jobDescription.toLowerCase();
            const foundKeywords = commonKeywords.filter(k => jdLower.includes(k));

            // Resume text (simplified concatenation)
            const resumeText = JSON.stringify(resumeData).toLowerCase();

            const matched = foundKeywords.filter(k => resumeText.includes(k));
            const missing = foundKeywords.filter(k => !resumeText.includes(k));

            const score = Math.round((matched.length / Math.max(foundKeywords.length, 1)) * 100);

            setAnalysis({
                score,
                matched,
                missing
            });
            setIsAnalyzing(false);
        }, 1000);
    };

    const addKeyword = (keyword) => {
        // Auto-add to skills
        const currentSkills = resumeData.skills || [];
        // Check if exists
        const exists = currentSkills.some(s => (typeof s === 'string' ? s : s.name).toLowerCase() === keyword.toLowerCase());

        if (!exists) {
            updateSection('skills', [...currentSkills, { name: keyword.charAt(0).toUpperCase() + keyword.slice(1) }]);
            // Re-analyze lightly or just update local state
            setAnalysis(prev => ({
                ...prev,
                matched: [...prev.matched, keyword],
                missing: prev.missing.filter(k => k !== keyword),
                score: Math.min(prev.score + 5, 100) // fake accumulation
            }));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
            <h3 className="font-bold flex items-center gap-2 mb-3 text-gray-800">
                <Target size={20} className="text-purple-600" />
                Job Matcher
            </h3>

            {!analysis ? (
                <div className="space-y-3">
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here to analyze match..."
                        className="w-full text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none h-32"
                    />
                    <button
                        onClick={analyzeJob}
                        disabled={!jobDescription.trim() || isAnalyzing}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition"
                    >
                        {isAnalyzing ? "Analyzing..." : "Analyze Match"}
                    </button>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                    <div className="flex items-center justify-between bg-purple-50 p-3 rounded-lg border border-purple-100">
                        <span className="text-sm font-medium text-purple-900">Match Score</span>
                        <span className="text-2xl font-bold text-purple-700">{analysis.score}%</span>
                    </div>

                    {analysis.missing.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                <AlertTriangle size={12} className="text-amber-500" /> Missing Keywords
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {analysis.missing.map(k => (
                                    <button
                                        key={k}
                                        onClick={() => addKeyword(k)}
                                        className="text-xs flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-full hover:bg-amber-100 transition"
                                        title="Click to add to skills"
                                    >
                                        <PlusIcon /> {k}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {analysis.matched.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                <Check size={12} className="text-green-500" /> Matched
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {analysis.matched.map(k => (
                                    <span key={k} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => setAnalysis(null)}
                        className="text-xs text-gray-500 hover:text-gray-800 underline w-full text-center"
                    >
                        Analyze another job
                    </button>
                </div>
            )}
        </div>
    );
};

const PlusIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default JobMatcher;
