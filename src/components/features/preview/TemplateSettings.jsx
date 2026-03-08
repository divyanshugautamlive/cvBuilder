import React, { useState } from 'react';
import { Palette, AlignVerticalSpaceAround, ChevronDown, ChevronUp } from 'lucide-react';
import useResumeStore from '../../../store/useResumeStore';

const ACCENT_PRESETS = [
    { color: '', label: 'Default' },
    { color: '#1e6bb8', label: 'Blue' },
    { color: '#0d9488', label: 'Teal' },
    { color: '#7c3aed', label: 'Purple' },
    { color: '#dc2626', label: 'Red' },
    { color: '#059669', label: 'Green' },
    { color: '#d97706', label: 'Amber' },
    { color: '#db2777', label: 'Pink' },
    { color: '#1a202c', label: 'Dark' },
];

const DENSITY_OPTIONS = [
    { value: 'compact', label: 'Compact', desc: 'Tight spacing, more content per page' },
    { value: 'normal', label: 'Normal', desc: 'Balanced spacing' },
    { value: 'relaxed', label: 'Relaxed', desc: 'Generous spacing, airy feel' },
];

const TemplateSettings = () => {
    const { resumeData, updateTemplateSettings } = useResumeStore();
    const settings = resumeData.templateSettings || { accentColor: '', density: 'normal' };
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-4">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <Palette size={15} />
                    Template Settings
                </span>
                {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>

            {/* Panel */}
            {isOpen && (
                <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm space-y-5">

                    {/* ── Accent Color ── */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            <Palette size={13} /> Accent Color
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ACCENT_PRESETS.map((preset) => (
                                <button
                                    key={preset.color || 'default'}
                                    onClick={() => updateTemplateSettings({ accentColor: preset.color })}
                                    title={preset.label}
                                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${settings.accentColor === preset.color
                                            ? 'border-blue-500 ring-2 ring-blue-200 scale-110'
                                            : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                    style={{
                                        background: preset.color || 'linear-gradient(135deg, #ccc 25%, #eee 25%, #eee 50%, #ccc 50%, #ccc 75%, #eee 75%)',
                                        backgroundSize: preset.color ? undefined : '6px 6px'
                                    }}
                                >
                                    {!preset.color && (
                                        <span className="text-[9px] font-bold text-gray-500">A</span>
                                    )}
                                </button>
                            ))}

                            {/* Custom color input */}
                            <label
                                className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-all overflow-hidden relative ${settings.accentColor && !ACCENT_PRESETS.find(p => p.color === settings.accentColor)
                                        ? 'border-blue-500 ring-2 ring-blue-200'
                                        : 'border-gray-200 hover:border-gray-400'
                                    }`}
                                title="Custom color"
                            >
                                <input
                                    type="color"
                                    value={settings.accentColor || '#1e6bb8'}
                                    onChange={(e) => updateTemplateSettings({ accentColor: e.target.value })}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <span
                                    className="w-full h-full block"
                                    style={{
                                        background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                                    }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* ── Density ── */}
                    <div>
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            <AlignVerticalSpaceAround size={13} /> Density
                        </label>
                        <div className="flex gap-2">
                            {DENSITY_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => updateTemplateSettings({ density: opt.value })}
                                    className={`flex-1 px-3 py-2 rounded-lg border text-center transition-all ${settings.density === opt.value
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="text-sm font-medium">{opt.label}</div>
                                    <div className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateSettings;
