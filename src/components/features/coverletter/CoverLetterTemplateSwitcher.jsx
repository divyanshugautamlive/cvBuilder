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
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {TEMPLATES.map(t => (
                <button
                    key={t.id}
                    onClick={() => onSelect(t.id)}
                    className={`template-selector-card ${selected === t.id ? 'active' : ''}`}
                    style={{
                        flex: '1 1 0',
                        minWidth: '100px',
                        padding: '10px 14px',
                        border: selected === t.id ? '2px solid transparent' : '2px solid #e5e7eb',
                        borderRadius: '10px',
                        background: selected === t.id ? 'transparent' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                    }}
                >
                    <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: selected === t.id ? '#6c63ff' : '#374151',
                        marginBottom: '2px',
                    }}>
                        {t.name}
                    </div>
                    <div style={{
                        fontSize: '11px',
                        color: '#9ca3af',
                        fontWeight: '500',
                    }}>
                        {t.desc}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default CoverLetterTemplateSwitcher;
