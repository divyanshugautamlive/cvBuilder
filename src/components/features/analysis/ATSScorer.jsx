import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';

const ATS_TIPS = [
    "Stick to standard section headers and avoid using tables or graphics for best compatibility.",
    "Use keywords from the job description to improve your ATS match rate.",
    "Keep formatting simple — avoid images, columns, and text boxes.",
    "Use a standard font like Arial, Calibri, or Times New Roman.",
    "Save your resume as a PDF to preserve formatting across systems.",
];

const ATSScorer = () => {
    const { resumeData } = useResumeStore();
    const [score, setScore] = useState(0);
    const [checks, setChecks] = useState([]);
    const [showTip, setShowTip] = useState(false);
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
        setTipIndex(Math.floor(Math.random() * ATS_TIPS.length));
    }, []);

    useEffect(() => {
        let tempScore = 30;
        const analysis = [];

        const { personalInfo } = resumeData;
        if (personalInfo.email && personalInfo.phone) {
            tempScore += 10;
            analysis.push({ passed: true, msg: "Contact info detected" });
        } else {
            analysis.push({ passed: false, msg: "Missing email or phone" });
        }

        if (resumeData.summary && resumeData.experience.length > 0 && resumeData.education.length > 0 && resumeData.skills.length > 0) {
            tempScore += 15;
            analysis.push({ passed: true, msg: "All standard sections present" });
        } else {
            analysis.push({ passed: false, msg: "Missing standard sections" });
        }

        if (resumeData.skills.length >= 5) {
            tempScore += 20;
            analysis.push({ passed: true, msg: "Good keyword density (5+ skills)" });
        } else {
            analysis.push({ passed: false, msg: "Low keyword density (<5 skills)" });
        }

        tempScore += 25; // Formatting + Font (assumed for templates)

        setScore(tempScore);
        setChecks(analysis);
    }, [resumeData]);

    const getBarColor = (s) => {
        if (s >= 90) return 'linear-gradient(90deg, #00d4aa, #6c63ff)'; // Cyber Teal to Electric Violet
        if (s >= 70) return '#f59e0b'; // Amber
        return '#ff6b6b'; // Coral
    };

    const getTextColor = (s) => {
        if (s >= 90) return '#00d4aa';
        if (s >= 70) return '#d97706';
        return '#ff6b6b';
    };

    return (
        <div className="bg-white dark:bg-[#12121a] rounded-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-gray-200 dark:border-[#6c63ff]/20 px-[18px] py-[12px] mb-[12px] relative transition-colors">
            {/* Banner row */}
            <div className="flex items-center gap-[14px]">
                {/* Score label + value */}
                <div className="flex items-center gap-[8px] flex-shrink-0">
                    <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300 tracking-wide">ATS</span>
                    <span 
                        className="text-[15px] font-extrabold bg-gray-100 dark:bg-gray-800 rounded-[6px] px-[8px] py-[2px] transition-colors"
                        style={{ color: getTextColor(score) }}
                    >
                        {score}/100
                    </span>
                </div>

                {/* Progress bar */}
                <div className="flex-1 h-[6px] bg-gray-200 dark:bg-[#1a1a2e] rounded-[3px] overflow-hidden">
                    <div style={{
                        width: `${score}%`, 
                        height: '100%', 
                        borderRadius: '3px',
                        background: getBarColor(score), 
                        transition: 'width 0.8s ease',
                        boxShadow: score >= 90 ? '0 0 10px rgba(0, 212, 170, 0.4)' : 'none'
                    }} />
                </div>

                {/* Check badges */}
                <div className="flex gap-[6px] flex-shrink-0">
                    {checks.map((item, i) => (
                        <span key={i} title={item.msg} className="cursor-help">
                            {item.passed ? (
                                <CheckCircle size={15} className="text-emerald-500 dark:text-[#00d4aa]" />
                            ) : (
                                <AlertTriangle size={15} className="text-red-500 dark:text-[#ff6b6b]" />
                            )}
                        </span>
                    ))}
                </div>

                {/* Lightbulb tip icon */}
                <div
                    className="relative flex-shrink-0 cursor-pointer"
                    onMouseEnter={() => setShowTip(true)}
                    onMouseLeave={() => setShowTip(false)}
                >
                    <Lightbulb size={18} className="text-amber-500" />

                    {/* Tooltip */}
                    {showTip && (
                        <div className="absolute right-0 top-[28px] w-[260px] bg-slate-800 dark:bg-[#0a0a0f] text-slate-50 dark:text-[#c9c9d9] text-[12px] leading-relaxed px-[14px] py-[10px] rounded-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.2)] dark:border dark:border-[#6c63ff]/30 z-50 pointer-events-none transition-colors">
                            <div className="font-bold mb-[4px] text-amber-400 text-[11px] uppercase tracking-wider">
                                💡 ATS Tip
                            </div>
                            {ATS_TIPS[tipIndex]}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ATSScorer;
