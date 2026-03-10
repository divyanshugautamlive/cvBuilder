import React from 'react';
import CLMarsTemplate from './CLMarsTemplate';
import CLExecutiveTemplate from './CLExecutiveTemplate';

/**
 * Cover Letter Preview - Routes to the selected template
 */
const CoverLetterPreview = ({ data, resumeData, template = 'classic' }) => {
    const formatDate = () =>
        new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Mars template
    if (template === 'mars') {
        return (
            <div id="cover-letter-preview">
                <CLMarsTemplate data={data} resumeData={resumeData} />
            </div>
        );
    }

    // Executive template
    if (template === 'executive') {
        return (
            <div id="cover-letter-preview">
                <CLExecutiveTemplate data={data} resumeData={resumeData} />
            </div>
        );
    }

    // Classic template (default — existing design)
    return (
        <div id="cover-letter-preview">
            <div className="cover-letter-document">
                {/* Header - Your Info */}
                <div className="cl-doc-header">
                    <p className="cl-doc-name">{resumeData.personalInfo?.fullName || 'Your Name'}</p>
                    <p className="cl-doc-contact">
                        {[
                            resumeData.personalInfo?.email,
                            resumeData.personalInfo?.phone,
                            resumeData.personalInfo?.location
                        ].filter(Boolean).join(' | ')}
                    </p>
                </div>

                {/* Date */}
                <div className="cl-doc-date">{formatDate()}</div>

                {/* Recipient */}
                <div className="cl-doc-recipient">
                    {data.recipientName && <p>{data.recipientName}</p>}
                    {data.recipientTitle && <p>{data.recipientTitle}</p>}
                    {data.companyName && <p>{data.companyName}</p>}
                </div>

                {/* Greeting */}
                <div className="cl-doc-greeting">
                    <p>Dear {data.recipientName || 'Hiring Manager'},</p>
                </div>

                {/* Body */}
                <div className="cl-doc-body">
                    {data.opening ? (
                        <p>{data.opening}</p>
                    ) : (
                        <p className="cl-placeholder">Your opening paragraph will appear here...</p>
                    )}
                    {data.body ? (
                        <p>{data.body}</p>
                    ) : (
                        <p className="cl-placeholder">Your main content will appear here...</p>
                    )}
                    {data.closing ? (
                        <p>{data.closing}</p>
                    ) : (
                        <p className="cl-placeholder">Your closing paragraph will appear here...</p>
                    )}
                </div>

                {/* Signature */}
                <div className="cl-doc-signature">
                    <p>Sincerely,</p>
                    <p className="cl-doc-sig-name">{resumeData.personalInfo?.fullName || 'Your Name'}</p>
                </div>
            </div>
        </div>
    );
};

export default CoverLetterPreview;
