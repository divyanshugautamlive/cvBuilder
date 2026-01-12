import React from 'react';
import useResumeStore from '../../../store/useResumeStore';

// ATS-Approved Templates Only
import ClassicTemplate from '../../templates/ClassicTemplate';
import MinimalistTemplate from '../../templates/MinimalistTemplate';
import ModernTemplate from '../../templates/ModernTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import TechTemplate from './templates/TechTemplate';


const TemplateRenderer = () => {
    const { resumeData } = useResumeStore();
    const { selectedTemplate } = resumeData;

    const renderTemplate = () => {
        switch (selectedTemplate) {
            case 'classic':
                return <ClassicTemplate data={resumeData} />;
            case 'minimalist':
                return <MinimalistTemplate data={resumeData} />;
            case 'modern':
                return <ModernTemplate data={resumeData} />;
            case 'executive':
                return <ExecutiveTemplate data={resumeData} />;
            case 'tech':
                return <TechTemplate data={resumeData} />;

            default:
                // Default to Executive for any invalid/deleted template selections
                return <ExecutiveTemplate data={resumeData} />;
        }
    };

    return (
        <div
            id="resume-preview"
            className="resume-section bg-white shadow-lg mx-auto print:shadow-none"
            style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '20mm',
                boxSizing: 'border-box',
                color: '#000000',
                backgroundColor: '#ffffff'
            }}
        >
            {renderTemplate()}
        </div>
    );
};

export default TemplateRenderer;
