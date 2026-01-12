import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';

const JobMatcher = () => {
    const { resumeData, updateSection } = useResumeStore();
    const [jobDesc, setJobDesc] = useState('');
    const [matches, setMatches] = useState(null);

    const analyzeJob = () => {
        if (!jobDesc) return;

        // Simple mock keyword extraction (looks for capitalized words or common tech terms)
        const commonTech = ['react', 'javascript', 'node', 'python', 'java', 'sql', 'aws', 'docker', 'agile', 'scrum', 'leadership', 'communication'];
        const words = jobDesc.toLowerCase().match(/\b\w+\b/g) || [];

        const meaningfulWords = words.filter(w => commonTech.includes(w) || w.length > 5);
        const uniqueJobKeywords = [...new Set(meaningfulWords)];

        const resumeText = JSON.stringify(resumeData).toLowerCase();

        const matched = [];
        const missing = [];

        uniqueJobKeywords.forEach(word => {
            if (resumeText.includes(word)) {
                matched.push(word);
            } else {
                missing.push(word);
            }
        });

        const score = Math.round((matched.length / uniqueJobKeywords.length) * 100) || 0;

        setMatches({ matched, missing, score });
    };

    const addSkill = (skill) => {
        const currentSkills = resumeData.skills.map(s => typeof s === 'string' ? s : s.name);
        if (!currentSkills.includes(skill)) {
            // Add as object to match store structure
            const newSkills = [...resumeData.skills, { name: skill, level: 'Intermediate' }];
            updateSection('skills', newSkills);
            // Optimistically move from missing to matched
            setMatches(prev => ({
                ...prev,
                matched: [...prev.matched, skill],
                missing: prev.missing.filter(m => m !== skill)
            }));
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Search size={18} /> Job Matcher
            </h3>

            <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description here to analyze match..."
                className="w-full p-2 border border-gray-300 rounded mb-4 text-sm h-32"
            />

            <button
                onClick={analyzeJob}
                className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition"
            >
                Analyze Match
            </button>

            {matches && (
                <div className="mt-6 animate-in fade-in">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-gray-600 text-sm">Match Score</span>
                        <span className="text-2xl font-bold text-indigo-600">{matches.score}%</span>
                    </div>

                    {matches.missing.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-red-500 uppercase mb-2">Missing Keywords</p>
                            <div className="flex flex-wrap gap-2">
                                {matches.missing.map((word, i) => (
                                    <button
                                        key={i}
                                        onClick={() => addSkill(word)}
                                        className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs border border-red-100 dashed hover:bg-red-100 flex items-center gap-1 group"
                                        title="Click to add to Skills"
                                    >
                                        {word} <Plus size={10} className="opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {matches.matched.length > 0 && (
                        <div className="mt-4">
                            <p className="text-xs font-bold text-green-600 uppercase mb-2">Matched</p>
                            <div className="flex flex-wrap gap-2">
                                {matches.matched.map((word, i) => (
                                    <span key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs border border-green-100">
                                        {word}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobMatcher;
