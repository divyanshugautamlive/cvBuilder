import React from 'react';
import useResumeStore from '../../store/useResumeStore';
import ModernTemplate from './ModernTemplate';
import ClassicTemplate from './ClassicTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import TechTemplate from './TechTemplate';
import EntryLevelTemplate from './EntryLevelTemplate';

const TemplateRenderer = () => {
    const { selectedTemplate, resumeData } = useResumeStore();

    const renderTemplate = () => {
        switch (selectedTemplate) {
            case 'modern':
                return <ModernTemplate data={resumeData} />;
            case 'classic':
                return <ClassicTemplate data={resumeData} />;
            case 'minimalist':
                return <MinimalistTemplate data={resumeData} />;
            case 'executive':
                return <ExecutiveTemplate data={resumeData} />;
            case 'tech':
                return <TechTemplate data={resumeData} />;
            case 'entrylevel':
                return <EntryLevelTemplate data={resumeData} />;
            default:
                return <ModernTemplate data={resumeData} />;
        }
    };

    return (
        <div className="w-full h-full bg-white shadow-xl theme-preview origin-top" style={{ minHeight: '297mm', width: '210mm' }}>
            {renderTemplate()}
        </div>
    );
};

export default TemplateRenderer;
