import React from 'react';
import useResumeStore from '../../../store/useResumeStore';

const PersonalInfo = () => {
    const { resumeData, updatePersonalInfo } = useResumeStore();
    const { personalInfo } = resumeData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        updatePersonalInfo({ [name]: value });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                    <input
                        type="text"
                        name="fullName"
                        value={personalInfo.fullName || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Job Title</label>
                    <input
                        type="text"
                        name="jobTitle"
                        value={personalInfo.jobTitle || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Software Engineer"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address *</label>
                    <input
                        type="email"
                        name="email"
                        value={personalInfo.email || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="john@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={personalInfo.phone || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="(555) 123-4567"
                    />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={personalInfo.location || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="New York, NY"
                    />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">LinkedIn URL</label>
                    <input
                        type="url"
                        name="linkedin"
                        value={personalInfo.linkedin || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="linkedin.com/in/johndoe"
                    />
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Website / Portfolio</label>
                    <input
                        type="url"
                        name="website"
                        value={personalInfo.website || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="johndoe.com"
                    />
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;
