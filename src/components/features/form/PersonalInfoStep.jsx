import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import { FormInput } from '../../core/FormInputs';


const PersonalInfoStep = () => {
    const { resumeData, updatePersonalInfo } = useResumeStore();
    const { personalInfo, parserConfidence = {} } = resumeData;

    const handleChange = (e) => {
        updatePersonalInfo({ [e.target.name]: e.target.value });
    };

    return (
        <div className="animate-in fade-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Personal Information</h2>
            <p className="text-gray-500 mb-6">Let's start with your contact details.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Full Name"
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    warning={parserConfidence.fullName === false ? "Verify autodetected name." : undefined}
                    required
                />
                <FormInput
                    label="Job Title"
                    name="jobTitle"
                    value={personalInfo.jobTitle || ""}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    warning={parserConfidence.jobTitle === false ? "Verify autodetected job title." : undefined}
                />
                <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={handleChange}
                    placeholder="e.g. john@example.com"
                    warning={parserConfidence.email === false ? "Verify autodetected email." : undefined}
                    required
                />
                <FormInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={personalInfo.phone}
                    onChange={handleChange}
                    placeholder="e.g. (555) 123-4567"
                    warning={parserConfidence.phone === false ? "Verify autodetected phone." : undefined}
                />
                <FormInput
                    label="Location"
                    name="location"
                    value={personalInfo.location}
                    onChange={handleChange}
                    placeholder="e.g. San Francisco, CA"
                    warning={parserConfidence.location === false ? "Verify autodetected location." : undefined}
                />
                <FormInput
                    label="LinkedIn URL"
                    name="linkedin"
                    value={personalInfo.linkedin || ""}
                    onChange={handleChange}
                    placeholder="e.g. linkedin.com/in/johndoe"
                    warning={parserConfidence.linkedin === false ? "Verify autodetected LinkedIn URL." : undefined}
                />
            </div>
        </div>
    );
};

export default PersonalInfoStep;
