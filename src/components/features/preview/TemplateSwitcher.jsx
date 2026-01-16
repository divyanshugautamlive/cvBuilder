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
                        className={`p-3 rounded-lg border text-left transition-all ${resumeData.selectedTemplate === t.id
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        <div className="font-medium text-gray-900 text-sm">{t.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{t.desc}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TemplateSwitcher;
