import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import PersonalInfo from './steps/PersonalInfo';
import Summary from './steps/Summary';
import Experience from './steps/Experience';
import Education from './steps/Education';
import Skills from './steps/Skills';

const steps = [
    { nr: 1, title: "Personal", component: PersonalInfo },
    { nr: 2, title: "Summary", component: Summary },
    { nr: 3, title: "Experience", component: Experience },
    { nr: 4, title: "Education", component: Education },
    { nr: 5, title: "Skills", component: Skills }
];

const FormBuilder = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const goToStep = (step) => setCurrentStep(step);

    const CurrentComponent = steps.find(s => s.nr === currentStep)?.component || PersonalInfo;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full overflow-hidden">
            {/* Progress Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
                <div className="flex justify-between items-center max-w-xl mx-auto mb-4">
                    {steps.map((s) => (
                        <button
                            key={s.nr}
                            onClick={() => goToStep(s.nr)}
                            className={`flex flex-col items-center group focus:outline-none`}
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                                ${currentStep === s.nr ? 'bg-blue-600 text-white shadow-md scale-110' :
                                    currentStep > s.nr ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'}
                            `}>
                                {currentStep > s.nr ? <CheckCircle size={16} /> : s.nr}
                            </div>
                            <span className={`text-xs mt-1 font-medium ${currentStep === s.nr ? 'text-blue-600' : 'text-gray-500'}`}>
                                {s.title}
                            </span>
                        </button>
                    ))}
                </div>
                {/* Progress Bar Line */}
                <div className="h-1 bg-gray-200 rounded-full max-w-xl mx-auto overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="max-w-xl mx-auto">
                    <CurrentComponent onNext={nextStep} onPrev={prevStep} />
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition
                        ${currentStep === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100 border border-gray-300'}`}
                >
                    <ChevronLeft size={20} className="mr-1" /> Previous
                </button>

                <div className="text-sm text-gray-500 font-medium">
                    Step {currentStep} of {steps.length}
                </div>

                <button
                    onClick={nextStep}
                    disabled={currentStep === steps.length}
                    className={`flex items-center px-6 py-2 rounded-lg font-medium text-white transition shadow-sm
                        ${currentStep === steps.length
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {currentStep === steps.length ? 'Finish' : 'Next'} <ChevronRight size={20} className="ml-1" />
                </button>
            </div>
        </div>
    );
};

export default FormBuilder;
