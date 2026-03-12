import React from 'react';
import { Layout, Award } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';

// ATS-approved templates
const templates = [
    { id: 'classic', name: 'Clean Classic', desc: 'Timeless & Traditional' },
    { id: 'minimalist', name: 'Minimalist', desc: 'Clean & Simple' },
    { id: 'modern', name: 'Modern', desc: 'Sleek & Professional' },
    { id: 'executive', name: 'Corporate Executive', desc: 'Sophisticated & Formal' },
    { id: 'tech', name: 'Tech Industry', desc: 'Structured & Skill-Focused' },
    { id: 'entrylevel', name: 'Entry Level', desc: 'Fresh & Focused' },
    { id: 'jupiter', name: 'Jupiter', desc: 'Modern & Bold', premium: true },
    { id: 'mars', name: 'Mars', desc: 'ATS-Optimized & Clean', premium: true },
    { id: 'blank', name: 'Blank Canvas', desc: 'Free-form Editing' },
];

const TemplateSwitcher = () => {
    const { resumeData, setTemplate } = useResumeStore();

    return (
        <div className="mb-6">
            {/* Template Count Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
                    <Layout size={16} /> SELECT TEMPLATE
                </h3>
                <div className="flex items-center gap-2">
                    <span className="template-count-badge">
                        {templates.length}
                    </span>
                    <span className="text-xs text-gray-500">ATS-Optimized Templates</span>
                </div>
            </div>

            {/* ATS Score Indicator */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 rounded-lg border border-green-100">
                <Award size={18} className="text-green-600" />
                <span className="text-sm text-green-700">
                    All templates score <strong>90-95%</strong> on ATS compatibility
                </span>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {templates.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTemplate(t.id)}
                        className={`template-selector-card p-3 rounded-lg border text-left relative overflow-hidden ${resumeData.selectedTemplate === t.id
                            ? 'active border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:border-transparent dark:bg-transparent dark:ring-0'
                            : 'border-gray-200'
                            }`}
                        style={{ cursor: 'pointer', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                    >
                        {/* Premium badge */}
                        {t.premium && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '6px',
                                    right: '6px',
                                    background: 'linear-gradient(135deg, #f59e0b, #ec4899, #8b5cf6, #3b82f6)',
                                    color: '#fff',
                                    fontSize: '8px',
                                    fontWeight: '800',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    letterSpacing: '0.06em',
                                    lineHeight: '1.4',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
                                }}
                            >
                                ✦ PRO
                            </span>
                        )}
                        <div className="font-medium text-gray-900 text-sm">{t.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSwitcher;
