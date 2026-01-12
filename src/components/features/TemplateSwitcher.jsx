import React from 'react';
import useResumeStore from '../../store/useResumeStore';
import { LayoutTemplate } from 'lucide-react';

const TemplateSwitcher = () => {
    const { selectedTemplate, setTemplate } = useResumeStore();

    const templates = [
        { id: 'modern', name: 'Modern' },
        { id: 'classic', name: 'Classic' },
        { id: 'minimalist', name: 'Minimalist' },
    ];

    return (
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <div className="px-2 text-gray-400">
                <LayoutTemplate size={16} />
            </div>
            {templates.map((t) => (
                <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${selectedTemplate === t.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    {t.name}
                </button>
            ))}
        </div>
    );
};

export default TemplateSwitcher;
