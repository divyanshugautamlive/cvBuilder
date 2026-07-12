import React from 'react';

const TEMPLATES = [
    { id: 'classic', name: 'Classic', desc: 'Serif · Centered' },
    { id: 'mars', name: 'Mars', desc: 'Clean · Compact' },
    { id: 'executive', name: 'Executive', desc: 'Bold · Premium' },
];

/**
 * Template switcher buttons for the cover letter preview pane
 */
const CoverLetterTemplateSwitcher = ({ selected, onSelect }) => {
    return (
        <div className="flex gap-2 mb-4 flex-wrap">
            {TEMPLATES.map(t => (
                <button
                    key={t.id}
                    onClick={() => onSelect(t.id)}
                    className={`template-selector-card flex-1 min-w-[100px] p-2.5 rounded-lg border text-center transition-all duration-200 cursor-pointer ${
                        selected === t.id
                            ? 'active border-transparent bg-transparent'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent'
                    }`}
                >
                    <div className={`text-[13px] font-bold mb-0.5 ${
                        selected === t.id ? 'text-[#6c63ff]' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                        {t.name}
                    </div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                        {t.desc}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default CoverLetterTemplateSwitcher;
