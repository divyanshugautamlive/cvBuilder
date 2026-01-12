import React, { useState } from 'react';
import useResumeStore from '../../../store/useResumeStore';
import AIAssistButton from '../../ai/AIAssistButton';
import CoverLetterPreview from './CoverLetterPreview';
import '../../../styles/cover-letter.css';

/**
 * Cover Letter Builder - Create matching cover letters with AI assistance
 */
const CoverLetterBuilder = () => {
    const { resumeData } = useResumeStore();
    const [coverLetter, setCoverLetter] = useState({
        recipientName: '',
        recipientTitle: '',
        companyName: '',
        jobTitle: '',
        opening: '',
        body: '',
        closing: '',
        matchResumeTemplate: true
    });

    const updateField = (field, value) => {
        setCoverLetter(prev => ({ ...prev, [field]: value }));
    };

    const generateFullLetter = () => {
        // Generate complete cover letter using AI
        const opening = `I am writing to express my strong interest in the ${coverLetter.jobTitle || 'position'} at ${coverLetter.companyName || 'your company'}. With my proven track record in delivering exceptional results, I am confident I would be an excellent addition to your team.`;

        const body = `Throughout my career, I have consistently demonstrated the ability to drive impactful outcomes. ${resumeData.experience?.[0] ? `As ${resumeData.experience[0].title} at ${resumeData.experience[0].company}, I developed skills that directly align with this role's requirements.` : ''} My expertise in ${resumeData.skills?.slice(0, 3).map(s => typeof s === 'string' ? s : s.name).join(', ') || 'key areas'} positions me to contribute immediately to your team's success.`;

        const closing = `I am excited about the opportunity to bring my skills and experience to ${coverLetter.companyName || 'your organization'}. I look forward to discussing how I can contribute to your team's continued success. Thank you for considering my application.`;

        setCoverLetter(prev => ({
            ...prev,
            opening,
            body,
            closing
        }));
    };

    const exportCoverLetter = () => {
        // Create a downloadable text version
        const content = `${resumeData.personalInfo?.fullName || 'Your Name'}
${resumeData.personalInfo?.email || ''} | ${resumeData.personalInfo?.phone || ''}
${resumeData.personalInfo?.location || ''}

${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

${coverLetter.recipientName || 'Hiring Manager'}
${coverLetter.recipientTitle || ''}
${coverLetter.companyName || ''}

Dear ${coverLetter.recipientName || 'Hiring Manager'},

${coverLetter.opening}

${coverLetter.body}

${coverLetter.closing}

Sincerely,
${resumeData.personalInfo?.fullName || 'Your Name'}`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CoverLetter_${coverLetter.companyName || 'Draft'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="cover-letter-container">
            <div className="cl-editor">
                <h2 className="cl-title">📄 Cover Letter Builder</h2>
                <p className="cl-subtitle">Create a professional cover letter that complements your resume</p>

                <div className="cl-form">
                    <div className="cl-form-row">
                        <div className="cl-field">
                            <label>Recipient Name</label>
                            <input
                                type="text"
                                placeholder="e.g., John Smith"
                                value={coverLetter.recipientName}
                                onChange={(e) => updateField('recipientName', e.target.value)}
                            />
                        </div>
                        <div className="cl-field">
                            <label>Their Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Hiring Manager"
                                value={coverLetter.recipientTitle}
                                onChange={(e) => updateField('recipientTitle', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="cl-form-row">
                        <div className="cl-field">
                            <label>Company Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Acme Corporation"
                                value={coverLetter.companyName}
                                onChange={(e) => updateField('companyName', e.target.value)}
                            />
                        </div>
                        <div className="cl-field">
                            <label>Job Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Senior Developer"
                                value={coverLetter.jobTitle}
                                onChange={(e) => updateField('jobTitle', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="cl-field-full">
                        <label>Opening Paragraph</label>
                        <textarea
                            value={coverLetter.opening}
                            onChange={(e) => updateField('opening', e.target.value)}
                            placeholder="Express your interest in the position..."
                            rows={3}
                        />
                        <AIAssistButton
                            context={`Write an opening paragraph for a cover letter for ${coverLetter.jobTitle || 'a position'} at ${coverLetter.companyName || 'a company'}.`}
                            onGenerate={(text) => updateField('opening', text)}
                            fieldName="opening paragraph"
                            placeholder="E.g., Make it enthusiastic, Reference the company's recent news..."
                        />
                    </div>

                    <div className="cl-field-full">
                        <label>Body (Main Content)</label>
                        <textarea
                            value={coverLetter.body}
                            onChange={(e) => updateField('body', e.target.value)}
                            placeholder="Highlight your relevant experience and skills..."
                            rows={5}
                        />
                        <AIAssistButton
                            context={`Write body paragraphs for a cover letter connecting: ${resumeData.experience?.[0]?.title || 'professional'} experience with ${resumeData.skills?.slice(0, 3).map(s => typeof s === 'string' ? s : s.name).join(', ') || 'relevant'} skills.`}
                            onGenerate={(text) => updateField('body', text)}
                            fieldName="body content"
                            placeholder="E.g., Focus on leadership, Emphasize technical skills..."
                        />
                    </div>

                    <div className="cl-field-full">
                        <label>Closing Paragraph</label>
                        <textarea
                            value={coverLetter.closing}
                            onChange={(e) => updateField('closing', e.target.value)}
                            placeholder="Thank them and express enthusiasm..."
                            rows={2}
                        />
                        <AIAssistButton
                            context="Write a closing paragraph for a cover letter expressing enthusiasm and requesting an interview."
                            onGenerate={(text) => updateField('closing', text)}
                            fieldName="closing"
                        />
                    </div>

                    <div className="cl-actions">
                        <button onClick={generateFullLetter} className="cl-ai-btn">
                            ✨ Auto-Generate Full Letter
                        </button>
                        <button onClick={exportCoverLetter} className="cl-export-btn">
                            📥 Export as Text
                        </button>
                    </div>
                </div>
            </div>

            <div className="cl-preview-pane">
                <h3 className="cl-preview-title">Preview</h3>
                <CoverLetterPreview data={coverLetter} resumeData={resumeData} />
            </div>
        </div>
    );
};

export default CoverLetterBuilder;
