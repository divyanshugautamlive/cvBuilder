import React, { useEffect, useState } from 'react';
import useResumeStore from '../../store/useResumeStore';
import { calculateATSScore } from '../../utils/atsScoring';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ATSScoreDisplay = () => {
    const { resumeData } = useResumeStore();
    const [scoreData, setScoreData] = useState({ score: 0, checks: [] });

    useEffect(() => {
        setScoreData(calculateATSScore(resumeData));
    }, [resumeData]);

    const scoreColor =
        scoreData.score >= 80 ? 'text-green-600 bg-green-50' :
            scoreData.score >= 50 ? 'text-yellow-600 bg-yellow-50' :
                'text-red-600 bg-red-50';

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border border-current ${scoreColor} cursor-help group relative`}>
            <span className="font-bold">{scoreData.score}/100</span>
            <span className="text-xs font-medium hidden sm:inline">ATS Score</span>

            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-xl rounded-lg p-4 border border-gray-100 hidden group-hover:block z-50">
                <h3 className="font-bold text-gray-800 mb-2 border-b pb-1">Optimization Tips</h3>
                <ul className="space-y-2">
                    {scoreData.checks.length === 0 ? (
                        <li className="text-green-600 text-sm flex items-start gap-2">
                            <CheckCircle size={16} className="mt-0.5" /> Great job! Your resume is optimized.
                        </li>
                    ) : (
                        scoreData.checks.map((check, i) => (
                            <li key={i} className="text-red-500 text-sm flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {check}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ATSScoreDisplay;
