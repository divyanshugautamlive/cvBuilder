import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import PersonalInfoStep from './PersonalInfoStep';
import SummaryStep from './SummaryStep';
import ExperienceStep from './ExperienceStep';
import EducationStep from './EducationStep';
import SkillsStep from './SkillsStep';
import useResumeStore from '../../../store/useResumeStore';
import useAutoSave from '../../../hooks/useAutoSave';

const FormWizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const { resumeData } = useResumeStore();

    // Enable auto-save
    useAutoSave();

    const steps = [
        { id: 1, title: 'Personal Info', component: PersonalInfoStep },
        { id: 2, title: 'Summary', component: SummaryStep },
        { id: 3, title: 'Experience', component: ExperienceStep },
        { id: 4, title: 'Education', component: EducationStep },
        { id: 5, title: 'Skills', component: SkillsStep }
    ];

    const validateStep = (step) => {
        const { personalInfo, experience } = resumeData;
        switch (step) {
            case 1:
                return personalInfo.fullName && personalInfo.email; // Basic requirement
            case 3:
                // Require at least one job if experience array exists? 
                // Let's make it soft required i.e. warn only, or strict as per prompt "at least 1 work experience"
                return experience.length > 0;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) {
            alert('Please fill in the required fields before proceeding.');
            return;
        }
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const CurrentComponent = steps.find(s => s.id === currentStep).component;

    return (
        <div className="flex flex-col h-full">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                    {steps.map(step => (
                        <div
                            key={step.id}
                            className={`${step.id === currentStep ? 'text-blue-600' : step.id < currentStep ? 'text-green-600' : ''}`}
                        >
                            <span className="hidden md:inline">Step {step.id}: </span>{step.title}
                        </div>
                    ))}
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <CurrentComponent />
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between pt-4 border-t border-gray-100">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors ${currentStep === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <ArrowLeft size={18} /> Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentStep === steps.length} // Disable next on last step? Or change text to Finish
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentStep === steps.length ? 'Finish' : 'Next'} <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default FormWizard;
