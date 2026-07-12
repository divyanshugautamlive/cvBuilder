import React from 'react';

export const FormInput = ({ label, type = "text", name, value, onChange, placeholder, error, warning, required }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-2 border rounded-md outline-none transition-all ${
                error
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : warning
                    ? 'border-amber-400 focus:ring-2 focus:ring-amber-200 bg-amber-50/20'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        {!error && warning && <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">⚠️ {warning}</p>}
    </div>
);

export const FormTextArea = ({ label, name, value, onChange, placeholder, rows = 4, maxLength, error, warning }) => (
    <div className="mb-4">
        <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {maxLength && <span className="text-xs text-gray-400">{value?.length || 0}/{maxLength}</span>}
        </div>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className={`w-full p-2 border rounded-md outline-none transition-all resize-y ${
                error
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : warning
                    ? 'border-amber-400 focus:ring-2 focus:ring-amber-200 bg-amber-50/20'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
            }`}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        {!error && warning && <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">⚠️ {warning}</p>}
    </div>
);
