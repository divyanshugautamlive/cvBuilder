import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import FormWizard from './components/features/form/FormWizard';
import TemplateRenderer from './components/features/preview/TemplateRenderer';
import TemplateSwitcher from './components/features/preview/TemplateSwitcher';
import ATSScorer from './components/features/analysis/ATSScorer';
import JobMatcher from './components/features/analysis/JobMatcher';
import ExportButtons from './components/features/export/ExportButtons';
import FileUploader from './components/features/parser/FileUploader';
import CoverLetterBuilder from './components/features/coverletter/CoverLetterBuilder';
import { Eye, Edit, FileText, Mail } from 'lucide-react';

const App = () => {
  // Mobile Tab State
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' or 'preview'
  // View State - Resume or Cover Letter
  const [activeView, setActiveView] = useState('resume'); // 'resume' or 'cover-letter'

  return (
    <MainLayout>
      {/* Navigation Tabs */}
      <div className="hidden md:flex fixed top-16 left-0 right-0 bg-gray-50 border-b border-gray-200 z-40">
        <div className="max-w-[1920px] mx-auto px-6 flex gap-0">
          <button
            onClick={() => setActiveView('resume')}
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeView === 'resume'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <FileText size={18} /> Resume Builder
          </button>
          <button
            onClick={() => setActiveView('cover-letter')}
            className={`px-6 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeView === 'cover-letter'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            <Mail size={18} /> Cover Letter
          </button>
        </div>
      </div>

      {/* Cover Letter View */}
      {activeView === 'cover-letter' && (
        <div className="flex-1 overflow-y-auto pt-12 md:pt-12">
          <CoverLetterBuilder />
        </div>
      )}

      {/* Resume Builder View */}
      {activeView === 'resume' && (
        <>
          {/* LEFT PANEL: EDITOR */}
          <div className={`
            flex-1 flex flex-col h-full overflow-hidden bg-white border-r border-gray-200 pt-0 md:pt-12
            ${mobileTab === 'preview' ? 'hidden md:flex' : 'flex'}
          `}>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-8">
                <FileUploader />
                <FormWizard />
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <JobMatcher />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: PREVIEW */}
          <div className={`
            flex-1 flex flex-col h-full bg-gray-100 pt-0 md:pt-12
            ${mobileTab === 'editor' ? 'hidden md:flex' : 'flex'}
          `}>
            {/* Preview Toolbar */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
              <span className="font-semibold text-gray-500 text-sm uppercase tracking-wide">Live Preview</span>
              <div className="flex items-center gap-4">
                <ExportButtons />
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
              <div className="max-w-[210mm] mx-auto space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <ATSScorer />
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                    <strong>ATS Tip:</strong> Stick to standard section headers and avoid using tables or graphics for best compatibility.
                  </div>
                </div>

                <TemplateSwitcher />

                <div className="shadow-2xl">
                  <TemplateRenderer />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MOBILE TABS */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-50">
        <button
          onClick={() => { setActiveView('resume'); setMobileTab('editor'); }}
          className={`flex-1 p-4 flex flex-col items-center gap-1 text-xs font-medium ${activeView === 'resume' && mobileTab === 'editor' ? 'text-blue-600' : 'text-gray-500'
            }`}
        >
          <Edit size={20} /> Editor
        </button>
        <button
          onClick={() => { setActiveView('resume'); setMobileTab('preview'); }}
          className={`flex-1 p-4 flex flex-col items-center gap-1 text-xs font-medium ${activeView === 'resume' && mobileTab === 'preview' ? 'text-blue-600' : 'text-gray-500'
            }`}
        >
          <Eye size={20} /> Preview
        </button>
        <button
          onClick={() => setActiveView('cover-letter')}
          className={`flex-1 p-4 flex flex-col items-center gap-1 text-xs font-medium ${activeView === 'cover-letter' ? 'text-blue-600' : 'text-gray-500'
            }`}
        >
          <Mail size={20} /> Letter
        </button>
      </div>

    </MainLayout>
  );
};

export default App;
