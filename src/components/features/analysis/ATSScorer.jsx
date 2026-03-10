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
        if (s >= 90) return '#10b981';
        if (s >= 70) return '#f59e0b';
        return '#ef4444';
    };

    const getTextColor = (s) => {
        if (s >= 90) return '#059669';
        if (s >= 70) return '#d97706';
        return '#dc2626';
    };

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            border: '1px solid #e5e7eb',
            padding: '12px 18px',
            marginBottom: '12px',
            position: 'relative',
        }}>
            {/* Banner row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Score label + value */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>ATS</span>
                    <span style={{
                        fontSize: '15px', fontWeight: '800', color: getTextColor(score),
                        background: '#f3f4f6', borderRadius: '6px', padding: '2px 8px',
                    }}>
                        {score}/100
                    </span>
                </div>

                {/* Progress bar */}
                <div style={{ flex: 1, height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${score}%`, height: '100%', borderRadius: '3px',
                        background: getBarColor(score), transition: 'width 0.8s ease',
                    }} />
                </div>

                {/* Check badges */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {checks.map((item, i) => (
                        <span key={i} title={item.msg} style={{ cursor: 'help' }}>
                            {item.passed ? (
                                <CheckCircle size={15} color="#10b981" />
                            ) : (
                                <AlertTriangle size={15} color="#ef4444" />
                            )}
                        </span>
                    ))}
                </div>

                {/* Lightbulb tip icon */}
                <div
                    style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
                    onMouseEnter={() => setShowTip(true)}
                    onMouseLeave={() => setShowTip(false)}
                >
                    <Lightbulb size={18} color="#f59e0b" />

                    {/* Tooltip */}
                    {showTip && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '28px',
                            width: '260px',
                            background: '#1e293b',
                            color: '#f8fafc',
                            fontSize: '12px',
                            lineHeight: '1.5',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                            zIndex: 50,
                            pointerEvents: 'none',
                        }}>
                            <div style={{ fontWeight: '700', marginBottom: '4px', color: '#fbbf24', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
