import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';

const JobMatcher = () => {
    const { resumeData, updateSection, updateJobMatchScore } = useResumeStore();
    const { jobKeywords = { score: null, matched: [], missing: [] } } = resumeData;
    
    const [jobDesc, setJobDesc] = useState('');
    const [matches, setMatches] = useState(() => {
        return jobKeywords.score !== null ? jobKeywords : null;
    });

    const analyzeJob = () => {
        if (!jobDesc) return;

        const stopWords = new Set([
            'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd",
            'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers',
            'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
            'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
            'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if',
            'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between',
            'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
            'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
            'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
            'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't",
            'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn',
            "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't",
            'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't",
            'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't",
            'job', 'description', 'requirements', 'duties', 'responsibilities', 'work', 'position', 'role', 'team',
            'experience', 'ability', 'qualification', 'qualifications', 'skills', 'candidate', 'candidates',
            'client', 'clients', 'company', 'companies', 'business', 'success', 'successful', 'workplace', 'about',
            'looking', 'join', 'help', 'design', 'develop', 'build', 'create', 'make', 'implement', 'manage', 'support'
        ]);

        const words = jobDesc.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const freq = {};
        words.forEach(w => {
            if (!stopWords.has(w)) {
                freq[w] = (freq[w] || 0) + 1;
            }
        });

        // Sort keywords by frequency descending and take top 20
        const topKeywords = Object.keys(freq)
            .sort((a, b) => freq[b] - freq[a])
            .slice(0, 20);

        if (topKeywords.length === 0) return;

        // Build unified resume text
        const { personalInfo = {}, summary = "", experience = [], education = [], skills = [], certifications = [] } = resumeData;
        const resumeText = [
            personalInfo.fullName,
            personalInfo.jobTitle,
            summary,
            experience.map(j => `${j.title} ${j.company} ${j.description}`).join(' '),
            education.map(e => `${e.degree} ${e.school}`).join(' '),
            skills.map(s => typeof s === 'string' ? s : s.name).join(' '),
            certifications.join(' ')
        ].join(' ').toLowerCase();

        const matched = [];
        const missing = [];

        topKeywords.forEach(word => {
            if (resumeText.includes(word)) {
                matched.push(word);
            } else {
                missing.push(word);
            }
        });

        const score = Math.round((matched.length / topKeywords.length) * 100) || 0;

        const newMatches = { matched, missing, score };
        setMatches(newMatches);
        updateJobMatchScore(score, matched, missing);
    };

    const addSkill = (skill) => {
        const currentSkills = resumeData.skills.map(s => typeof s === 'string' ? s : s.name);
        if (!currentSkills.includes(skill)) {
            const newSkills = [...resumeData.skills, { name: skill, level: 'Intermediate' }];
            updateSection('skills', newSkills);
            
            // Recalculate matches
            const newMatched = [...(matches?.matched || []), skill];
            const newMissing = (matches?.missing || []).filter(m => m !== skill);
            const newScore = Math.round((newMatched.length / (newMatched.length + newMissing.length)) * 100) || 0;

            const newMatches = { matched: newMatched, missing: newMissing, score: newScore };
            setMatches(newMatches);
            updateJobMatchScore(newScore, newMatched, newMissing);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Search size={18} /> Keyword Matcher
            </h3>

            <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description here to find keyword matches..."
                className="w-full p-2 border border-gray-300 rounded mb-4 text-sm h-32"
            />

            <button
                onClick={analyzeJob}
                className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition"
            >
                Analyze Keywords
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
