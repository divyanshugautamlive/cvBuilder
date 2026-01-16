import React from 'react';
import useResumeStore from '../../../store/useResumeStore';
import EditableTemplate from '../../EditableTemplate';

// ATS-Approved Templates Only
import ClassicTemplate from '../../templates/ClassicTemplate';
import MinimalistTemplate from '../../templates/MinimalistTemplate';
import ModernTemplate from '../../templates/ModernTemplate';
import ExecutiveTemplate from '../../templates/ExecutiveTemplate';
import TechTemplate from '../../templates/TechTemplate';
import EntryLevelTemplate from '../../templates/EntryLevelTemplate';


const TemplateRenderer = ({ editable = false }) => {
    const { resumeData, setResumeData } = useResumeStore();
    const { selectedTemplate } = resumeData;

    const renderTemplate = () => {
        // Props without editable/onUpdateData specific to individual fields
        // Since EditableTemplate handles updates, we just pass data to templates for rendering.
        const props = {
            data: resumeData,
            // We pass onUpdateData just in case, but new templates won't use it directly for inline editing
            // except if they have input fields (which we are removing).
            onUpdateData: setResumeData,
            editable: false // Disable internal template editing logic if any left
        };

        const TemplateComponent = (() => {
            switch (selectedTemplate) {
                case 'classic': return ClassicTemplate;
                case 'minimalist': return MinimalistTemplate;
                case 'modern': return ModernTemplate;
                case 'executive': return ExecutiveTemplate;
                case 'tech': return TechTemplate;
                case 'entrylevel': return EntryLevelTemplate;
                default: return ExecutiveTemplate;
            }
        })();

        return <TemplateComponent {...props} />;
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
            <EditableTemplate
                resumeData={resumeData}
                onUpdateData={setResumeData}
                enabled={editable}
            >
                {renderTemplate()}
            </EditableTemplate>
        </div>
    );
};

export default TemplateRenderer;
