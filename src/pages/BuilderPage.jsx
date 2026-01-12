
import React, { useRef } from 'react';
import TemplateRenderer from '../components/templates/TemplateRenderer';
import FormBuilder from '../components/forms/FormBuilder';
import FileUploader from '../components/features/FileUploader';
import TemplateSwitcher from '../components/features/TemplateSwitcher';
import ATSScoreDisplay from '../components/features/ATSScoreDisplay';
import ExportControls from '../components/features/ExportControls';
import JobMatcher from '../components/features/JobMatcher';

const BuilderPage = () => {
    const printRef = useRef();

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6 antialiased">
            {/* Left Panel: Builder */}
            <div className="w-1/2 flex flex-col gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <FileUploader />
                </div>

                <div className="flex-1 overflow-hidden rounded-xl shadow-sm border border-gray-200 bg-white relative flex flex-col">
                    <FormBuilder />
                </div>

                <JobMatcher />
            </div>

            {/* Right Panel: Preview */}
            <div className="w-1/2 bg-gray-100 rounded-xl border border-gray-200 p-6 overflow-hidden flex flex-col">
                <h2 className="text-xl font-bold mb-6 flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Preview</span>
                        <TemplateSwitcher />
                    </div>
                    <div className="flex items-center gap-3">
                        <ATSScoreDisplay />
                        <ExportControls printRef={printRef} />
                    </div>
                </h2>
                <div className="flex-1 overflow-y-auto bg-gray-50/50 p-8 flex justify-center rounded-lg border border-gray-200 border-dashed">
                    <div className="scale-[0.55] origin-top shadow-2xl transition-all duration-300 ease-in-out hover:scale-[0.6]">
                        <div ref={printRef}>
                            <TemplateRenderer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuilderPage;

