import React from 'react';
import PersonalInfoForm from './form/PersonalInfoForm';
import SummaryForm from './form/SummaryForm';
import ExperienceForm from './form/ExperienceForm';
import EducationForm from './form/EducationForm';
import SkillsForm from './form/SkillsForm';
import FileUploader from './FileUploader';


const ResumeForm = () => {
    return (
        <div className="space-y-6 pb-20">
            <FileUploader />
            <PersonalInfoForm />
            <SummaryForm />
            <ExperienceForm />
            <EducationForm />
            <SkillsForm />

            <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-lg">
                More sections coming soon...
            </div>
        </div>
    );
};

export default ResumeForm;
