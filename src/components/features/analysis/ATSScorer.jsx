import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';

const ATSScorer = () => {
    const { resumeData } = useResumeStore();
    const [score, setScore] = useState(0);
    const [analysis, setAnalysis] = useState([]);

    useEffect(() => {
        const calculateScore = () => {
            let tempScore = 30; // Base score for file format compatibility
            const checks = [];

            // Contact Info (10pts)
            const { personalInfo } = resumeData;
            if (personalInfo.email && personalInfo.phone) {
                tempScore += 10;
                checks.push({ passed: true, msg: "Contact info detected" });
            } else {
                checks.push({ passed: false, msg: "Missing email or phone number" });
            }

            // Sections (15pts)
            if (resumeData.summary && resumeData.experience.length > 0 && resumeData.education.length > 0 && resumeData.skills.length > 0) {
                tempScore += 15;
                checks.push({ passed: true, msg: "All standard sections present" });
            } else {
                checks.push({ passed: false, msg: "Missing standard sections (Summary, Exp, Edu, or Skills)" });
            }

            // Keywords (20pts) - Proxied by skills count
            if (resumeData.skills.length >= 5) {
                tempScore += 20;
                checks.push({ passed: true, msg: "Good keyword density (5+ skills)" });
            } else {
                checks.push({ passed: false, msg: "Low keyword density (<5 skills)" });
            }

            // Formatting (15pts) - Assumed true for our templates
            tempScore += 15;

            // Font (10pts) - Assumed true for our templates
            tempScore += 10;

            setScore(tempScore);
            setAnalysis(checks);
        };

        calculateScore();
    }, [resumeData]);

    const getColor = (s) => {
        if (s >= 90) return 'text-green-600';
        if (s >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">ATS Score</h3>
                <div className={`text-3xl font-bold ${getColor(score)} bg-gray-100 px-3 py-1 rounded-lg`}>
                    {score}/100
                </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div
                    className={`bg-blue-600 h-2.5 rounded-full transition-all duration-1000`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>

            <div className="space-y-3">
                {analysis.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                        {item.passed ? (
                            <CheckCircle size={16} className="text-green-500 mt-0.5" />
                        ) : (
                            <AlertTriangle size={16} className="text-red-500 mt-0.5" />
                        )}
                        <span className={item.passed ? 'text-gray-700' : 'text-red-600 font-medium'}>{item.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ATSScorer;
