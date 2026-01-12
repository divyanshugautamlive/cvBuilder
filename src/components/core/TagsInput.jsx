import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export const TagsInput = ({ label, values, onChange, placeholder, maxTags = 20 }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const trimmed = input.trim();
        if (trimmed && !values.includes(trimmed) && values.length < maxTags) {
            onChange([...values, trimmed]);
            setInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(values.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-200 rounded-md min-h-[42px] bg-white">
                {values.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-blue-900">
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={addTag}
                    placeholder={values.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-[120px] outline-none bg-transparent"
                />
            </div>
            <p className="text-xs text-gray-400">Press Enter or Comma to add tags</p>
        </div>
    );
};
