import React, { useRef, useState, useEffect } from 'react';
import CLMarsTemplate from './CLMarsTemplate';
import CLExecutiveTemplate from './CLExecutiveTemplate';

/**
 * Cover Letter Preview - Routes to the selected template and scales to A4
 */
const CoverLetterPreview = ({ data, resumeData, template = 'classic' }) => {
    const wrapperRef = useRef(null);
    const [scale, setScale] = useState(1);

    // Dynamic scaling logic to fit mobile screens
    useEffect(() => {
        const updateScale = () => {
            if (!wrapperRef.current) return;
            const parent = wrapperRef.current.parentElement;
            if (!parent) return;
            
            const parentWidth = parent.clientWidth;
            // 210mm in pixels at 96 DPI is approx 794px
            const targetWidth = 794;
            
            // Allow some padding on mobile
            if (parentWidth < targetWidth + 16) {
                setScale((parentWidth - 16) / targetWidth);
            } else {
                setScale(1);
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    const formatDate = () =>
        new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const renderTemplateContent = () => {
        if (template === 'mars') {
            return <CLMarsTemplate data={data} resumeData={resumeData} />;
        }
        if (template === 'executive') {
            return <CLExecutiveTemplate data={data} resumeData={resumeData} />;
        }

        // Classic template (default — inline document)
        return (
            <div className="cover-letter-document" style={{ boxSizing: 'border-box', minHeight: '297mm' }}>
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
        );
    };

    return (
        <div ref={wrapperRef} className="w-full flex justify-center items-start overflow-hidden print:overflow-visible">
            <div
                id="cover-letter-preview"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    width: '210mm',
                    minHeight: '297mm',
                    marginBottom: `calc(297mm * (${scale} - 1))`,
                    boxSizing: 'border-box',
                    transition: 'transform 0.15s ease-out',
                    backgroundColor: '#ffffff'
                }}
                className="shadow-xl rounded-lg print:transform-none print:margin-0 print:shadow-none animate-in fade-in zoom-in-95 duration-300"
            >
                {renderTemplateContent()}
            </div>
        </div>
    );
};

export default CoverLetterPreview;
