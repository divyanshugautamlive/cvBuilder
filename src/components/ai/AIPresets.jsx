import React from 'react';

/**
 * AI Presets - Quick action buttons for common AI generation tasks
 */
const AIPresets = ({ onSelect, jobTitle = 'professional' }) => {
    const presets = [
        {
            label: '📝 Generate Summary',
            prompt: `Write a professional 3-sentence summary for a ${jobTitle} role.`,
            description: 'Create a compelling professional summary'
        },
        {
            label: '📊 Add Metrics',
            prompt: 'Add specific metrics and quantifiable achievements to this content.',
            description: 'Make achievements measurable'
        },
        {
            label: '💪 Action Verbs',
            prompt: 'Rewrite using stronger action verbs that demonstrate leadership and impact.',
            description: 'Use powerful language'
        },
        {
            label: '🎯 ATS Keywords',
            prompt: 'Add relevant ATS-friendly keywords for this role while keeping it natural.',
            description: 'Optimize for ATS systems'
        }
    ];

    return (
        <div className="ai-presets">
            <p className="ai-presets-title">Quick AI Actions:</p>
            <div className="ai-presets-grid">
                {presets.map((preset, idx) => (
                    <button
                        key={idx}
                        onClick={() => onSelect(preset.prompt)}
                        className="ai-preset-button"
                        type="button"
                        title={preset.description}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AIPresets;
