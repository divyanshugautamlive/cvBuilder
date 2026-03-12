import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, X, Download, Sparkles } from 'lucide-react';
import PersonalInfoStep from './PersonalInfoStep';
import SummaryStep from './SummaryStep';
import ExperienceStep from './ExperienceStep';
import EducationStep from './EducationStep';
import SkillsStep from './SkillsStep';
import JobMatcher from '../analysis/JobMatcher';
import useResumeStore from '../../../store/useResumeStore';
import useAutoSave from '../../../hooks/useAutoSave';

const FormWizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { resumeData } = useResumeStore();

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
            case 1: return personalInfo.fullName && personalInfo.email;
            case 3: return experience.length > 0;
            default: return true;
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

    const handleFinish = () => {
        setShowSuccessModal(true);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const CurrentComponent = steps.find(s => s.id === currentStep).component;
    const isLastStep = currentStep === steps.length;

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
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-8">
                <CurrentComponent />

                {/* Keyword Matcher (Hidden on Step 1 and 4) */}
                {currentStep !== 1 && currentStep !== 4 && (
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <JobMatcher />
                    </div>
                )}
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

                {isLastStep ? (
                    <button
                        onClick={handleFinish}
                        className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700 flex items-center gap-2 transition-colors shadow-lg shadow-green-600/25"
                    >
                        <Check size={18} /> Finish
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 flex items-center gap-2 transition-colors"
                    >
                        Next <ArrowRight size={18} />
                    </button>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={() => setShowSuccessModal(false)}>
                    <div
                        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center relative"
                        onClick={e => e.stopPropagation()}
                        style={{ animation: 'modalPop 0.3s ease-out' }}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X size={20} />
                        </button>

                        {/* Success icon */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                                <Check size={32} className="text-white" strokeWidth={3} />
                            </div>
                        </div>

                        {/* Sparkle decoration */}
                        <div className="flex justify-center mb-3">
                            <Sparkles size={24} className="text-yellow-500" />
                        </div>

                        {/* Message */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Congratulations!
                        </h2>
                        <p className="text-gray-600 mb-1 text-lg font-medium">
                            Your ATS-friendly resume is ready to download
                        </p>
                        <p className="text-gray-400 text-sm mb-6">
                            Preview it on the right panel and click "Download PDF" to save.
                        </p>

                        {/* OK Button */}
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/25 text-base w-full"
                        >
                            OK, Got it!
                        </button>
                    </div>

                    <style>{`
                        @keyframes modalPop {
                            0% { opacity: 0; transform: scale(0.85) translateY(20px); }
                            100% { opacity: 1; transform: scale(1) translateY(0); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default FormWizard;
